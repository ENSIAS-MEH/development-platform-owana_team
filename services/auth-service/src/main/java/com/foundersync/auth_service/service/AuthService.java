package com.foundersync.auth_service.service;

import com.foundersync.auth_service.dto.AuthResponse;
import com.foundersync.auth_service.dto.LoginRequest;
import com.foundersync.auth_service.dto.RegisterRequest;
import com.foundersync.auth_service.entity.User;
import com.foundersync.auth_service.enums.AppRole;
import com.foundersync.auth_service.exception.EmailAlreadyExistsException;
import com.foundersync.auth_service.repository.UserRepository;
import com.foundersync.auth_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        // 1. Vérifier que l'email n'existe pas déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        // 2. Créer et sauvegarder l'utilisateur
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(AppRole.USER)
                .build();
        userRepository.save(user);

        // 3. Générer le token avec userId et role dans les claims
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, Map.of(
                "userId", user.getId().toString(),
                "role", user.getRole().name()
        ));

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Spring Security vérifie email + password + BCrypt
        // Lance BadCredentialsException automatiquement si incorrect
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Récupérer l'utilisateur (on sait qu'il existe après authenticate)
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // 3. Générer le token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, Map.of(
                "userId", user.getId().toString(),
                "role", user.getRole().name()
        ));

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}

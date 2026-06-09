package com.foundersync.startup_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.UUID;

@Component
public class AuthFilter extends OncePerRequestFilter {

    @Value("${app.jwt.secret}")
    private String secret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        System.out.println("=== AuthFilter triggered for: " + request.getMethod() + " " + request.getRequestURI());

        String method = request.getMethod();
        String path = request.getRequestURI();

        // ══════════════════════════════
        // Allow public endpoints
        // ══════════════════════════════
        if (isPublicEndpoint(method, path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ══════════════════════════════
        // Check Authorization header
        // ══════════════════════════════
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, 401, "Unauthorized: missing or invalid token");
            return;
        }

        // ══════════════════════════════
        // Validate JWT
        // ══════════════════════════════
        try {
            String token = authHeader.substring(7);

            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            UUID userId = UUID.fromString((String) claims.get("userId"));
            String role = (String) claims.get("role");

            // ══════════════════════════════
            // Check admin endpoints
            // ══════════════════════════════
            if (path.startsWith("/api/admin") && !"ADMIN".equals(role)) {
                sendError(response, 403, "Forbidden: admin access required");
                return;
            }

            // ══════════════════════════════
            // Set authenticated user in request
            // ══════════════════════════════
            AuthenticatedUser authenticatedUser = AuthenticatedUser.builder()
                    .userId(userId)
                    .role(role)
                    .build();

            request.setAttribute("authenticatedUser", authenticatedUser);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            sendError(response, 401, "Unauthorized: invalid or expired token");
        }
    }

    // ══════════════════════════════
    // Public endpoints checker
    // ══════════════════════════════
    private boolean isPublicEndpoint(String method, String path) {
        return false;
    }

    // ══════════════════════════════
    // Error response helper
    // ══════════════════════════════
    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(
                String.format("{\"status\":%d,\"message\":\"%s\",\"errors\":null}", status, message)
        );
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
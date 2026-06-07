package com.founderssync.gateway.config;

import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
@RefreshScope
public class GatewayConfig {

    private static final Logger logger = LoggerFactory.getLogger(GatewayConfig.class);

    @Value("${auth-service-url:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${user-service-url:http://localhost:8082}")
    private String userServiceUrl;

    @Value("${startup-service-url:http://localhost:8083}")
    private String startupServiceUrl;

    @Value("${post-service-url:http://localhost:8084}")
    private String postServiceUrl;

    @Value("${chat-service-url:http://localhost:8085}")
    private String chatServiceUrl;

    @Value("${notification-service-url:http://localhost:8086}")
    private String notificationServiceUrl;

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        logger.info("=== FoundersSync Gateway routes ===");
        logger.info("auth-service      : {}", authServiceUrl);
        logger.info("user-service      : {}", userServiceUrl);
        logger.info("startup-service   : {}", startupServiceUrl);
        logger.info("post-service      : {}", postServiceUrl);
        logger.info("chat-service      : {}", chatServiceUrl);
        logger.info("notification-svc  : {}", notificationServiceUrl);

        return builder.routes()
                // Auth
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("authCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(authServiceUrl))

                // Users
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("userCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(userServiceUrl))

                // Startups
                .route("startup-service", r -> r
                        .path("/api/startups/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("startupCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(startupServiceUrl))

                // Admin Startups
                .route("admin-startup-service", r -> r
                        .path("/api/admin/startups/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("startupCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(startupServiceUrl))


                // Posts & feed
                .route("post-service", r -> r
                        .path("/api/posts/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("postCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(postServiceUrl))

                // Chat REST
                .route("chat-service-rest", r -> r
                        .path("/api/conversations/**", "/api/groups/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("chatCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(chatServiceUrl))

                // Chat WebSocket
                .route("chat-service-ws", r -> r
                        .path("/ws/**")
                        .uri(chatServiceUrl))

                // Notifications
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .filters(f -> f.circuitBreaker(c -> c
                                .setName("notificationCircuitBreaker")
                                .setFallbackUri("forward:/fallback")))
                        .uri(notificationServiceUrl))

                .build();
    }
}
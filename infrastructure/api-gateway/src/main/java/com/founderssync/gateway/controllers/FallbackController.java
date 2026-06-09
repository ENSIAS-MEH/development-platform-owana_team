package com.founderssync.gateway.controllers;

import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class FallbackController {

    @RequestMapping("/fallback")
    public Mono<ResponseEntity<Map<String, Object>>> fallback(ServerWebExchange exchange) {
        // Extracting error details from the exchange attributes
        Throwable exception = exchange.getAttribute(ServerWebExchangeUtils.CIRCUITBREAKER_EXECUTION_EXCEPTION_ATTR);
        String errorMessage = (exception != null) ? exception.getMessage() : "Unknown error";

        // Creating a response with detailed error information
        Map<String, Object> response = Map.of(
                "message", "The service is temporarily unavailable. Please try again later.",
                "error", errorMessage,
                "status", HttpStatus.SERVICE_UNAVAILABLE.value()
        );

        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
}
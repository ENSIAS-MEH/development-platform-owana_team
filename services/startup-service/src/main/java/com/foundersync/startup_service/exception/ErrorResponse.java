package com.foundersync.startup_service.exception;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private int status;
    private String message;
    private Map<String, String> errors;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.errors = null;
    }
}
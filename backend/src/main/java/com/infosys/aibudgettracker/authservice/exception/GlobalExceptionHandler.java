package com.infosys.aibudgettracker.authservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the application.
 * Captures exceptions thrown by controllers and returns appropriate HTTP
 * responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles validation exceptions triggered by @Valid annotation.
     * Extracts the first error message and returns it.
     * 
     * @param ex The MethodArgumentNotValidException thrown when validation fails.
     * @return A ResponseEntity containing the error message and BAD_REQUEST status.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = "Validation failed";

        // Get the first error message to display to the user
        FieldError firstError = ex.getBindingResult().getFieldError();
        if (firstError != null) {
            errorMessage = firstError.getDefaultMessage();
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
}

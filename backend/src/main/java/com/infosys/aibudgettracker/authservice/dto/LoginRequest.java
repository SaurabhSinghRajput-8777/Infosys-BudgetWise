package com.infosys.aibudgettracker.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO class for handling user login requests.
 * Contains the username and password required for authentication.
 */
@Data
public class LoginRequest {

    /**
     * The username of the user attempting to login.
     * Cannot be blank.
     */
    @NotBlank(message = "Username is required")
    private String username;

    /**
     * The password of the user attempting to login.
     * Cannot be blank.
     */
    @NotBlank(message = "Password is required")
    private String password;
}
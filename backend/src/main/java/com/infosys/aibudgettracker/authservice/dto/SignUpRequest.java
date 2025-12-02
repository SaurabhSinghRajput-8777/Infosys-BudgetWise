package com.infosys.aibudgettracker.authservice.dto;

import com.infosys.aibudgettracker.authservice.model.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO class for handling user registration requests.
 * Contains user details required for creating a new account.
 */
@Data
public class SignUpRequest {

    /**
     * The desired username for the new account.
     * Must be between 3 and 20 characters.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    /**
     * The email address for the new account.
     * Must be a valid email format.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    /**
     * The password for the new account.
     * Must be at least 6 characters long and contain uppercase, lowercase, number,
     * and special character.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @jakarta.validation.constraints.Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{6,}$", message = "Password must contain at least one digit, one lowercase, one uppercase, and one special character")
    private String password;

    /**
     * The role of the user (e.g., USER, ADMIN).
     * Optional, defaults to USER if not provided.
     */
    private Role role;
}
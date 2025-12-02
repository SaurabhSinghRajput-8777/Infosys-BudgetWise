package com.infosys.aibudgettracker.authservice.service;

import com.infosys.aibudgettracker.authservice.dto.AuthResponse;
import com.infosys.aibudgettracker.authservice.dto.LoginRequest;
import com.infosys.aibudgettracker.authservice.dto.SignUpRequest;
import com.infosys.aibudgettracker.authservice.model.User;
import com.infosys.aibudgettracker.authservice.repository.UserRepository;
import com.infosys.aibudgettracker.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

/**
 * Service class for handling authentication logic.
 * Manages user registration, login, and token generation.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.owner.id:0}")
    private Long ownerId;

    /**
     * Registers a new user in the system.
     * Checks if the username already exists, encodes the password, and sets the
     * default role.
     * 
     * @param signUpRequest The registration details.
     * @throws RuntimeException if the username is already taken.
     */
    public void registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        User newUser = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()));

        // Set role - default to USER if not provided
        if (signUpRequest.getRole() != null) {
            newUser.setRole(signUpRequest.getRole());
        } else {
            newUser.setRole(User.Role.USER);
        }

        // If user registers as ADMIN, mark adminApproved=false so owner must approve
        // later.
        if (newUser.getRole() == User.Role.ADMIN) {
            newUser.setAdminApproved(false);
        } else {
            newUser.setAdminApproved(true);
        }

        userRepository.save(newUser);
    }

    /**
     * Authenticates a user and generates a JWT token.
     * Verifies username, password, ban status, and admin approval status.
     * 
     * @param loginRequest The login credentials.
     * @return An AuthResponse containing the JWT token.
     * @throws RuntimeException if authentication fails or user is not allowed to
     *                          login.
     */
    public AuthResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid password.");
        }
        // Prevent banned users from logging in
        if (user.isBanned()) {
            throw new RuntimeException("Error: User is banned.");
        }
        // Prevent ADMIN users from logging in until owner has approved them
        if (user.getRole() == User.Role.ADMIN && !user.isAdminApproved()) {
            // Allow the configured owner id or any explicit OWNER role to always login
            if (!((user.getId() != null && user.getId().equals(ownerId)) || user.getRole() == User.Role.OWNER)) {
                throw new RuntimeException("Error: Admin approval pending.");
            }
        }
        // Auto-assign OWNER role if ID matches configured ownerId
        if (user.getId() != null && user.getId().equals(ownerId) && user.getRole() != User.Role.OWNER) {
            user.setRole(User.Role.OWNER);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token);
    }
}
package com.infosys.budgetwise.controller;

import com.infosys.budgetwise.model.User;
import com.infosys.budgetwise.payload.AuthRequest;
import com.infosys.budgetwise.repository.UserRepository;
import com.infosys.budgetwise.service.CustomUserDetailsService;
import com.infosys.budgetwise.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest authRequest) {
        try {
            if (userRepository.existsByEmail(authRequest.getEmail())) {
                return new ResponseEntity<>(Collections.singletonMap("message", "Email is already taken!"), HttpStatus.BAD_REQUEST);
            }

            User user = new User();
            user.setName(authRequest.getName());
            user.setEmail(authRequest.getEmail());
            user.setPassword(passwordEncoder.encode(authRequest.getPassword()));
            user.setRole(authRequest.getRole() != null ? authRequest.getRole() : "USER");

            userRepository.save(user);

            return new ResponseEntity<>(Collections.singletonMap("message", "User registered successfully!"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Registration failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );

            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + authRequest.getEmail()));
            
            // NEW CHECK: Verify if the requested role matches the user's actual role
            if (authRequest.getRole() != null && !authRequest.getRole().equals(user.getRole())) {
                String requestedRole = authRequest.getRole().toLowerCase();
                @SuppressWarnings("unused")
                String actualRole = user.getRole().toLowerCase();
                
                String message;
                if (requestedRole.equals("admin")) {
                    message = "Access Denied: You are registered as a User, not an Admin.";
                } else {
                    message = "Access Denied: You are trying to log in as User, but are registered as Admin.";
                }
                
                return new ResponseEntity<>(Collections.singletonMap("message", message), HttpStatus.FORBIDDEN);
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "User not found!"), HttpStatus.UNAUTHORIZED);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Invalid credentials!"), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Login failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AuthRequest authRequest) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

            if (authRequest.getName() != null && !authRequest.getName().isEmpty()) {
                user.setName(authRequest.getName());
            }

            if (authRequest.getEmail() != null && !authRequest.getEmail().isEmpty()) {
                if (!authRequest.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(authRequest.getEmail())) {
                    return new ResponseEntity<>(Collections.singletonMap("message", "Email is already taken!"), HttpStatus.BAD_REQUEST);
                }
                user.setEmail(authRequest.getEmail());
            }

            if (authRequest.getPassword() != null && !authRequest.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(authRequest.getPassword()));
            }

            userRepository.save(user);

            return ResponseEntity.ok(Collections.singletonMap("message", "Profile updated successfully!"));
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(Collections.singletonMap("message", e.getMessage()), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Profile update failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
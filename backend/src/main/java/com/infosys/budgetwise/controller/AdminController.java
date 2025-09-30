package com.infosys.budgetwise.controller;

import com.infosys.budgetwise.model.User;
import com.infosys.budgetwise.payload.AuthRequest;
import com.infosys.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "User deleted successfully!"));
        }
        return new ResponseEntity<>(Collections.singletonMap("message", "User not found!"), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/users/create-admin")
    public ResponseEntity<?> createAdminUser(@RequestBody AuthRequest authRequest) {
        try {
            if (userRepository.existsByEmail(authRequest.getEmail())) {
                return new ResponseEntity<>(Collections.singletonMap("message", "Email is already taken!"), HttpStatus.BAD_REQUEST);
            }

            User user = new User();
            user.setName(authRequest.getName());
            user.setEmail(authRequest.getEmail());
            user.setPassword(passwordEncoder.encode(authRequest.getPassword()));
            user.setRole("ADMIN"); // Manually setting the role to ADMIN

            userRepository.save(user);

            return new ResponseEntity<>(Collections.singletonMap("message", "Admin user created successfully!"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Admin creation failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
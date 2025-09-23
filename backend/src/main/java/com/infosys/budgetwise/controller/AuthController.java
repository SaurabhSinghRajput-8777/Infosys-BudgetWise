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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

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
        if (userRepository.existsByEmail(authRequest.getEmail())) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Email is already taken!"), HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(authRequest.getName());
        user.setEmail(authRequest.getEmail());
        user.setPassword(passwordEncoder.encode(authRequest.getPassword()));
        user.setRole(authRequest.getRole());

        userRepository.save(user);

        return new ResponseEntity<>(Collections.singletonMap("message", "User registered successfully!"), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Collections.singletonMap("token", token));

        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "User not found!"), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Invalid credentials!"), HttpStatus.UNAUTHORIZED);
        }
    }
}
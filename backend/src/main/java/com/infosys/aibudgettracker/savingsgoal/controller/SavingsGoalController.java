package com.infosys.aibudgettracker.savingsgoal.controller;

import com.infosys.aibudgettracker.authservice.model.User;
import com.infosys.aibudgettracker.authservice.repository.UserRepository;
import com.infosys.aibudgettracker.savingsgoal.dto.SavingsGoalProgress;
import com.infosys.aibudgettracker.savingsgoal.dto.SavingsGoalRequest;
import com.infosys.aibudgettracker.savingsgoal.dto.SavingsGoalResponse;
import com.infosys.aibudgettracker.savingsgoal.service.SavingsGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savings-goals")
@CrossOrigin(origins = "http://localhost:5173")
public class SavingsGoalController {
    
    @Autowired
    private SavingsGoalService savingsGoalService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> createSavingsGoal(@RequestBody SavingsGoalRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            SavingsGoalResponse response = savingsGoalService.createSavingsGoal(user.getId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserSavingsGoals(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<SavingsGoalResponse> goals = savingsGoalService.getUserSavingsGoals(user.getId());
            return ResponseEntity.ok(goals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @GetMapping("/progress")
    public ResponseEntity<?> getSavingsGoalProgress(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<SavingsGoalProgress> progress = savingsGoalService.getSavingsGoalProgress(user.getId());
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSavingsGoal(
            @PathVariable Long id,
            @RequestBody SavingsGoalRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            SavingsGoalResponse response = savingsGoalService.updateSavingsGoal(id, user.getId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavingsGoal(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            savingsGoalService.deleteSavingsGoal(id, user.getId());
            return ResponseEntity.ok("Savings goal deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PostMapping("/{id}/add")
    public ResponseEntity<?> addToSavingsGoal(
            @PathVariable Long id,
            @RequestBody Map<String, Double> request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Double amount = request.get("amount");
            if (amount == null || amount <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid amount");
            }
            
            SavingsGoalResponse response = savingsGoalService.addToSavingsGoal(id, user.getId(), amount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

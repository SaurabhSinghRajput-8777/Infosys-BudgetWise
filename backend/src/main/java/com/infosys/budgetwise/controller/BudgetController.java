package com.infosys.budgetwise.controller;

import com.infosys.budgetwise.model.Budget;
import com.infosys.budgetwise.model.User;
import com.infosys.budgetwise.payload.BudgetRequest;
import com.infosys.budgetwise.repository.BudgetRepository;
import com.infosys.budgetwise.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getBudget(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            logger.info("Fetching budget for user: {}", userDetails.getUsername());
            
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Budget> budget = budgetRepository.findByUserAndPeriod(user, YearMonth.now());

            if (budget.isPresent()) {
                logger.info("Budget found for user: {}", userDetails.getUsername());
                return ResponseEntity.ok(budget.get());
            } else {
                logger.warn("No budget found for user: {}", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "No budget found for the current month."));
            }
        } catch (Exception e) {
            logger.error("Error fetching budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching budget: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateBudget(
            @AuthenticationPrincipal UserDetails userDetails, 
            @RequestBody BudgetRequest budgetRequest) {
        try {
            logger.info("Creating/updating budget for user: {}", userDetails.getUsername());
            logger.debug("Budget request: {}", budgetRequest);

            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            YearMonth currentPeriod = YearMonth.now();
            Optional<Budget> existingBudget = budgetRepository.findByUserAndPeriod(user, currentPeriod);
            
            // Validate input
            if (budgetRequest.getMonthlyIncome() == null || budgetRequest.getMonthlyIncome() <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Monthly income must be greater than 0"));
            }
            
            if (budgetRequest.getSavingGoal() == null || budgetRequest.getSavingGoal() < 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Saving goal cannot be negative"));
            }
            
            if (budgetRequest.getTargetExpenses() == null || budgetRequest.getTargetExpenses() < 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Target expenses cannot be negative"));
            }

            // Convert category expenses
            Map<String, BigDecimal> convertedCategoryExpenses = new HashMap<>();
            if (budgetRequest.getCategoryExpenses() != null) {
                convertedCategoryExpenses = budgetRequest.getCategoryExpenses().entrySet().stream()
                        .filter(entry -> entry.getValue() != null && entry.getValue() > 0)
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> BigDecimal.valueOf(entry.getValue())
                        ));
            }

            Budget budget;
            if (existingBudget.isPresent()) {
                logger.info("Updating existing budget");
                budget = existingBudget.get();
            } else {
                logger.info("Creating new budget");
                budget = new Budget();
                budget.setUser(user);
                budget.setPeriod(currentPeriod);
            }
            
            budget.setMonthlyIncome(BigDecimal.valueOf(budgetRequest.getMonthlyIncome()));
            budget.setSavingGoal(BigDecimal.valueOf(budgetRequest.getSavingGoal()));
            budget.setTargetExpenses(BigDecimal.valueOf(budgetRequest.getTargetExpenses()));
            budget.setCategoryExpenses(convertedCategoryExpenses);

            Budget savedBudget = budgetRepository.save(budget);
            logger.info("Budget saved successfully with ID: {}", savedBudget.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Budget saved successfully",
                            "budget", savedBudget
                    ));
                    
        } catch (Exception e) {
            logger.error("Error creating/updating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error saving budget: " + e.getMessage()));
        }
    }
}
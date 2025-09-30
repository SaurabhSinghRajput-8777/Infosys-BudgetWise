package com.infosys.budgetwise.controller;

import com.infosys.budgetwise.model.Budget;
import com.infosys.budgetwise.model.User;
import com.infosys.budgetwise.payload.BudgetRequest;
import com.infosys.budgetwise.repository.BudgetRepository;
import com.infosys.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getBudget(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Budget> budget = budgetRepository.findByUserAndPeriod(user, YearMonth.now());

        if (budget.isPresent()) {
            return ResponseEntity.ok(budget.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No budget found for the current month.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateBudget(@AuthenticationPrincipal UserDetails userDetails, @RequestBody BudgetRequest budgetRequest) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<Budget> existingBudget = budgetRepository.findByUserAndPeriod(user, YearMonth.now());
        
        // Manually convert Double values from the request to BigDecimal
        Map<String, BigDecimal> convertedCategoryExpenses = budgetRequest.getCategoryExpenses().entrySet().stream()
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    entry -> BigDecimal.valueOf(entry.getValue())
                ));

        Budget budget;
        if (existingBudget.isPresent()) {
            budget = existingBudget.get();
            budget.setMonthlyIncome(BigDecimal.valueOf(budgetRequest.getMonthlyIncome()));
            budget.setSavingGoal(BigDecimal.valueOf(budgetRequest.getSavingGoal()));
            budget.setTargetExpenses(BigDecimal.valueOf(budgetRequest.getTargetExpenses()));
            budget.setCategoryExpenses(convertedCategoryExpenses);
        } else {
            budget = new Budget();
            budget.setUser(user);
            budget.setPeriod(YearMonth.now());
            budget.setMonthlyIncome(BigDecimal.valueOf(budgetRequest.getMonthlyIncome()));
            budget.setSavingGoal(BigDecimal.valueOf(budgetRequest.getSavingGoal()));
            budget.setTargetExpenses(BigDecimal.valueOf(budgetRequest.getTargetExpenses()));
            budget.setCategoryExpenses(convertedCategoryExpenses);
        }

        budgetRepository.save(budget);
        return new ResponseEntity<>(budget, HttpStatus.CREATED);
    }
}
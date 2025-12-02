package com.infosys.aibudgettracker.budget.service;

import com.infosys.aibudgettracker.budget.dto.BudgetProgress;
import com.infosys.aibudgettracker.budget.dto.BudgetRequest;
import com.infosys.aibudgettracker.budget.dto.BudgetResponse;
import com.infosys.aibudgettracker.budget.model.Budget;
import com.infosys.aibudgettracker.budget.repository.BudgetRepository;
import com.infosys.aibudgettracker.transaction.model.Transaction;
import com.infosys.aibudgettracker.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        // Check if budget already exists for this category/month/year
        var existing = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
            userId, request.getCategory(), request.getMonth(), request.getYear());
        
        if (existing.isPresent()) {
            throw new RuntimeException("Budget for this category already exists for the selected month");
        }
        
        Budget budget = new Budget();
        budget.setUserId(userId);
        budget.setCategory(request.getCategory());
        budget.setAmount(request.getAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        
        Budget savedBudget = budgetRepository.save(budget);
        return mapToResponse(savedBudget);
    }
    
    public List<BudgetResponse> getUserBudgets(Long userId, Integer month, Integer year) {
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public BudgetResponse updateBudget(Long budgetId, Long userId, BudgetRequest request) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to budget");
        }
        
        budget.setAmount(request.getAmount());
        
        Budget updatedBudget = budgetRepository.save(budget);
        return mapToResponse(updatedBudget);
    }
    
    public void deleteBudget(Long budgetId, Long userId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to budget");
        }
        
        budgetRepository.delete(budget);
    }
    
    public List<BudgetProgress> getBudgetProgress(Long userId, Integer month, Integer year) {
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        
        // Get start and end of month
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        
        // Get all expenses for this month
        List<Transaction> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);
        
        List<BudgetProgress> progressList = new ArrayList<>();
        
        for (Budget budget : budgets) {
            // Calculate spent amount for this category
            double spent = transactions.stream()
                    .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                    .filter(t -> t.getCategory().equalsIgnoreCase(budget.getCategory()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();
            
            double remaining = budget.getAmount() - spent;
            double percentage = budget.getAmount() > 0 ? (spent / budget.getAmount()) * 100 : 0;
            
            progressList.add(new BudgetProgress(
                    budget.getCategory(),
                    budget.getAmount(),
                    spent,
                    remaining,
                    percentage
            ));
        }
        
        return progressList;
    }
    
    private BudgetResponse mapToResponse(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getCategory(),
                budget.getAmount(),
                budget.getMonth(),
                budget.getYear(),
                budget.getUserId(),
                budget.getCreatedAt(),
                budget.getUpdatedAt()
        );
    }
}

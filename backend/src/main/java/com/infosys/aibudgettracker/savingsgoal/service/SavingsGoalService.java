package com.infosys.aibudgettracker.savingsgoal.service;

import com.infosys.aibudgettracker.savingsgoal.dto.SavingsGoalProgress;
import com.infosys.aibudgettracker.savingsgoal.dto.SavingsGoalRequest;
import com.infosys.aibudgettracker.savingsgoal.dto.SavingsGoalResponse;
import com.infosys.aibudgettracker.savingsgoal.model.SavingsGoal;
import com.infosys.aibudgettracker.savingsgoal.repository.SavingsGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavingsGoalService {
    
    @Autowired
    private SavingsGoalRepository savingsGoalRepository;
    
    public SavingsGoalResponse createSavingsGoal(Long userId, SavingsGoalRequest request) {
        SavingsGoal goal = new SavingsGoal();
        goal.setUserId(userId);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : 0.0);
        goal.setTargetDate(request.getTargetDate());
        
        SavingsGoal savedGoal = savingsGoalRepository.save(goal);
        return mapToResponse(savedGoal);
    }
    
    public List<SavingsGoalResponse> getUserSavingsGoals(Long userId) {
        return savingsGoalRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<SavingsGoalProgress> getSavingsGoalProgress(Long userId) {
        return savingsGoalRepository.findByUserId(userId)
                .stream()
                .map(this::mapToProgress)
                .collect(Collectors.toList());
    }
    
    public SavingsGoalResponse updateSavingsGoal(Long goalId, Long userId, SavingsGoalRequest request) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
        
        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }
        
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(request.getCurrentAmount());
        }
        goal.setTargetDate(request.getTargetDate());
        
        SavingsGoal updatedGoal = savingsGoalRepository.save(goal);
        return mapToResponse(updatedGoal);
    }
    
    public void deleteSavingsGoal(Long goalId, Long userId) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
        
        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }
        
        savingsGoalRepository.delete(goal);
    }
    
    public SavingsGoalResponse addToSavingsGoal(Long goalId, Long userId, Double amount) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
        
        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to savings goal");
        }
        
        goal.setCurrentAmount(goal.getCurrentAmount() + amount);
        
        SavingsGoal updatedGoal = savingsGoalRepository.save(goal);
        return mapToResponse(updatedGoal);
    }
    
    private SavingsGoalResponse mapToResponse(SavingsGoal goal) {
        return new SavingsGoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getTargetDate(),
                goal.getUserId(),
                goal.getCreatedAt(),
                goal.getUpdatedAt()
        );
    }
    
    private SavingsGoalProgress mapToProgress(SavingsGoal goal) {
        double progressPercentage = goal.getTargetAmount() > 0 
                ? (goal.getCurrentAmount() / goal.getTargetAmount()) * 100 
                : 0;
        
        Integer daysRemaining = null;
        if (goal.getTargetDate() != null) {
            daysRemaining = (int) ChronoUnit.DAYS.between(LocalDate.now(), goal.getTargetDate());
        }
        
        // Determine if on track
        boolean onTrack = true;
        if (goal.getTargetDate() != null && daysRemaining != null) {
            long totalDays = ChronoUnit.DAYS.between(
                goal.getCreatedAt().toLocalDate(), 
                goal.getTargetDate()
            );
            if (totalDays > 0) {
                long daysPassed = ChronoUnit.DAYS.between(goal.getCreatedAt().toLocalDate(), LocalDate.now());
                double expectedProgress = (double) daysPassed / totalDays * 100;
                onTrack = progressPercentage >= expectedProgress;
            }
        }
        
        return new SavingsGoalProgress(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getTargetDate(),
                goal.getUserId(),
                goal.getCreatedAt(),
                goal.getUpdatedAt(),
                progressPercentage,
                daysRemaining,
                onTrack
        );
    }
}

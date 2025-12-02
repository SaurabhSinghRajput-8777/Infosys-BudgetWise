package com.infosys.aibudgettracker.savingsgoal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SavingsGoalResponse {
    private Long id;
    private String name;
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate targetDate;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

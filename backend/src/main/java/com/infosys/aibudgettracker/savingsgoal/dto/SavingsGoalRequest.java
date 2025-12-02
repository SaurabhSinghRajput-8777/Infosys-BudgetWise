package com.infosys.aibudgettracker.savingsgoal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SavingsGoalRequest {
    private String name;
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate targetDate;
}

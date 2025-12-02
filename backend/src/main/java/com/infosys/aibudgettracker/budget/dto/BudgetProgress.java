package com.infosys.aibudgettracker.budget.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetProgress {
    private String category;
    private Double budgeted;
    private Double spent;
    private Double remaining;
    private Double percentage;
}

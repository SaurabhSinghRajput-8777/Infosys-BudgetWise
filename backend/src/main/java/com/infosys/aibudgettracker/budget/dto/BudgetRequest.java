package com.infosys.aibudgettracker.budget.dto;

import lombok.Data;

@Data
public class BudgetRequest {
    private String category;
    private Double amount;
    private Integer month;
    private Integer year;
}

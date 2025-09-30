package com.infosys.budgetwise.payload;

import lombok.Data;
import java.util.Map;

@Data
public class BudgetRequest {
    private Double monthlyIncome;
    private Double savingGoal;
    private Double targetExpenses;
    private Map<String, Double> categoryExpenses;
}
package com.infosys.aibudgettracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeVsExpenseDTO {
    private String month;
    private Double totalIncome;
    private Double totalExpenses;
}

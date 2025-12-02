package com.infosys.aibudgettracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private List<CategoryBreakdownDTO> categoryBreakdown;
    private List<MonthlyTrendDTO> monthlyTrend;
    private List<IncomeVsExpenseDTO> incomeVsExpenses;
}

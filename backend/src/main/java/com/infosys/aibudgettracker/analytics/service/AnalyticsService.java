package com.infosys.aibudgettracker.analytics.service;

import com.infosys.aibudgettracker.analytics.dto.AnalyticsResponse;
import com.infosys.aibudgettracker.analytics.dto.CategoryBreakdownDTO;
import com.infosys.aibudgettracker.analytics.dto.IncomeVsExpenseDTO;
import com.infosys.aibudgettracker.analytics.dto.MonthlyTrendDTO;
import com.infosys.aibudgettracker.transaction.model.Transaction;
import com.infosys.aibudgettracker.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    public AnalyticsResponse getAnalytics(Long userId, int year, int month) {
        // Get date range for the specified month
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);

        // Get all transactions for the year
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        List<Transaction> monthTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startOfMonth, endOfMonth);
        
        List<Transaction> yearTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startOfYear, endOfYear);

        // Category breakdown for the selected month (expenses only)
        List<CategoryBreakdownDTO> categoryBreakdown = getCategoryBreakdown(monthTransactions);

        // Monthly trend for the entire year (expenses only)
        List<MonthlyTrendDTO> monthlyTrend = getMonthlyTrend(yearTransactions, year);

        // Income vs Expenses for the entire year
        List<IncomeVsExpenseDTO> incomeVsExpenses = getIncomeVsExpenses(yearTransactions, year);

        return new AnalyticsResponse(categoryBreakdown, monthlyTrend, incomeVsExpenses);
    }

    private List<CategoryBreakdownDTO> getCategoryBreakdown(List<Transaction> transactions) {
        Map<String, Double> categoryTotals = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        return categoryTotals.entrySet().stream()
                .map(entry -> new CategoryBreakdownDTO(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> Double.compare(b.getTotalAmount(), a.getTotalAmount()))
                .collect(Collectors.toList());
    }

    private List<MonthlyTrendDTO> getMonthlyTrend(List<Transaction> transactions, int year) {
        Map<Integer, Double> monthlyTotals = new HashMap<>();
        
        // Initialize all months with 0
        for (int i = 1; i <= 12; i++) {
            monthlyTotals.put(i, 0.0);
        }

        // Sum expenses by month
        transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .forEach(t -> {
                    int month = t.getTransactionDate().getMonthValue();
                    monthlyTotals.merge(month, t.getAmount(), Double::sum);
                });

        return monthlyTotals.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    YearMonth ym = YearMonth.of(year, entry.getKey());
                    String monthStr = ym.atDay(1).toString();
                    return new MonthlyTrendDTO(monthStr, entry.getValue());
                })
                .collect(Collectors.toList());
    }

    private List<IncomeVsExpenseDTO> getIncomeVsExpenses(List<Transaction> transactions, int year) {
        Map<Integer, Double> incomeByMonth = new HashMap<>();
        Map<Integer, Double> expenseByMonth = new HashMap<>();

        // Initialize all months with 0
        for (int i = 1; i <= 12; i++) {
            incomeByMonth.put(i, 0.0);
            expenseByMonth.put(i, 0.0);
        }

        // Aggregate transactions by month and type
        transactions.forEach(t -> {
            int month = t.getTransactionDate().getMonthValue();
            if (t.getType() == Transaction.TransactionType.INCOME) {
                incomeByMonth.merge(month, t.getAmount(), Double::sum);
            } else {
                expenseByMonth.merge(month, t.getAmount(), Double::sum);
            }
        });

        List<IncomeVsExpenseDTO> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            YearMonth ym = YearMonth.of(year, i);
            String monthStr = ym.atDay(1).toString();
            result.add(new IncomeVsExpenseDTO(
                    monthStr,
                    incomeByMonth.get(i),
                    expenseByMonth.get(i)
            ));
        }

        return result;
    }
}

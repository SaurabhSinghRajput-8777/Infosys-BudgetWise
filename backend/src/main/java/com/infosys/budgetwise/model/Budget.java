package com.infosys.budgetwise.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Map;

@Entity
@Table(name = "budgets")
@Data
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private YearMonth period;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal savingGoal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal targetExpenses;

    @ElementCollection
    @CollectionTable(name = "budget_category_expenses", joinColumns = @JoinColumn(name = "budget_id"))
    @MapKeyColumn(name = "category")
    @Column(name = "amount")
    private Map<String, BigDecimal> categoryExpenses;
}
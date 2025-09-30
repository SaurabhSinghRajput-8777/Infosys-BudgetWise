package com.infosys.budgetwise.model;

import com.infosys.budgetwise.config.YearMonthAttributeConverter;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "budgets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "period"})
})
@Data
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Convert(converter = YearMonthAttributeConverter.class)
    private YearMonth period;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal savingGoal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal targetExpenses;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "budget_category_expenses", joinColumns = @JoinColumn(name = "budget_id"))
    @MapKeyColumn(name = "category", length = 50)
    @Column(name = "amount", precision = 10, scale = 2)
    private Map<String, BigDecimal> categoryExpenses = new HashMap<>();
}
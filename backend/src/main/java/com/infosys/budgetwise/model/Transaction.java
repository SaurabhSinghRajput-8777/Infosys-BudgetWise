package com.infosys.budgetwise.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String description;
    
    @Column(nullable = false)
    private BigDecimal amount;

    private String category;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TransactionType type;
}
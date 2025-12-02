package com.infosys.aibudgettracker.transaction.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private String category;
    
    @Column
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime transactionDate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public enum TransactionType {
        INCOME, EXPENSE
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
    }
}

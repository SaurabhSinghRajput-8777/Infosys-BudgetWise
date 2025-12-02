package com.infosys.aibudgettracker.transaction.dto;

import com.infosys.aibudgettracker.transaction.model.Transaction.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private Double amount;
    private String category;
    private String description;
    private LocalDateTime transactionDate;
    private LocalDateTime createdAt;
}

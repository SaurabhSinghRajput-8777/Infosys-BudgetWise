package com.infosys.aibudgettracker.transaction.dto;

import com.infosys.aibudgettracker.transaction.model.Transaction.TransactionType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    private TransactionType type;
    private Double amount;
    private String category;
    private String description;
    private LocalDateTime transactionDate;
}

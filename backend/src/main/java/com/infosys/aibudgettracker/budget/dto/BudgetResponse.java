package com.infosys.aibudgettracker.budget.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private String category;
    private Double amount;
    private Integer month;
    private Integer year;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

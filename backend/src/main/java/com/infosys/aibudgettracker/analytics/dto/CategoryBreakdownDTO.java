package com.infosys.aibudgettracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBreakdownDTO {
    private String category;
    private Double totalAmount;
}

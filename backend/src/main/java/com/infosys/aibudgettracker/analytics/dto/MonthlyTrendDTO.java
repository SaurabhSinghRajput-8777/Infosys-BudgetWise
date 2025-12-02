package com.infosys.aibudgettracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTrendDTO {
    private String month;
    private Double totalAmount;
}

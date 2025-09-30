package com.infosys.budgetwise.repository;

import com.infosys.budgetwise.model.Budget;
import com.infosys.budgetwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserAndPeriod(User user, YearMonth period);
}
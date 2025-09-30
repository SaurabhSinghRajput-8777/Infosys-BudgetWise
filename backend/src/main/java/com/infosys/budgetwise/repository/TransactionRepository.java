package com.infosys.budgetwise.repository;

import com.infosys.budgetwise.model.Transaction;
import com.infosys.budgetwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
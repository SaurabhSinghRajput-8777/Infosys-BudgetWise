package com.infosys.aibudgettracker.transaction.repository;

import com.infosys.aibudgettracker.transaction.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUserIdAndType(Long userId, Transaction.TransactionType type);
    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);
}

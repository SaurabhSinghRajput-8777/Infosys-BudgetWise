package com.infosys.aibudgettracker.transaction.service;

import com.infosys.aibudgettracker.transaction.dto.TransactionRequest;
import com.infosys.aibudgettracker.transaction.dto.TransactionResponse;
import com.infosys.aibudgettracker.transaction.model.Transaction;
import com.infosys.aibudgettracker.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }
    
    public List<TransactionResponse> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public TransactionResponse updateTransaction(Long transactionId, Long userId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }
        
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return mapToResponse(updatedTransaction);
    }
    
    public void deleteTransaction(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to transaction");
        }
        
        transactionRepository.delete(transaction);
    }
    
    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt()
        );
    }
}

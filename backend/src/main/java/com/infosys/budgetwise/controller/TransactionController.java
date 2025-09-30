package com.infosys.budgetwise.controller;

import com.infosys.budgetwise.model.Transaction;
import com.infosys.budgetwise.model.User;
import com.infosys.budgetwise.repository.TransactionRepository;
import com.infosys.budgetwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate startDate = LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetween(user, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Transaction transaction) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);
        return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id, @RequestBody Transaction transactionDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Transaction> optionalTransaction = transactionRepository.findById(id);

        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            if (!transaction.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            transaction.setDescription(transactionDetails.getDescription());
            transaction.setAmount(transactionDetails.getAmount());
            transaction.setCategory(transactionDetails.getCategory());
            transaction.setDate(transactionDetails.getDate());
            transaction.setType(transactionDetails.getType());
            Transaction updatedTransaction = transactionRepository.save(transaction);
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Transaction> optionalTransaction = transactionRepository.findById(id);

        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            if (!transaction.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            transactionRepository.delete(transaction);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
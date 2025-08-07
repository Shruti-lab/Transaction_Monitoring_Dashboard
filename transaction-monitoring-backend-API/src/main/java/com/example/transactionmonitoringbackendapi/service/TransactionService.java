package com.example.transactionmonitoringbackendapi.service;

import com.example.transactionmonitoringbackendapi.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public interface TransactionService {

    // CRUD operations
    Transaction saveTransaction(Transaction transaction);
    Transaction getTransactionById(Long id);
    Page<Transaction> getAllTransactions(Pageable pageable);
    void deleteTransaction(Long id);
    
    // Filtering operations
    Page<Transaction> getTransactionsByRegion(String country, String region, String city, Pageable pageable);
    Page<Transaction> getTransactionsByAmountRange(BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
    Page<Transaction> getTransactionsByRegionAndAmountRange(
            String country, String region, String city, 
            BigDecimal minAmount, BigDecimal maxAmount, 
            Pageable pageable);
    
    // Fraud and error transactions
    Page<Transaction> getFraudulentTransactions(Pageable pageable);
    Page<Transaction> getErrorTransactions(Pageable pageable);
    
    // Metrics for dashboard
    Map<String, Object> getTransactionMetrics(LocalDateTime startTime, LocalDateTime endTime);
    
    // Transaction simulation
    void simulateTransactions(int count);
    void startTransactionSimulation(int transactionsPerMinute);
    void stopTransactionSimulation();
}
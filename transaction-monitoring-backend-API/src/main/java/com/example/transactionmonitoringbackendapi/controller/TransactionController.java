package com.example.transactionmonitoringbackendapi.controller;

import com.example.transactionmonitoringbackendapi.model.Transaction;
import com.example.transactionmonitoringbackendapi.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow cross-origin requests from the frontend
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * Get all transactions with pagination and sorting
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactionsPage = transactionService.getAllTransactions(pageable);

        return createPaginatedResponse(transactionsPage);
    }

    /**
     * Get transaction by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        try {
            Transaction transaction = transactionService.getTransactionById(id);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Filter transactions by region (country, region, city)
     */
    @GetMapping("/filter/region")
    public ResponseEntity<Map<String, Object>> getTransactionsByRegion(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactionsPage = transactionService.getTransactionsByRegion(
                country, region, city, pageable);

        return createPaginatedResponse(transactionsPage);
    }

    /**
     * Filter transactions by amount range
     */
    @GetMapping("/filter/amount")
    public ResponseEntity<Map<String, Object>> getTransactionsByAmountRange(
            @RequestParam(defaultValue = "0") BigDecimal minAmount,
            @RequestParam(defaultValue = "999999999") BigDecimal maxAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactionsPage = transactionService.getTransactionsByAmountRange(
                minAmount, maxAmount, pageable);

        return createPaginatedResponse(transactionsPage);
    }

    /**
     * Filter transactions by both region and amount range
     */
    @GetMapping("/filter/combined")
    public ResponseEntity<Map<String, Object>> getTransactionsByRegionAndAmountRange(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") BigDecimal minAmount,
            @RequestParam(defaultValue = "999999999") BigDecimal maxAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactionsPage = transactionService.getTransactionsByRegionAndAmountRange(
                country, region, city, minAmount, maxAmount, pageable);

        return createPaginatedResponse(transactionsPage);
    }

    /**
     * Get fraudulent transactions
     */
    @GetMapping("/fraudulent")
    public ResponseEntity<Map<String, Object>> getFraudulentTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactionsPage = transactionService.getFraudulentTransactions(pageable);

        return createPaginatedResponse(transactionsPage);
    }

    /**
     * Get error transactions
     */
    @GetMapping("/errors")
    public ResponseEntity<Map<String, Object>> getErrorTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactionsPage = transactionService.getErrorTransactions(pageable);

        return createPaginatedResponse(transactionsPage);
    }

    /**
     * Get transaction metrics for dashboard
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getTransactionMetrics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        
        // Default to last 24 hours if not specified
        if (startTime == null) {
            startTime = LocalDateTime.now().minusHours(24);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        Map<String, Object> metrics = transactionService.getTransactionMetrics(startTime, endTime);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Simulate transactions (for testing and demo purposes)
     */
    @PostMapping("/simulate")
    public ResponseEntity<Map<String, String>> simulateTransactions(
            @RequestParam(defaultValue = "100") int count) {
        
        transactionService.simulateTransactions(count);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully simulated " + count + " transactions");
        return ResponseEntity.ok(response);
    }

    /**
     * Start continuous transaction simulation
     */
    @PostMapping("/simulate/start")
    public ResponseEntity<Map<String, String>> startTransactionSimulation(
            @RequestParam(defaultValue = "60") int transactionsPerMinute) {
        
        transactionService.startTransactionSimulation(transactionsPerMinute);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Started transaction simulation at " + transactionsPerMinute + " transactions per minute");
        return ResponseEntity.ok(response);
    }

    /**
     * Stop continuous transaction simulation
     */
    @PostMapping("/simulate/stop")
    public ResponseEntity<Map<String, String>> stopTransactionSimulation() {
        transactionService.stopTransactionSimulation();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Stopped transaction simulation");
        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to create a paginated response
     */
    private ResponseEntity<Map<String, Object>> createPaginatedResponse(Page<Transaction> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("transactions", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
}
package com.example.transactionmonitoringbackendapi.repository;

import com.example.transactionmonitoringbackendapi.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find transactions by region (country, region, or city)
    Page<Transaction> findByCountry(String country, Pageable pageable);
    Page<Transaction> findByRegion(String region, Pageable pageable);
    Page<Transaction> findByCity(String city, Pageable pageable);
    
    // Find transactions by amount range
    Page<Transaction> findByAmountBetween(BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
    
    // Find transactions by combined filters
    Page<Transaction> findByCountryAndAmountBetween(
            String country, BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
    
    Page<Transaction> findByRegionAndAmountBetween(
            String region, BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
    
    Page<Transaction> findByCountryAndRegionAndAmountBetween(
            String country, String region, BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
    
    Page<Transaction> findByCountryAndRegionAndCityAndAmountBetween(
            String country, String region, String city, BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
    
    // Find fraudulent transactions
    Page<Transaction> findByIsFraudulent(boolean isFraudulent, Pageable pageable);
    
    // Find error transactions
    Page<Transaction> findByIsError(boolean isError, Pageable pageable);
    
    // Count metrics for dashboard
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.timestamp BETWEEN :startTime AND :endTime")
    long countTransactionsInTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.isFraudulent = true AND t.timestamp BETWEEN :startTime AND :endTime")
    long countFraudulentTransactionsInTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.isError = true AND t.timestamp BETWEEN :startTime AND :endTime")
    long countErrorTransactionsInTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}
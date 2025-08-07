package com.example.transactionmonitoringbackendapi.service;

import com.example.transactionmonitoringbackendapi.model.Transaction;
import com.example.transactionmonitoringbackendapi.repository.TransactionRepository;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Counter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final MeterRegistry meterRegistry;
    
    // Counters for Prometheus metrics
    private final Counter totalTransactionsCounter;
    private final Counter fraudulentTransactionsCounter;
    private final Counter errorTransactionsCounter;
    
    // Simulation control
    private final AtomicBoolean simulationRunning = new AtomicBoolean(false);
    private int transactionsPerMinute = 60; // Default: 1 per second
    
    // Sample data for simulation
    private final String[] countries = {"USA", "Canada", "UK", "Germany", "France", "Japan", "Australia", "India", "Brazil", "China"};
    private final Map<String, String[]> regionsMap = new HashMap<>();
    private final Map<String, String[]> citiesMap = new HashMap<>();
    private final String[] merchantNames = {"Amazon", "Walmart", "Target", "Best Buy", "Apple Store", "Starbucks", "McDonald's", "Uber", "Netflix", "Spotify"};
    private final String[] transactionTypes = {"PURCHASE", "REFUND", "WITHDRAWAL", "DEPOSIT", "TRANSFER"};
    private final String[] currencies = {"USD", "EUR", "GBP", "CAD", "JPY", "AUD", "INR", "BRL", "CNY"};
    
    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository, MeterRegistry meterRegistry) {
        this.transactionRepository = transactionRepository;
        this.meterRegistry = meterRegistry;
        
        // Initialize Prometheus counters
        this.totalTransactionsCounter = Counter.builder("transactions_total")
                .description("Total number of transactions processed")
                .register(meterRegistry);
        
        this.fraudulentTransactionsCounter = Counter.builder("transactions_fraudulent")
                .description("Total number of fraudulent transactions detected")
                .register(meterRegistry);
        
        this.errorTransactionsCounter = Counter.builder("transactions_error")
                .description("Total number of transactions with errors")
                .register(meterRegistry);
        
        // Initialize sample data for regions and cities
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        // Initialize regions for countries
        regionsMap.put("USA", new String[]{"East Coast", "West Coast", "Midwest", "South", "Northwest"});
        regionsMap.put("Canada", new String[]{"Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"});
        regionsMap.put("UK", new String[]{"England", "Scotland", "Wales", "Northern Ireland"});
        regionsMap.put("Germany", new String[]{"Bavaria", "Berlin", "Hamburg", "Saxony", "Hesse"});
        regionsMap.put("France", new String[]{"Île-de-France", "Provence", "Normandy", "Brittany", "Alsace"});
        regionsMap.put("Japan", new String[]{"Kanto", "Kansai", "Chubu", "Kyushu", "Tohoku"});
        regionsMap.put("Australia", new String[]{"New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"});
        regionsMap.put("India", new String[]{"Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"});
        regionsMap.put("Brazil", new String[]{"São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná"});
        regionsMap.put("China", new String[]{"Guangdong", "Beijing", "Shanghai", "Sichuan", "Zhejiang"});
        
        // Initialize cities for regions (simplified)
        citiesMap.put("East Coast", new String[]{"New York", "Boston", "Philadelphia", "Miami", "Washington DC"});
        citiesMap.put("West Coast", new String[]{"Los Angeles", "San Francisco", "Seattle", "Portland", "San Diego"});
        citiesMap.put("England", new String[]{"London", "Manchester", "Birmingham", "Liverpool", "Leeds"});
        citiesMap.put("Bavaria", new String[]{"Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"});
        citiesMap.put("Île-de-France", new String[]{"Paris", "Versailles", "Saint-Denis", "Boulogne-Billancourt", "Argenteuil"});
        // Add more cities as needed
    }

    @Override
    public Transaction saveTransaction(Transaction transaction) {
        // Update metrics
        totalTransactionsCounter.increment();
        if (transaction.isFraudulent()) {
            fraudulentTransactionsCounter.increment();
        }
        if (transaction.isError()) {
            errorTransactionsCounter.increment();
        }
        
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found with ID: " + id));
    }

    @Override
    public Page<Transaction> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    @Override
    public Page<Transaction> getTransactionsByRegion(String country, String region, String city, Pageable pageable) {
        if (country != null && region != null && city != null) {
            return transactionRepository.findByCountryAndRegionAndCityAndAmountBetween(
                    country, region, city, BigDecimal.ZERO, new BigDecimal("999999999"), pageable);
        } else if (country != null && region != null) {
            return transactionRepository.findByCountryAndRegionAndAmountBetween(
                    country, region, BigDecimal.ZERO, new BigDecimal("999999999"), pageable);
        } else if (country != null) {
            return transactionRepository.findByCountry(country, pageable);
        } else if (region != null) {
            return transactionRepository.findByRegion(region, pageable);
        } else if (city != null) {
            return transactionRepository.findByCity(city, pageable);
        } else {
            return transactionRepository.findAll(pageable);
        }
    }

    @Override
    public Page<Transaction> getTransactionsByAmountRange(BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable) {
        return transactionRepository.findByAmountBetween(minAmount, maxAmount, pageable);
    }

    @Override
    public Page<Transaction> getTransactionsByRegionAndAmountRange(
            String country, String region, String city, 
            BigDecimal minAmount, BigDecimal maxAmount, 
            Pageable pageable) {
        
        if (country != null && region != null && city != null) {
            return transactionRepository.findByCountryAndRegionAndCityAndAmountBetween(
                    country, region, city, minAmount, maxAmount, pageable);
        } else if (country != null && region != null) {
            return transactionRepository.findByCountryAndRegionAndAmountBetween(
                    country, region, minAmount, maxAmount, pageable);
        } else if (country != null) {
            return transactionRepository.findByCountryAndAmountBetween(
                    country, minAmount, maxAmount, pageable);
        } else if (region != null) {
            return transactionRepository.findByRegionAndAmountBetween(
                    region, minAmount, maxAmount, pageable);
        } else {
            return transactionRepository.findByAmountBetween(minAmount, maxAmount, pageable);
        }
    }

    @Override
    public Page<Transaction> getFraudulentTransactions(Pageable pageable) {
        return transactionRepository.findByIsFraudulent(true, pageable);
    }

    @Override
    public Page<Transaction> getErrorTransactions(Pageable pageable) {
        return transactionRepository.findByIsError(true, pageable);
    }

    @Override
    public Map<String, Object> getTransactionMetrics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> metrics = new HashMap<>();
        
        long totalCount = transactionRepository.countTransactionsInTimeRange(startTime, endTime);
        long fraudCount = transactionRepository.countFraudulentTransactionsInTimeRange(startTime, endTime);
        long errorCount = transactionRepository.countErrorTransactionsInTimeRange(startTime, endTime);
        
        metrics.put("totalTransactions", totalCount);
        metrics.put("fraudulentTransactions", fraudCount);
        metrics.put("errorTransactions", errorCount);
        
        // Calculate percentages if there are transactions
        if (totalCount > 0) {
            metrics.put("fraudRate", (double) fraudCount / totalCount * 100);
            metrics.put("errorRate", (double) errorCount / totalCount * 100);
        } else {
            metrics.put("fraudRate", 0.0);
            metrics.put("errorRate", 0.0);
        }
        
        metrics.put("startTime", startTime);
        metrics.put("endTime", endTime);
        
        return metrics;
    }

    @Override
    public void simulateTransactions(int count) {
        for (int i = 0; i < count; i++) {
            Transaction transaction = generateRandomTransaction();
            saveTransaction(transaction);
        }
    }

    @Override
    public void startTransactionSimulation(int transactionsPerMinute) {
        this.transactionsPerMinute = transactionsPerMinute;
        simulationRunning.set(true);
    }

    @Override
    public void stopTransactionSimulation() {
        simulationRunning.set(false);
    }
    
    @Scheduled(fixedRate = 60000) // Run every minute
    public void scheduledTransactionSimulation() {
        if (simulationRunning.get()) {
            simulateTransactions(transactionsPerMinute);
        }
    }
    
    // Helper method to generate random transactions for simulation
    private Transaction generateRandomTransaction() {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        
        // Generate random card number (simplified)
        String cardNumber = "4" + String.format("%015d", random.nextLong(1_000_000_000_000_000L));
        
        // Generate random amount between $1 and $10,000
        BigDecimal amount = BigDecimal.valueOf(random.nextDouble(1.0, 10000.0)).setScale(2, BigDecimal.ROUND_HALF_UP);
        
        // Select random location
        String country = countries[random.nextInt(countries.length)];
        String[] regions = regionsMap.getOrDefault(country, new String[]{"Unknown Region"});
        String region = regions[random.nextInt(regions.length)];
        String[] cities = citiesMap.getOrDefault(region, new String[]{"Unknown City"});
        String city = cities.length > 0 ? cities[random.nextInt(cities.length)] : "Unknown City";
        
        // Select random merchant and transaction type
        String merchantName = merchantNames[random.nextInt(merchantNames.length)];
        String transactionType = transactionTypes[random.nextInt(transactionTypes.length)];
        String currency = currencies[random.nextInt(currencies.length)];
        
        // Randomly determine if transaction is fraudulent (5% chance)
        boolean isFraudulent = random.nextInt(100) < 5;
        
        // Randomly determine if transaction has an error (3% chance)
        boolean isError = random.nextInt(100) < 3;
        
        // Generate error message if there's an error
        String errorMessage = isError ? generateRandomErrorMessage() : null;
        
        // Create transaction with current timestamp
        return new Transaction(
                cardNumber,
                amount,
                currency,
                LocalDateTime.now(),
                merchantName,
                country,
                region,
                city,
                transactionType,
                isFraudulent,
                isError,
                errorMessage
        );
    }
    
    private String generateRandomErrorMessage() {
        String[] errorMessages = {
                "Insufficient funds",
                "Card expired",
                "Invalid card number",
                "Transaction timeout",
                "Network error",
                "Card blocked",
                "Security verification failed",
                "Processing error"
        };
        
        return errorMessages[ThreadLocalRandom.current().nextInt(errorMessages.length)];
    }
}
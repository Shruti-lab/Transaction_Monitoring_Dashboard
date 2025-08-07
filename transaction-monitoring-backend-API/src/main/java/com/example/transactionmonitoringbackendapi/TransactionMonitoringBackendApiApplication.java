package com.example.transactionmonitoringbackendapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TransactionMonitoringBackendApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransactionMonitoringBackendApiApplication.class, args);
	}

}

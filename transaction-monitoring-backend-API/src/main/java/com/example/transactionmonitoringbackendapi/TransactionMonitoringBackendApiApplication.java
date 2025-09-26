package com.example.transactionmonitoringbackendapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
@EnableScheduling
public class TransactionMonitoringBackendApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransactionMonitoringBackendApiApplication.class, args);
	}

	@GetMapping("/something")
	public ResponseEntity<String> something() {
//		logger.warn("just checking...");
		return ResponseEntity.ok("something");

	}


}

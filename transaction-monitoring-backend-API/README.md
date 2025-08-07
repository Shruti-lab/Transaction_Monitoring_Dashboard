# Transaction Monitoring Dashboard Backend

This is the backend API for the Transaction Monitoring Dashboard, a system for monitoring credit card transactions, detecting fraud, and visualizing transaction metrics.

## Features

- Simulates credit card transaction logs
- Provides real-time fraud metrics and error rates
- Supports pagination and filtering by region and transaction size
- Exposes REST APIs for frontend consumption
- Integrates with Prometheus for metrics and alerting

## Technology Stack

- **Framework**: Spring Boot 3.5.4
- **Language**: Java 21
- **Database**: PostgreSQL
- **Build Tool**: Maven
- **Monitoring**: Prometheus (via Micrometer)

## Project Structure

The project follows a standard Spring Boot architecture:

- `model`: Entity classes representing database tables
- `repository`: Data access interfaces
- `service`: Business logic and transaction simulation
- `controller`: REST API endpoints

## Getting Started

### Prerequisites

- Java 21
- Maven
- PostgreSQL
- Docker ( for containerization)

### Database Setup

1. Create a PostgreSQL database named `transaction_monitoring`:

```sql
CREATE DATABASE transaction_monitoring;
```

2. The application will automatically create the necessary tables on startup (using Hibernate's `ddl-auto=update`).

### Running the Application

1. Clone the repository
2. Configure database connection in `application.properties` if needed
3. Build the project:

```bash
mvn clean install
```

4. Run the application:

```bash
mvn spring-boot:run
```

The application will start on port 8080.

### Generating Sample Data

To generate sample transaction data, use one of the following endpoints:

- One-time generation: `POST /api/transactions/simulate?count=100`
- Continuous simulation: `POST /api/transactions/simulate/start?transactionsPerMinute=60`
- Stop simulation: `POST /api/transactions/simulate/stop`

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed information about the available endpoints.

## Monitoring with Prometheus

Prometheus metrics are available at `/actuator/prometheus`. The following metrics are exposed:

- `transactions_total`: Total number of transactions processed
- `transactions_fraudulent`: Total number of fraudulent transactions detected
- `transactions_error`: Total number of transactions with errors

## Frontend Integration

The backend is designed to work with a React.js frontend. Key integration points:

1. The API supports CORS to allow requests from the frontend
2. Pagination is implemented for all transaction endpoints
3. Filtering by region and transaction size is supported
4. Real-time metrics are available for dashboard visualization

## Next Steps

1. **Deploy the Application**:
   - Set up a production database
   - Configure environment-specific properties
   - Deploy to a cloud provider or on-premises server

2. **Implement Security**:
   - Add authentication and authorization
   - Secure sensitive endpoints
   - Implement HTTPS

3. **Set Up Monitoring**:
   - Configure Prometheus server
   - Set up alerting rules
   - Add Grafana dashboards for visualization

4. **Develop Frontend**:
   - Create React.js components for transaction display
   - Implement filtering and pagination UI
   - Build dashboard visualizations for metrics

5. **Containerize with Docker**:
   - Create Dockerfile for the application
   - Set up Docker Compose for local development
   - Configure container orchestration for production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
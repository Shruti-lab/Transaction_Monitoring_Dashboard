# Transaction Monitoring Dashboard API Documentation

This document provides details about the REST API endpoints available in the Transaction Monitoring Dashboard backend.

## Base URL

All API endpoints are relative to the base URL: `http://localhost:8080/api`

## Authentication

Currently, the API does not require authentication. This should be implemented in a production environment.

## Common Response Format

For paginated responses, the following format is used:

```json
{
  "transactions": [
    {
      "id": 1,
      "cardNumber": "4123456789012345",
      "amount": 125.50,
      "currency": "USD",
      "timestamp": "2025-08-07T13:45:30",
      "merchantName": "Amazon",
      "country": "USA",
      "region": "East Coast",
      "city": "New York",
      "transactionType": "PURCHASE",
      "isFraudulent": false,
      "isError": false,
      "errorMessage": null
    }
  ],
  "currentPage": 0,
  "totalItems": 150,
  "totalPages": 15
}
```

Note: The actual response will contain multiple transaction objects in the transactions array.

## Transaction Endpoints

### Get All Transactions

Retrieves a paginated list of all transactions.

- **URL**: `/transactions`
- **Method**: `GET`
- **URL Parameters**:
  - `page` (optional): Page number (0-based). Default: 0
  - `size` (optional): Number of items per page. Default: 10
  - `sortBy` (optional): Field to sort by. Default: "timestamp"
  - `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"

- **Success Response**: 200 OK with paginated transactions

### Get Transaction by ID

Retrieves a specific transaction by its ID.

- **URL**: `/transactions/{id}`
- **Method**: `GET`
- **URL Parameters**: None
- **Path Parameters**:
  - `id`: The ID of the transaction to retrieve

- **Success Response**: 200 OK with transaction details
- **Error Response**: 404 Not Found if transaction doesn't exist

### Filter Transactions by Region

Retrieves transactions filtered by region (country, region, city).

- **URL**: `/transactions/filter/region`
- **Method**: `GET`
- **URL Parameters**:
  - `country` (optional): Country name
  - `region` (optional): Region name
  - `city` (optional): City name
  - `page` (optional): Page number (0-based). Default: 0
  - `size` (optional): Number of items per page. Default: 10
  - `sortBy` (optional): Field to sort by. Default: "timestamp"
  - `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"

- **Success Response**: 200 OK with paginated transactions

### Filter Transactions by Amount Range

Retrieves transactions filtered by amount range.

- **URL**: `/transactions/filter/amount`
- **Method**: `GET`
- **URL Parameters**:
  - `minAmount` (optional): Minimum transaction amount. Default: 0
  - `maxAmount` (optional): Maximum transaction amount. Default: 999999999
  - `page` (optional): Page number (0-based). Default: 0
  - `size` (optional): Number of items per page. Default: 10
  - `sortBy` (optional): Field to sort by. Default: "timestamp"
  - `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"

- **Success Response**: 200 OK with paginated transactions

### Filter Transactions by Region and Amount Range

Retrieves transactions filtered by both region and amount range.

- **URL**: `/transactions/filter/combined`
- **Method**: `GET`
- **URL Parameters**:
  - `country` (optional): Country name
  - `region` (optional): Region name
  - `city` (optional): City name
  - `minAmount` (optional): Minimum transaction amount. Default: 0
  - `maxAmount` (optional): Maximum transaction amount. Default: 999999999
  - `page` (optional): Page number (0-based). Default: 0
  - `size` (optional): Number of items per page. Default: 10
  - `sortBy` (optional): Field to sort by. Default: "timestamp"
  - `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"

- **Success Response**: 200 OK with paginated transactions

### Get Fraudulent Transactions

Retrieves transactions marked as fraudulent.

- **URL**: `/transactions/fraudulent`
- **Method**: `GET`
- **URL Parameters**:
  - `page` (optional): Page number (0-based). Default: 0
  - `size` (optional): Number of items per page. Default: 10
  - `sortBy` (optional): Field to sort by. Default: "timestamp"
  - `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"

- **Success Response**: 200 OK with paginated transactions

### Get Error Transactions

Retrieves transactions that encountered errors.

- **URL**: `/transactions/errors`
- **Method**: `GET`
- **URL Parameters**:
  - `page` (optional): Page number (0-based). Default: 0
  - `size` (optional): Number of items per page. Default: 10
  - `sortBy` (optional): Field to sort by. Default: "timestamp"
  - `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"

- **Success Response**: 200 OK with paginated transactions

## Metrics Endpoints

### Get Transaction Metrics

Retrieves metrics for the dashboard, including fraud rates and error rates.

- **URL**: `/transactions/metrics`
- **Method**: `GET`
- **URL Parameters**:
  - `startTime` (optional): Start time for metrics calculation (ISO format). Default: 24 hours ago
  - `endTime` (optional): End time for metrics calculation (ISO format). Default: current time

- **Success Response**: 200 OK with metrics data
- **Example Response**:
```json
{
  "totalTransactions": 1250,
  "fraudulentTransactions": 62,
  "errorTransactions": 37,
  "fraudRate": 4.96,
  "errorRate": 2.96,
  "startTime": "2025-08-06T13:45:30",
  "endTime": "2025-08-07T13:45:30"
}
```

## Simulation Endpoints (For Testing/Demo)

### Simulate Transactions

Generates a specified number of random transactions.

- **URL**: `/transactions/simulate`
- **Method**: `POST`
- **URL Parameters**:
  - `count` (optional): Number of transactions to simulate. Default: 100

- **Success Response**: 200 OK with confirmation message

### Start Continuous Transaction Simulation

Starts continuous transaction simulation at a specified rate.

- **URL**: `/transactions/simulate/start`
- **Method**: `POST`
- **URL Parameters**:
  - `transactionsPerMinute` (optional): Number of transactions to generate per minute. Default: 60

- **Success Response**: 200 OK with confirmation message

### Stop Continuous Transaction Simulation

Stops the continuous transaction simulation.

- **URL**: `/transactions/simulate/stop`
- **Method**: `POST`
- **URL Parameters**: None

- **Success Response**: 200 OK with confirmation message

## Prometheus Metrics

Prometheus metrics are available at:

- **URL**: `/actuator/prometheus`
- **Method**: `GET`

This endpoint provides metrics in Prometheus format, including:
- `transactions_total`: Total number of transactions processed
- `transactions_fraudulent`: Total number of fraudulent transactions detected
- `transactions_error`: Total number of transactions with errors

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200 OK: Request successful
- 400 Bad Request: Invalid parameters
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error

Error responses include a message describing the error.

## Frontend Integration

To integrate with a React.js frontend:

1. Use the base URL `http://localhost:8080/api` for all API requests
2. For paginated data, implement pagination controls using the `currentPage`, `totalItems`, and `totalPages` values
3. Implement filtering UI for region and amount range using the filter endpoints
4. Use the metrics endpoint to display dashboard statistics
5. For real-time updates, poll the relevant endpoints at appropriate intervals

## Example API Usage (JavaScript/Fetch)

```javascript
// Get all transactions (first page)
fetch('http://localhost:8080/api/transactions')
  .then(response => response.json())
  .then(data => console.log(data));

// Filter transactions by country and amount range
fetch('http://localhost:8080/api/transactions/filter/combined?country=USA&minAmount=100&maxAmount=1000')
  .then(response => response.json())
  .then(data => console.log(data));

// Get metrics for dashboard
fetch('http://localhost:8080/api/transactions/metrics')
  .then(response => response.json())
  .then(data => console.log(data));

// Simulate 50 transactions
fetch('http://localhost:8080/api/transactions/simulate?count=50', { method: 'POST' })
  .then(response => response.json())
  .then(data => console.log(data));
```
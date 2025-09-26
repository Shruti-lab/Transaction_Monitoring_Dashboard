// src/services/mockDataService.ts
import type { 
  Transaction, 
  PaginatedResponse, 
  TransactionMetrics, 
  TimeSeriesDataPoint,
  GeoDistributionDataPoint,
  ChartDataPoint
} from '../types/index';

// Generate a random transaction
const generateRandomTransaction = (id: number): Transaction => {
  const cardTypes = ['Visa', 'Mastercard', 'Amex', 'Discover'];
  const cardPrefix = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  const cardNumber = `${cardPrefix} **** **** ${Math.floor(1000 + Math.random() * 9000)}`;
  
  const merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Apple Store', 'Starbucks', 'McDonald\'s', 'Uber', 'Netflix', 'Spotify'];
  const countries = ['USA', 'UK', 'Germany', 'France', 'Canada', 'Japan', 'Australia', 'India', 'Brazil', 'China'];
  const regions = ['East Coast', 'West Coast', 'Midwest', 'South', 'Northwest', 'Central', 'Northeast'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Boston', 'San Francisco', 'Dallas', 'Denver'];
  const transactionTypes = ['PURCHASE', 'REFUND', 'WITHDRAWAL', 'DEPOSIT', 'TRANSFER'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'BRL', 'CNY'];
  
  const isFraudulent = Math.random() < 0.05; // 5% chance of fraud
  const isError = !isFraudulent && Math.random() < 0.03; // 3% chance of error if not fraudulent
  
  const errorMessages = [
    'Insufficient funds',
    'Card expired',
    'Invalid card number',
    'Transaction timeout',
    'Network error',
    'Card blocked',
    'Security verification failed',
    'Processing error'
  ];
  
  return {
    id,
    cardNumber,
    amount: parseFloat((Math.random() * 1000 + 1).toFixed(2)),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    merchantName: merchants[Math.floor(Math.random() * merchants.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    transactionType: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
    isFraudulent,
    isError,
    errorMessage: isError ? errorMessages[Math.floor(Math.random() * errorMessages.length)] : undefined
  };
};

// Mock paginated transactions
export const getMockTransactions = (
  page: number = 0, 
  size: number = 10, 
  filters: any = {}
): PaginatedResponse<Transaction> => {
  const totalItems = 235; // Mock total count
  const totalPages = Math.ceil(totalItems / size);
  
  let transactions: Transaction[] = [];
  
  // Generate transactions for the current page
  for (let i = 0; i < size; i++) {
    const id = page * size + i + 1;
    if (id <= totalItems) {
      transactions.push(generateRandomTransaction(id));
    }
  }
  
  // Apply filters if any
  if (filters.country) {
    transactions = transactions.filter(t => t.country === filters.country);
  }
  
  if (filters.region) {
    transactions = transactions.filter(t => t.region === filters.region);
  }
  
  if (filters.city) {
    transactions = transactions.filter(t => t.city === filters.city);
  }
  
  if (filters.minAmount !== undefined) {
    transactions = transactions.filter(t => t.amount >= filters.minAmount);
  }
  
  if (filters.maxAmount !== undefined) {
    transactions = transactions.filter(t => t.amount <= filters.maxAmount);
  }
  
  return {
    transactions,
    currentPage: page,
    totalItems,
    totalPages
  };
};

// Mock fraudulent transactions
export const getMockFraudulentTransactions = (
  page: number = 0, 
  size: number = 10
): PaginatedResponse<Transaction> => {
  const allTransactions = getMockTransactions(0, 200).transactions;
  const fraudulentTransactions = allTransactions.filter(t => t.isFraudulent);
  
  const totalItems = fraudulentTransactions.length;
  const totalPages = Math.ceil(totalItems / size);
  
  const startIndex = page * size;
  const endIndex = Math.min(startIndex + size, totalItems);
  
  return {
    transactions: fraudulentTransactions.slice(startIndex, endIndex),
    currentPage: page,
    totalItems,
    totalPages
  };
};

// Mock error transactions
export const getMockErrorTransactions = (
  page: number = 0, 
  size: number = 10
): PaginatedResponse<Transaction> => {
  const allTransactions = getMockTransactions(0, 200).transactions;
  const errorTransactions = allTransactions.filter(t => t.isError);
  
  const totalItems = errorTransactions.length;
  const totalPages = Math.ceil(totalItems / size);
  
  const startIndex = page * size;
  const endIndex = Math.min(startIndex + size, totalItems);
  
  return {
    transactions: errorTransactions.slice(startIndex, endIndex),
    currentPage: page,
    totalItems,
    totalPages
  };
};

// Mock transaction metrics
export const getMockTransactionMetrics = (
  timeRange: string = '24h'
): TransactionMetrics => {
  // Calculate mock metrics based on time range
  let totalTransactions: number;
  let fraudulentTransactions: number;
  let errorTransactions: number;
  
  switch(timeRange) {
    case '7d':
      totalTransactions = 3500;
      fraudulentTransactions = 175; // 5%
      errorTransactions = 105; // 3%
      break;
    case '30d':
      totalTransactions = 15000;
      fraudulentTransactions = 750; // 5%
      errorTransactions = 450; // 3%
      break;
    default: // 24h
      totalTransactions = 500;
      fraudulentTransactions = 25; // 5%
      errorTransactions = 15; // 3%
  }
  
  // Calculate end time (now) and start time based on time range
  const endTime = new Date().toISOString();
  let startTime: string;
  
  switch(timeRange) {
    case '7d':
      startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '30d':
      startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    default: // 24h
      startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  }
  
  return {
    totalTransactions,
    fraudulentTransactions,
    errorTransactions,
    fraudRate: (fraudulentTransactions / totalTransactions) * 100,
    errorRate: (errorTransactions / totalTransactions) * 100,
    startTime,
    endTime
  };
};

// Mock time series data for transaction volume chart
export const getMockTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    const total = Math.floor(Math.random() * 100) + 50;
    const fraudulent = Math.floor(total * 0.05); // 5% fraud rate
    const error = Math.floor(total * 0.03); // 3% error rate
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total,
      fraudulent,
      error
    });
  }
  
  return data;
};

// Mock geographic distribution data
export const getMockGeoDistributionData = (
  viewBy: 'country' | 'region' | 'city' = 'country'
): GeoDistributionDataPoint[] => {
  if (viewBy === 'country') {
    return [
      { name: 'USA', transactions: 450, fraudulent: 22 },
      { name: 'UK', transactions: 320, fraudulent: 15 },
      { name: 'Germany', transactions: 280, fraudulent: 12 },
      { name: 'France', transactions: 240, fraudulent: 10 },
      { name: 'Canada', transactions: 190, fraudulent: 8 }
    ];
  } else if (viewBy === 'region') {
    return [
      { name: 'East Coast', transactions: 220, fraudulent: 12 },
      { name: 'West Coast', transactions: 180, fraudulent: 9 },
      { name: 'Midwest', transactions: 150, fraudulent: 7 },
      { name: 'South', transactions: 120, fraudulent: 6 },
      { name: 'Northwest', transactions: 90, fraudulent: 4 }
    ];
  } else {
    return [
      { name: 'New York', transactions: 120, fraudulent: 7 },
      { name: 'Los Angeles', transactions: 100, fraudulent: 5 },
      { name: 'Chicago', transactions: 80, fraudulent: 4 },
      { name: 'Houston', transactions: 70, fraudulent: 3 },
      { name: 'Miami', transactions: 60, fraudulent: 3 }
    ];
  }
};
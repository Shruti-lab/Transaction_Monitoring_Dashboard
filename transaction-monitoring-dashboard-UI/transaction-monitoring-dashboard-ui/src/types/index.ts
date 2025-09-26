// src/types/index.ts
export interface Transaction {
  id: number;
  cardNumber: string;
  amount: number;
  currency: string;
  timestamp: string;
  merchantName: string;
  country: string;
  region: string;
  city: string;
  transactionType: string;
  isFraudulent: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface PaginatedResponse<T> {
  transactions: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface TransactionMetrics {
  totalTransactions: number;
  fraudulentTransactions: number;
  errorTransactions: number;
  fraudRate: number;
  errorRate: number;
  startTime: string;
  endTime: string;
}

export interface FilterParams {
  country?: string;
  region?: string;
  city?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesDataPoint {
  time: string;
  total: number;
  fraudulent: number;
  error: number;
}

export interface GeoDistributionDataPoint {
  name: string;
  transactions: number;
  fraudulent: number;
}
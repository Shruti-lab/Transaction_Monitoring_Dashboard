// src/utils/apiUtils.ts
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import * as mockDataService from '../services/mockDataService';
import type { GeoDistributionDataPoint, PaginatedResponse, TimeSeriesDataPoint, Transaction, TransactionMetrics } from '../types';

// Function to check if the error is due to backend unavailability
const isBackendUnavailable = (error: any): boolean => {
  return (
    error.code === 'ECONNABORTED' || 
    error.code === 'ERR_NETWORK' || 
    (error.response && (error.response.status === 502 || error.response.status === 503 || error.response.status === 504))
  );
};

// Generic API call function with fallback to mock data
export const apiCallWithFallback = async <T>(
  apiCall: () => Promise<T>,
  mockDataFn: () => T
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('Backend API call failed, using mock data instead:', error);
    return mockDataFn();
  }
};

// Specific API functions with fallbacks
export const fetchTransactions = async (
  endpoint: string = '',
  page: number = 0,
  size: number = 10,
  filters: any = {}
) => {
  return apiCallWithFallback(
    async () => {
      const response = await axios.get<PaginatedResponse<Transaction>>(`/api/transactions${endpoint}`, {
        params: { 
          page, 
          size, 
          sortBy: 'timestamp', 
          direction: 'desc',
          ...filters
        },
        timeout: 5000 // 5 second timeout
      });
      return response.data;
    },
    () => {
      // Determine which mock data to return based on endpoint
      if (endpoint === '/fraudulent') {
        return mockDataService.getMockFraudulentTransactions(page, size);
      } else if (endpoint === '/errors') {
        return mockDataService.getMockErrorTransactions(page, size);
      } else {
        return mockDataService.getMockTransactions(page, size, filters);
      }
    }
  );
};

export const fetchTransactionMetrics = async (timeRange: string = '24h') => {
  // Calculate start and end times based on timeRange
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
  
  return apiCallWithFallback(
    async () => {
      const response = await axios.get<TransactionMetrics>('/api/transactions/metrics', {
        params: { startTime, endTime },
        timeout: 5000
      });
      return response.data;
    },
    () => mockDataService.getMockTransactionMetrics(timeRange)
  );
};

export const fetchVolumeData = async () => {
  return apiCallWithFallback(
    async () => {
      const response = await axios.get<TimeSeriesDataPoint[]>('/api/transactions/volume', {
        timeout: 5000
      });
      return response.data;
    },
    () => mockDataService.getMockTimeSeriesData()
  );
};

export const fetchGeoDistributionData = async (viewBy: 'country' | 'region' | 'city' = 'country') => {
  return apiCallWithFallback(
    async () => {
      const response = await axios.get<GeoDistributionDataPoint[]>(`/api/transactions/geo-distribution`, {
        params: { viewBy },
        timeout: 5000
      });
      return response.data;
    },
    () => mockDataService.getMockGeoDistributionData(viewBy)
  );
};

export const simulateTransactions = async (count: number = 100) => {
  try {
    const response = await axios.post('/api/transactions/simulate', null, {
      params: { count },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, simulation not possible:', error);
    return { message: 'Simulation not available - backend is offline' };
  }
};
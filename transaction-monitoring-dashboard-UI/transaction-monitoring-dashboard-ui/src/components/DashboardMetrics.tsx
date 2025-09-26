// src/components/DashboardMetrics.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import type { TransactionMetrics, ChartDataPoint } from '../types';
import { fetchTransactionMetrics } from '../utils/apiUtils';



type TimeRange = '24h' | '7d' | '30d';

const DashboardMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<TransactionMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  
useEffect(() => {
    fetchMetricsData();
  }, [timeRange]);
  
  const fetchMetricsData = async (): Promise<void> => {
    setLoading(true);
    try {
      const metricsData = await fetchTransactionMetrics(timeRange);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  if (loading || !metrics) {
    return <div className="loading-spinner">Loading metrics...</div>;
  }
  
  // Prepare data for pie chart
  const statusData: ChartDataPoint[] = [
    { name: 'Successful', value: metrics.totalTransactions - metrics.fraudulentTransactions - metrics.errorTransactions },
    { name: 'Fraudulent', value: metrics.fraudulentTransactions },
    { name: 'Error', value: metrics.errorTransactions }
  ];


  
  const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];
  
  return (
    <div className="dashboard-metrics">
      <div className="metrics-header">
        <h2>Transaction Metrics</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === '24h' ? 'active' : ''} 
            onClick={() => setTimeRange('24h')}
          >
            Last 24 Hours
          </button>
          <button 
            className={timeRange === '7d' ? 'active' : ''} 
            onClick={() => setTimeRange('7d')}
          >
            Last 7 Days
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''} 
            onClick={() => setTimeRange('30d')}
          >
            Last 30 Days
          </button>
        </div>
      </div>
      
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Transactions</h3>
          <p className="metric-value">{metrics.totalTransactions}</p>
        </div>
        <div className="metric-card fraud">
          <h3>Fraud Rate</h3>
          <p className="metric-value">{metrics.fraudRate.toFixed(2)}%</p>
        </div>
        <div className="metric-card error">
          <h3>Error Rate</h3>
          <p className="metric-value">{metrics.errorRate.toFixed(2)}%</p>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Transaction Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
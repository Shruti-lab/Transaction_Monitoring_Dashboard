// src/components/TransactionVolumeChart.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import type { TimeSeriesDataPoint } from '../types';
import { fetchVolumeData } from '../utils/apiUtils';

const TransactionVolumeChart: React.FC = () => {
  const [volumeData, setVolumeData] = useState<TimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
 useEffect(() => {
    fetchVolumeDataFromApi();
  }, []);
  
  const fetchVolumeDataFromApi = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchVolumeData();
      setVolumeData(data);
    } catch (error) {
      console.error('Error fetching volume data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockVolumeData = (): TimeSeriesDataPoint[] => {
    // Generate 24 hours of mock data
    const data: TimeSeriesDataPoint[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        total: Math.floor(Math.random() * 100) + 50,
        fraudulent: Math.floor(Math.random() * 10),
        error: Math.floor(Math.random() * 15)
      });
    }
    
    return data;
  };
  
  if (loading || volumeData.length === 0) {
    return <div className="loading-spinner">Loading chart data...</div>;
  }
  
  return (
    <div className="chart-container">
      <h3>Transaction Volume (24 Hours)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={volumeData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Total Transactions"
          />
          <Line 
            type="monotone" 
            dataKey="fraudulent" 
            stroke="#ff7300" 
            name="Fraudulent"
          />
          <Line 
            type="monotone" 
            dataKey="error" 
            stroke="#ff0000" 
            name="Errors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionVolumeChart;
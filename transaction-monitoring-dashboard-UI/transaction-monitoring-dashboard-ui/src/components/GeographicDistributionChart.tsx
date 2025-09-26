// src/components/GeographicDistributionChart.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import type { GeoDistributionDataPoint } from '../types';
import { fetchGeoDistributionData } from '../utils/apiUtils';

type ViewByType = 'country' | 'region' | 'city';

const GeographicDistributionChart: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoDistributionDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewBy, setViewBy] = useState<ViewByType>('country');
  
  useEffect(() => {
    fetchGeoData();
  }, [viewBy]);
  
  const fetchGeoData = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchGeoDistributionData(viewBy);
      setGeoData(data);
    } catch (error) {
      console.error('Error fetching geographic data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockGeoData = (): GeoDistributionDataPoint[] => {
    // Generate mock geographic data based on viewBy
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
  
  if (loading || geoData.length === 0) {
    return <div className="loading-spinner">Loading geographic data...</div>;
  }
  
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Geographic Distribution</h3>
        <div className="view-selector">
          <button 
            className={viewBy === 'country' ? 'active' : ''} 
            onClick={() => setViewBy('country')}
          >
            By Country
          </button>
          <button 
            className={viewBy === 'region' ? 'active' : ''} 
            onClick={() => setViewBy('region')}
          >
            By Region
          </button>
          <button 
            className={viewBy === 'city' ? 'active' : ''} 
            onClick={() => setViewBy('city')}
          >
            By City
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={geoData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="transactions" fill="#8884d8" name="Total Transactions" />
          <Bar dataKey="fraudulent" fill="#ff7300" name="Fraudulent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeographicDistributionChart;
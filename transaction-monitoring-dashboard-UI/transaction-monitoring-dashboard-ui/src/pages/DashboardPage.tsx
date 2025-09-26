// src/pages/DashboardPage.tsx
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardMetrics from '../components/DashboardMetrics';
import TransactionVolumeChart from '../components/TransactionVolumeChart';
import GeographicDistributionChart from '../components/GeographicDistributionChart';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <DashboardMetrics />
      <div className="charts-grid">
        <TransactionVolumeChart />
        <GeographicDistributionChart />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
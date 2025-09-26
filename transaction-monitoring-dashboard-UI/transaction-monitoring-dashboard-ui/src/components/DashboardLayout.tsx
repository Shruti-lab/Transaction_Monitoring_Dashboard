// src/components/DashboardLayout.tsx
import React, { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
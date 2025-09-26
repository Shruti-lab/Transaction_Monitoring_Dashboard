// src/components/Header.tsx
import React from 'react';
import axios from 'axios';
import avatarImg from '../assets/avatar.png'; 

const Header: React.FC = () => {
  const handleSimulateTransactions = async (): Promise<void> => {
    try {
      await axios.post('/api/transactions/simulate', null, {
        params: { count: 100 }
      });
      alert('Successfully simulated 100 transactions');
    } catch (error) {
      console.error('Error simulating transactions:', error);
      alert('Failed to simulate transactions');
    }
  };

  return (
    <header className="dashboard-header">
      <h1>Transaction Monitoring Dashboard</h1>
      <div className="header-actions">
        <button 
          className="btn-simulate" 
          onClick={handleSimulateTransactions}
        >
          Simulate Transactions
        </button>
        <div className="user-profile">
          <span>Admin User</span>
          <img src={avatarImg} alt="User" style={{ height: '40px', width: '40px' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
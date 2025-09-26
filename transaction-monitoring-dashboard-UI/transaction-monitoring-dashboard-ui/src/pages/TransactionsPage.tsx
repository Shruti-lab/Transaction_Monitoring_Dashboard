// src/pages/TransactionsPage.tsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFilters';
import type { FilterParams } from '../types';

interface TransactionsPageProps {
  endpoint?: string;
  title?: string;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ 
  endpoint: initialEndpoint = '', 
  title = 'All Transactions' 
}) => {
  const [filters, setFilters] = useState<FilterParams>({});
  const [endpoint, setEndpoint] = useState<string>(initialEndpoint);
  
  const handleApplyFilters = (newFilters: FilterParams): void => {
    setFilters(newFilters);
    
    // Only modify the endpoint if we're on the main transactions page
    // Don't override the endpoint if it was provided as a prop (for fraudulent/errors pages)
    if (initialEndpoint === '') {
      // Construct the appropriate endpoint based on filters
      if (newFilters.country || newFilters.region || newFilters.city) {
        if (newFilters.minAmount !== undefined || newFilters.maxAmount !== undefined) {
          setEndpoint('/filter/combined');
        } else {
          setEndpoint('/filter/region');
        }
      } else if (newFilters.minAmount !== undefined || newFilters.maxAmount !== undefined) {
        setEndpoint('/filter/amount');
      } else {
        setEndpoint('');
      }
    }
  };
  
  return (
    <DashboardLayout>
      <h1>{title}</h1>
      <TransactionFilters onApplyFilters={handleApplyFilters} />
      <TransactionTable 
        endpoint={endpoint} 
        title={title} 
        filters={filters}
      />
    </DashboardLayout>
  );
};

export default TransactionsPage;
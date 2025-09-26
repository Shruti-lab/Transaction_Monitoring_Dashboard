// src/components/TransactionFilters.tsx
import React, { useState } from 'react';
import type { FilterParams } from '../types';

interface TransactionFiltersProps {
  onApplyFilters: (filters: FilterParams) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onApplyFilters }) => {
  const [country, setCountry] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  
  const handleApplyFilters = (): void => {
    onApplyFilters({
      country: country || undefined,
      region: region || undefined,
      city: city || undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined
    });
  };
  
  const handleReset = (): void => {
    setCountry('');
    setRegion('');
    setCity('');
    setMinAmount('');
    setMaxAmount('');
    onApplyFilters({});
  };
  
  return (
    <div className="filters-container">
      <h3>Filter Transactions</h3>
      <div className="filters-form">
        <div className="filter-group">
          <label>Country</label>
          <input 
            type="text" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            placeholder="Country"
          />
        </div>
        <div className="filter-group">
          <label>Region</label>
          <input 
            type="text" 
            value={region} 
            onChange={(e) => setRegion(e.target.value)} 
            placeholder="Region"
          />
        </div>
        <div className="filter-group">
          <label>City</label>
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="City"
          />
        </div>
        <div className="filter-group">
          <label>Min Amount</label>
          <input 
            type="number" 
            value={minAmount} 
            onChange={(e) => setMinAmount(e.target.value)} 
            placeholder="Min Amount"
          />
        </div>
        <div className="filter-group">
          <label>Max Amount</label>
          <input 
            type="number" 
            value={maxAmount} 
            onChange={(e) => setMaxAmount(e.target.value)} 
            placeholder="Max Amount"
          />
        </div>
        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn-apply">Apply Filters</button>
          <button onClick={handleReset} className="btn-reset">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
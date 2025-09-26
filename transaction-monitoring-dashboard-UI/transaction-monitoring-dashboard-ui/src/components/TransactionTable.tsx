// src/components/TransactionTable.tsx
import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import type { Transaction, FilterParams } from '../types';
import { fetchTransactions } from '../utils/apiUtils';

interface TransactionTableProps {
  endpoint?: string;
  title?: string;
  filters?: FilterParams;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  endpoint = '', 
  title = 'Transactions',
  filters = {}
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  useEffect(() => {
    fetchTransactionData();
  }, [endpoint, page, size, filters]);
  
  const fetchTransactionData = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetchTransactions(endpoint, page, size, filters);
      setTransactions(response.transactions);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="transaction-table-container">
      <h2>{title}</h2>
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Card Number</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Merchant</th>
                <th>Location</th>
                <th>Type</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className={
                  transaction.isFraudulent ? 'fraudulent' : 
                  transaction.isError ? 'error' : ''
                }>
                  <td>{transaction.id}</td>
                  <td>{transaction.cardNumber.replace(/\d(?=\d{4})/g, "*")}</td>
                  <td>{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.merchantName}</td>
                  <td>{`${transaction.city}, ${transaction.country}`}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                  <td>
                    {transaction.isFraudulent ? 'Fraudulent' : 
                     transaction.isError ? 'Error' : 'Success'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            itemsPerPage={size}
            onItemsPerPageChange={setSize}
          />
        </>
      )}
    </div>
  );
};

export default TransactionTable;
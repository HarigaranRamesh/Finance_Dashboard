import React, { createContext, useState, useEffect } from 'react';
import { MockAPI } from '../api/mockApi';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState({ locale: 'en-US', code: 'USD', symbol: '$' });
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await MockAPI.getTransactions();
        setTransactions(data);
        
        // Dynamic Categories
        const savedCategories = localStorage.getItem('finance_categories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          const defaultCats = ['Food', 'Utilities', 'Entertainment', 'Shopping', 'Transport', 'Rent', 'Salary', 'Freelance', 'Other'];
          const derivedCats = [...new Set([...data.map(t => t.category), ...defaultCats])];
          setCategories(derivedCats);
        }

        // Dynamic Settings
        const savedCurrency = localStorage.getItem('finance_currency');
        if (savedCurrency) {
          setCurrency(JSON.parse(savedCurrency));
        }
      } catch (error) {
        console.error("Error fetching mock data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      MockAPI.saveTransactions(transactions);
      localStorage.setItem('finance_categories', JSON.stringify(categories));
      localStorage.setItem('finance_currency', JSON.stringify(currency));
    }
  }, [transactions, categories, currency, isLoading]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const addTransaction = (t) => {
    setTransactions(prev => [{ ...t, id: Date.now().toString() }, ...prev]);
    if (t.category && !categories.includes(t.category)) {
      setCategories(prev => [...prev, t.category]);
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleRole = () => setRole(prev => (prev === 'admin' ? 'viewer' : 'admin'));
  const updateCurrency = (c) => setCurrency(c);

  return (
    <FinanceContext.Provider value={{
      transactions,
      categories,
      currency,
      isLoading,
      role,
      isDarkMode,
      addTransaction,
      deleteTransaction,
      toggleDarkMode,
      toggleRole,
      updateCurrency
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

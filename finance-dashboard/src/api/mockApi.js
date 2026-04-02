import { initialTransactions } from '../data/mockData';

// Delay helper to emulate network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAPI = {
  getTransactions: async () => {
    await delay(800); // simulate 800ms loading
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  },
  
  saveTransactions: async (transactions) => {
    await delay(300); // simulate 300ms network latency
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    return { success: true };
  }
};

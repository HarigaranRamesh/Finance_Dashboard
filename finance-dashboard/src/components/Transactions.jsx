import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Plus, Search, Trash2, Download } from 'lucide-react';
import { downloadCSV, downloadJSON } from '../utils/exportUtils';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import './Transactions.css';
const Transactions = () => {
  const { transactions, categories, currency, role, addTransaction, deleteTransaction } = useContext(FinanceContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: categories.length > 0 ? categories[0] : 'Other',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });

    return result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortBy === 'amount-asc') return parseFloat(a.amount) - parseFloat(b.amount);
      return 0;
    });
  }, [transactions, searchTerm, filterType, sortBy]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    setFormData({
      description: '',
      amount: '',
      category: categories.length > 0 ? categories[0] : 'Other',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  const handleExport = (format) => {
    if (format === 'csv') downloadCSV(filteredTransactions);
    else downloadJSON(filteredTransactions);
  };

  const formatCurrency = (val) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(val).replace(currency.code, currency.symbol);
  const formatDate = (dateStr) => new Intl.DateTimeFormat(currency.locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));

  return (
    <div className="transactions-container fade-in">
      <div className="filters-bar">
        <div className="filter-group">
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ flex: '1 1 120px' }}>
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: '1 1 140px' }}>
            <option value="date-desc">Newest to Oldest</option>
            <option value="date-asc">Oldest to Newest</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <select 
              className="btn btn-secondary border-select" 
              onChange={(e) => {
                if(e.target.value) { handleExport(e.target.value); e.target.value = ''; }
              }}
              style={{ appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }}
            >
              <option value="">Export Data...</option>
              <option value="csv">Download CSV</option>
              <option value="json">Download JSON</option>
            </select>
            <Download size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
          </div>

          {role === 'admin' && (
            <button className="btn btn-primary hover-lift" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                {role === 'admin' && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td style={{ fontWeight: 500 }}>{t.description}</td>
                  <td>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '0.35rem 0.6rem', borderRadius: '6px', fontWeight: '500' }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(t.amount)}</td>
                  <td>
                    <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="icon-btn" 
                        style={{ border: 'none', background: 'transparent', display: 'inline-flex', padding: '0.25rem' }}
                        onClick={() => deleteTransaction(t.id)}
                        title="Delete Transaction"
                      >
                        <Trash2 size={18} color="var(--danger)" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message="No transactions found matching your criteria." />
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Transaction"
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              required 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="E.g. Monthly Rent"
            />
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              required 
              min="0.01" 
              step="0.01"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              required 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="form-group grid-2">
            <div>
              <label>Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label>Category</label>
              <input 
                list="categoryOptions"
                required
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="E.g. Food"
              />
              <datalist id="categoryOptions">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Transaction</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;

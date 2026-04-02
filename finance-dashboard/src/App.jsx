import { useState, useContext } from 'react';
import { FinanceContext } from './context/FinanceContext';
import { LayoutDashboard, Receipt, LineChart, Moon, Sun, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isLoading, role, isDarkMode, toggleDarkMode, toggleRole } = useContext(FinanceContext);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loader-container fade-in">
          <div className="spinner"></div>
          <p>Syncing transactions...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="icon-btn" style={{ background: 'var(--accent-base)', color: 'white', border: 'none' }}>
            <LineChart size={24} />
          </div>
          FinDash
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <Receipt size={20} /> Transactions
          </button>
          <button 
            className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <LineChart size={20} /> Insights
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-title" style={{ textTransform: 'capitalize' }}>
            {activeTab}
          </div>
          <div className="header-right">
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textTransform: 'capitalize' }} 
              onClick={toggleRole}
              title={`Click to switch. Current: ${role}`}
            >
              Role: {role}
            </button>
            <button className="icon-btn" onClick={toggleDarkMode} title="Toggle Dark Mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="content-wrapper fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <button 
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <Receipt size={20} />
          <span>Transactions</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <LineChart size={20} />
          <span>Insights</span>
        </button>
      </nav>
    </div>
  );
}

export default App;

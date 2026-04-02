import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from './ui/StatCard';
import './Dashboard.css';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard = () => {
  const { transactions, currency } = useContext(FinanceContext);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      if (t.type === 'income') income += amount;
      else expenses += amount;
    });

    return {
      balance: income - expenses,
      income,
      expenses
    };
  }, [transactions]);

  const timeData = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      if (!grouped[t.date]) {
        grouped[t.date] = { date: t.date, income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        grouped[t.date].income += parseFloat(t.amount);
      } else {
        grouped[t.date].expenses += parseFloat(t.amount);
      }
    });

    let currentBalance = 0;
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date)).map(day => {
      currentBalance += day.income - day.expenses;
      return { ...day, balance: currentBalance };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = {};
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + parseFloat(t.amount);
    });
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const formatCurrency = (val) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(val).replace(currency.code, currency.symbol);

  return (
    <div className="dashboard-grid fade-in">
      <div className="summary-cards">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.balance)}
          icon={<Wallet size={18} />}
          iconBg="var(--accent-light)"
          iconColor="var(--accent-base)"
          trendIcon={stats.balance >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          trendText={`Overall look is ${stats.balance >= 0 ? 'positive' : 'negative'}`}
          trendColor={stats.balance >= 0 ? 'var(--success)' : 'var(--danger)'}
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.income)}
          icon={<DollarSign size={18} />}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="var(--success)"
          trendText="Across all time"
          trendColor="var(--text-secondary)"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.expenses)}
          icon={<CreditCard size={18} />}
          iconBg="rgba(239, 68, 68, 0.1)"
          iconColor="var(--danger)"
          trendText="Across all time"
          trendColor="var(--text-secondary)"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card hover-lift">
          <h3 className="chart-header">Balance Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={timeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value) => formatCurrency(value)}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--accent-base)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-secondary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card hover-lift">
          <h3 className="chart-header">Expenses by Category</h3>
          <div style={{ width: '100%', height: 300 }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No expenses recorded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

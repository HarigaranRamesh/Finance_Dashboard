import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { TrendingUp, AlertCircle, Award } from 'lucide-react';
import InsightCard from './ui/InsightCard';
import EmptyState from './ui/EmptyState';
import './Insights.css';

const Insights = () => {
  const { transactions, currency } = useContext(FinanceContext);

  const formatCurrency = (val) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(val).replace(currency.code, currency.symbol);

  const insightsData = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Highest category
    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
    });
    
    let highestCategory = { name: 'None', amount: 0 };
    Object.entries(categoryTotals).forEach(([name, amount]) => {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    });

    // Biggest single transaction
    let biggestExpense = { amount: 0 };
    expenses.forEach(t => {
      if (parseFloat(t.amount) > biggestExpense.amount) {
        biggestExpense = { ...t, amount: parseFloat(t.amount) };
      }
    });

    // Savings rate
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const totalExpenses = expenses.reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      highestCategory,
      biggestExpense,
      totalIncome,
      totalExpenses,
      savingsRate
    };
  }, [transactions]);

  if (!insightsData) {
    return <EmptyState message="Not enough data to generate insights." />;
  }

  return (
    <div className="insights-container fade-in">
      <div className="insights-grid">
        <InsightCard
          title="Top Spending Category"
          icon={<Award size={20} />}
          iconColor="var(--accent-base)"
          value={insightsData.highestCategory.name}
          description={
            <>You've spent <strong>{formatCurrency(insightsData.highestCategory.amount)}</strong> in this category, making it your biggest expense area.</>
          }
        />

        <InsightCard
          title="Largest Single Expense"
          icon={<AlertCircle size={20} />}
          iconColor="var(--warning)"
          value={insightsData.biggestExpense.description || 'None'}
          description={
            <>At <strong>{formatCurrency(insightsData.biggestExpense.amount)}</strong>, this was your single largest transaction limit.</>
          }
        />

        <InsightCard
          title="Savings Rate"
          icon={<TrendingUp size={20} />}
          iconColor="var(--success)"
          value={`${insightsData.savingsRate.toFixed(1)}%`}
          valueColor={insightsData.savingsRate >= 0 ? 'var(--success)' : 'var(--danger)'}
          description={
            insightsData.savingsRate > 20 
              ? "Great job! You are saving over 20% of your income. Keep up the good work." 
              : insightsData.savingsRate > 0 
                ? "You're saving a portion of your income, but you could try to reduce expenses in your top categories to save more."
                : "You're currently spending more than you earn. Take a closer look at your expenses to start saving."
          }
        />
      </div>
    </div>
  );
};

export default Insights;

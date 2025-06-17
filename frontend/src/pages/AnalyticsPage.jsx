import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#00C49F', '#FF4D4F', '#FFBB28', '#FF8042', '#AF19FF', '#DE3163'];

function AnalyticsPage() {
  const [summaryData, setSummaryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Budgetly - Analytics';
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [transactionsRes, budgetsRes] = await Promise.all([
        axios.get('/transactions'),
        axios.get('/budgets')
      ]);

      const txs = transactionsRes.data;
      const budgets = budgetsRes.data;

      const income = txs.filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expenses = txs.filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      setSummaryData([
        { name: 'Income', value: income },
        { name: 'Expenses', value: expenses },
      ]);

      const categoryTotals = {};
      txs.forEach((tx) => {
        if (tx.type === 'expense') {
          const cat = tx.category || 'Uncategorized';
          categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
        }
      });
      setCategoryData(Object.entries(categoryTotals).map(
        ([category, total]) => ({ category, total })
      ));

      const formattedBudgets = budgets.map(budget => ({
        name: budget.category,
        allocated: budget.amount,
        spent: budget.spent,
        percentageUsed: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
      }));
      setBudgetData(formattedBudgets);

      setError(null);
    } catch (err) {
      console.error('Analytics fetch failed:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasSummaryData = summaryData.some(d => d.value > 0);
  const hasCategoryData = categoryData.length > 0 && categoryData.some(d => d.total > 0);
  const hasBudgetData = budgetData.length > 0;

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Analytics Dashboard</h1>

      {loading && <p className="text-center text-blue-500">Loading analytics data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md animate-fadeInUp delay-100">
            <h2 className="text-xl font-semibold mb-4 text-center">Income vs Expenses</h2>
            {hasSummaryData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summaryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {summaryData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatZAR(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No income or expense data to display.</p>
            )}
          </div>

          {/* Category Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md animate-fadeInUp delay-200">
            <h2 className="text-xl font-semibold mb-4 text-center">Expenses by Category</h2>
            {hasCategoryData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatZAR(value)} />
                  <Bar
                    dataKey="total"
                    fill="#FF4D4F"
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No expense category data to display.</p>
            )}
          </div>

          {/* Budget Comparison Bar Chart */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md animate-fadeInUp delay-300">
            <h2 className="text-xl font-semibold mb-4 text-center">Budget Progress</h2>
            {hasBudgetData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={budgetData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [formatZAR(value), name === 'allocated' ? 'Allocated Budget' : 'Spent']} />
                  <Legend />
                  <Bar
                    dataKey="allocated"
                    fill="#3B82F6"
                    name="Allocated Budget"
                    isAnimationActive={true}
                    animationBegin={200}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  <Bar
                    dataKey="spent"
                    fill="#00C49F"
                    name="Spent"
                    isAnimationActive={true}
                    animationBegin={400}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No budget goals set. Add some budgets to see your progress!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;

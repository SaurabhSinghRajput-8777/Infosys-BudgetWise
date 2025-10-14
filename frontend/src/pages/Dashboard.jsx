import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { FaMoneyBillWave, FaChartLine, FaPiggyBank, FaCreditCard, FaCalendarCheck } from 'react-icons/fa';
import './Dashboard.css';
import TransactionList from './TransactionList.jsx';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

const Dashboard = ({ onLogout }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [budget, setBudget] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            onLogout();
            return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            const budgetRes = await axios.get('http://localhost:8080/api/budgets', config);
            setBudget(budgetRes.data);

            const transactionsRes = await axios.get('http://localhost:8080/api/transactions', config);
            // Sort transactions by date in descending order (most recent first)
            const sortedTransactions = transactionsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sortedTransactions);
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Session expired. Please log in again.');
                onLogout();
            } else {
                setError('Failed to load dashboard data. Please set your budget first.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [onLogout]);

    const calculateTotals = () => {
        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const transactionIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalIncome = (parseFloat(budget?.monthlyIncome) || 0) + transactionIncome;

        const expensesByCategory = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
                return acc;
            }, {});
            
        return { totalExpenses, totalIncome, transactionIncome, expensesByCategory };
    };

    const { totalExpenses, totalIncome, expensesByCategory } = calculateTotals();
    const netSavings = totalIncome - totalExpenses;
    
    const expenseData = [
        ['Category', 'Amount'],
        ...Object.entries(expensesByCategory).map(([category, amount]) => [category, amount])
    ];

    const pieOptions = {
        title: 'Expense Breakdown',
        pieHole: 0.4,
        backgroundColor: 'transparent',
        titleTextStyle: { color: '#F8F9FA', fontSize: 18 },
        legend: { textStyle: { color: '#A0AEC0' } },
        colors: ['#FFD700', '#4caf50', '#e53e3e', '#3182ce', '#ff9800'],
    };

    const monthlyTrendData = [
        ['Month', 'Income', 'Expenses'],
        ['Oct', 2000, 1500],
        ['Nov', 2100, 1600],
        ['Dec', 2200, 1750],
        ['Jan', 2300, 1800],
        ['Feb', 2400, 1950],
        ['Mar', totalIncome, totalExpenses]
    ];

    const trendOptions = {
        title: 'Demo Income vs. Expenses (Last 6 Months)',
        hAxis: { title: 'Month', textStyle: { color: '#A0AEC0' } },
        vAxis: { title: 'Amount ($)', textStyle: { color: '#A0AEC0' } },
        legend: { textStyle: { color: '#A0AEC0' } },
        seriesType: 'bars',
        series: { 1: { type: 'line' } },
        backgroundColor: 'transparent',
        titleTextStyle: { color: '#F8F9FA', fontSize: 18 },
        colors: ['#4caf50', '#e53e3e'],
    };

    if (loading) return <div className="page-container">Loading dashboard...</div>;
    if (error) return <div className="page-container" style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div className="dashboard-page-container">
            {/* Hero Strip */}
<div className="dashboard-section hero-panel">
    <div className="hero-text-content">
        <h2 className="dashboard-welcome-message">
            👋 {getGreeting()}, {user?.name}!
        </h2>
        <p className="hero-tip">
            💡 You're on track to hit <strong>80%</strong> of your savings goal
        </p>
    </div>
    <div className="hero-chart-container">
        <Chart
            chartType="LineChart"
            data={[
                ['Month', 'Expenses'],
                ['Oct', 1500],
                ['Nov', 1600],
                ['Dec', 1750],
                ['Jan', 1800],
                ['Feb', 1950],
                ['Mar', totalExpenses]
            ]}
            options={{
                backgroundColor: 'transparent',
                legend: 'none',
                curveType: 'function',
                hAxis: { textPosition: 'none', gridlines: { color: 'transparent' } },
                vAxis: { textPosition: 'none', gridlines: { color: 'transparent' } },
                colors: ['#e53e3e'],
                chartArea: { width: '100%', height: '80%' },
            }}
            width="100%"
            height="100%"
        />
    </div>
</div>



            {/* Balance Overview */}
            <div className="dashboard-section balance-overview-cards">
                <div className="summary-card">
                    <div className="card-icon"><FaMoneyBillWave /></div>
                    <div className="card-label">Total Balance</div>
                    <div className="card-value net-savings">₹ {netSavings.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="card-icon"><FaChartLine /></div>
                    <div className="card-label">Total Income</div>
                    <div className="card-value income">₹ {totalIncome.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="card-icon"><FaCreditCard /></div>
                    <div className="card-label">Total Expenses</div>
                    <div className="card-value expenses">₹ {totalExpenses.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="card-icon"><FaPiggyBank /></div>
                    <div className="card-label">Savings Progress</div>
                    <div className="progress-container">
                        <div className="progress-text">
                            ₹ {netSavings.toFixed(2)} / ₹ {budget?.savingGoal?.toFixed(2) || 'N/A'}
                        </div>
                        <div className="progress-bar-wrapper">
                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: `${Math.min((netSavings / (parseFloat(budget?.savingGoal) || 1)) * 100, 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense Insights */}
            <div className="dashboard-section expense-insights">
                <h3 className="section-title">Expense Insights</h3>
                <div className="chart-and-tips">
                    <div className="chart-container">
                        <Chart
                            chartType="PieChart"
                            data={expenseData}
                            options={pieOptions}
                            width="100%"
                            height="320px"
                        />
                    </div>
                    <div className="ai-tips-container">
                        <p className="ai-tip-statement">
                            Dining out is 25% of your budget, higher than average.
                        </p>
                        <p className="ai-tip-statement">
                            You've spent 75% of your budgeted amount for Bills this month.
                        </p>
                        <p className="ai-tip-statement">
                            You could save ₹3,000/month if you reduce shopping spend by 10%.
                        </p>
                    </div>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="dashboard-section monthly-trend-graph">
                <h3 className="section-title">Monthly Trend</h3>
                <Chart
                    chartType="ComboChart"
                    data={monthlyTrendData}
                    options={trendOptions}
                    width="100%"
                    height="400px"
                />
            </div>

            {/* Recent Transactions */}
<div className="dashboard-section recent-transactions">
    <h3 className="section-title">Recent Transactions</h3>
    <div className="transaction-list">
        {transactions.slice(0, 5).map(t => (
            <div className="transaction-card" key={t.id}>
                <div className="transaction-left">
                    <div className="transaction-icon">
                        {t.type === 'EXPENSE' ? <FaCreditCard /> : <FaMoneyBillWave />}
                    </div>
                    <div className="transaction-info-row">
                        <div className="transaction-category">{t.category || 'General'}</div>
                        <div className="transaction-description">{t.description || 'No Description'}</div>
                        <div className="transaction-date">{new Date(t.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="transaction-right">
                    <div className={`transaction-amount ${t.type.toLowerCase()}`}>
                        {t.type === 'EXPENSE' ? '-' : '+'} ₹ {parseFloat(t.amount).toFixed(2)}
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>


            {/* Upcoming Bills */}
            <div className="dashboard-section upcoming-bills">
                <h3 className="section-title">Upcoming Bills & Reminders</h3>
                <ul className="reminders-list">
                    <li><FaCalendarCheck /> Rent due in 5 days (₹ 800)</li>
                    <li><FaCalendarCheck /> Credit card payment due (Oct 25)</li>
                    <li><FaCalendarCheck /> EMI schedule (Oct 30)</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
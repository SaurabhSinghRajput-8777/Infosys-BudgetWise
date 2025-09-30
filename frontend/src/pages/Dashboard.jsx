import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import './Dashboard.css'; // Add a new CSS file for dashboard styles

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 18) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
};

const Dashboard = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [budget, setBudget] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                const budgetRes = await axios.get('http://localhost:8080/api/budgets', config);
                setBudget(budgetRes.data);

                const transactionsRes = await axios.get('http://localhost:8080/api/transactions', config);
                setTransactions(transactionsRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please set your budget first.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateTotals = () => {
        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expensesByCategory = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
                return acc;
            }, {});
            
        return { totalExpenses, totalIncome, expensesByCategory };
    };

    const { totalExpenses, totalIncome, expensesByCategory } = calculateTotals();
    const netSavings = totalIncome - totalExpenses;
    const expenseData = [
        ['Category', 'Amount'],
        ...Object.entries(expensesByCategory).map(([category, amount]) => [category, amount])
    ];

    const pieChartData = [
        ['Type', 'Amount'],
        ['Income', totalIncome],
        ['Expenses', totalExpenses],
    ];

    const pieOptions = {
        title: 'Financial Overview',
        pieHole: 0.4,
        is3D: false,
        backgroundColor: { fill: 'transparent' },
        titleTextStyle: { color: '#F8F9FA', fontSize: 20 },
        legend: { textStyle: { color: '#A0AEC0' } },
        colors: ['#FFD700', '#4A5568'],
    };

    const barOptions = {
        title: 'Spending by Category',
        backgroundColor: { fill: 'transparent' },
        titleTextStyle: { color: '#F8F9FA', fontSize: 20 },
        legend: { position: 'none' },
        hAxis: {
            title: 'Category',
            titleTextStyle: { color: '#A0AEC0' },
            textStyle: { color: '#A0AEC0' },
        },
        vAxis: {
            title: 'Amount ($)',
            titleTextStyle: { color: '#A0AEC0' },
            textStyle: { color: '#A0AEC0' },
        },
    };

    const expenseProgress = budget?.targetExpenses ? Math.min((totalExpenses / budget.targetExpenses) * 100, 100) : 0;
    const savingProgress = budget?.savingGoal ? Math.min((netSavings / budget.savingGoal) * 100, 100) : 0;
    
    if (loading) {
        return <div className="page-container">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="page-container" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="dashboard-page-container">
            <h2 className="dashboard-welcome-message">{getGreeting()}, {user?.name}!</h2>
            
            <div className="dashboard-content-card">
                <h3 className="card-title">Monthly Summary</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span>Total Income:</span>
                        <span className="summary-value income">${totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Total Expenses:</span>
                        <span className="summary-value expenses">${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Net Savings:</span>
                        <span className="summary-value net-savings">${netSavings.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-card">
                <h3 className="card-title">Financial Progress</h3>
                <p>Expense Progress against Target: ${totalExpenses.toFixed(2)} / ${budget?.targetExpenses?.toFixed(2) || 'N/A'}</p>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${expenseProgress}%` }}></div>
                </div>
                <p>Saving Progress against Goal: ${netSavings.toFixed(2)} / ${budget?.savingGoal?.toFixed(2) || 'N/A'}</p>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${savingProgress}%`, backgroundColor: '#4caf50' }}></div>
                </div>
            </div>

            <div className="dashboard-content-card chart-card">
                <h3 className="card-title">Your Financial Breakdown</h3>
                <div className="graph-container">
                    <Chart
                        chartType="PieChart"
                        data={pieChartData}
                        options={pieOptions}
                        width="100%"
                        height="400px"
                    />
                </div>
                {Object.keys(expensesByCategory).length > 0 && (
                    <div className="graph-container">
                        <Chart
                            chartType="BarChart"
                            data={expenseData}
                            options={barOptions}
                            width="100%"
                            height="400px"
                        />
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
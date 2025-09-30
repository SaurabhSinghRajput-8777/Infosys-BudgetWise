import React from 'react';
import { Chart } from 'react-google-charts'; // Ensure this import is correct after installation

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

const Dashboard = ({ onPageChange }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const greeting = getGreeting();
    const userName = user ? user.name : 'User';

    // Dummy data for a pie chart
    const data = [
        ['Category', 'Amount'],
        ['Income', 4000],
        ['Savings', 1000],
        ['Expenses', 2500],
    ];

    const options = {
        title: 'Financial Overview',
        pieHole: 0.4,
        is3D: false,
        backgroundColor: { fill: 'transparent' }, // Use transparent fill to let the card background show
        titleTextStyle: { color: '#F8F9FA', fontSize: 20 },
        legend: { textStyle: { color: '#A0AEC0' } },
        colors: ['#FFD700', '#4A5568', '#007bff'],
    };

    const handleQuickAction = (page) => {
        onPageChange(page);
    };

    return (
        <div className="dashboard-page-container">
            <h2 className="dashboard-welcome-message">{greeting}, {userName}!</h2>
            
            <div className="dashboard-summary-cards">
                <div className="summary-card">
                    <span className="card-icon">💰</span>
                    <h4 className="card-label">Current Balance</h4>
                    <p className="card-value">$2,500</p>
                </div>
                <div className="summary-card">
                    <span className="card-icon">💸</span>
                    <h4 className="card-label">Monthly Expenses</h4>
                    <p className="card-value">$1,500</p>
                </div>
                <div className="summary-card">
                    <span className="card-icon">📈</span>
                    <h4 className="card-label">Savings Goal</h4>
                    <p className="card-value">$10,000</p>
                </div>
            </div>

            <div className="dashboard-content-card">
                <h3 className="card-title">Your Financial Summary</h3>
                <div className="graph-container">
                    <Chart
                        chartType="PieChart"
                        data={data}
                        options={options}
                        width="100%"
                        height="400px"
                    />
                </div>
                <p className="graph-description">
                    This is a dummy visualization of your financial data.
                    Manage your budgets and transactions to see a real-time summary here.
                </p>
            </div>

            <div className="dashboard-quick-actions">
                <h3 className="card-title">Quick Actions</h3>
                <div className="actions-container">
                    <button onClick={() => handleQuickAction('Transaction')} className="action-button">
                        Add Transaction
                    </button>
                    <button onClick={() => handleQuickAction('Budget')} className="action-button">
                        View Budget
                    </button>
                    <button onClick={() => handleQuickAction('Profile')} className="action-button">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
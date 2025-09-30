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

const Dashboard = () => {
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

    return (
        <div className="dashboard-page-container">
            <h2 className="dashboard-welcome-message">{greeting}, {userName}!</h2>
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
        </div>
    );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Budget from './pages/Budget.jsx';
import Transaction from './pages/Transaction.jsx';
import Profile from './pages/Profile.jsx';
import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

    useEffect(() => {
        const hasSetBudget = localStorage.getItem('hasSetBudget');
        if (!hasSetBudget) {
            setIsFirstTimeUser(true);
            setCurrentPage('Budget');
        } else {
            setIsFirstTimeUser(false);
            setCurrentPage('Dashboard');
        }
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBudgetSetupComplete = () => {
        localStorage.setItem('hasSetBudget', 'true');
        setIsFirstTimeUser(false);
        setCurrentPage('Dashboard');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard onLogout={onLogout} />;
            case 'Budget':
                return <Budget onBudgetSetupComplete={handleBudgetSetupComplete} />;
            case 'Transaction':
                return <Transaction />;
            case 'Profile':
                return <Profile onLogout={onLogout} />;
            default:
                return <Dashboard onLogout={onLogout} />;
        }
    };

    return (
        <div className="user-dashboard-container">
            {isFirstTimeUser && currentPage === 'Budget' && (
                <div className="onboarding-message">
                    <h3>Welcome! 👋</h3>
                    <p>It looks like this is your first time here. Let's set up your budget to get started.</p>
                </div>
            )}
            <Header currentPage={currentPage} onPageChange={handlePageChange} />
            <main className="user-dashboard-main-content">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
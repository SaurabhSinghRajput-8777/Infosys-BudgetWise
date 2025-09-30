import React from 'react';

function Header({ currentPage, onPageChange }) {
    return(
        <header className="main-header">
            <nav className="header-nav-container">
                <nav className="header-title">
                    <h1>BudgetWise</h1>
                </nav>
                <nav className="header-components">
                    <ul className="nav-menu">
                        <li className={currentPage === 'Dashboard' ? 'active' : ''}>
                            <a href="#" onClick={() => onPageChange('Dashboard')}>Dashboard</a>
                        </li>
                        <li className={currentPage === 'Transaction' ? 'active' : ''}>
                            <a href="#" onClick={() => onPageChange('Transaction')}>Transactions</a>
                        </li>
                        <li className={currentPage === 'Budget' ? 'active' : ''}>
                            <a href="#" onClick={() => onPageChange('Budget')}>Budget</a>
                        </li>
                        <li className={currentPage === 'Profile' ? 'active' : ''}>
                            <a href="#" onClick={() => onPageChange('Profile')}>Profile</a>
                        </li>
                    </ul>
                </nav>
            </nav>
        </header>
    );
}

export default Header;
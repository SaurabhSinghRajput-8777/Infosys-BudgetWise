import React from 'react';
import Button from '../components/Button';
import '../UserDashboard.css'; // Import shared CSS for styling

function AdminHeader({ currentPage, onPageChange, onLogout }) {
    return(
        <header className="main-header">
            <nav className="header-nav-container">
                <div className="header-title">
                    <h1>BudgetWise - Admin</h1>
                </div>
                <div className="header-components">
                    <ul className="nav-menu">
                        {/* Only include Dashboard and Profile links */}
                        <li className={currentPage === 'AdminDashboard' ? 'active' : ''}>
                            <a href="#" onClick={() => onPageChange('AdminDashboard')}>Dashboard</a>
                        </li>
                        <li className={currentPage === 'Profile' ? 'active' : ''}>
                            <a href="#" onClick={() => onPageChange('Profile')}>Profile</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default AdminHeader;
import React, { useState } from 'react';
import AdminHeader from './AdminHeader.jsx'; 
import Footer from '../Footer.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import Profile from './Profile.jsx'; 
import './AdminLayout.css'; // New Layout file for admin view
import '../UserDashboard.css'; // Keep this for Header/Footer styles

const AdminDashboardContainer = ({ onLogout }) => {
    const [currentPage, setCurrentPage] = useState('AdminDashboard');

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'AdminDashboard':
                return <AdminDashboard onLogout={onLogout} />; 
            case 'Profile':
                return <Profile onLogout={onLogout} />;
            default:
                return <AdminDashboard onLogout={onLogout} />;
        }
    };

    return (
        <div className="admin-view-container">
            <AdminHeader 
                currentPage={currentPage} 
                onPageChange={handlePageChange} 
                onLogout={onLogout} 
            />
            <main className="admin-main-content">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboardContainer;
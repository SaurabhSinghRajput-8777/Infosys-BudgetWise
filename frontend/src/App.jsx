import React, { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboardContainer from './pages/AdminDashboardContainer.jsx'; // Updated import
import './index.css';

const App = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check for a token and user info in local storage on app load
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    setIsLoginView(true); // Return to login view
  };

  const renderContent = () => {
    if (isLoggedIn) {
      if (userRole === 'USER') {
        return <UserDashboard onLogout={handleLogout} />;
      } else if (userRole === 'ADMIN') {
        return <AdminDashboardContainer onLogout={handleLogout} />; // Updated component
      }
    } else {
      if (isLoginView) {
        return <Login onToggleView={() => setIsLoginView(false)} onLoginSuccess={handleLoginSuccess} />;
      } else {
        return <Signup onToggleView={() => setIsLoginView(true)} />;
      }
    }
  };

  return <>{renderContent()}</>;
};

export default App;
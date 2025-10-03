import React, { useState } from 'react';
import Button from '../components/Button.jsx';

const Login = ({ onToggleView, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // State to control the toggle button
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the selected role to the backend for verification
        body: JSON.stringify({ email, password, role }), 
      });

      const data = await response.json();

      if (!response.ok) {
        // If status is 403 (FORBIDDEN) due to role mismatch, display the specific message
        if (response.status === 403) {
            throw new Error(data.message);
        }
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          name: data.name,
          role: data.role
        }));
      }

      alert(`Login successful! Welcome ${data.name || 'User'}`);
      onLoginSuccess(data.role);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = () => {
    setRole(role === 'USER' ? 'ADMIN' : 'USER');
  };

  return (
    <div className="Landing-Page">
      {/* Left Half: Background Image and Text */}
      <div className="Left-Half">
        <div className="Logo">💰 BudgetWise</div>
        <div className="Left-Half-Content">
          <h1>Welcome to BudgetWise</h1>
          <p>Manage your finances with ease.</p>
        </div>
      </div>

      {/* Right Half: Login Card Container */}
      <div className="Right-Half">
        <div className="Login-Card">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="Role-Toggle-Container">
              <label htmlFor="role-toggle">Login as:</label>
              <div
                id="role-toggle"
                className="Role-Toggle-Button"
                onClick={handleRoleToggle}
              >
                {role}
              </div>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          {error && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</p>}
          <p className="New-User-Text">
              New User? <span onClick={onToggleView}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
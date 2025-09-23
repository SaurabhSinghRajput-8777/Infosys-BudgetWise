import React, { useState } from 'react';

const Login = ({ onToggleView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace this with your actual Spring Boot login API endpoint
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      // Here you would store the JWT token from the backend, e.g., in localStorage or a state management solution
      // For example: localStorage.setItem('token', data.token);

      alert('Login successful! You can now access the dashboard.');

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
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p className="New-User-Text">
              New User? <span onClick={onToggleView}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
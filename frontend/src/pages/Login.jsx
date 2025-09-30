import React, { useState } from 'react';

const Login = ({ onToggleView, onLoginSuccess }) => {
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
      console.log('Attempting login with:', { email, role });
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      console.log('Login successful:', data);
      
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
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
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
import React, { useState } from 'react';
import Button from '../components/Button.jsx'; 
import IntroImg from '../assets/Intro Img.png';

const Signup = ({ onToggleView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'USER' }),
      });

      if (!response.ok) {
        throw new Error('Signup failed. The user may already exist.');
      }

      const data = await response.json();
      console.log('Signup successful:', data);

      alert('Signup successful! You can now log in.');
      onToggleView();

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Landing-Page">
      {/* Left Half with the image */}
      <div 
        className="Left-Half" 
        style={{ 
          backgroundImage: `url(${IntroImg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat' 
        }}
      >
      </div>

      {/* Right Half: Signup Card */}
      <div className="Right-Half">
        <div className="Login-Card">
          <h2>Signup</h2>
          <form onSubmit={handleSignupSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              {loading ? 'Signing up...' : 'Signup'}
            </Button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p className="New-User-Text">
            Already have an account? <span onClick={onToggleView}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
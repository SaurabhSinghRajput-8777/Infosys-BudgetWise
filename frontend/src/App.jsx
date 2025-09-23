import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import './index.css';

const App = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <>
      {isLoginView ? <Login onToggleView={toggleView} /> : <Signup onToggleView={toggleView} />}
    </>
  );
};

export default App;
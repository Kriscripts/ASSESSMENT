import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial state values based on localStorage
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';

    setEmail(rememberedEmail);
    setPassword(rememberedPassword);
    setRememberMe(!!rememberedEmail);
  }, []);

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
        rememberMe,
      });

      if (rememberMe) {
        // Store email and password in localStorage if rememberMe is checked
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        // Clear stored email and password if rememberMe is not checked
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
         
      console.log("Login Successfull");
      navigate('/integration');
    } catch (error) {
      console.error('Login error:', error.response?.data.error || error.message);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="body">
      <div className="card">
        <h2>Login to your Account</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
        </div>

        <button className="button" onClick={handleLogin}>
          Login
        </button>

        <p>
          New to myApp?{' '}
          <Link to="/register" className="register-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

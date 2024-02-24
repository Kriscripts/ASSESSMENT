import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial state values based on localStorage
    const rememberedName = localStorage.getItem('rememberedName') || '';
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';

    setName(rememberedName);
    setEmail(rememberedEmail);
    setPassword(rememberedPassword);
    setRememberMe(!!rememberedName);
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        name,
        email,
        password,
      });

      if (rememberMe) {
        // Store name, email, and password in localStorage if rememberMe is checked
        localStorage.setItem('rememberedName', name);
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        // Clear stored name, email, and password if rememberMe is not checked
        localStorage.removeItem('rememberedName');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      
      console.log('User registered successfully');
     
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error.response?.data.error || error.message);
      alert('Registration failed. Please check your information and try again.');
    }
  };

  return (
    <div className="body">
      <div className="card">
        <h2>Create Account</h2>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <button className="button" onClick={handleRegister}>
          Sign Up
        </button>

        <p>
          Already have an account?{' '}
          <a href="/login" className="login-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

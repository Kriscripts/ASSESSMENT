import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import IntegrationPage from './components/IntegrationPage';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/*" element={<Navigate to="/register" />} />
       <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/integration" element={<IntegrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}



export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentRegister from './pages/agent/AgentRegister';
import InvestorDashboard from './pages/investor/InvestorDashboard';
import InvestorRegister from './pages/investor/InvestorRegister';
import BorrowerDashboard from './pages/borrower/BorrowerDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent/register" element={<AgentRegister />} />
          <Route path="/investor/register" element={<InvestorRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/investor/dashboard" element={<InvestorDashboard />} />
          <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

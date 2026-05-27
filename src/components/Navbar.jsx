import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>💰 Loan Management System</h1>
          <span className="role-badge">{role.toUpperCase()}</span>
        </div>
        
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

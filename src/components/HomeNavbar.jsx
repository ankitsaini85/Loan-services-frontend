import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeNavbar.css';

export default function HomeNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="home-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">💰</span>
          <span className="logo-text">LoanHub</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menu Items */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Features
          </a>
          <a href="#pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </a>
          <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            About
          </a>
          <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </a>
        </div>

        {/* Login Button */}
        <button className="btn-login" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </nav>
  );
}

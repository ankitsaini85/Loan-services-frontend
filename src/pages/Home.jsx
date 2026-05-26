import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📊',
      title: 'Portfolio Management',
      description: 'Track and manage your loan portfolio with real-time analytics and detailed insights.',
    },
    {
      icon: '💰',
      title: 'Collection Tracking',
      description: 'Monitor EMI collections, payments, and overdue amounts with precision.',
    },
    {
      icon: '👥',
      title: 'Multi-Role Support',
      description: 'Admin, agents, investors, and borrowers - all in one unified platform.',
    },
    {
      icon: '📄',
      title: 'Document Management',
      description: 'Upload, store, and manage all loan documents securely.',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Get instant alerts for payments, approvals, and important updates.',
    },
    {
      icon: '📈',
      title: 'Investor Allocation',
      description: 'Distribute loans among investors with transparent allocation tracking.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Loans' },
    { value: '50K+', label: 'Users' },
    { value: '₹500Cr+', label: 'Portfolio Value' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="home-container">
      <HomeNavbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Complete Loan Management <span className="gradient-text">& Collection System</span>
          </h1>
          <p className="hero-subtitle">
            Streamline your lending operations with our comprehensive platform designed for efficiency, transparency, and growth.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Get Started
            </button>
            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-placeholder">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
              <rect x="50" y="50" width="300" height="300" fill="url(#grad1)" rx="20" />
              <circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.2)" />
              <circle cx="150" cy="150" r="50" fill="rgba(255,255,255,0.1)" />
              <circle cx="250" cy="250" r="40" fill="rgba(255,255,255,0.15)" />
              <text x="200" y="210" fontSize="48" textAnchor="middle" fill="white">
                💰
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to manage loans efficiently</p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Lending Business?</h2>
          <p>Join thousands of organizations using our platform to streamline loan management.</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/login')}>
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

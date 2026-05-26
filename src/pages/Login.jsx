import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, setLoading } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  // For borrower login, use groupId instead of email
  const loginFieldName = role === 'borrower' ? 'groupId' : 'email';
  const loginFieldLabel = role === 'borrower' ? 'Group ID' : 'Email';
  const loginFieldType = role === 'borrower' ? 'text' : 'email';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (role === 'borrower' && name === 'email') {
      // Convert email field to groupId for borrower
      setCredentials({
        ...credentials,
        groupId: value,
      });
    } else if (role !== 'borrower' && name === 'groupId') {
      // Use email for other roles
      setCredentials({
        ...credentials,
        email: value,
      });
    } else {
      setCredentials({
        ...credentials,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (role === 'admin') {
        const { adminLogin } = await import('../services/adminService');
        response = await adminLogin(credentials);
      } else if (role === 'agent') {
        const { agentLogin } = await import('../services/agentService');
        response = await agentLogin(credentials);
      } else if (role === 'investor') {
        const { investorLogin } = await import('../services/investorService');
        response = await investorLogin(credentials);
      } else if (role === 'borrower') {
        const { borrowerLogin } = await import('../services/borrowerService');
        response = await borrowerLogin(credentials);
      }

      if (response?.data?.success) {
        login(response.data.user, response.data.token);
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">💰 Loan Management</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 500 }}>
          Complete Loan Management & Collection System
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <label>Login As:</label>
            <div className="role-buttons">
              {['admin', 'agent', 'investor', 'borrower'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>{loginFieldLabel}</label>
            <input
              type={loginFieldType}
              name={role === 'borrower' ? 'groupId' : 'email'}
              value={role === 'borrower' ? (credentials.groupId || '') : (credentials.email || '')}
              onChange={handleChange}
              placeholder={`Enter your ${loginFieldLabel.toLowerCase()}`}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>

          {role === 'agent' && (
            <button
              type="button"
              className="link-button"
              style={{ marginTop: '10px' }}
              onClick={() => navigate('/agent/register')}
            >
              New agent? Register for approval
            </button>
          )}

          {role === 'investor' && (
            <button
              type="button"
              className="link-button"
              style={{ marginTop: '10px' }}
              onClick={() => navigate('/investor/register')}
            >
              New investor? Register for approval
            </button>
          )}
        </form>

        {/* <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin@loansystem.com / Admin@123</p>
          <p>Agent: raj@loansystem.com / Agent@123</p>
          <p>Investor: investor@loansystem.com / Investor@123</p>
          <p>Borrower: (Use any Group ID from registered groups) / (GroupID@123)</p>
        </div> */}
      </div>
    </div>
  );
}

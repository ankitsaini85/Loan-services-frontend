import React, { useEffect, useState } from 'react';
import { PieChart, TrendingUp, Shield, DollarSign, Users, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { getInvestorDashboard } from '../../services/investorService';

export default function PortfolioDistribution() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const { data } = await getInvestorDashboard();
        setPortfolio(data.investments || []);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const totalInvested = portfolio.reduce((sum, p) => sum + (p.allocatedAmount || 0), 0);
  const totalInterestEarned = portfolio.reduce((sum, p) => sum + (p.interestEarned || 0), 0);
  const averageReturn = totalInvested > 0 ? ((totalInterestEarned / totalInvested) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="content-section">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f4f6', 
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '16px', color: '#718096' }}>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <h1>Portfolio Distribution</h1>
        <div style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#991b1b',
          marginTop: '20px'
        }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="content-section" style={{ padding: '0' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '16px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: 'white',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <PieChart size={36} />
          Portfolio Distribution
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Track your investments across different loan groups</p>
      </div>

      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #667eea',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <DollarSign size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Total Invested</p>
          </div>
          <p style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1a202c' }}>
            ₹{totalInvested.toLocaleString('en-IN')}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #f5576c',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Active Groups</p>
          </div>
          <p style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1a202c' }}>
            {portfolio.length}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #43e97b',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <TrendingUp size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Avg Return</p>
          </div>
          <p style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1a202c' }}>
            {averageReturn}%
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #4facfe',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Shield size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Interest Earned</p>
          </div>
          <p style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1a202c' }}>
            ₹{totalInterestEarned.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Portfolio Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {portfolio.length > 0 ? portfolio.map((item, idx) => {
          const returnPercentage = item.allocatedAmount > 0 
            ? ((item.interestEarned / item.allocatedAmount) * 100).toFixed(2) 
            : 0;
          
          return (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
            }}>
              {/* Card Header */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: '#1a202c' 
                  }}>{item.groupName}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: item.status === 'active' ? '#d1fae5' : '#fee2e2',
                    color: item.status === 'active' ? '#065f46' : '#991b1b',
                    border: item.status === 'active' ? '1px solid #a7f3d0' : '1px solid #fecaca'
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} style={{ color: item.status === 'active' ? '#10b981' : '#9ca3af' }} />
                  <span style={{ fontSize: '13px', color: item.status === 'active' ? '#10b981' : '#9ca3af', fontWeight: '600' }}>
                    {item.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>

              {/* Investment Details */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Invested</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                      ₹{(item.allocatedAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Interest Rate</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                      {item.interestRate}% p.a.
                    </p>
                  </div>
                </div>
              </div>

              {/* Returns */}
              <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                padding: '15px',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#065f46', fontWeight: '600' }}>Interest Earned</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#047857' }}>
                      ₹{(item.interestEarned || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#047857' }}>
                      +{returnPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6b7280',
            gridColumn: '1 / -1'
          }}>
            <PieChart size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>No active investments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

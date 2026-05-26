import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import { TrendingUp, Wallet, DollarSign, PieChart, Activity, Calendar, Award, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';
import { getInvestorDashboard } from '../../services/investorService';

export default function MyFund() {
  const [fundData, setFundData] = useState({
    totalInvested: 0,
    availableFunds: 0,
    activeInvestment: 0,
    totalInterestEarned: 0,
    interestRate: 12,
  });
  const [investments, setInvestments] = useState([]);
  const [investor, setInvestor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchFundData();
  }, []);

  const fetchFundData = async () => {
    try {
      setLoading(true);
      const { data } = await getInvestorDashboard();
      setInvestor(data.investor || {});
      setFundData({
        totalInvested: data.portfolio?.totalInvested || 0,
        availableFunds: data.portfolio?.availableFund || 0,
        activeInvestment: data.portfolio?.activeInvestment || 0,
        totalInterestEarned: data.portfolio?.totalInterestEarned || 0,
        interestRate: data.investor?.interestRate || 12,
      });
      setInvestments(data.investments || []);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load fund data');
      console.error('Error fetching fund data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          <p style={{ fontSize: '16px', color: '#718096' }}>Loading your investment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <h1>My Fund</h1>
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

  const returnOnInvestment = fundData.totalInvested > 0 
    ? ((fundData.totalInterestEarned / fundData.totalInvested) * 100).toFixed(2)
    : 0;

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
          margin: '0 0 8px 0'
        }}>My Investment Fund</h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Monitor and manage your investment portfolio</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '25px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Total Invested</p>
              <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>
                ₹{fundData.totalInvested.toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <DollarSign size={28} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '25px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 87, 108, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.3)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Active Investment</p>
              <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>
                ₹{fundData.activeInvestment.toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '25px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.3)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Available Funds</p>
              <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>
                ₹{fundData.availableFunds.toLocaleString('en-IN')}
              </h2>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <Wallet size={28} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '25px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(67, 233, 123, 0.3)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>Interest Earned</p>
              <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700' }}>
                ₹{fundData.totalInterestEarned.toLocaleString()}
              </h2>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <ArrowUpRight size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          color: '#1a202c',
          margin: '0 0 25px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Activity size={24} style={{ color: '#667eea' }} />
          Performance Metrics
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)',
            borderRadius: '12px',
            borderLeft: '4px solid #667eea'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <PieChart size={20} style={{ color: '#667eea' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>ROI</p>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#667eea' 
            }}>{returnOnInvestment}%</p>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8f5 100%)',
            borderRadius: '12px',
            borderLeft: '4px solid #f5576c'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Award size={20} style={{ color: '#f5576c' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Interest Rate</p>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#f5576c' 
            }}>{fundData.interestRate}% p.a.</p>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f0fcff 0%, #e8f9ff 100%)',
            borderRadius: '12px',
            borderLeft: '4px solid #4facfe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <TrendingUp size={20} style={{ color: '#4facfe' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Total Loans</p>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#4facfe' 
            }}>{investments.length}</p>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f0fff4 0%, #e8fff0 100%)',
            borderRadius: '12px',
            borderLeft: '4px solid #43e97b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Activity size={20} style={{ color: '#43e97b' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Active Loans</p>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#43e97b' 
            }}>{investments.filter(inv => inv.status === 'active').length}</p>
          </div>
        </div>
      </div>

      {/* Fund Allocation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1a202c',
            margin: '0 0 20px 0'
          }}>Fund Allocation</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Active Investments</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>
                {fundData.totalInvested > 0 
                  ? ((fundData.activeInvestmentValue / fundData.totalInvested) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${fundData.totalInvested > 0 
                  ? ((fundData.activeInvestmentValue / fundData.totalInvested) * 100)
                  : 0}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Available Funds</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4facfe' }}>
                {fundData.totalInvested > 0 
                  ? ((fundData.availableFunds / fundData.totalInvested) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${fundData.totalInvested > 0 
                  ? ((fundData.availableFunds / fundData.totalInvested) * 100)
                  : 0}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Active Investments by Group */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          marginTop: '30px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1a202c',
            margin: '0 0 20px 0'
          }}>
            💼 Active Investments by Group
          </h3>

          {investments.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '12px'
            }}>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>No active investments yet</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {investments.map((inv) => (
                <div key={inv.allocationId} style={{
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Group Header */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>
                          {inv.groupName}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                          ID: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{inv.groupId}</span>
                          <button style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            marginLeft: '4px',
                            color: copiedId === inv.allocationId ? '#10b981' : '#667eea'
                          }}
                            onClick={() => copyToClipboard(inv.groupId, inv.allocationId)}
                          >
                            {copiedId === inv.allocationId ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </p>
                      </div>
                      <span style={{
                        background: inv.status === 'active' ? '#d1fae5' : '#fef3c7',
                        color: inv.status === 'active' ? '#065f46' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {inv.status === 'active' ? '🟢 Active' : '🟡 ' + inv.status}
                      </span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  {inv.agent && (
                    <div style={{
                      padding: '10px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontSize: '12px'
                    }}>
                      <p style={{ margin: '0 0 2px 0', color: '#6b7280' }}>Agent: <span style={{ fontWeight: '600', color: '#1a202c' }}>{inv.agent.name}</span></p>
                      <p style={{ margin: 0, color: '#6b7280' }}>📧 {inv.agent.email}</p>
                    </div>
                  )}

                  {/* Investment Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Your Allocation</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#10b981' }}>
                        ₹{inv.allocatedAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Interest Rate</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>
                        {inv.interestRate}% p.a.
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Interest Earned</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>
                        ₹{inv.interestEarned.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Duration</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#667eea' }}>
                        {inv.duration}
                      </p>
                    </div>
                  </div>

                  {/* Loan Group Details */}
                  <div style={{
                    padding: '10px',
                    background: '#faf5ff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    marginBottom: '12px'
                  }}>
                    <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>
                      Total Loan Amount: <span style={{ fontWeight: '600', color: '#1a202c' }}>₹{inv.totalLoanAmount.toLocaleString('en-IN')}</span>
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>
                      Profit Margin: <span style={{ fontWeight: '600', color: '#1a202c' }}>₹{inv.profitMargin.toLocaleString('en-IN')}</span>
                    </p>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      EMI Amount: <span style={{ fontWeight: '600', color: '#1a202c' }}>₹{inv.emiAmount.toLocaleString('en-IN')}</span>
                    </p>
                  </div>

                  {/* Dates */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#6b7280'
                  }}>
                    <span>Started: {new Date(inv.allocationDate).toLocaleDateString('en-IN')}</span>
                    {inv.completionDate && <span>Ends: {new Date(inv.completionDate).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

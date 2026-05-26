import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Award, BarChart3 } from 'lucide-react';
import { getMyCommission } from '../../services/agentService';

export default function MyCommission() {
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommission();
  }, []);

  const loadCommission = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyCommission();
      setCommission(response.data);
    } catch (err) {
      setError('Failed to load commission data');
      console.error('Failed to load commission:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly commission summary
  const getMonthlyBreakdown = () => {
    if (!commission?.commissions) return [];
    
    const monthlyData = {};
    commission.commissions.forEach(c => {
      const month = c.month || new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, earned: 0, paid: 0, pending: 0 };
      }
      monthlyData[month].earned += c.commissionAmount;
      if (c.status === 'paid') {
        monthlyData[month].paid += c.commissionAmount;
      } else {
        monthlyData[month].pending += c.commissionAmount;
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const monthlyData = getMonthlyBreakdown();
  const maxMonthlyEarning = Math.max(...monthlyData.map(m => m.earned), 1);

  if (loading) {
    return <div className="content-section"><p>Loading...</p></div>;
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
          <Award size={36} />
          My Commission
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Track your commission earnings and payouts</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '1px solid #fecaca',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#991b1b'
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: '600' }}>Error: {error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
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
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          color: 'white',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <TrendingUp size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Total Lifetime Commission</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            ₹{(commission?.totalEarned || 0).toLocaleString('en-IN')}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
          color: 'white',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <CheckCircle size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Paid Commission</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            ₹{(commission?.totalPaid || 0).toLocaleString('en-IN')}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            {commission?.commissions?.filter(c => c.status === 'paid').length || 0} payments received
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
          color: 'white',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <Clock size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Pending Commission</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            ₹{(commission?.pending || 0).toLocaleString('en-IN')}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            {commission?.commissions?.filter(c => c.status !== 'paid').length || 0} pending payments
          </p>
        </div>
      </div>

      {/* Monthly Income Summary */}
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
          gap: '10px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <BarChart3 size={24} style={{ color: '#667eea' }} />
          Monthly Income Summary
        </h2>

        {monthlyData.length > 0 ? (
          <>
            <div style={{
              overflowX: 'auto',
              marginBottom: '30px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '500px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ 
                      padding: '14px', 
                      textAlign: 'left', 
                      fontWeight: '700', 
                      color: '#1a202c',
                      fontSize: '13px'
                    }}>Month</th>
                    <th style={{ 
                      padding: '14px', 
                      textAlign: 'right', 
                      fontWeight: '700', 
                      color: '#667eea',
                      fontSize: '13px'
                    }}>Earned</th>
                    <th style={{ 
                      padding: '14px', 
                      textAlign: 'right', 
                      fontWeight: '700', 
                      color: '#43e97b',
                      fontSize: '13px'
                    }}>Paid</th>
                    <th style={{ 
                      padding: '14px', 
                      textAlign: 'right', 
                      fontWeight: '700', 
                      color: '#f5576c',
                      fontSize: '13px'
                    }}>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px', fontWeight: '600', color: '#1a202c' }}>{month.month}</td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: '600', color: '#667eea' }}>
                        ₹{month.earned.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: '600', color: '#43e97b' }}>
                        ₹{month.paid.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: '600', color: '#f5576c' }}>
                        ₹{month.pending.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monthly Bar Chart */}
            <div>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#1a202c',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <TrendingUp size={20} style={{ color: '#667eea' }} />
                Monthly Commission Trend
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'flex-end', 
                height: '250px', 
                paddingBottom: '20px',
                paddingTop: '20px',
                overflowX: 'auto'
              }}>
                {monthlyData.map((month, idx) => (
                  <div key={idx} style={{ 
                    flex: '0 0 60px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      width: '100%',
                      height: `${(month.earned / maxMonthlyEarning) * 180}px`,
                      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '8px 8px 0 0',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #764ba2 0%, #667eea 100%)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                    }}
                    title={`₹${month.earned.toLocaleString()}`}>
                      {month.earned > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-24px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#667eea',
                          whiteSpace: 'nowrap'
                        }}>
                          ₹{(month.earned / 1000).toFixed(1)}K
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      marginTop: '12px', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: '#718096', 
                      textAlign: 'center',
                      maxWidth: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {month.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            <p>No commission records yet</p>
          </div>
        )}
      </div>

      {/* Commission History */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#1a202c',
          margin: '0 0 25px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <DollarSign size={24} style={{ color: '#43e97b' }} />
          Commission History
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '500px'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ 
                  padding: '14px', 
                  textAlign: 'left', 
                  fontWeight: '700', 
                  color: '#1a202c',
                  fontSize: '13px'
                }}>Month</th>
                <th style={{ 
                  padding: '14px', 
                  textAlign: 'right', 
                  fontWeight: '700', 
                  color: '#1a202c',
                  fontSize: '13px'
                }}>Amount</th>
                <th style={{ 
                  padding: '14px', 
                  textAlign: 'left', 
                  fontWeight: '700', 
                  color: '#1a202c',
                  fontSize: '13px'
                }}>Status</th>
                <th style={{ 
                  padding: '14px', 
                  textAlign: 'left', 
                  fontWeight: '700', 
                  color: '#1a202c',
                  fontSize: '13px'
                }}>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {commission?.commissions && commission.commissions.length > 0 ? (
                commission.commissions.map((c, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ fontWeight: '600', color: '#1a202c', padding: '14px' }}>{c.month}</td>
                    <td style={{ fontWeight: '700', color: '#667eea', padding: '14px', textAlign: 'right' }}>
                      ₹{c.commissionAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        background: c.status === 'paid' ? '#d1fae5' : '#fef3c7',
                        color: c.status === 'paid' ? '#047857' : '#92400e',
                        display: 'inline-block'
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ color: '#718096', padding: '14px' }}>
                      {c.paidDate ? new Date(c.paidDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                    No commission records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

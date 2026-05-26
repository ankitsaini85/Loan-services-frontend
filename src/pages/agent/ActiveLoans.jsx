import React, { useEffect, useState } from 'react';
import { Search, Loader2, TrendingUp, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { getAgentActiveLoans } from '../../services/agentService';

export default function ActiveLoans() {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoans = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAgentActiveLoans(search);
      setLoans(data || []);
      setFilteredLoans(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load loans');
      setLoans([]);
      setFilteredLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(
        loan =>
          loan.groupName.toLowerCase().includes(term.toLowerCase()) ||
          loan.groupId.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredLoans(filtered);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchLoans(searchTerm);
  };

  const stats = loans.length > 0 ? {
    totalLoans: loans.length,
    totalDisbursal: loans.reduce((sum, l) => sum + (l.totalPayable || 0), 0),
    totalCollected: loans.reduce((sum, l) => sum + (l.amountCollected || 0), 0),
    avgRecovery: Math.round(loans.reduce((sum, l) => sum + (l.recoveryPercent || 0), 0) / loans.length)
  } : { totalLoans: 0, totalDisbursal: 0, totalCollected: 0, avgRecovery: 0 };

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
          <TrendingUp size={36} />
          Active Loans
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Live tracking of your active loan groups in real-time</p>
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
          <AlertCircle size={20} />
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {loans.length > 0 && (
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
                <CheckCircle size={24} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Active Loans</p>
            </div>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a202c' }}>
              {stats.totalLoans}
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
                <DollarSign size={24} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Total Collected</p>
            </div>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a202c' }}>
              ₹{stats.totalCollected.toLocaleString()}
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
                <TrendingUp size={24} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Avg Recovery</p>
            </div>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a202c' }}>
              {stats.avgRecovery}%
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
                <DollarSign size={24} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Total Disbursed</p>
            </div>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a202c' }}>
              ₹{stats.totalDisbursal.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '16px',
              color: '#718096',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Search by group name or group ID..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '14px 16px 14px 45px',
                fontSize: '14px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </form>

      {/* Loans Grid or Message */}
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '40px',
          color: '#718096'
        }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading loans...</span>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <p style={{ margin: 0, fontSize: '16px', color: '#718096' }}>
            {loans.length === 0 ? 'No active loans yet' : 'No loans match your search'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredLoans.map(loan => {
            const recoveryPercent = loan.recoveryPercent || 0;
            const recoveryColor = recoveryPercent >= 75 ? '#43e97b' : recoveryPercent >= 50 ? '#fde68a' : '#fecaca';
            
            return (
              <div key={loan.id} style={{
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>
                      {loan.groupName}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#718096', fontWeight: '600' }}>
                      ID: {loan.groupId}
                    </p>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {loan.status || 'Active'}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Total Payable</p>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                        ₹{(loan.totalPayable || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Collected</p>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#43e97b' }}>
                        ₹{(loan.amountCollected || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Remaining</p>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f5576c' }}>
                        ₹{(loan.remainingBalance || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Recovery %</p>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: recoveryColor }}>
                        {loan.recoveryPercent}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${recoveryPercent}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${recoveryColor}, ${recoveryColor}dd)`,
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Footer Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} style={{ color: '#667eea' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '10px', color: '#718096' }}>Next EMI</p>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>
                        {loan.nextInstallmentDate ? new Date(loan.nextInstallmentDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} style={{ color: '#43e97b' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '10px', color: '#718096' }}>Last Paid</p>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>
                        {loan.lastPaidDate ? new Date(loan.lastPaidDate).toLocaleDateString() : 'No payment'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

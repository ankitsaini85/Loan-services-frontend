import React, { useState } from 'react';
import { calculateLoan } from '../../services/agentService';
import { Calculator, DollarSign, TrendingUp, Gift, AlertCircle, Calendar } from 'lucide-react';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!amount) return;

    const totalMonths = (parseInt(years) || 0) * 12 + (parseInt(months) || 0);
    if (totalMonths <= 0) {
      alert('Please select a duration');
      return;
    }

    setLoading(true);
    try {
      const response = await calculateLoan(parseFloat(amount), totalMonths);
      setResult(response.data);
    } catch (error) {
      alert('Failed to calculate loan');
    } finally {
      setLoading(false);
    }
  };

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
          <Calculator size={36} />
          Loan Calculator
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Pre-approval tool for quick loan calculation</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {/* Calculator Form */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          gridColumn: result ? 'auto' : '1 / -1'
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
            <DollarSign size={24} style={{ color: '#667eea' }} />
            Enter Loan Details
          </h2>

          <form onSubmit={handleCalculate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter loan amount (minimum ₹1000)"
                required
                min="1000"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
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
              <p style={{ 
                margin: '8px 0 0 0', 
                fontSize: '12px', 
                color: '#718096' 
              }}>
                Enter the loan amount you want to process
              </p>
            </div>

            {/* Duration Selection */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Calendar size={16} style={{ color: '#667eea' }} />
                  Years
                </label>
                <select
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="0">0 Years</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="4">4 Years</option>
                  <option value="5">5 Years</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Calendar size={16} style={{ color: '#667eea' }} />
                  Months
                </label>
                <select
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => (
                    <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <Calculator size={18} />
              {loading ? 'Calculating...' : 'Calculate Loan Details'}
            </button>
          </form>

          {/* Info Box */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '10px',
            border: '1px solid #fcd34d',
            display: 'flex',
            gap: '12px'
          }}>
            <AlertCircle size={20} style={{ color: '#92400e', flexShrink: 0 }} />
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: '#92400e',
              lineHeight: '1.5'
            }}>
              This is an approximate calculation. Final loan details may vary based on actual assessment and group requirements.
            </p>
          </div>
        </div>

        {/* Results Section */}
        {result && (
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
              gap: '10px'
            }}>
              <TrendingUp size={24} style={{ color: '#43e97b' }} />
              Loan Details
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '15px'
            }}>
              {/* Duration */}
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.9 }}>Loan Duration</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  {result.durationDisplay}
                </p>
              </div>

              {/* Entered Amount */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.9 }}>Entered Amount</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  ₹{result.enteredAmount.toLocaleString()}
                </p>
              </div>

              {/* Disbursal */}
              <div style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.9 }}>Disbursal (Hand Cash)</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  ₹{result.disbursal.toLocaleString()}
                </p>
              </div>

              {/* Profit Margin */}
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.9 }}>Profit Margin</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  ₹{result.profitMargin.toLocaleString()}
                </p>
              </div>

              {/* Total Payable */}
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.9 }}>Total Payable</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  ₹{result.totalPayable.toLocaleString()}
                </p>
              </div>

              {/* EMI Amount */}
              <div style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: '#1a202c'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.8 }}>EMI Amount (Monthly)</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  ₹{result.emiAmount.toLocaleString()}
                </p>
              </div>

              {/* Profit Per Month */}
              <div style={{
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: '#1a202c'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.8 }}>Profit Per Month</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                  ₹{result.profitPerMonth.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Summary Box */}
            <div style={{
              marginTop: '25px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
              borderRadius: '12px',
              border: '1px solid #cbd5e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Gift size={20} style={{ color: '#667eea' }} />
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                  Commission Estimate
                </p>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#667eea' 
              }}>
                ₹{(result.profitMargin * 0.05).toLocaleString()} (5% of profit margin)
              </p>
              <p style={{ 
                margin: '8px 0 0 0', 
                fontSize: '12px', 
                color: '#718096' 
              }}>
                Your estimated commission from this loan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

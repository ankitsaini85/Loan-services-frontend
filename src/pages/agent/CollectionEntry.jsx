import React, { useState } from 'react';
import { recordCollectionEntry } from '../../services/agentService';
import { CreditCard, DollarSign, Calendar, FileText, CheckCircle, AlertCircle, Check } from 'lucide-react';

export default function CollectionEntry() {
  const [collectionData, setCollectionData] = useState({
    loanGroupId: '',
    emiNumber: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'cash',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCollectionData({
      ...collectionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!collectionData.loanGroupId || !collectionData.amountPaid || Number(collectionData.amountPaid) <= 0) {
      setError('Loan group and valid amount are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        loanGroupId: collectionData.loanGroupId,
        emiNumber: collectionData.emiNumber ? Number(collectionData.emiNumber) : null,
        amountPaid: Number(collectionData.amountPaid),
        paymentDate: collectionData.paymentDate,
        paymentMode: collectionData.paymentMode,
        notes: collectionData.notes,
      };

      const { data } = await recordCollectionEntry(payload);
      setMessage('✓ Collection recorded successfully - Payment Marked as Paid');
      setCollectionData({
        loanGroupId: '',
        emiNumber: '',
        amountPaid: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: 'cash',
        notes: '',
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to record collection');
    } finally {
      setLoading(false);
    }
  };

  const paymentModes = [
    { value: 'cash', label: '💵 Cash', color: '#43e97b' },
    { value: 'bank_transfer', label: '🏦 Bank Transfer', color: '#4facfe' },
    { value: 'cheque', label: '📋 Cheque', color: '#667eea' },
    { value: 'upi', label: '📱 UPI', color: '#f5576c' },
  ];

  const getPaymentModeColor = (mode) => {
    const found = paymentModes.find(m => m.value === mode);
    return found ? found.color : '#667eea';
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
          <CreditCard size={36} />
          Collection Entry
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Record EMI collection and mark payments as paid</p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '1px solid #a7f3d0',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#065f46'
        }}>
          <CheckCircle size={20} />
          <div>
            <p style={{ margin: 0, fontWeight: '600' }}>Success!</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{message}</p>
          </div>
        </div>
      )}

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
          <div>
            <p style={{ margin: 0, fontWeight: '600' }}>Error</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Loan Details */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <FileText size={22} style={{ color: '#667eea' }} />
              Loan Information
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px'
                }}>Loan Group ID *</label>
                <input
                  type="text"
                  name="loanGroupId"
                  value={collectionData.loanGroupId}
                  onChange={handleChange}
                  placeholder="Enter group ID (e.g., GRP-001)"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
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

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px'
                }}>EMI Number (Optional)</label>
                <input
                  type="number"
                  name="emiNumber"
                  value={collectionData.emiNumber}
                  onChange={handleChange}
                  placeholder="Which EMI? (1-12)"
                  min="1"
                  max="12"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
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
          </div>

          {/* Section 2: Payment Details */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <DollarSign size={22} style={{ color: '#43e97b' }} />
              Payment Information
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px'
                }}>Amount Paid (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#667eea'
                  }}>₹</span>
                  <input
                    type="number"
                    name="amountPaid"
                    value={collectionData.amountPaid}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 35px',
                      fontSize: '14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#43e97b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(67, 233, 123, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '8px'
                }}>Payment Date *</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={collectionData.paymentDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
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
          </div>

          {/* Section 3: Payment Mode */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <CreditCard size={22} style={{ color: '#f5576c' }} />
              Payment Mode
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '15px'
            }}>
              {paymentModes.map(mode => (
                <label
                  key={mode.value}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '15px',
                    borderRadius: '12px',
                    border: `2px solid ${collectionData.paymentMode === mode.value ? mode.color : '#e2e8f0'}`,
                    background: collectionData.paymentMode === mode.value 
                      ? `${mode.color}15` 
                      : '#fafafa',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    if (collectionData.paymentMode !== mode.value) {
                      e.currentTarget.style.borderColor = mode.color;
                      e.currentTarget.style.background = `${mode.color}08`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (collectionData.paymentMode !== mode.value) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#fafafa';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value={mode.value}
                    checked={collectionData.paymentMode === mode.value}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c'
                  }}>
                    {mode.label}
                  </span>
                  {collectionData.paymentMode === mode.value && (
                    <Check size={16} style={{ marginLeft: 'auto', color: mode.color, fontWeight: 'bold' }} />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Additional Notes */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <FileText size={22} style={{ color: '#4facfe' }} />
              Additional Notes
            </h2>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '8px'
              }}>Notes (Optional)</label>
              <textarea
                name="notes"
                value={collectionData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about this collection (e.g., Partial payment, follow-up required, etc.)"
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
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
            <Check size={20} />
            {loading ? 'Recording Collection...' : 'Mark Payment as Paid'}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        borderRadius: '12px',
        border: '1px solid #cbd5e0'
      }}>
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: '#1a202c',
          lineHeight: '1.6'
        }}>
          <strong>💡 How to use:</strong> Enter the loan group ID where you collected the EMI payment, select payment mode, and click "Mark Payment as Paid" to record the transaction. This will update the collection records and mark the payment as completed.
        </p>
      </div>
    </div>
  );
}

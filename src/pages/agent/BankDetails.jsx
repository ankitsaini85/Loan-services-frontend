import React, { useState, useEffect } from 'react';
import { CreditCard, Save, Edit2, CheckCircle, AlertCircle } from 'lucide-react';

export default function BankDetails() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    bankDetailsAdded: false
  });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/agent/bank-details', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bank details');
      }

      const data = await response.json();
      setBankDetails({
        bankName: data.bankName || '',
        accountNumber: data.accountNumber || '',
        ifscCode: data.ifscCode || '',
        upiId: data.upiId || '',
        bankDetailsAdded: data.bankDetailsAdded || false
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
      setError('Bank Name, Account Number, and IFSC Code are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/agent/bank-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bankName: bankDetails.bankName,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          upiId: bankDetails.upiId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update bank details');
      }

      const data = await response.json();
      setBankDetails({
        ...bankDetails,
        bankDetailsAdded: true
      });
      setSuccess(bankDetails.bankDetailsAdded ? 'Bank details updated successfully!' : 'Bank details added successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setBankDetails({
      ...bankDetails,
      [e.target.name]: e.target.value
    });
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
          <p style={{ fontSize: '16px', color: '#718096' }}>Loading bank details...</p>
        </div>
      </div>
    );
  }

  const canEdit = !bankDetails.bankDetailsAdded || isEditing;

  return (
    <div className="content-section" style={{ padding: '0' }}>
      {/* Header */}
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
          Bank Details
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Manage your bank account information for commission payments</p>
      </div>

      {error && (
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#991b1b',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#d1fae5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          color: '#065f46',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Bank Details Form */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      }}>
        {bankDetails.bankDetailsAdded && !isEditing && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            padding: '15px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0369a1' }}>
              <CheckCircle size={20} />
              <span style={{ fontWeight: '600' }}>Bank details already added</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Edit2 size={16} />
              Edit Details
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                Bank Name <span style={{ color: '#e53e3e' }}>*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={bankDetails.bankName}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="Enter bank name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: !canEdit ? '#f7fafc' : 'white'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                Account Number <span style={{ color: '#e53e3e' }}>*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="Enter account number"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: !canEdit ? '#f7fafc' : 'white'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                IFSC Code <span style={{ color: '#e53e3e' }}>*</span>
              </label>
              <input
                type="text"
                name="ifscCode"
                value={bankDetails.ifscCode}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="Enter IFSC code"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                  backgroundColor: !canEdit ? '#f7fafc' : 'white'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                UPI ID (Optional)
              </label>
              <input
                type="text"
                name="upiId"
                value={bankDetails.upiId}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="yourname@upi"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: !canEdit ? '#f7fafc' : 'white'
                }}
              />
            </div>
          </div>

          {canEdit && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  background: saving ? '#cbd5e0' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Save size={18} />
                {saving ? 'Saving...' : (bankDetails.bankDetailsAdded ? 'Update Details' : 'Add Details')}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchBankDetails();
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#f7fafc',
                    color: '#1a202c',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Info Card */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '16px', 
          fontWeight: '700', 
          color: '#92400e' 
        }}>
          Important Information
        </h3>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px', 
          color: '#92400e',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li>Bank details are required for commission payments</li>
          <li>Once added, you can update your details anytime by clicking "Edit Details"</li>
          <li>UPI ID is optional but recommended for faster payments</li>
          <li>Ensure all details are accurate to avoid payment delays</li>
        </ul>
      </div>
    </div>
  );
}

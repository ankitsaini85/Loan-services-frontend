import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, Clock, XCircle, Download, ArrowRight } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function PayoutManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, paid
  const [payouts, setPayouts] = useState([]);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalForm, setApprovalForm] = useState({
    approvedAmount: '',
    remarks: ''
  });
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [markPaidForm, setMarkPaidForm] = useState({
    transferMode: 'bank_transfer',
    remarks: ''
  });

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getPendingPayouts();
      setPayouts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load payouts');
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPayout || !approvalForm.approvedAmount) {
      setError('Please enter an approved amount');
      return;
    }

    try {
      await adminService.approveMonthlyPayout(selectedPayout._id, {
        approvedAmount: Number(approvalForm.approvedAmount),
        remarks: approvalForm.remarks
      });
      setShowApprovalModal(false);
      setApprovalForm({ approvedAmount: '', remarks: '' });
      setSelectedPayout(null);
      await fetchPayouts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to approve payout');
    }
  };

  const handleMarkPaid = async () => {
    if (!selectedPayout) return;

    try {
      await adminService.markPayoutAsPaid(selectedPayout._id, {
        transferMode: markPaidForm.transferMode,
        remarks: markPaidForm.remarks
      });
      setShowMarkPaidModal(false);
      setMarkPaidForm({ transferMode: 'bank_transfer', remarks: '' });
      setSelectedPayout(null);
      await fetchPayouts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark payout as paid');
    }
  };

  const handleReject = async () => {
    if (!selectedPayout) return;

    try {
      await adminService.rejectPayout(selectedPayout._id, {
        remarks: 'Rejected by admin'
      });
      setSelectedPayout(null);
      await fetchPayouts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reject payout');
    }
  };

  const filterPayouts = (tab) => {
    return payouts.filter(p => p.status === tab || (tab === 'pending' && p.status === 'pending_admin_approval'));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending_admin_approval: { bg: '#fef3c7', color: '#92400e', label: 'Pending Approval', icon: Clock },
      approved: { bg: '#dbeafe', color: '#0c4a6e', label: 'Approved', icon: CheckCircle },
      paid: { bg: '#d1fae5', color: '#065f46', label: 'Paid', icon: CheckCircle },
      rejected: { bg: '#fee2e2', color: '#7f1d1d', label: 'Rejected', icon: XCircle }
    };
    const stat = statusMap[status] || statusMap.pending_admin_approval;
    const Icon = stat.icon;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Icon size={14} />
        <span>{stat.label}</span>
      </div>
    );
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
          <p style={{ fontSize: '16px', color: '#718096' }}>Loading payouts...</p>
        </div>
      </div>
    );
  }

  const currentPayouts = filterPayouts(activeTab);

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
          <DollarSign size={36} />
          Payout Management
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Review and process investor monthly payouts</p>
      </div>

      {error && (
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        borderBottom: '2px solid #e2e8f0'
      }}>
        {['pending', 'approved', 'paid'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: activeTab === tab ? '#667eea' : '#718096',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {tab === 'pending' ? `Pending (${filterPayouts('pending').length})` : 
             tab === 'approved' ? `Approved (${filterPayouts('approved').length})` :
             `Paid (${filterPayouts('paid').length})`}
          </button>
        ))}
      </div>

      {/* Payouts List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {currentPayouts.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '40px',
            textAlign: 'center',
            background: '#f7fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e0'
          }}>
            <p style={{ margin: 0, color: '#718096', fontSize: '16px' }}>
              No {activeTab} payouts
            </p>
          </div>
        ) : (
          currentPayouts.map(payout => (
            <div
              key={payout._id}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => setSelectedPayout(payout)}
            >
              {/* Investor Info */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#718096' }}>Investor</p>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>
                  {payout.investorId?.name}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#718096' }}>
                  {payout.investorId?.email}
                </p>
              </div>

              {/* Month Info */}
              <div style={{
                background: '#f7fafc',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#718096' }}>Month Period</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                  {new Date(payout.monthStartDate).toLocaleDateString('en-IN')} - {new Date(payout.monthEndDate).toLocaleDateString('en-IN')}
                </p>
              </div>

              {/* Amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#718096' }}>Calculated Amount</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#667eea' }}>
                    ₹{payout.calculatedAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                {payout.approvedAmount && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#718096' }}>Approved</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                      ₹{payout.approvedAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: '#f7fafc',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1a202c',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {getStatusBadge(payout.status)}
              </div>

              {/* Actions */}
              {selectedPayout?._id === payout._id && (
                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column'
                }}>
                  {payout.status === 'pending_admin_approval' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setApprovalForm({
                            approvedAmount: payout.calculatedAmount.toString(),
                            remarks: ''
                          });
                          setShowApprovalModal(true);
                        }}
                        style={{
                          padding: '10px 15px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10b981'}
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject();
                        }}
                        style={{
                          padding: '10px 15px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {payout.status === 'approved' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMarkPaidModal(true);
                      }}
                      style={{
                        padding: '10px 15px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
                      onMouseLeave={(e) => e.target.style.background = '#667eea'}
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>
              Approve Payout
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                Approved Amount (₹)
              </label>
              <input
                type="number"
                value={approvalForm.approvedAmount}
                onChange={(e) => setApprovalForm({ ...approvalForm, approvedAmount: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                Remarks (Optional)
              </label>
              <textarea
                value={approvalForm.remarks}
                onChange={(e) => setApprovalForm({ ...approvalForm, remarks: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowApprovalModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f7fafc',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Paid Modal */}
      {showMarkPaidModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>
              Mark Payout as Paid
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                Transfer Mode
              </label>
              <select
                value={markPaidForm.transferMode}
                onChange={(e) => setMarkPaidForm({ ...markPaidForm, transferMode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="neft">NEFT</option>
                <option value="rtgs">RTGS</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                Remarks (Optional)
              </label>
              <textarea
                value={markPaidForm.remarks}
                onChange={(e) => setMarkPaidForm({ ...markPaidForm, remarks: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowMarkPaidModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f7fafc',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleMarkPaid}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

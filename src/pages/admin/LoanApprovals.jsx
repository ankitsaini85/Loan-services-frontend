import React, { useEffect, useState } from 'react';
import { Check, X, Loader2, Shield, ClipboardList, DollarSign, Users } from 'lucide-react';
import { getPendingLoans, approveLoan, rejectLoan } from '../../services/adminService';

export default function LoanApprovals() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPendingLoans();
      setLoans(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load pending loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (loanId, groupName) => {
    setActionLoading(loanId);
    setMessage(null);
    setError(null);
    try {
      await approveLoan(loanId);
      setMessage(`✓ ${groupName} approved successfully`);
      setLoans(loans.filter(l => l.id !== loanId));
    } catch (err) {
      setError(err?.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (loanId, groupName) => {
    setActionLoading(loanId);
    setMessage(null);
    setError(null);
    try {
      const reason = prompt(`Reason for rejecting ${groupName}:`, '');
      if (!reason) return;

      await rejectLoan(loanId, reason);
      setMessage(`✗ ${groupName} rejected`);
      setLoans(loans.filter(l => l.id !== loanId));
    } catch (err) {
      setError(err?.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const totalAmount = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const totalMembers = loans.reduce((sum, loan) => sum + (loan.members || 0), 0);

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '34px',
        borderRadius: '16px',
        marginBottom: '22px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={30} /> Loan Approvals
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Verify documents, approve qualified groups, and keep risk under control.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            Pending: {loans.length}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        padding: '0 4px',
        marginBottom: '18px'
      }}>
        {[{
          label: 'Pending Groups',
          value: loans.length,
          icon: <ClipboardList size={24} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          label: 'Total Amount',
          value: `₹${totalAmount.toLocaleString('en-IN')}`,
          icon: <DollarSign size={24} />, 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }, {
          label: 'Applicants',
          value: totalMembers,
          icon: <Users size={24} />, 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }].map((card, idx) => (
          <div key={idx} style={{
            background: card.gradient,
            padding: '18px',
            borderRadius: '14px',
            color: 'white',
            boxShadow: '0 10px 22px rgba(0,0,0,0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 14px 28px rgba(0,0,0,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.14)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, opacity: 0.9 }}>{card.label}</p>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {card.icon}
              </div>
            </div>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>{card.value}</h3>
          </div>
        ))}
      </div>

      {message && (
        <div style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '14px',
          borderRadius: '12px',
          margin: '0 4px 14px 4px'
        }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '14px',
          borderRadius: '12px',
          margin: '0 4px 14px 4px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-row"><Loader2 className="spin" size={20} /> Loading pending loans...</div>
      ) : loans.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          No pending loans for approval
        </div>
      ) : (
        <div className="table-container" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Agent</th>
                <th>Amount</th>
                <th>Members</th>
                <th>KYC</th>
                <th>Stamp Paper</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
              <tr key={loan.id}>
                  <td style={{ fontWeight: 700 }}>{loan.groupName}</td>
                  <td>{loan.agent}</td>
                  <td>₹{loan.amount.toLocaleString('en-IN')}</td>
                  <td>{loan.members}</td>
                  <td><span style={{ color: loan.kycVerified ? '#047857' : '#b91c1c', fontWeight: 700 }}>{loan.kycVerified ? '✓' : '✗'}</span></td>
                  <td><span style={{ color: loan.stampVerified ? '#047857' : '#b91c1c', fontWeight: 700 }}>{loan.stampVerified ? '✓' : '✗'}</span></td>
                  <td><span className="status-badge status-pending">{loan.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(loan.id, loan.groupName)}
                        disabled={actionLoading === loan.id}
                        title={!loan.stampVerified ? 'Stamp paper required to approve' : ''}
                      >
                        {actionLoading === loan.id ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
                        {actionLoading === loan.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(loan.id, loan.groupName)}
                        disabled={actionLoading === loan.id}
                      >
                        {actionLoading === loan.id ? <Loader2 className="spin" size={18} /> : <X size={18} />}
                        {actionLoading === loan.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Check, X, Users, Shield, TrendingUp, BarChart3, RefreshCw, Send, Activity } from 'lucide-react';
import { getAgents, updateAgentStatus, backfillLoansProcessed, backfillCommissions, getAllAgentCommissions, payCommission, cleanupDuplicateCommissions } from '../../services/adminService';

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backfillLoading, setBackfillLoading] = useState(false);
  const [backfillMessage, setBackfillMessage] = useState('');
  const [activeTab, setActiveTab] = useState('approvals');
  const [commissions, setCommissions] = useState([]);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ agentId: '', amount: '', transactionId: '' });
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAgents();
      let agentsData = response.data || [];
      
      // Get commissions to calculate correct totals
      const commissionsResponse = await getAllAgentCommissions();
      const commissionsMap = {};
      if (commissionsResponse?.data) {
        commissionsResponse.data.forEach(agent => {
          commissionsMap[agent.agentId] = agent.totalEarned;
        });
      }
      
      // Update agents with correct commission from database
      agentsData = agentsData.map(agent => ({
        ...agent,
        totalCommissionEarned: commissionsMap[agent._id] || 0
      }));
      
      setAgents(agentsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (agentId, status) => {
    try {
      setError('');
      await updateAgentStatus(agentId, status);
      await loadAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update agent');
    }
  };

  const handleBackfillCommissions = async () => {
    try {
      setBackfillLoading(true);
      setBackfillMessage('');
      const response = await backfillCommissions();
      if (response?.data?.success) {
        setBackfillMessage(`✓ Created ${response.data.created} commissions, Skipped ${response.data.skipped}`);
        setTimeout(() => setBackfillMessage(''), 4000);
      }
    } catch (err) {
      setBackfillMessage(`✗ Error: ${err.response?.data?.message || 'Failed to backfill commissions'}`);
      setTimeout(() => setBackfillMessage(''), 4000);
    } finally {
      setBackfillLoading(false);
    }
  };

  const handleBackfillLoansProcessed = async () => {
    try {
      setBackfillLoading(true);
      setBackfillMessage('');
      const response = await backfillLoansProcessed();
      if (response?.data?.success) {
        setBackfillMessage(`✓ Updated loans processed for ${response.data.updated} agents`);
        await loadAgents();
        setTimeout(() => setBackfillMessage(''), 4000);
      }
    } catch (err) {
      setBackfillMessage(`✗ Error: ${err.response?.data?.message || 'Failed to backfill loans'}`);
      setTimeout(() => setBackfillMessage(''), 4000);
    } finally {
      setBackfillLoading(false);
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      setBackfillLoading(true);
      setBackfillMessage('');
      const response = await cleanupDuplicateCommissions();
      if (response?.data?.success) {
        setBackfillMessage(`✓ Removed ${response.data.removedDuplicates} duplicate commission records`);
        await loadCommissions();
        setTimeout(() => setBackfillMessage(''), 4000);
      }
    } catch (err) {
      setBackfillMessage(`✗ Error: ${err.response?.data?.message || 'Failed to cleanup duplicates'}`);
      setTimeout(() => setBackfillMessage(''), 4000);
    } finally {
      setBackfillLoading(false);
    }
  };

  const loadCommissions = async () => {
    try {
      setCommissionLoading(true);
      const response = await getAllAgentCommissions();
      console.log('Commission data loaded:', response.data);
      setCommissions(response.data || []);
    } catch (err) {
      setPaymentMessage(`Error loading commissions: ${err.response?.data?.message || 'Failed'}`);
    } finally {
      setCommissionLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentMessage('');

    if (!paymentForm.agentId || !paymentForm.amount || paymentForm.amount <= 0) {
      setPaymentMessage('Please select agent and enter valid amount');
      return;
    }

    try {
      const response = await payCommission(paymentForm.agentId, Number(paymentForm.amount), paymentForm.transactionId);
      if (response?.data?.success) {
        setPaymentMessage(`✓ Commission paid: ₹${paymentForm.amount} to agent`);
        setPaymentForm({ agentId: '', amount: '', transactionId: '' });
        await loadCommissions();
        setTimeout(() => setPaymentMessage(''), 4000);
      }
    } catch (err) {
      setPaymentMessage(`✗ Error: ${err.response?.data?.message || 'Payment failed'}`);
    }
  };

  useEffect(() => {
    if (activeTab === 'commission') {
      loadCommissions();
    }
  }, [activeTab]);

  const pendingCount = agents.filter(a => a.status === 'pending').length;
  const approvedCount = agents.filter(a => a.status === 'approved').length;
  const totalCommission = agents.reduce((sum, a) => sum + (a.totalCommissionEarned || 0), 0);

  return (
    <div className="content-section" style={{ padding: 0 }}>
      {/* Backfill Commissions Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '16px 18px',
        borderRadius: '14px',
        marginBottom: '22px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 22px rgba(240, 147, 251, 0.28)'
      }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>🎯 Generate Commissions for Existing Groups</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Create commission records for previously approved loan groups</p>
          {backfillMessage && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontWeight: 600, color: backfillMessage.includes('✓') ? '#a7f3d0' : '#fecaca' }}>
              {backfillMessage}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleBackfillLoansProcessed}
            disabled={backfillLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: backfillLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              opacity: backfillLoading ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => !backfillLoading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => !backfillLoading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            title="Update loans processed count for existing groups"
          >
            <RefreshCw size={14} style={{ animation: backfillLoading ? 'spin 1s linear infinite' : 'none' }} />
            Loans
          </button>
          <button
            onClick={handleBackfillCommissions}
            disabled={backfillLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: backfillLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              opacity: backfillLoading ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => !backfillLoading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => !backfillLoading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            title="Generate commission for existing groups"
          >
            <RefreshCw size={14} style={{ animation: backfillLoading ? 'spin 1s linear infinite' : 'none' }} />
            Commissions
          </button>
          <button
            onClick={handleCleanupDuplicates}
            disabled={backfillLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: backfillLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              opacity: backfillLoading ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => !backfillLoading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => !backfillLoading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            title="Remove duplicate commission records"
          >
            <RefreshCw size={14} style={{ animation: backfillLoading ? 'spin 1s linear infinite' : 'none' }} />
            Cleanup
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        padding: '34px',
        borderRadius: '16px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(79, 172, 254, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={30} /> Agent Management
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>Approve new agents, configure commissions, and track performance.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            Pending Approvals: {pendingCount}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        padding: '0 4px',
        marginBottom: '22px'
      }}>
        {[{
          title: 'Active Agents',
          value: approvedCount,
          icon: <Shield size={24} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          title: 'Pending Approvals',
          value: pendingCount,
          icon: <Check size={24} />, 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }, {
          title: 'Loans Processed',
          value: agents.reduce((sum, a) => sum + (a.totalLoansProcessed || 0), 0),
          icon: <BarChart3 size={24} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }, {
          title: 'Commission Pool',
          value: `₹${totalCommission.toLocaleString('en-IN')}`,
          icon: <TrendingUp size={24} />, 
          gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
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
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, opacity: 0.9 }}>{card.title}</p>
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

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        padding: '0 4px',
        marginBottom: '18px'
      }}>
        {["New Approvals", "Commission Setup", "Performance Analysis", "Bank Details"].map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx === 0 ? 'approvals' : idx === 1 ? 'commission' : idx === 2 ? 'performance' : 'bank')} style={{
            border: 'none',
            background: (idx === 0 ? activeTab === 'approvals' : idx === 1 ? activeTab === 'commission' : idx === 2 ? activeTab === 'performance' : activeTab === 'bank') ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : '#f3f4f6',
            color: (idx === 0 ? activeTab === 'approvals' : idx === 1 ? activeTab === 'commission' : idx === 2 ? activeTab === 'performance' : activeTab === 'bank') ? 'white' : '#374151',
            padding: '12px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: (idx === 0 ? activeTab === 'approvals' : idx === 1 ? activeTab === 'commission' : idx === 2 ? activeTab === 'performance' : activeTab === 'bank') ? '0 10px 20px rgba(79,172,254,0.22)' : 'none'
          }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
      }}>
        {activeTab === 'approvals' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>New Approvals</h2>
              <span style={{ background: '#eef2ff', color: '#4338ca', padding: '6px 10px', borderRadius: '10px', fontWeight: 700 }}>Review & Assign</span>
            </div>
            {error && <div className="error-message" style={{ marginBottom: '12px' }}>{error}</div>}
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Loans Processed</th>
                    <th>Commission Earned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '18px' }}>Loading agents...</td>
                    </tr>
                  )}
                  {!loading && agents.map(agent => (
                    <tr key={agent._id}>
                      <td style={{ fontWeight: 700 }}>{agent.name}</td>
                      <td>{agent.email}</td>
                      <td>{agent.phone || '-'}</td>
                      <td><span className={`status-badge status-${agent.status}`}>{agent.status}</span></td>
                      <td>{agent.totalLoansProcessed || 0}</td>
                      <td>₹{(agent.totalCommissionEarned || 0).toLocaleString('en-IN')}</td>
                      <td>
                        {agent.status === 'pending' && (
                          <div className="action-buttons">
                            <button className="btn-approve" onClick={() => handleStatusChange(agent._id, 'approved')}><Check size={18} /> Approve</button>
                            <button className="btn-reject" onClick={() => handleStatusChange(agent._id, 'rejected')}><X size={18} /> Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'commission' && (
          <>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Commission Setup</h2>
            
            {paymentMessage && (
              <div className={paymentMessage.includes('✓') ? 'success-message' : 'error-message'} style={{ marginBottom: '16px' }}>
                {paymentMessage}
              </div>
            )}

            {/* Payment Form */}
            <div style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              padding: '18px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>Record Commission Payment</h3>
              <form onSubmit={handlePaymentSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <select
                  name="agentId"
                  value={paymentForm.agentId}
                  onChange={handlePaymentChange}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                  required
                >
                  <option value="">Select Agent</option>
                  {commissions.map(comm => (
                    <option key={comm.agentId} value={comm.agentId}>
                      {comm.agentName} (Remaining: ₹{comm.remaining.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="amount"
                  value={paymentForm.amount}
                  onChange={handlePaymentChange}
                  placeholder="Amount to pay"
                  min="1"
                  step="0.01"
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                  required
                />

                <input
                  type="text"
                  name="transactionId"
                  value={paymentForm.transactionId}
                  onChange={handlePaymentChange}
                  placeholder="Transaction ID (optional)"
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Send size={16} /> Pay Commission
                </button>
              </form>
            </div>

            {/* Commission List */}
            {commissionLoading ? (
              <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading commissions...</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px'
              }}>
                {commissions.map(commission => (
                  <div key={commission.agentId} style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
                      {commission.agentName}
                    </h4>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280' }}>📧 {commission.agentEmail}</p>
                    
                    <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '600' }}>Total Earned:</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>₹{commission.totalEarned.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '600' }}>Total Paid:</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6' }}>₹{commission.totalPaid.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: commission.remaining > 0 ? '#fef3c7' : '#d1fae5', padding: '8px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '600' }}>Remaining:</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: commission.remaining > 0 ? '#d97706' : '#059669' }}>
                          ₹{commission.remaining.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'performance' && (
          <>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Performance Analysis</h2>
            
            {/* Performance Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {agents.map(agent => {
                const performanceScore = agent.totalLoansProcessed > 0 
                  ? ((agent.totalCommissionEarned / (agent.totalLoansProcessed * 5000)) * 100).toFixed(0)
                  : 0;
                
                return (
                  <div key={agent._id} style={{
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    borderRadius: '14px',
                    padding: '18px',
                    color: '#1f2937',
                    boxShadow: '0 8px 18px rgba(252,182,159,0.22)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 14px 28px rgba(252,182,159,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(252,182,159,0.22)';
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800' }}>{agent.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{agent.email}</p>
                      </div>
                      <Activity size={20} style={{ opacity: 0.6 }} />
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(31,41,55,0.15)', paddingTop: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ opacity: 0.7 }}>Loans Processed</span>
                        <span style={{ fontWeight: '700' }}>{agent.totalLoansProcessed || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ opacity: 0.7 }}>Commission Earned</span>
                        <span style={{ fontWeight: '700' }}>₹{(agent.totalCommissionEarned || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ opacity: 0.7 }}>Avg/Loan</span>
                        <span style={{ fontWeight: '700' }}>₹{agent.totalLoansProcessed > 0 ? Math.round((agent.totalCommissionEarned || 0) / agent.totalLoansProcessed).toLocaleString('en-IN') : 0}</span>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(31,41,55,0.08)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>Performance Score</span>
                      <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{performanceScore}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Ranking Table */}
            <div style={{
              background: 'white',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>Agent Rankings</h3>
              <div className="table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Agent Name</th>
                      <th>Status</th>
                      <th>Loans</th>
                      <th>Avg Commission</th>
                      <th>Total Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '18px' }}>No agents found</td>
                      </tr>
                    )}
                    {agents
                      .sort((a, b) => (b.totalCommissionEarned || 0) - (a.totalCommissionEarned || 0))
                      .map((agent, idx) => (
                      <tr key={agent._id}>
                        <td style={{ fontWeight: '700', fontSize: '15px' }}>
                          <span style={{
                            background: idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : idx === 2 ? '#f97316' : '#e5e7eb',
                            color: idx < 3 ? 'white' : '#4b5563',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '700'
                          }}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700' }}>{agent.name}</td>
                        <td><span className={`status-badge status-${agent.status}`}>{agent.status}</span></td>
                        <td style={{ fontWeight: '600' }}>{agent.totalLoansProcessed || 0}</td>
                        <td style={{ fontWeight: '600', color: '#10b981' }}>₹{agent.totalLoansProcessed > 0 ? Math.round((agent.totalCommissionEarned || 0) / agent.totalLoansProcessed).toLocaleString('en-IN') : 0}</td>
                        <td style={{ fontWeight: '700', color: '#3b82f6' }}>₹{(agent.totalCommissionEarned || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'bank' && (
          <>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Agent Bank Details</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {agents.filter(agent => agent.bankDetailsAdded).length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                  No agents have added their bank details yet.
                </p>
              ) : (
                agents.filter(agent => agent.bankDetailsAdded).map(agent => (
                  <div key={agent._id} style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '14px',
                    padding: '20px',
                    color: 'white',
                    boxShadow: '0 8px 18px rgba(102,126,234,0.25)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 14px 28px rgba(102,126,234,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 18px rgba(102,126,234,0.25)';
                  }}>
                    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '800' }}>{agent.name}</h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.85 }}>📧 {agent.email}</p>
                      {agent.phone && <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.85 }}>📱 {agent.phone}</p>}
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      padding: '14px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Name</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{agent.bankName || 'Not provided'}</p>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Number</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', fontFamily: 'monospace' }}>{agent.accountNumber || 'Not provided'}</p>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px' }}>IFSC Code</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', fontFamily: 'monospace' }}>{agent.ifscCode || 'Not provided'}</p>
                      </div>

                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px' }}>UPI ID</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{agent.upiId || 'Not provided'}</p>
                      </div>
                    </div>

                    {agent.bankDetailsUpdatedAt && (
                      <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>
                        Last updated: {new Date(agent.bankDetailsUpdatedAt).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

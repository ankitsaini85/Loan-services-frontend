import React, { useEffect, useState } from 'react';
import { getInvestorFunds, getInvestorPayouts, approveInvestor } from '../../services/adminService';
import { Loader2, Users, Wallet, ArrowDownCircle, BarChart3, CheckCircle } from 'lucide-react';

export default function InvestorManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [investors, setInvestors] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amountInputs, setAmountInputs] = useState({});
  const [rateInputs, setRateInputs] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'all' || tab === 'funds' || tab === 'pending') {
        const { data } = await getInvestorFunds();
        setInvestors(data || []);
      }
      if (tab === 'payouts') {
        const { data } = await getInvestorPayouts();
        setPayouts(data || []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load investor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const activeInvestors = investors.filter(inv => inv.status === 'active');
  const totalInvested = activeInvestors.reduce((sum, inv) => sum + (inv.totalInvested || 0), 0);
  const totalActive = activeInvestors.reduce((sum, inv) => sum + (inv.activeInvestmentValue || 0), 0);
  const totalInterest = activeInvestors.reduce((sum, inv) => sum + (inv.totalInterestEarned || 0), 0);
  const totalInvestors = investors.length;
  const pendingInvestors = investors.filter(inv => inv.status === 'pending');

  const handleApprove = async (investorId) => {
    const investedAmount = amountInputs[investorId];
    const rate = rateInputs[investorId];

    if (!investedAmount || Number(investedAmount) <= 0) {
      setError('Please enter a valid invested amount before approving.');
      return;
    }

    try {
      setActionLoadingId(investorId);
      await approveInvestor(investorId, Number(investedAmount), rate ? Number(rate) : undefined);
      await loadData(activeTab);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to approve investor');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="content-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '320px' }}>
        <Loader2 className="spin" size={26} />
      </div>
    );
  }

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '22px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(102, 126, 234, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={30} /> Investor Management
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>Oversee investor portfolios, fund status, and payout history.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            Total Investors: {totalInvestors}
          </div>
        </div>
      </div>

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

      {/* Summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        padding: '0 4px',
        marginBottom: '18px'
      }}>
        {[{
          title: 'Total Invested',
          value: `₹${totalInvested.toLocaleString('en-IN')}`,
          icon: <Wallet size={24} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          title: 'Active Value',
          value: `₹${totalActive.toLocaleString('en-IN')}`,
          icon: <BarChart3 size={24} />, 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }, {
          title: 'Interest Earned',
          value: `₹${totalInterest.toLocaleString('en-IN')}`,
          icon: <ArrowDownCircle size={24} />, 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }, {
          title: 'Investor Count',
          value: totalInvestors,
          icon: <Users size={24} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        padding: '0 4px',
        marginBottom: '16px'
      }}>
        {[{ key: 'all', label: 'All Investors' }, { key: 'funds', label: 'Fund Status' }, { key: 'pending', label: 'Pending Approvals' }, { key: 'payouts', label: 'Payout History' }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              border: 'none',
              background: activeTab === tab.key ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : '#f3f4f6',
              color: activeTab === tab.key ? 'white' : '#374151',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 10px 20px rgba(79,172,254,0.22)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Investors table */}
      {(activeTab === 'all' || activeTab === 'funds') && (
        <div className="table-container" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Total Invested</th>
                <th>Available Funds</th>
                <th>Active Value</th>
                <th>Interest Earned</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {investors.length > 0 ? investors.map(investor => (
                <tr key={investor.id}>
                  <td style={{ fontWeight: 700 }}>{investor.name}</td>
                  <td>{investor.email}</td>
                  <td>₹{(investor.totalInvested || 0).toLocaleString('en-IN')}</td>
                  <td>₹{(investor.availableFunds || 0).toLocaleString('en-IN')}</td>
                  <td>₹{(investor.activeInvestmentValue || 0).toLocaleString('en-IN')}</td>
                  <td>₹{(investor.totalInterestEarned || 0).toLocaleString('en-IN')}</td>
                  <td>{investor.interestRate}%</td>
                  <td><span className={`status-badge status-${investor.status}`}>{investor.status}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No investors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pending approvals */}
      {activeTab === 'pending' && (
        <div className="table-container" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Invested Amount (₹)</th>
                <th>Interest Rate (%)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingInvestors.length > 0 ? pendingInvestors.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 700 }}>{inv.name}</td>
                  <td>{inv.email}</td>
                  <td>{inv.phone || '-'}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={amountInputs[inv.id] || ''}
                      onChange={(e) => setAmountInputs(prev => ({ ...prev, [inv.id]: e.target.value }))}
                      placeholder="Enter amount"
                      style={{ width: '140px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rateInputs[inv.id] || ''}
                      onChange={(e) => setRateInputs(prev => ({ ...prev, [inv.id]: e.target.value }))}
                      placeholder={inv.interestRate ? `${inv.interestRate}%` : 'Default'}
                      style={{ width: '120px' }}
                    />
                  </td>
                  <td>
                    <button
                      className="submit-btn"
                      style={{ padding: '8px 12px', minWidth: '140px' }}
                      onClick={() => handleApprove(inv.id)}
                      disabled={actionLoadingId === inv.id}
                    >
                      {actionLoadingId === inv.id ? 'Approving...' : 'Approve Investor'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No pending investors</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Payouts table */}
      {activeTab === 'payouts' && (
        <div className="table-container" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Investor</th>
                <th>Email</th>
                <th>Month Period</th>
                <th>Calculated Amount</th>
                <th>Approved Amount</th>
                <th>Paid Amount</th>
                <th>Transfer Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length > 0 ? payouts.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{item.investorName}</td>
                  <td>{item.email}</td>
                  <td style={{ fontSize: '12px' }}>{item.monthPeriod}</td>
                  <td>₹{(item.calculatedAmount || 0).toLocaleString('en-IN')}</td>
                  <td>₹{(item.approvedAmount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>₹{(item.paidAmount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ textTransform: 'capitalize' }}>{item.mode?.replace(/_/g, ' ') || '-'}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString('en-IN') : '-'}</td>
                  <td>
                    <span className={`status-badge status-${item.payoutStatus}`}>
                      {item.payoutStatus?.replace(/_/g, ' ') || 'pending'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No payouts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

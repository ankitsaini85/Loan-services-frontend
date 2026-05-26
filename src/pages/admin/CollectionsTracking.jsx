import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, Shield, BarChart3, Activity } from 'lucide-react';
import { getLatePayments, getDefaultAnalysis, getLowRecoveryAlerts } from '../../services/adminService';

export default function CollectionsTracking() {
  const [activeTab, setActiveTab] = useState('late');
  const [loading, setLoading] = useState(false);
  const [latePayments, setLatePayments] = useState([]);
  const [defaultAnalysis, setDefaultAnalysis] = useState({ defaults: [], atRisk: [] });
  const [lowRecovery, setLowRecovery] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'late') {
        const { data } = await getLatePayments();
        setLatePayments(data || []);
      }
      if (tab === 'default') {
        const { data } = await getDefaultAnalysis();
        setDefaultAnalysis(data || { defaults: [], atRisk: [] });
      }
      if (tab === 'recovery') {
        const { data } = await getLowRecoveryAlerts();
        setLowRecovery(data || []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const totalLate = latePayments.length;
  const totalDefaults = defaultAnalysis?.defaults?.length || 0;
  const totalAtRisk = defaultAnalysis?.atRisk?.length || 0;
  const totalLowRecovery = lowRecovery.length;

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #3b82f6 100%)',
        padding: '34px',
        borderRadius: '16px',
        marginBottom: '22px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(17, 24, 39, 0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={30} /> Collections & NPA Tracking
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Monitor late payments, defaults, and low recovery clusters.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            Alerts Active: {totalLate + totalDefaults + totalLowRecovery}
          </div>
        </div>
      </div>

      {/* Stat Chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        padding: '0 4px',
        marginBottom: '16px'
      }}>
        {[{
          label: 'Late Payments',
          value: totalLate,
          gradient: 'linear-gradient(135deg, #f97316 0%, #fb7185 100%)'
        }, {
          label: 'Defaults',
          value: totalDefaults,
          gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
        }, {
          label: 'At Risk',
          value: totalAtRisk,
          gradient: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)'
        }, {
          label: 'Low Recovery',
          value: totalLowRecovery,
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }].map((chip, idx) => (
          <div key={idx} style={{
            background: chip.gradient,
            padding: '14px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 10px 20px rgba(0,0,0,0.14)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: '800'
          }}>
            <span style={{ fontSize: '13px' }}>{chip.label}</span>
            <span style={{ fontSize: '20px' }}>{chip.value}</span>
          </div>
        ))}
      </div>

      <div className="section-tabs" style={{ margin: '0 4px 14px 4px' }}>
        {['late', 'default', 'recovery'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' : '#f3f4f6',
              color: activeTab === tab ? 'white' : '#374151',
              fontWeight: 700
            }}
          >
            {tab === 'late' && 'Late Payments'}
            {tab === 'default' && 'Default Analysis'}
            {tab === 'recovery' && 'Low Recovery Alerts'}
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <div className="loading-row"><Loader2 className="spin" size={20} /> Loading...</div>
      ) : (
        <div className="table-container" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
          {activeTab === 'late' && (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Agent</th>
                  <th>Due Date</th>
                  <th>EMI Amount</th>
                  <th>Status</th>
                  <th>Overdue (days)</th>
                </tr>
              </thead>
              <tbody>
                {latePayments.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700 }}>{item.groupName}</td>
                    <td>{item.agent}</td>
                    <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
                    <td>₹{item.emiAmount?.toLocaleString('en-IN')}</td>
                    <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
                    <td className="highlight-red" style={{ fontWeight: 700 }}>{item.overdueDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'default' && (
            <div className="dual-tables">
              <div className="table-container" style={{ background: 'white', boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} style={{ color: '#ef4444' }} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111827' }}>Defaults</h3>
                </div>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Group</th>
                      <th>Agent</th>
                      <th>Remaining</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultAnalysis.defaults.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 700 }}>{item.groupName}</td>
                        <td>{item.agent}</td>
                        <td>₹{item.remainingBalance?.toLocaleString('en-IN')}</td>
                        <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-container" style={{ background: 'white', boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Activity size={18} style={{ color: '#f97316' }} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111827' }}>At-Risk (Overdue)</h3>
                </div>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Group</th>
                      <th>Agent</th>
                      <th>Next Installment</th>
                      <th>Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultAnalysis.atRisk.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 700 }}>{item.groupName}</td>
                        <td>{item.agent}</td>
                        <td>{item.nextInstallmentDate ? new Date(item.nextInstallmentDate).toLocaleDateString() : '-'}</td>
                        <td>₹{item.remainingBalance?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'recovery' && (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Agent</th>
                  <th>Collected</th>
                  <th>Total Payable</th>
                  <th>Recovery %</th>
                </tr>
              </thead>
              <tbody>
                {lowRecovery.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700 }}>{item.groupName}</td>
                    <td>{item.agent}</td>
                    <td>₹{item.collected?.toLocaleString('en-IN')}</td>
                    <td>₹{item.totalPayable?.toLocaleString('en-IN')}</td>
                    <td className="highlight-red" style={{ fontWeight: 800 }}>{item.recoveryPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

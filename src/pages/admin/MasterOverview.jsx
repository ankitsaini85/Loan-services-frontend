import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Zap, AlertCircle, Shield, Activity, BarChart3 } from 'lucide-react';
import { getAdminDashboard } from '../../services/adminService';

export default function MasterOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `₹${(value || 0).toLocaleString('en-IN')}`;
  const pendingApprovals = data?.pendingApprovals ?? 0;
  const npaCount = data?.npaCount ?? 0;
  const lateGroups = data?.lateGroups ?? 0;

  if (loading) {
    return <div className="content-section"><p>Loading...</p></div>;
  }

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '38px',
        borderRadius: '16px',
        marginBottom: '28px',
        color: 'white',
        boxShadow: '0 16px 40px rgba(102, 126, 234, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={34} />
              Master Overview
            </h1>
            <p style={{ margin: '10px 0 0 0', opacity: 0.92, fontSize: '15px' }}>
              Monitor capital, portfolio health, and operational alerts in one snapshot.
            </p>
          </div>
          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(8px)',
            fontWeight: 700
          }}>
            <AlertCircle size={22} /> Live Recovery: {data?.overallRecoveryPercentage || 0}%
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '26px'
      }}>
        {[{
          title: 'Capital Deployed',
          value: formatCurrency(data?.totalCapitalDeployed),
          icon: <TrendingUp size={26} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          title: 'Active Loan Groups',
          value: data?.activeLoanGroups || 0,
          icon: <Zap size={26} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }, {
          title: 'Profit Earned',
          value: formatCurrency(data?.totalProfitEarned),
          icon: <BarChart3 size={26} />, 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }, {
          title: 'Overall Recovery',
          value: `${data?.overallRecoveryPercentage || 0}%`,
          icon: <AlertCircle size={26} />, 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }].map((card, idx) => (
          <div key={idx} style={{
            background: card.gradient,
            padding: '22px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.15)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: 600 }}>{card.title}</p>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}>
                {card.icon}
              </div>
            </div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* System Summary */}
      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
        marginBottom: '22px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Users size={20} style={{ color: '#667eea' }} /> System Summary
          </h2>
          <span style={{ padding: '8px 12px', borderRadius: '10px', background: '#edf2ff', color: '#4338ca', fontWeight: 700 }}>Live</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          {[{
            label: 'Total Agents',
            value: data?.totalAgents || 0
          }, {
            label: 'Total Investors',
            value: data?.totalInvestors || 0
          }, {
            label: 'Pending Approvals',
            value: pendingApprovals
          }, {
            label: 'NPA Count',
            value: npaCount
          }].map((item, idx) => (
            <div key={idx} style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111827' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health & Risk */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Activity size={20} style={{ color: '#22c55e' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>Operational Health</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '12px', background: '#ecfdf3', border: '1px solid #bbf7d0' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#166534', fontWeight: '700' }}>Collection Health</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#065f46' }}>
                {data?.overallRecoveryPercentage || 0}%
              </p>
            </div>
            <div style={{ padding: '14px', borderRadius: '12px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#1d4ed8', fontWeight: '700' }}>Late Installments</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#1e3a8a' }}>
                {lateGroups}
              </p>
            </div>
            <div style={{ padding: '14px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#c2410c', fontWeight: '700' }}>NPAs</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#9a3412' }}>
                {npaCount}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <TrendingUp size={20} style={{ color: '#f97316' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>Performance Snapshot</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[{
              label: 'Portfolio Yield (est.)',
              value: data?.portfolioYield ?? '—',
              color: '#111827'
            }, {
              label: 'Avg Ticket Size',
              value: formatCurrency(data?.avgTicketSize),
              color: '#1e3a8a'
            }, {
              label: 'Groups Funding This Week',
              value: formatCurrency(data?.fundingThisWeek),
              color: '#0f766e'
            }].map((row, idx) => (
              <div key={idx} style={{
                padding: '14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#4b5563', fontWeight: 700, fontSize: '13px' }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 800, fontSize: '15px' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

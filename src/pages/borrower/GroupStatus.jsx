import React from 'react';
import { Users, Shield, Calendar, DollarSign, CreditCard, CheckCircle } from 'lucide-react';
import '../../styles/BorrowerDashboard.css';

export default function GroupStatus({ groupData }) {
  if (!groupData) {
    return <div className="content-section"><p>Loading...</p></div>;
  }

  const members = groupData.members || [];

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '34px',
        borderRadius: '16px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(102, 126, 234, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={30} /> My Group Status
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>View your group information and member details</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            {groupData.groupName}
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
          title: 'Group ID',
          value: groupData.groupId,
          icon: <Shield size={24} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }, {
          title: 'Loan Status',
          value: groupData.status?.toUpperCase() || 'ACTIVE',
          icon: <CheckCircle size={24} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          title: 'Loan Duration',
          value: groupData.durationDisplay || `${groupData.loanTenure || 12} Months`,
          icon: <Calendar size={24} />, 
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        }, {
          title: 'Total Loan',
          value: `₹${groupData.totalLoan?.toLocaleString() || '0'}`,
          icon: <DollarSign size={24} />, 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }, {
          title: 'EMI Amount',
          value: `₹${groupData.emiAmount?.toLocaleString() || '0'}`,
          icon: <CreditCard size={24} />, 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }, {
          title: 'Total Members',
          value: members.length,
          icon: <Users size={24} />, 
          gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
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
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{card.value}</h3>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>Group Members</h2>
          <span style={{ background: '#eef2ff', color: '#4338ca', padding: '6px 10px', borderRadius: '10px', fontWeight: 700 }}>{members.length} Members</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
          marginTop: '16px'
        }}>
          {members.length > 0 ? (
            members.map((member, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>{member.name}</h4>
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#4b5563' }}>📱 {member.phone}</p>
                {member.aadharNumber && <p style={{ margin: '4px 0', fontSize: '13px', color: '#4b5563' }}>🆔 {member.aadharNumber}</p>}
                {member.panNumber && <p style={{ margin: '4px 0', fontSize: '13px', color: '#4b5563' }}>💳 {member.panNumber}</p>}
                <span style={{ display: 'inline-block', marginTop: '8px', background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>ACTIVE</span>
              </div>
            ))
          ) : (
            <p>No members found</p>
          )}
        </div>
      </div>
    </div>
  );
}

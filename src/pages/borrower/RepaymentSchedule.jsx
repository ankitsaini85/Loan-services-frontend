import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Clock, DollarSign } from 'lucide-react';
import { getRepaymentSchedule } from '../../services/borrowerService';
import '../../styles/BorrowerDashboard.css';

export default function RepaymentSchedule({ groupData }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupData?.groupId) {
      fetchSchedule();
    }
  }, [groupData]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const { data } = await getRepaymentSchedule(groupData.groupId);
      setSchedule(data || []);
    } catch (error) {
      console.error('Failed to fetch repayment schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!groupData) {
    return <div className="content-section"><p>Loading...</p></div>;
  }

  const emiAmount = groupData.emiAmount || 0;
  const loanTenure = groupData.loanTenure || 12;
  const totalLoan = groupData.totalLoan || 0;

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '34px',
        borderRadius: '16px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(240, 147, 251, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={30} /> Repayment Schedule
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>Your monthly EMI payment schedule for {groupData.groupName}</p>
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
          title: 'Monthly EMI',
          value: `₹${emiAmount.toLocaleString()}`,
          icon: <CreditCard size={24} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }, {
          title: 'Loan Duration',
          value: groupData.durationDisplay || `${loanTenure} Months`,
          icon: <Clock size={24} />, 
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        }, {
          title: 'Total Payable',
          value: `₹${totalLoan.toLocaleString()}`,
          icon: <DollarSign size={24} />, 
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

      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>EMI Schedule</h2>
          <span style={{ background: '#eef2ff', color: '#4338ca', padding: '6px 10px', borderRadius: '10px', fontWeight: 700 }}>{loanTenure} Installments</span>
        </div>
        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading schedule...</p>
          ) : schedule.length > 0 ? (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>EMI #</th>
                  <th>Due Date</th>
                  <th>EMI Amount</th>
                  <th>Amount Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: '700' }}>{item.emiNumber}</td>
                  <td>{new Date(item.dueDate).toLocaleDateString('en-IN')}</td>
                  <td>₹{item.emiAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: '700', color: item.amountPaid > 0 ? '#10b981' : '#6b7280' }}>₹{(item.amountPaid || 0).toLocaleString('en-IN')}</td>
                  <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No repayment schedule available yet. Schedule will be generated once your loan is approved.</p>
          )}
        </div>
      </div>
    </div>
  );
}

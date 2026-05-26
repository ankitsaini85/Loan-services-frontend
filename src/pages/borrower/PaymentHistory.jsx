import React from 'react';
import { TrendingUp, DollarSign, AlertCircle, BarChart3 } from 'lucide-react';

export default function PaymentHistory({ groupData }) {
  if (!groupData) {
    return <div className="content-section"><p>Loading...</p></div>;
  }

  const payments = groupData.payments || [];
  const totalAmount = groupData.totalLoan || groupData.totalAmount || 0;
  const paidAmount = groupData.paidAmount || groupData.amountPaid || 0;
  const remainingBalance = groupData.remainingBalance || (totalAmount - paidAmount) || 0;
  const paymentPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return (
    <div className="content-section" style={{ padding: 0 }}>
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
              <BarChart3 size={30} /> Payment History
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>Track your payments and balance</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            {paymentPercentage.toFixed(1)}% Completed
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
          title: 'Total Amount',
          value: `₹${totalAmount.toLocaleString()}`,
          icon: <DollarSign size={24} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }, {
          title: 'Amount Paid',
          value: `₹${paidAmount.toLocaleString()}`,
          icon: <TrendingUp size={24} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          title: 'Remaining Balance',
          value: `₹${remainingBalance.toLocaleString()}`,
          icon: <AlertCircle size={24} />, 
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
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

      {/* Progress Section */}
      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
        marginBottom: '22px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Payment Progress</h3>
        <div style={{
          width: '100%',
          height: '40px',
          background: '#e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${paymentPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.5s ease',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: '700',
              fontSize: '14px',
              color: paymentPercentage > 30 ? 'white' : '#111827',
              zIndex: 1
            }}>
              {paymentPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>Payment Records</h2>
          <span style={{ background: '#eef2ff', color: '#4338ca', padding: '6px 10px', borderRadius: '10px', fontWeight: 700 }}>{payments.length} Transactions</span>
        </div>
        {payments.length > 0 ? (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>EMI #</th>
                  <th>Payment Date</th>
                  <th>Amount Paid</th>
                  <th>Payment Mode</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id || index}>
                    <td>{payment.emiNo}</td>
                    <td>{new Date(payment.paidDate).toLocaleDateString()}</td>
                    <td>₹{payment.amount.toLocaleString()}</td>
                    <td><span className="status-badge status-paid">{payment.paymentMode}</span></td>
                    <td>{payment.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No payment records available yet.</p>
        )}
      </div>
    </div>
  );
}

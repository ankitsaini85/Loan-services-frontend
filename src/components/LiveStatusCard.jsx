import React from 'react';
import './LiveStatusCard.css';

export default function LiveStatusCard({ group }) {
  const progressPercentage = (group.amountPaid / group.totalLoan) * 100;

  return (
    <div className="live-status-card">
      <div className="status-header">
        <h2 className="status-title">{group.groupName}</h2>
        <span className="status-badge">{group.groupId}</span>
      </div>

      <div className="status-grid">
        <div className="status-item">
          <label>Total Loan</label>
          <p className="status-value">₹{group.totalLoan.toLocaleString()}</p>
        </div>
        <div className="status-item">
          <label>Amount Paid</label>
          <p className="status-value">₹{group.amountPaid.toLocaleString()}</p>
        </div>
        <div className="status-item">
          <label>Remaining Balance</label>
          <p className="status-value">₹{group.remainingBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Progress: {progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="status-dates">
        <div className="date-item">
          <label>Last Paid Date</label>
          <p>{group.lastPaidDate ? new Date(group.lastPaidDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="date-item">
          <label>Next Installment</label>
          <p>{group.nextInstallmentDate ? new Date(group.nextInstallmentDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

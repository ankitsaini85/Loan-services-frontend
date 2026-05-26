import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, CreditCard, CheckCircle, Clock, BarChart3, Wallet } from 'lucide-react';
import { getInvestorDashboard } from '../../services/investorService';

export default function EarningsReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [totalInterest, setTotalInterest] = useState(0);
  const [investorData, setInvestorData] = useState(null);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const { data } = await getInvestorDashboard();
      setInvestorData(data.investor);
      
      const investments = data.investments || [];
      const totalEarned = data.portfolio?.totalInterestEarned || 0;
      setTotalInterest(totalEarned);

      // Get investor approval date
      const approvalDate = data.investor?.approvedAt ? new Date(data.investor.approvedAt) : null;
      
      if (!approvalDate) {
        // If not approved yet, show empty breakdown
        setMonthlyBreakdown([]);
        setError(null);
        setLoading(false);
        return;
      }

      const currentDate = new Date();
      
      // Calculate which year period we're in (each period is 12 months from approval)
      const daysSinceApproval = Math.floor((currentDate.getTime() - approvalDate.getTime()) / (1000 * 60 * 60 * 24));
      const yearPeriod = Math.floor(daysSinceApproval / 360); // 360 days per year (12 months × 30 days)
      
      // Start date for current year period
      const periodStartDate = new Date(approvalDate);
      periodStartDate.setDate(periodStartDate.getDate() + (yearPeriod * 360));

      // Generate 12 months from period start date
      const breakdown = [];
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const monthStartDate = new Date(periodStartDate);
        monthStartDate.setDate(monthStartDate.getDate() + (monthIndex * 30));
        
        const monthEndDate = new Date(monthStartDate);
        monthEndDate.setDate(monthEndDate.getDate() + 29); // 30 days total (start day + 29)

        // Determine status based on current date and payout status
        let status = 'upcoming';
        let monthlyInterest = 0;
        let transferDate = null;
        let payoutStatus = 'pending_admin_approval'; // pending_admin_approval, approved, paid, rejected
        let paidAmount = null;

        if (currentDate > monthEndDate) {
          // Month has ended - calculate actual interest for this period
          
          // Calculate interest for allocations active during this period
          monthlyInterest = investments.reduce((sum, inv) => {
            const allocationDate = new Date(inv.allocationDate);
            const allocationStart = allocationDate > monthStartDate ? allocationDate : monthStartDate;
            
            if (allocationDate <= monthEndDate && inv.status === 'active') {
              const daysInMonth = Math.min(
                Math.floor((monthEndDate.getTime() - allocationStart.getTime()) / (1000 * 60 * 60 * 24)) + 1,
                30
              );
              const interest = (inv.allocatedAmount * (inv.interestRate / 100) * (daysInMonth / 365));
              return sum + interest;
            }
            return sum;
          }, 0);
          
          // Check if this month has a payout record and use actual paid status
          const monthPayout = data.monthlyPayouts?.find(p => 
            new Date(p.monthStartDate).getTime() === monthStartDate.getTime()
          );

          if (monthPayout) {
            payoutStatus = monthPayout.status;
            if (monthPayout.status === 'paid') {
              status = 'paid';
              paidAmount = monthPayout.paidAmount;
              transferDate = monthPayout.paidDate ? new Date(monthPayout.paidDate).toISOString().split('T')[0] : null;
            } else if (monthPayout.status === 'approved') {
              status = 'approved';
              paidAmount = monthPayout.approvedAmount;
            } else if (monthPayout.status === 'pending_admin_approval') {
              status = 'pending_approval';
            } else if (monthPayout.status === 'rejected') {
              status = 'rejected';
            }
          } else {
            // No payout record yet - show as pending admin approval
            status = 'pending_approval';
            transferDate = new Date(monthEndDate);
            transferDate.setDate(transferDate.getDate() + 5); // Expected transfer date
            transferDate = transferDate.toISOString().split('T')[0];
          }
        } else if (currentDate >= monthStartDate && currentDate <= monthEndDate) {
          // Current month - show as pending
          status = 'pending';
          
          // Calculate interest earned so far this month
          monthlyInterest = investments.reduce((sum, inv) => {
            const allocationDate = new Date(inv.allocationDate);
            const allocationStart = allocationDate > monthStartDate ? allocationDate : monthStartDate;
            
            if (allocationDate <= currentDate && inv.status === 'active') {
              const daysElapsed = Math.floor((currentDate.getTime() - allocationStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              const interest = (inv.allocatedAmount * (inv.interestRate / 100) * (daysElapsed / 365));
              return sum + interest;
            }
            return sum;
          }, 0);
        }

        breakdown.push({
          month: `Month ${monthIndex + 1}`,
          dateRange: `${monthStartDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${monthEndDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
          amount: Math.round(monthlyInterest),
          status: status,
          payoutStatus: payoutStatus,
          paidAmount: paidAmount ? Math.round(paidAmount) : null,
          transferDate: transferDate
        });
      }

      setMonthlyBreakdown(breakdown);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
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
          <p style={{ fontSize: '16px', color: '#718096' }}>Loading earnings report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <h1>Earnings Report</h1>
        <div style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#991b1b',
          marginTop: '20px'
        }}>{error}</div>
      </div>
    );
  }

  const totalPaid = monthlyBreakdown
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);
  
  const totalPending = monthlyBreakdown
    .filter(m => m.status === 'pending' || m.status === 'pending_approval')
    .reduce((sum, m) => sum + m.amount, 0);

  const paidCount = monthlyBreakdown.filter(e => e.status === 'paid').length;
  const averageMonthly = monthlyBreakdown.length > 0 
    ? (totalInterest / monthlyBreakdown.filter(m => m.status !== 'upcoming').length).toFixed(0)
    : 0;

  // Find next payout date - from the next pending month that hasn't completed yet
  const nextPendingMonth = monthlyBreakdown.find(m => 
    m.status === 'pending' || m.status === 'pending_approval'
  );
  
  let nextPayoutDate = null;
  let nextPayoutDateStr = 'TBD';
  
  if (nextPendingMonth && nextPendingMonth.transferDate) {
    nextPayoutDate = new Date(nextPendingMonth.transferDate);
    nextPayoutDateStr = nextPayoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (investorData?.approvedAt) {
    // Calculate from approval date if no pending months
    const approvalDate = new Date(investorData.approvedAt);
    const currentDate = new Date();
    const daysSinceApproval = Math.floor((currentDate.getTime() - approvalDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentMonthIndex = Math.floor(daysSinceApproval / 30);
    
    // Next month end date + 5 days
    const nextMonthStart = new Date(approvalDate);
    nextMonthStart.setDate(nextMonthStart.getDate() + ((currentMonthIndex + 1) * 30));
    nextMonthStart.setDate(nextMonthStart.getDate() + 29 + 5); // Month end + 5 days
    
    nextPayoutDate = nextMonthStart;
    nextPayoutDateStr = nextPayoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const getStatusColor = (status) => {
    const colors = {
      paid: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
      pending: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      upcoming: { bg: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' },
      pending_approval: { bg: '#fed7aa', color: '#9a3412', border: '#fdba74' },
      approved: { bg: '#dbeafe', color: '#0c4a6e', border: '#93c5fd' },
      rejected: { bg: '#fecaca', color: '#7f1d1d', border: '#fca5a5' }
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div className="content-section" style={{ padding: '0' }}>
      {/* Header Section */}
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
          <BarChart3 size={36} />
          Earnings Report
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Track your interest earnings and payouts</p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <DollarSign size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Total Yearly Earnings</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            ₹{totalInterest.toLocaleString('en-IN')}
          </p>
        </div>

        <div style={{
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <CheckCircle size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Total Paid</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
            {paidCount} payment{paidCount !== 1 ? 's' : ''} completed
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <Calendar size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Next Payout</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            {nextPayoutDateStr}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
            ₹{totalPending.toLocaleString('en-IN')} pending
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <TrendingUp size={26} />
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>Avg Monthly</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            ₹{Number(averageMonthly).toLocaleString('en-IN')}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
            Interest earnings
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          color: '#1a202c',
          margin: '0 0 25px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Wallet size={24} style={{ color: '#667eea' }} />
          Monthly Breakdown
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '15px'
        }}>
          {monthlyBreakdown.map((item, index) => {
            const statusStyle = getStatusColor(item.status);
            
            return (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: `1px solid ${statusStyle.border}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                    {item.month} 2026
                  </p>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {item.status === 'paid' && <CheckCircle size={12} />}
                    {item.status === 'pending' && <Clock size={12} />}
                    {item.status === 'pending_approval' && <Clock size={12} />}
                    {item.status === 'approved' && <CheckCircle size={12} />}
                    {item.status === 'upcoming' && <TrendingUp size={12} />}
                    {item.status === 'rejected' && '✕'}
                    {item.status}
                  </span>
                </div>

                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Interest Earned</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                    {item.amount > 0 ? `₹${item.amount.toLocaleString('en-IN')}` : '-'}
                  </p>
                  {item.status === 'paid' && item.paidAmount && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#718096' }}>
                      Paid: ₹{item.paidAmount.toLocaleString('en-IN')}
                    </p>
                  )}
                  {item.status === 'approved' && item.paidAmount && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#718096' }}>
                      Approved: ₹{item.paidAmount.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                {/* Payout Status Info */}
                {item.status === 'pending_approval' && (
                  <div style={{
                    background: '#fffbeb',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#92400e',
                    border: '1px solid #fde68a'
                  }}>
                    ⏳ Awaiting admin approval
                  </div>
                )}

                {item.status === 'approved' && (
                  <div style={{
                    background: '#dbeafe',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#0c4a6e',
                    border: '1px solid #93c5fd'
                  }}>
                    ✓ Approved - Pending payment processing
                  </div>
                )}

                {item.status === 'rejected' && (
                  <div style={{
                    background: '#fee2e2',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#7f1d1d',
                    border: '1px solid #fca5a5'
                  }}>
                    ✕ Rejected by admin
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} style={{ color: '#718096' }} />
                  <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                    {item.transferDate 
                      ? `Transferred: ${new Date(item.transferDate).toLocaleDateString('en-IN')}` 
                      : 'Transfer date: TBD'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank Transfer Info */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <CreditCard size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>
              Investment Summary
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>
              Your interest earnings overview
            </p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #cbd5e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Wallet size={18} style={{ color: '#667eea' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
              Total Interest Earned
            </p>
          </div>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#667eea' }}>
            ₹{totalInterest.toLocaleString('en-IN')}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#718096' }}>
            {investorData?.interestRate || 11}% annual interest rate
          </p>
        </div>
      </div>
    </div>
  );
}

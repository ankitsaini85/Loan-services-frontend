import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getGroupStatus, getRepaymentSchedule, getPaymentHistory } from '../../services/borrowerService';
import '../../styles/Dashboard.css';

// Sub-pages
import GroupStatus from './GroupStatus';
import RepaymentSchedule from './RepaymentSchedule';
import PaymentHistory from './PaymentHistory';
import HelpSupport from './HelpSupport';

const sidebarItems = [
  { id: 'status', label: 'My Group Status', icon: '👥' },
  { id: 'schedule', label: 'Repayment Schedule', icon: '📅' },
  { id: 'history', label: 'Payment History', icon: '📊' },
  { id: 'help', label: 'Help & Support', icon: '❓' },
];

export default function BorrowerDashboard() {
  const [activeMenu, setActiveMenu] = useState('status');
  const [groupData, setGroupData] = useState(null);
  const [paymentHistoryData, setPaymentHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupIdFromStorage = JSON.parse(localStorage.getItem('user'))?.groupId;

  useEffect(() => {
    console.log('BorrowerDashboard - groupIdFromStorage:', groupIdFromStorage);
    if (!groupIdFromStorage) {
      setError('No group ID found. Please log in again.');
      setLoading(false);
      return;
    }
    fetchGroupData();
  }, []);

  useEffect(() => {
    if (activeMenu === 'history' && groupIdFromStorage) {
      fetchPaymentHistory();
    }
  }, [activeMenu]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      console.log('Fetching group status for:', groupIdFromStorage);
      const { data } = await getGroupStatus(groupIdFromStorage);
      console.log('Group status data received:', data);
      setGroupData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError(err?.response?.data?.message || 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      console.log('Fetching payment history for:', groupIdFromStorage);
      const { data } = await getPaymentHistory(groupIdFromStorage);
      console.log('Payment history data received:', data);
      setPaymentHistoryData(data);
    } catch (err) {
      console.error('Error fetching payment history:', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="content-section"><p>Loading group data...</p></div>;
    }

    if (error) {
      return <div className="content-section"><div className="error-banner">{error}</div></div>;
    }

    if (!groupData) {
      return <div className="content-section"><p>No group data available</p></div>;
    }

    switch (activeMenu) {
      case 'status':
        return <GroupStatus groupData={groupData} />;
      case 'schedule':
        return <RepaymentSchedule groupData={groupData} />;
      case 'history':
        return <PaymentHistory groupData={paymentHistoryData || groupData} />;
      case 'help':
        return <HelpSupport />;
      default:
        return <GroupStatus groupData={groupData} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="borrower" />
      <div className="dashboard-content">
        <Sidebar items={sidebarItems} active={activeMenu} onSelect={setActiveMenu} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

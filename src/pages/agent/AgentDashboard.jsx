import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LiveStatusCard from '../../components/LiveStatusCard';
import { DollarSign, Calculator, Users, CreditCard } from 'lucide-react';
import '../../styles/Dashboard.css';

// Sub-pages
import LoanCalculator from './LoanCalculator';
import RegisterGroup from './RegisterGroup';
import ActiveLoans from './ActiveLoans';
import CollectionEntry from './CollectionEntry';
import MyCommission from './MyCommission';
import BankDetails from './BankDetails';
import AgentNotifications from './AgentNotifications';

const sidebarItems = [
  { id: 'calculator', label: 'Loan Calculator', icon: '🧮' },
  { id: 'register', label: 'Register New Group', icon: '📝' },
  { id: 'loans', label: 'Active Loans', icon: '💳' },
  { id: 'collection', label: 'Collection Entry', icon: '📊' },
  { id: 'commission', label: 'My Commission', icon: '💰' },
  { id: 'bank', label: 'Bank Details', icon: '🏦' },
  // { id: 'notifications', label: 'Notifications', icon: '🔔' },
];

export default function AgentDashboard() {
  const [activeMenu, setActiveMenu] = useState('calculator');
  const [liveStatus, setLiveStatus] = useState(null);

  const renderContent = () => {
    switch (activeMenu) {
      case 'calculator':
        return <LoanCalculator />;
      case 'register':
        return <RegisterGroup />;
      case 'loans':
        return <ActiveLoans onSelectLoan={setLiveStatus} />;
      case 'collection':
        return <CollectionEntry />;
      case 'commission':
        return <MyCommission />;
      case 'bank':
        return <BankDetails />;
      case 'notifications':
        return <AgentNotifications />;
      default:
        return <LoanCalculator />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="agent" />
      <div className="dashboard-content">
        <Sidebar items={sidebarItems} active={activeMenu} onSelect={setActiveMenu} />
        <main className="main-content">
          {liveStatus && <LiveStatusCard group={liveStatus} />}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { TrendingUp, Users, Zap, AlertCircle } from 'lucide-react';
import '../../styles/Dashboard.css';

// Sub-pages
import MasterOverview from './MasterOverview';
import AgentManagement from './AgentManagement';
import InvestorManagement from './InvestorManagement';
import LoanApprovals from './LoanApprovals';
import CollectionsTracking from './CollectionsTracking';
import CollectionEntries from './CollectionEntries';
import AdminComplaints from './AdminComplaints';
import PayoutManagement from './PayoutManagement';
import DocumentManagement from './DocumentManagement';
import AdminNotifications from './AdminNotifications';

const sidebarItems = [
  { id: 'overview', label: 'Master Overview', icon: '📊' },
  { id: 'agents', label: 'Agent Management', icon: '👨‍💼' },
  { id: 'investors', label: 'Investor Management', icon: '💼' },
  { id: 'payouts', label: 'Investor Payouts', icon: '💸' },
  { id: 'approvals', label: 'Loan Approvals', icon: '✅' },
  { id: 'collections', label: 'Collections & NPA', icon: '📈' },
  { id: 'entries', label: 'Collection Entries', icon: '💰' },
  { id: 'complaints', label: 'Complaints', icon: '⚠️' },
  { id: 'documents', label: 'Document Upload', icon: '📄' },
  // { id: 'notifications', label: 'Notifications', icon: '🔔' },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('overview');

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return <MasterOverview />;
      case 'agents':
        return <AgentManagement />;
      case 'investors':
        return <InvestorManagement />;
      case 'payouts':
        return <PayoutManagement />;
      case 'approvals':
        return <LoanApprovals />;
      case 'collections':
        return <CollectionsTracking />;
      case 'entries':
        return <CollectionEntries />;
      case 'complaints':
        return <AdminComplaints />;
      case 'documents':
        return <DocumentManagement />;
      case 'notifications':
        return <AdminNotifications />;
      default:
        return <MasterOverview />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="admin" />
      <div className="dashboard-content">
        <Sidebar items={sidebarItems} active={activeMenu} onSelect={setActiveMenu} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

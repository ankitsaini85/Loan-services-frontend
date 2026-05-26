import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { TrendingUp, Wallet, FileText, DollarSign } from 'lucide-react';
import '../../styles/Dashboard.css';

// Sub-pages
import MyFund from './MyFund';
import PortfolioDistribution from './PortfolioDistribution';
import EarningsReport from './EarningsReport';
import Documents from './Documents';

const sidebarItems = [
  { id: 'fund', label: 'My Fund', icon: '💳' },
  { id: 'portfolio', label: 'Portfolio Distribution', icon: '📊' },
  { id: 'earnings', label: 'Earnings Report', icon: '📈' },
  { id: 'documents', label: 'Documents', icon: '📄' },
];

export default function InvestorDashboard() {
  const [activeMenu, setActiveMenu] = useState('fund');

  const renderContent = () => {
    switch (activeMenu) {
      case 'fund':
        return <MyFund />;
      case 'portfolio':
        return <PortfolioDistribution />;
      case 'earnings':
        return <EarningsReport />;
      case 'documents':
        return <Documents />;
      default:
        return <MyFund />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar role="investor" />
      <div className="dashboard-content">
        <Sidebar items={sidebarItems} active={activeMenu} onSelect={setActiveMenu} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

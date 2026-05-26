import React, { useState, useEffect } from 'react';
import { getCollectionEntries } from '../../services/adminService.js';
import { Loader2, Search, Wallet, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';

const CollectionEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCollectionEntries();
  }, []);

  const fetchCollectionEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCollectionEntries();
      console.log('Collection entries response:', response.data);
      setEntries(response.data || []);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err.response?.data?.message || 'Failed to fetch collection entries');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const searchMatch = 
      entry.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.groupId?.toString().includes(searchTerm);
    
    return searchMatch;
  });

  const totalCollected = filteredEntries.reduce((sum, entry) => sum + (entry.amountPaid || 0), 0);
  const totalEntries = filteredEntries.length;
  const completedCount = filteredEntries.filter(e => e.status === 'completed').length;
  const pendingCount = filteredEntries.filter(e => e.status === 'pending').length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Loader2 style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '22px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(79, 172, 254, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={30} /> Collection Entries
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>View all EMI collections recorded by agents and spot issues quickly.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            Total Records: {entries.length}
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '14px',
          borderRadius: '12px',
          margin: '0 4px 16px 4px'
        }}>
          Error: {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        padding: '0 4px',
        marginBottom: '18px'
      }}>
        {[{
          title: 'Total Collections',
          value: totalEntries,
          icon: <BarChart3 size={24} />, 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }, {
          title: 'Amount Collected',
          value: `₹${totalCollected.toLocaleString('en-IN')}`,
          icon: <CheckCircle size={24} />, 
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }, {
          title: 'Completed',
          value: completedCount,
          icon: <CheckCircle size={24} />, 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }, {
          title: 'Pending / Failed',
          value: `${pendingCount} / ${totalEntries - completedCount - pendingCount}`,
          icon: <AlertCircle size={24} />, 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
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
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-section" style={{ margin: '0 4px 18px 4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div className="search-form" style={{ flex: '1 1 320px', background: 'white', borderRadius: '12px', padding: '10px 12px', border: '1px solid #e5e7eb', boxShadow: '0 8px 18px rgba(0,0,0,0.04)' }}>
          <Search style={{ fontSize: '18px', color: '#666' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by group name, agent name, or group ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '170px',
            boxShadow: '0 8px 18px rgba(0,0,0,0.04)'
          }}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Collection Entries Table */}
      <div className="table-container" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Agent Name</th>
              <th>EMI #</th>
              <th>Amount Paid</th>
              <th>Paid Date</th>
              <th>Status</th>
              <th>Payment Mode</th>
              <th>Notes</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontWeight: 'bold', color: '#1f2937' }}>#{entry.groupId}</td>
                  <td>{entry.groupName || 'N/A'}</td>
                  <td>{entry.agent || 'N/A'}</td>
                  <td style={{ textAlign: 'center' }}>{entry.emiNumber || 'N/A'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>
                    ₹{entry.amountPaid?.toLocaleString('en-IN') || '0'}
                  </td>
                  <td>{entry.paymentDate ? new Date(entry.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: '#d1fae5',
                      color: '#047857'
                    }}>
                      PAID
                    </span>
                  </td>
                  <td style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: '600' }}>
                    {entry.paymentMode || 'N/A'}
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.notes || '-'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#666' }}>
                    {entry.recordedAt ? new Date(entry.recordedAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                  No collection entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionEntries;

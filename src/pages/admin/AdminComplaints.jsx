import React, { useState, useEffect } from 'react';
import { Eye, Filter, Search, AlertCircle, CheckCircle, Clock, Shield, Inbox } from 'lucide-react';
import { getAllComplaints, updateComplaintStatus } from '../../services/complaintService';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllComplaints();
      const complaintsData = response.data || response.complaints || response;
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      filterComplaints(Array.isArray(complaintsData) ? complaintsData : [], filterStatus, searchTerm);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = (data, status, search) => {
    let filtered = data;

    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.groupName?.toLowerCase().includes(searchLower) ||
        c.groupId?.toLowerCase().includes(searchLower) ||
        c.title?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredComplaints(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterComplaints(complaints, filterStatus, value);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    filterComplaints(complaints, value, searchTerm);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    try {
      setUpdateLoading(true);
      setUpdateMessage(null);

      await updateComplaintStatus(selectedComplaint._id, {
        status: newStatus,
        resolution: resolution || null,
      });

      setUpdateMessage({ type: 'success', text: 'Complaint updated successfully' });
      fetchComplaints();
      setShowDetail(false);
      setNewStatus('');
      setResolution('');
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      setUpdateMessage({ type: 'error', text: err.message || 'Failed to update complaint' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#ef4444',
      'in-progress': '#f59e0b',
      'resolved': '#10b981',
      'closed': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#3b82f6',
      'medium': '#f59e0b',
      'high': '#ef4444'
    };
    return colors[priority] || '#6b7280';
  };

  const StatusIcon = ({ status }) => {
    if (status === 'resolved' || status === 'closed') return <CheckCircle size={16} />;
    if (status === 'in-progress') return <Clock size={16} />;
    return <AlertCircle size={16} />;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Loading complaints...</p>
      </div>
    );
  }

  const openCount = complaints.filter(c => c.status === 'open').length;
  const progressCount = complaints.filter(c => c.status === 'in-progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div style={{ padding: '0 0 30px 0', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '28px',
          borderRadius: '18px',
          color: 'white',
          margin: '22px 0',
          boxShadow: '0 14px 32px rgba(102,126,234,0.28)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={30} /> Complaints Management
              </h1>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Track, triage, and resolve all borrower and agent complaints.</p>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
              Total: {complaints.length}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '18px'
        }}>
          {[{
            label: 'Open',
            value: openCount,
            gradient: 'linear-gradient(135deg, #f97316 0%, #fb7185 100%)'
          }, {
            label: 'In Progress',
            value: progressCount,
            gradient: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)'
          }, {
            label: 'Resolved',
            value: resolvedCount,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
          }, {
            label: 'Total',
            value: complaints.length,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }].map((card, idx) => (
            <div key={idx} style={{
              background: card.gradient,
              padding: '16px',
              borderRadius: '14px',
              color: 'white',
              boxShadow: '0 10px 22px rgba(0,0,0,0.14)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800
            }}>
              <span style={{ fontSize: '13px' }}>{card.label}</span>
              <span style={{ fontSize: '22px' }}>{card.value}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ background: 'white', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 18px rgba(0,0,0,0.04)' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4a5568', marginBottom: '6px' }}>
              <Search size={16} style={{ display: 'inline-block', marginRight: '6px' }} /> Search
            </label>
            <input
              type="text"
              placeholder="Search by group name, ID, or complaint title..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ background: 'white', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 18px rgba(0,0,0,0.04)' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4a5568', marginBottom: '6px' }}>
              <Filter size={16} style={{ display: 'inline-block', marginRight: '6px' }} /> Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Complaints</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div style={{
            padding: '15px',
            marginBottom: '18px',
            borderRadius: '10px',
            backgroundColor: updateMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: updateMessage.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${updateMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`
          }}>
            {updateMessage.text}
          </div>
        )}

        {/* Complaints Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
        }}>
          {filteredComplaints.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p>No complaints found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Group ID</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Group Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Complaint Title</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Priority</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((comp) => (
                    <tr key={comp._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '15px', color: '#2d3748', fontSize: '14px' }}>
                        <span style={{ fontWeight: '600', color: '#667eea' }}>{comp.groupId}</span>
                      </td>
                      <td style={{ padding: '15px', color: '#2d3748', fontSize: '14px' }}>{comp.groupName}</td>
                      <td style={{ padding: '15px', color: '#2d3748', fontSize: '14px' }}>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {comp.title}
                        </div>
                      </td>
                      <td style={{ padding: '15px', color: '#2d3748', fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151'
                        }}>
                          {comp.category}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: getStatusColor(comp.status) + '20',
                          color: getStatusColor(comp.status)
                        }}>
                          <StatusIcon status={comp.status} />
                          {comp.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: getPriorityColor(comp.priority) + '20',
                          color: getPriorityColor(comp.priority)
                        }}>
                          {comp.priority}
                        </span>
                      </td>
                      <td style={{ padding: '15px', color: '#666', fontSize: '13px' }}>
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedComplaint(comp);
                            setShowDetail(true);
                            setNewStatus(comp.status);
                            setResolution(comp.resolution || '');
                          }}
                          style={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#764ba2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetail && selectedComplaint && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              padding: '30px',
              maxWidth: '640px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 14px 32px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#1a202c' }}>
                  Complaint Details
                </h2>
                <span style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: '#f3f4f6',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '12px'
                }}>
                  <Inbox size={14} /> {selectedComplaint.category}
                </span>
              </div>

              <div style={{ marginBottom: '16px', padding: '14px', backgroundColor: '#f7fafc', borderRadius: '10px' }}>
                <p style={{ margin: '0 0 6px 0', color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group Information</p>
                <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: '700' }}>
                  {selectedComplaint.groupId} - {selectedComplaint.groupName}
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#4a5568', marginBottom: '6px' }}>Title</h3>
                <p style={{ fontSize: '14px', color: '#2d3748', fontWeight: '600' }}>{selectedComplaint.title}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#4a5568', marginBottom: '6px' }}>Description</h3>
                <p style={{ fontSize: '14px', color: '#2d3748', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {selectedComplaint.description}
                </p>
              </div>

              <div style={{ marginBottom: '18px', padding: '14px', backgroundColor: '#f7fafc', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#4a5568', marginBottom: '8px' }}>Status & Priority</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Current Status</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: getStatusColor(selectedComplaint.status) }}>
                      {selectedComplaint.status}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Priority</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: getPriorityColor(selectedComplaint.priority) }}>
                      {selectedComplaint.priority}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#4a5568', marginBottom: '6px' }}>Update Status</h3>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={updateLoading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    marginBottom: '10px'
                  }}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#4a5568', marginBottom: '6px' }}>Resolution Notes (Optional)</h3>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  disabled={updateLoading}
                  placeholder="Add resolution notes..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updateLoading || !newStatus}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: updateLoading || !newStatus ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: updateLoading || !newStatus ? 'not-allowed' : 'pointer'
                  }}
                >
                  {updateLoading ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={() => setShowDetail(false)}
                  disabled={updateLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    color: '#667eea',
                    border: '1px solid #667eea',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

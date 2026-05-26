import React, { useState, useEffect } from 'react';
import { registerGroup, getInvestors } from '../../services/agentService';
import { Upload, Users, FileText, CheckCircle, AlertCircle, DollarSign, User, Calendar } from 'lucide-react';

export default function RegisterGroup() {
  const [groupData, setGroupData] = useState({
    groupName: '',
    loanAmount: '',
    durationYears: 1,
    durationMonths: 0,
    members: [{ name: '', phone: '', aadhar: '', pan: '' }],
  });

  const [investors, setInvestors] = useState([]);
  const [investorAllocations, setInvestorAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [documents, setDocuments] = useState({
    stampPaper: null,
    aadharFiles: Array(5).fill(null),
    panFiles: Array(5).fill(null),
  });

  // Load investors on mount
  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await getInvestors();
        setInvestors(response.data || []);
      } catch (err) {
        console.error('Failed to load investors:', err);
      }
    };
    fetchInvestors();
  }, []);

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prev => ({
      ...prev,
      [name]: name === 'loanAmount' ? value : value,
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...groupData.members];
    newMembers[index][field] = value;
    setGroupData({
      ...groupData,
      members: newMembers,
    });
  };

  const handleInvestorAllocationChange = (investorId, amount) => {
    const updatedAllocations = investorAllocations.filter(a => a.investorId !== investorId);
    if (amount > 0) {
      updatedAllocations.push({ investorId, amount: Number(amount) });
    }
    setInvestorAllocations(updatedAllocations);
  };

  const getTotalAllocated = () => {
    return investorAllocations.reduce((sum, alloc) => sum + alloc.amount, 0);
  };

  const validateAllocations = () => {
    const loanAmount = Number(groupData.loanAmount) || 0;
    const totalAllocated = getTotalAllocated();

    if (investorAllocations.length === 0) {
      setError('Please allocate at least one investor');
      return false;
    }

    if (totalAllocated !== loanAmount) {
      setError(`Total allocations (₹${totalAllocated}) must equal loan amount (₹${loanAmount})`);
      return false;
    }

    // Validate each investor has sufficient available funds
    for (const alloc of investorAllocations) {
      const investor = investors.find(i => i._id === alloc.investorId);
      if (!investor) continue;

      const availableFund = (investor.totalInvested || 0) - (investor.activeInvestmentValue || 0);
      if (alloc.amount > availableFund) {
        setError(`${investor.name} has insufficient available funds. Available: ₹${availableFund}, Requested: ₹${alloc.amount}`);
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (fileType, index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (fileType === 'stampPaper') {
        setDocuments({
          ...documents,
          stampPaper: { name: file.name, data: reader.result },
        });
      } else if (fileType === 'aadhar') {
        const newAadhar = [...documents.aadharFiles];
        newAadhar[index] = { name: file.name, data: reader.result };
        setDocuments({
          ...documents,
          aadharFiles: newAadhar,
        });
      } else if (fileType === 'pan') {
        const newPan = [...documents.panFiles];
        newPan[index] = { name: file.name, data: reader.result };
        setDocuments({
          ...documents,
          panFiles: newPan,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const addMember = () => {
    if (groupData.members.length < 5) {
      setGroupData({
        ...groupData,
        members: [...groupData.members, { name: '', phone: '', aadhar: '', pan: '' }],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (groupData.members.length !== 5) {
      setError('Exactly 5 members are required.');
      return;
    }

    if (!documents.stampPaper) {
      setError('Stamp paper image is required for group.');
      return;
    }

    // Validate that each member has either Aadhaar OR PAN number (at least one)
    for (let i = 0; i < 5; i++) {
      const hasAadhar = groupData.members[i].aadhar && groupData.members[i].aadhar.trim() !== '';
      const hasPan = groupData.members[i].pan && groupData.members[i].pan.trim() !== '';
      
      if (!hasAadhar && !hasPan) {
        setError(`Member ${i + 1} must enter either Aadhaar or PAN number (at least one is mandatory).`);
        return;
      }
    }

    // Validate that each member has at least one document (Aadhaar OR PAN)
    for (let i = 0; i < 5; i++) {
      const hasAadhar = documents.aadharFiles[i] !== null;
      const hasPan = documents.panFiles[i] !== null;
      
      if (!hasAadhar && !hasPan) {
        setError(`Member ${i + 1} must have either Aadhaar or PAN document uploaded.`);
        return;
      }
    }

    // Validate investor allocations
    if (!validateAllocations()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        groupName: groupData.groupName,
        loanAmount: Number(groupData.loanAmount),
        durationYears: Number(groupData.durationYears),
        durationMonths: Number(groupData.durationMonths),
        members: groupData.members,
        investorAllocations,
        documents: {
          stampPaper: documents.stampPaper.name,
          aadharFiles: documents.aadharFiles.map(f => f?.name || null),
          panFiles: documents.panFiles.map(f => f?.name || null),
        },
      };

      const { data } = await registerGroup(payload);
      setMessage('✓ Group submitted for admin approval! Group ID: ' + data.group.groupId);
      setGroupData({
        groupName: '',
        loanAmount: '',
        durationYears: 1,
        durationMonths: 0,
        members: [{ name: '', phone: '', aadhar: '', pan: '' }],
      });
      setInvestorAllocations([]);
      setDocuments({
        stampPaper: null,
        aadharFiles: Array(5).fill(null),
        panFiles: Array(5).fill(null),
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          <Users size={36} />
          Register New Group
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>Register a 5-member loan group with required documentation</p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '1px solid #a7f3d0',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#065f46'
        }}>
          <CheckCircle size={20} />
          <div>
            <p style={{ margin: 0, fontWeight: '600' }}>Success!</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '1px solid #fecaca',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#991b1b'
        }}>
          <AlertCircle size={20} />
          <div>
            <p style={{ margin: 0, fontWeight: '600' }}>Error</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Group Details Section */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          marginBottom: '25px'
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
            <DollarSign size={24} style={{ color: '#667eea' }} />
            Group Details
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '8px'
              }}>Group Name *</label>
              <input
                type="text"
                name="groupName"
                value={groupData.groupName}
                onChange={handleGroupChange}
                placeholder="Enter group name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '8px'
              }}>Loan Amount (₹) *</label>
              <input
                type="number"
                name="loanAmount"
                value={groupData.loanAmount}
                onChange={handleGroupChange}
                placeholder="Enter loan amount"
                required
                min="5000"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Calendar size={16} style={{ color: '#667eea' }} />
                Duration - Years *
              </label>
              <select
                name="durationYears"
                value={groupData.durationYears}
                onChange={handleGroupChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="0">0 Years</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Calendar size={16} style={{ color: '#667eea' }} />
                Duration - Months *
              </label>
              <select
                name="durationMonths"
                value={groupData.durationMonths}
                onChange={handleGroupChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => (
                  <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Investor Allocations Section */}
        <div style={{
          background: '#f8fafc',
          padding: '24px',
          borderRadius: '14px',
          marginBottom: '24px',
          border: '2px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DollarSign size={20} style={{ color: '#667eea' }} />
            Investor Fund Allocations
          </h3>

          {investors.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>No active investors available</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {investors.map(investor => {
                const totalInvested = investor.totalInvested || 0;
                const activeInvestment = investor.activeInvestmentValue || 0;
                const availableFund = totalInvested - activeInvestment;
                const allocation = investorAllocations.find(a => a.investorId === investor._id);
                const allocationAmount = allocation?.amount || 0;

                return (
                  <div key={investor._id} style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>
                        {investor.name}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                        📧 {investor.email}
                      </p>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginBottom: '12px',
                      padding: '12px',
                      background: '#f0f4f8',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>Total Invested:</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#10b981' }}>
                          ₹{totalInvested.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Active Investment:</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#f59e0b' }}>
                          ₹{activeInvestment.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: '#6b7280' }}>Available Fund:</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: availableFund > 0 ? '#3b82f6' : '#ef4444' }}>
                          ₹{availableFund.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '6px'
                    }}>
                      Allocate Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={allocationAmount}
                      onChange={(e) => handleInvestorAllocationChange(investor._id, e.target.value)}
                      placeholder="0"
                      min="0"
                      max={availableFund}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '13px',
                        border: availableFund > 0 ? '2px solid #e2e8f0' : '2px solid #fed7d7',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                        background: availableFund > 0 ? 'white' : '#fef2f2'
                      }}
                      disabled={availableFund <= 0}
                      onFocus={(e) => {
                        if (availableFund > 0) {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {availableFund <= 0 && (
                      <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#ef4444' }}>
                        ❌ No available funds
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Allocation Summary */}
          {groupData.loanAmount && (
            <div style={{
              marginTop: '16px',
              padding: '12px 14px',
              background: getTotalAllocated() === Number(groupData.loanAmount) ? '#d1fae5' : '#fef3c7',
              border: getTotalAllocated() === Number(groupData.loanAmount) ? '2px solid #10b981' : '2px solid #d97706',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: getTotalAllocated() === Number(groupData.loanAmount) ? '#065f46' : '#92400e' }}>
                  {getTotalAllocated() === Number(groupData.loanAmount) ? '✓ Total Allocated' : '⚠ Total Allocated'}
                </span>
                <span>₹{getTotalAllocated().toLocaleString('en-IN')} / ₹{Number(groupData.loanAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stamp Paper Upload */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          marginBottom: '25px'
        }}>
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            color: '#1a202c',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={24} style={{ color: '#43e97b' }} />
            Group Documents
          </h2>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>Stamp Paper Image (Required) *</label>
            <input
              type="file"
              id="stampPaper"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('stampPaper', null, e.target.files[0])}
              style={{ display: 'none' }}
            />
            <label htmlFor="stampPaper" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '30px',
              border: '2px dashed #cbd5e0',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '600',
              color: documents.stampPaper ? '#10b981' : '#718096'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'linear-gradient(135deg, #edf2f7 0%, #dbeafe 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e0';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
            }}>
              <Upload size={20} />
              {documents.stampPaper ? `✓ ${documents.stampPaper.name}` : 'Click to upload stamp paper'}
            </label>
          </div>
        </div>

        {/* Members Section */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          marginBottom: '25px'
        }}>
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            color: '#1a202c',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Users size={24} style={{ color: '#f5576c' }} />
            Group Members
          </h2>
          <p style={{
            margin: '0 0 25px 0',
            fontSize: '14px',
            color: '#718096'
          }}>
            Progress: <span style={{ fontWeight: '700', color: '#667eea' }}>{groupData.members.length}/5</span> members added
          </p>

          {groupData.members.map((member, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #cbd5e0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '18px'
                }}>
                  {index + 1}
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
                  Member {index + 1}
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '6px'
                  }}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter member name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e0',
                      borderRadius: '8px',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '6px'
                  }}>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e0',
                      borderRadius: '8px',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '6px'
                  }}>Aadhaar Number</label>
                  <input
                    type="text"
                    placeholder="Enter Aadhaar"
                    value={member.aadhar}
                    onChange={(e) => handleMemberChange(index, 'aadhar', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e0',
                      borderRadius: '8px',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#718096' }}>Optional</p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#f5576c',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca'
                  }}>
                    OR
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '6px'
                  }}>PAN Number</label>
                  <input
                    type="text"
                    placeholder="Enter PAN"
                    value={member.pan}
                    onChange={(e) => handleMemberChange(index, 'pan', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e0',
                      borderRadius: '8px',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#718096' }}>Optional</p>
                </div>
              </div>

              {/* Member Documents */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '6px'
                  }}>Aadhaar Image</label>
                  <input
                    type="file"
                    id={`aadhar-${index}`}
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('aadhar', index, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`aadhar-${index}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    border: '1px dashed #cbd5e0',
                    borderRadius: '8px',
                    background: '#fafafa',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: documents.aadharFiles[index] ? '#10b981' : '#718096',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#f0f4ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e0';
                    e.currentTarget.style.background = '#fafafa';
                  }}>
                    <Upload size={14} />
                    {documents.aadharFiles[index] ? `✓ ${documents.aadharFiles[index].name.substring(0, 15)}...` : 'Upload'}
                  </label>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#f5576c',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca'
                  }}>
                    OR
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '6px'
                  }}>PAN Image</label>
                  <input
                    type="file"
                    id={`pan-${index}`}
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('pan', index, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`pan-${index}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    border: '1px dashed #cbd5e0',
                    borderRadius: '8px',
                    background: '#fafafa',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: documents.panFiles[index] ? '#10b981' : '#718096',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#f0f4ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e0';
                    e.currentTarget.style.background = '#fafafa';
                  }}>
                    <Upload size={14} />
                    {documents.panFiles[index] ? `✓ ${documents.panFiles[index].name.substring(0, 15)}...` : 'Upload'}
                  </label>
                </div>
              </div>
            </div>
          ))}

          {groupData.members.length < 5 && (
            <button
              type="button"
              onClick={addMember}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)',
                color: '#667eea',
                border: '2px dashed #667eea',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #dbeafe 0%, #dbeafe 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              + Add Member ({groupData.members.length}/5)
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <CheckCircle size={18} />
          {loading ? 'Submitting...' : 'Submit for Admin Approval'}
        </button>
      </form>
    </div>
  );
}

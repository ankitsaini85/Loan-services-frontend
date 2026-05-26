import React, { useEffect, useState } from 'react';
import { FileText, Download, Shield, CheckCircle, Clock, File, Folder, Lock, Calendar } from 'lucide-react';
import { investorService } from '../../services/investorService';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await investorService.getDocuments();
      setDocuments(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await investorService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download document:', err);
      setError('Failed to download document');
      setTimeout(() => setError(''), 4000);
    }
  };

  const totalDocs = documents.length;
  const verifiedDocs = documents.filter(d => d.isActive !== false).length;
  const categories = [...new Set(documents.map(d => d.documentType || 'Other'))];

  const getStatusColor = (status) => {
    const colors = {
      verified: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
      pending: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
    };
    return colors[status] || colors.pending;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Legal': '#667eea',
      'Identity': '#43e97b',
      'Tax': '#f5576c',
      'Banking': '#4facfe',
      'Reports': '#764ba2'
    };
    return colors[category] || '#718096';
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
          <Folder size={36} />
          Documents
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>View and download your investment documents</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #667eea',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <File size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Total Documents</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>
            {totalDocs}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #43e97b',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <CheckCircle size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Verified</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>
            {verifiedDocs}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderTop: '4px solid #f5576c',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Folder size={24} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096', fontWeight: '600' }}>Categories</p>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>
            {categories.length}
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {documents.map(doc => {
          const status = doc.status || 'verified';
          const category = doc.documentType || 'Other';
          const statusStyle = getStatusColor(status);
          const categoryColor = getCategoryColor(category);
          
          return (
            <div key={doc.id} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
            }}>
              {/* Document Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 4px 15px ${categoryColor}40`
                }}>
                  <FileText size={32} />
                </div>
                <span style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
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
                  {status === 'verified' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {status}
                </span>
              </div>

              {/* Document Info */}
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#1a202c',
                lineHeight: '1.4'
              }}>{doc.fileName}</h3>
              
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: `${categoryColor}15`,
                color: categoryColor,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                {category}
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#718096' }}>Type</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>PDF</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#718096' }}>Size</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>
                    {doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#718096' }}>Uploaded</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} style={{ color: '#718096' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleDownload(doc._id, doc.fileName)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                <Download size={18} />
                Download
              </button>
            </div>
          );
        })}
      </div>

      {/* Security Notice */}
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
            <Shield size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>
              Security & Privacy
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>
              Your data is protected
            </p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #cbd5e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <Lock size={18} style={{ color: '#667eea', marginTop: '2px' }} />
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                End-to-End Encryption
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                All documents are encrypted using industry-standard AES-256 encryption and securely stored in compliance with data protection regulations.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Shield size={18} style={{ color: '#43e97b', marginTop: '2px' }} />
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                Privacy Protected
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>
                Your personal information is protected under our privacy policy and applicable data protection regulations including GDPR compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

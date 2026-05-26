import React, { useEffect, useState } from 'react';
import { Upload, Trash2, File, AlertCircle, CheckCircle, Calendar, FileText } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function DocumentManagement() {
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState('');
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('other');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
    loadInvestors();
  }, []);

  useEffect(() => {
    if (selectedInvestor) {
      loadDocuments();
    }
  }, [selectedInvestor]);

  const loadInvestors = async () => {
    try {
      const response = await adminService.getInvestorsForDocumentUpload();
      setInvestors(response.data?.data || []);
    } catch (error) {
      showMessage('Failed to load investors', 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setFile(null);
      showMessage('Please select a valid PDF file', 'error');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedInvestor) {
      showMessage('Please select an investor', 'error');
      return;
    }

    if (!file) {
      showMessage('Please select a PDF file', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('investorId', selectedInvestor);
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('description', description);

      const response = await adminService.uploadDocument(formData);
      if (response?.data?.success) {
        showMessage('Document uploaded successfully!', 'success');
        document.getElementById('fileInput').value = '';
        setFile(null);
        setDescription('');
        setDocumentType('other');
        loadDocuments();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to upload document', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!selectedInvestor) return;
    try {
      setLoadingDocuments(true);
      const response = await adminService.getDocumentsForInvestor(selectedInvestor);
      setDocuments(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await adminService.deleteDocument(documentId);
      if (response?.data?.success) {
        showMessage('Document deleted successfully', 'success');
        loadDocuments();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to delete document', 'error');
    }
  };

  return (
    <div className="content-section" style={{ padding: 0 }}>
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '24px',
          color: 'white',
          boxShadow: '0 14px 32px rgba(102, 126, 234, 0.3)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}
            >
              <Upload size={28} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
                Investor Documents
              </h1>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
                Upload, manage, and track PDF documents for each investor
              </p>
            </div>
          </div>
          {selectedInvestor && (
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(6px)',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {documents.length} file{documents.length === 1 ? '' : 's'} uploaded
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 4px' }}>
        {/* Alert */}
        {message && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 500,
              background:
                messageType === 'success'
                  ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                  : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: messageType === 'success' ? '1px solid #6ee7b7' : '1px solid #fecaca',
              color: messageType === 'success' ? '#065f46' : '#991b1b'
            }}
          >
            {messageType === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {message}
          </div>
        )}

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          style={{
            background: 'white',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'grid',
            gap: '20px'
          }}
        >
          {/* Investor Selection */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: '#374151',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Select Investor *
            </label>
            <select
              value={selectedInvestor}
              onChange={(e) => setSelectedInvestor(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #d1d5db',
                fontSize: '14px',
                background: '#ffffff',
                color: '#111827',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Choose an investor --</option>
              {investors.map((investor) => (
                <option key={investor._id} value={investor._id}>
                  {investor.name} ({investor.email})
                </option>
              ))}
            </select>
          </div>

          {/* Document Type & Description */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '14px',
                  background: '#ffffff',
                  color: '#111827',
                  cursor: 'pointer'
                }}
              >
                <option value="policy">Policy</option>
                <option value="guide">Guide</option>
                <option value="training">Training</option>
                <option value="compliance">Compliance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Add a brief summary or notes about this document"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '14px',
                  background: '#ffffff',
                  color: '#111827',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: '#374151',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Upload PDF File *
            </label>
            <label
              htmlFor="fileInput"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 24px',
                border: '2.5px dashed #c7d2fe',
                borderRadius: '14px',
                background: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.background = '#eef2ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#c7d2fe';
                e.currentTarget.style.background = '#f9fafb';
              }}
            >
              <Upload
                size={32}
                style={{
                  color: '#6366f1',
                  marginBottom: '12px'
                }}
              />
              <p
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827'
                }}
              >
                {file ? file.name : 'Click to upload or drag & drop'}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#6b7280'
                }}
              >
                Only PDF files accepted (Max 10MB)
              </p>
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                hidden
                required
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 100%)'
                : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '15px',
              padding: '16px 24px',
              borderRadius: '14px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 18px rgba(102, 126, 234, 0.35)',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.8 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(102, 126, 234, 0.35)';
              }
            }}
          >
            <Upload size={18} />
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>

        {/* Documents List */}
        {selectedInvestor && (
          <div
            style={{
              marginTop: '32px',
              background: 'white',
              padding: '28px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#111827'
                  }}
                >
                  Documents for Selected Investor
                </h2>
                <p
                  style={{
                    margin: '6px 0 0 0',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}
                >
                  {documents.length} document{documents.length === 1 ? '' : 's'} available
                </p>
              </div>
            </div>

            {loadingDocuments ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                Loading documents...
              </p>
            ) : documents.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 600,
                            color: '#111827',
                            fontSize: '14px'
                          }}
                        >
                          {doc.fileName}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              background: '#eef2ff',
                              color: '#4f46e5',
                              fontSize: '12px',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          >
                            {doc.documentType || 'other'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                          </span>
                          {typeof doc.fileSize === 'number' && (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                        {doc.description && (
                          <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc._id)}
                      style={{
                        background: '#fff1f2',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#dc2626',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff1f2';
                      }}
                      title="Delete document"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                No documents uploaded for this investor yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

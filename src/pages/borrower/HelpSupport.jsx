import React, { useState, useEffect } from 'react';
import { Send, Phone, Mail, MessageCircle, ChevronDown } from 'lucide-react';
import '../../styles/BorrowerDashboard.css';
import { submitComplaint } from '../../services/complaintService';

export default function HelpSupport() {
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    category: 'payment-issue',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [groupId, setGroupId] = useState('');

  const faqItems = [
    {
      question: 'What if I miss an EMI payment?',
      answer: 'You can contact our support team immediately. We offer flexible payment options for genuine cases. A late payment may incur a small interest charge, so please inform us as soon as possible.'
    },
    {
      question: 'Can I pay extra EMI?',
      answer: 'Yes, you can pay additional amounts to reduce your loan tenure and save on interest. Contact your agent for details on how to make early payments.'
    },
    {
      question: 'How do I update my bank details?',
      answer: 'Contact the support team with your new bank details and proof of account ownership. We will update your records within 2-3 business days.'
    },
    {
      question: 'How can I get a loan closure certificate?',
      answer: 'Once your loan is fully repaid, we automatically send you a closure certificate via email. You can also request it from our support team.'
    },
    {
      question: 'What documents do I need to keep?',
      answer: 'Keep all payment receipts, EMI statements, and loan agreement copies for your records. These are important for future reference and loan closure.'
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    // Get groupId from localStorage when component mounts
    const storedGroupId = localStorage.getItem('groupId');
    if (storedGroupId) {
      setGroupId(storedGroupId);
    }
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleChange = (e) => {
    setComplaint({
      ...complaint,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!groupId) {
        throw new Error('Group ID not found. Please log in again.');
      }

      const complaintData = {
        groupId: groupId,
        category: complaint.category,
        title: complaint.title,
        description: complaint.description,
      };

      await submitComplaint(complaintData);
      
      setMessage({ type: 'success', text: 'Your complaint has been submitted successfully. Our team will contact you soon.' });
      setComplaint({ title: '', description: '', category: 'payment-issue' });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      const errorMsg = error.message || 'Failed to submit complaint. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section" style={{ padding: 0 }}>
      <div style={{
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        padding: '34px',
        borderRadius: '16px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 14px 32px rgba(250, 112, 154, 0.28)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageCircle size={30} /> Help & Support
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.92 }}>Get assistance with your loan account - We're here to help</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', fontWeight: 700 }}>
            24/7 Available
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
        marginBottom: '22px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Get In Touch</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {[{
            icon: <Phone size={24} />,
            title: 'Phone',
            value: '1800-LOAN-999',
            subtitle: '24/7 Available',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }, {
            icon: <Mail size={24} />,
            title: 'Email',
            value: 'support@loansystem.com',
            subtitle: 'Response within 24h',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }, {
            icon: <MessageCircle size={24} />,
            title: 'Live Chat',
            value: 'Available Now',
            subtitle: '9 AM - 6 PM IST',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
          }].map((contact, idx) => (
            <div key={idx} style={{
              background: contact.gradient,
              padding: '18px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ marginBottom: '12px' }}>{contact.icon}</div>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700, opacity: 0.9 }}>{contact.title}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800' }}>{contact.value}</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.85 }}>{contact.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
        marginBottom: '22px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqItems.map((item, index) => (
            <div
              key={index}
              style={{
                background: expandedFaq === index ? '#f9fafb' : 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => toggleFaq(index)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => !expandedFaq === index && (e.currentTarget.style.background = 'white')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '14px' }}>{item.question}</span>
                <span style={{
                  transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  display: 'flex',
                  color: '#6b7280'
                }}><ChevronDown size={18} /></span>
              </div>
              {expandedFaq === index && (
                <div style={{ marginTop: '12px', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complaint Form */}
      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Submit a Complaint</h2>
        
        {message && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: message.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="complaint-form" style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>Category</label>
            <select
              name="category"
              value={complaint.category}
              onChange={handleChange}
              disabled={loading}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}
            >
              <option value="payment-issue">Payment Issue</option>
              <option value="schedule-problem">Schedule Problem</option>
              <option value="document-issue">Document Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>Subject</label>
            <input
              type="text"
              name="title"
              value={complaint.title}
              onChange={handleChange}
              placeholder="Brief subject of complaint"
              disabled={loading}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', opacity: loading ? 0.6 : 1 }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>Description</label>
            <textarea
              name="description"
              value={complaint.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
              rows="5"
              disabled={loading}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', opacity: loading ? 0.6 : 1 }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            <Send size={18} /> {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}

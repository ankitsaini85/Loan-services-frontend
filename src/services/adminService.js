import api from './api.js';

export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAllAgentCommissions = () => api.get('/admin/commissions');
export const payCommission = (agentId, amount, transactionId, note) => api.post('/admin/commissions/pay', { agentId, amount, transactionId, note });
export const backfillLoansProcessed = () => api.post('/admin/backfill-loans-processed', {});
export const backfillCommissions = () => api.post('/admin/backfill-commissions', {});
export const cleanupDuplicateCommissions = () => api.post('/admin/cleanup-duplicate-commissions', {});
export const getAgents = () => api.get('/admin/agents');
export const updateAgentStatus = (agentId, status) => api.post('/admin/agents/status', { agentId, status });
export const getLatePayments = () => api.get('/admin/collections/late-payments');
export const getDefaultAnalysis = () => api.get('/admin/collections/default-analysis');
export const getLowRecoveryAlerts = () => api.get('/admin/collections/low-recovery');
export const getCollectionEntries = () => api.get('/admin/collections/entries');
export const getInvestorFunds = () => api.get('/admin/investors/funds');
export const approveInvestor = (investorId, investedAmount, interestRate) => api.post('/admin/investors/approve', { investorId, investedAmount, interestRate });
export const getInvestorPayouts = () => api.get('/admin/investors/payouts');
export const getPendingPayouts = () => api.get('/admin/payouts/pending');
export const approveMonthlyPayout = (payoutId, data) => api.post(`/admin/payouts/${payoutId}/approve`, data);
export const markPayoutAsPaid = (payoutId, data) => api.post(`/admin/payouts/${payoutId}/mark-paid`, data);
export const rejectPayout = (payoutId, data) => api.post(`/admin/payouts/${payoutId}/reject`, data);
export const getPendingLoans = () => api.get('/admin/loans/pending');
export const approveLoan = (loanGroupId) => api.post('/admin/loans/approve', { loanGroupId });
export const rejectLoan = (loanGroupId, reason) => api.post('/admin/loans/reject', { loanGroupId, reason });

// Document Management
export const getInvestorsForDocumentUpload = () => api.get('/admin/investors-for-documents');
export const getDocumentsForInvestor = (investorId) => api.get('/admin/documents', { params: { investorId } });
export const uploadDocument = (formData) => api.post('/admin/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteDocument = (documentId) => api.delete(`/admin/documents/${documentId}`);

// Notifications
export const getNotifications = () => api.get('/admin/notifications');
export const deleteNotification = (notificationId) => api.delete(`/admin/notifications/${notificationId}`);
export const markNotificationAsRead = (notificationId) => api.post(`/admin/notifications/${notificationId}/read`, {});

// Export as adminService object for compatibility
export const adminService = {
  adminLogin,
  getAdminDashboard,
  getAllAgentCommissions,
  payCommission,
  backfillLoansProcessed,
  backfillCommissions,
  cleanupDuplicateCommissions,
  getAgents,
  updateAgentStatus,
  getLatePayments,
  getDefaultAnalysis,
  getLowRecoveryAlerts,
  getCollectionEntries,
  getInvestorFunds,
  approveInvestor,
  getInvestorPayouts,
  getPendingPayouts,
  approveMonthlyPayout,
  markPayoutAsPaid,
  rejectPayout,
  getPendingLoans,
  approveLoan,
  rejectLoan,
  getInvestorsForDocumentUpload,
  getDocumentsForInvestor,
  uploadDocument,
  deleteDocument,
  getNotifications,
  deleteNotification,
  markNotificationAsRead
};


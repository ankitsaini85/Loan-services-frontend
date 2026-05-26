import api from './api.js';

export const agentLogin = (credentials) => api.post('/agent/login', credentials);
export const registerAgent = (payload) => api.post('/agent/register', payload);
export const calculateLoan = (amount, duration = 12) => api.post('/agent/calculate-loan', { loanAmount: amount, duration });
export const getAgentDashboard = () => api.get('/agent/dashboard');
export const getActiveLoanStatus = (groupId) => api.get(`/agent/loan/${groupId}`);
export const getAgentActiveLoans = (search = '') => api.get('/agent/loans/active', { params: { search } });
export const getMyCommission = () => api.get('/agent/commission');
export const getInvestors = () => api.get('/agent/investors');
export const registerGroup = (payload) => api.post('/agent/groups', payload);
export const recordCollectionEntry = (payload) => api.post('/agent/collections', payload);
export const getBankDetails = () => api.get('/agent/bank-details');
export const updateBankDetails = (payload) => api.put('/agent/bank-details', payload);

// Notifications
export const getNotifications = () => api.get('/agent/notifications');
export const deleteNotification = (notificationId) => api.delete(`/agent/notifications/${notificationId}`);
export const markNotificationAsRead = (notificationId) => api.post(`/agent/notifications/${notificationId}/read`, {});

// Export as agentService object for compatibility
export const agentService = {
  agentLogin,
  registerAgent,
  calculateLoan,
  getAgentDashboard,
  getActiveLoanStatus,
  getAgentActiveLoans,
  getMyCommission,
  getInvestors,
  registerGroup,
  recordCollectionEntry,
  getBankDetails,
  updateBankDetails,
  getNotifications,
  deleteNotification,
  markNotificationAsRead
};


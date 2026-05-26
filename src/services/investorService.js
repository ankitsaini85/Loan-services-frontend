import api from './api.js';

export const investorLogin = (credentials) => api.post('/investor/login', credentials);
export const registerInvestor = (payload) => api.post('/investor/register', payload);
export const getInvestorDashboard = () => api.get('/investor/dashboard');
export const getMyInvestments = () => api.get('/investor/investments');
export const getFundStatus = () => api.get('/investor/funds');
export const getPayoutHistory = () => api.get('/investor/payouts');

// Documents
export const getDocuments = () => api.get('/investor/documents');
export const downloadDocument = (documentId) => api.get(`/investor/documents/${documentId}/download`, {
	responseType: 'blob'
});

export const investorService = {
	investorLogin,
	registerInvestor,
	getInvestorDashboard,
	getMyInvestments,
	getFundStatus,
	getPayoutHistory,
	getDocuments,
	downloadDocument,
};

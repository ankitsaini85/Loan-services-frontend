import api from './api.js';

export const borrowerLogin = (credentials) => api.post('/borrower/login', credentials);
export const getGroupStatus = (groupId) => api.get(`/borrower/group/${groupId}`);
export const getRepaymentSchedule = (groupId) => api.get(`/borrower/schedule/${groupId}`);
export const getPaymentHistory = (groupId) => api.get(`/borrower/payment-history/${groupId}`);

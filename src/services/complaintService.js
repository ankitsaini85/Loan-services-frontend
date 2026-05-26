import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/complaints';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const submitComplaint = async (complaintData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, complaintData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getGroupComplaints = async (groupId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllComplaints = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getComplaintById = async (complaintId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${complaintId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateComplaintStatus = async (complaintId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${complaintId}`, updates, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

import axios from "axios";
import { baseUrl } from "../features/config";

// Get JWT token from localStorage
const getAuthToken = () => localStorage.getItem("bictoken");

// Axios headers with token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  },
});

// ✅ CREATE Escalation (with file upload)
export const createEscalationApi = async (formData) => {
  try {
    const response = await fetch(`${baseUrl}/api/escalations/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
        // Note: DO NOT set Content-Type here for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit escalation');
    }

    const data = await response.json();
    alert("Escalation submitted successfully!");
    return data;
  } catch (error) {
    console.error('Create Escalation Error:', error);
    alert(`Error: ${error.message || 'Failed to submit escalation'}`);
    throw error;
  }
};

// ✅ READ All Escalations
export const getEscalationsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/escalations/getescalations`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Get Escalations Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ READ Escalation by ID
export const getEscalationByIdApi = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/escalations/getEscalationById/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Get Escalation By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ UPDATE Escalation (normal JSON)
export const updateEscalationApi = async (id, payload) => {
  try {
    const response = await axios.put(`${baseUrl}/api/escalations/escalations/${id}`, payload, authHeader());
    return response.data;
  } catch (error) {
    console.error("Update Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE Escalation
export const deleteEscalationApi = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/escalations/escalations/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Delete Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const totalEscalationCountsApi = async () => {
  const token = getAuthToken(); 
  const res = await axios.get(`${baseUrl}/api/escalations/totalescalationcounts`, {
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.count; 
};

export const getEscalationAnalyticsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/analytics/getescalationanalytics`, authHeader());
    return response.data; 
  } catch (error) {
    console.error("Fetch Escalation Analytics Error:", error.response?.data || error.message);
    throw error;    
  }
};

export const overviewAnalyticsRangeApi = async (range = '7d') => {
  const res = await axios.get(`/api/analytics/evaluations?range=${range}`);
  return res.data;
};
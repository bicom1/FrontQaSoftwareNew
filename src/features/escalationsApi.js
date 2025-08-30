// src/features/escalationApi.js
import axios from "axios";
import { baseUrl, getToken } from "./config";

// Axios headers with token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const createEscalationApi = async (payload) => {
  try {
    let config = authHeader();
    let data = payload;

    // If payload has 'audio' as a file, convert to FormData
    if (payload.audio instanceof File) {
      data = new FormData();
      for (const key in payload) {
        if (payload[key] !== null && payload[key] !== undefined) {
          data.append(key, payload[key]);
        }
      }
      // Let browser set Content-Type automatically
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      // JSON submission
      config.headers["Content-Type"] = "application/json";
    }

    const response = await axios.post(`${baseUrl}/api/escalations`, data, config);
    alert("Escalation submitted successfully!");
    return response.data;
  } catch (error) {
    console.error("Create Escalation Error:", error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.message || error.message}`);
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

// ✅ UPDATE Escalation
export const updateEscalationApi = async (id, payload) => {
  try {
    const response = await axios.put(`${baseUrl}/api/escalations/${id}`, payload, authHeader());
    return response.data;
  } catch (error) {
    console.error("Update Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE Escalation
export const deleteEscalationApi = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/escalations/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Delete Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ TOTAL Escalation Counts
export const totalEscalationCountsApi = async () => {
  try {
    const token = getToken();
    const res = await axios.get(`${baseUrl}/api/escalations/totalescalationcounts`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data.count;
  } catch (error) {
    console.error("Total Escalation Counts Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Escalation Analytics
export const getEscalationAnalyticsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/analytics/getescalationanalytics`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Fetch Escalation Analytics Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Overview Analytics with Range
export const overviewAnalyticsRangeApi = async (range = "7d") => {
  try {
    const response = await axios.get(`${baseUrl}/api/analytics/evaluations?range=${range}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Fetch Overview Analytics Error:", error.response?.data || error.message);
    throw error;
  }
};

import axios from "axios";
import { baseUrl, getToken } from "../features/config";





const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export const createMarketingApi = async (payload) => {
  try {
    const res = await axios.post(`${baseUrl}/api/marketing/`, payload, authHeader());
    return res.data;
  } catch (error) {
    console.error("Create Marketing Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getMarketingApi = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/marketing/getmarketing/`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Get Marketing Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ READ Single Marketing Entry by ID
export const getMarketingByIdApi = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/marketing/getmarketingbyid/${id}`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Get Marketing By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ UPDATE Marketing Entry
export const updateMarketingApi = async (id, payload) => {
  try {
    const res = await axios.put(`${baseUrl}/api/marketing/getmarketing/${id}`, payload, authHeader());
    return res.data;
  } catch (error) {
    console.error("Update Marketing Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE Marketing Entry
export const deleteMarketingApi = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/marketing/marketing${id}`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Delete Marketing Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ TOTAL MARKETING COUNTS
export const totalMarketingCountsApi = async () => {
  try {
    const token = getToken(); 
    const res = await axios.get(`${baseUrl}/api/marketing/totalmarketingcounts`, {
      withCredentials: true,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data.count; 
  } catch (error) {
    console.error("Total Marketing Count Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getMarketingAnalyticsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/analytics/getMarketingAnalytics`, authHeader());
    return response.data; 
  } catch (error) {
    console.error("Fetch Escalation Analytics Error:", error.response?.data || error.message);
    throw error;    
  }
};

import axios from "axios";
import { baseUrl, getToken } from "../features/config";


const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getDailyMarketingSubmissions = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/marketing/dailymarketingformsubmit`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (res.data.success) {
      return res.data.data.map((item) => ({
        date: item.date,
        count: item.count,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching daily marketing submissions:", error);
    return [];
  }
};


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

// ✅ Admin/QC: READ All Marketing Entries (cross-user)
export const getAllMarketingAdminApi = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/marketing/all`, authHeader());
    return res.data;
  } catch (error) {
    console.error(
      "Get All Marketing (Admin) Error:",
      error.response?.data || error.message
    );
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
    const res = await axios.put(
      `${baseUrl}/api/marketing/marketing/${id}`,
      payload,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Update Marketing Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE Marketing Entry
export const deleteMarketingApi = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/marketing/marketing/${id}`, authHeader());
    return res.data;
  } catch (error) {
    console.error("Delete Marketing Error:", error.response?.data || error.message);
    throw error;
  }
};

export const totalMarketingCountsApi = async () => {
    const response = await fetch(`${baseUrl}/api/marketing/totalmarketingcounts`, {
      headers: authHeader(),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch Marketing Form count");
    }
  
    return await response.json();
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

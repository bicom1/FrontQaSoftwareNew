// src/features/bitrixApi.js
import axios from "axios";
import { baseUrl, getToken } from "../features/config";



// Auth header with token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Fetch full lead details by ID
export const getBitrixLeadDetailsById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/bitrix24/user-leads/${id}`, authHeader());
    console.log("📦 Bitrix API Response:", response.data); 
    return response.data.result; 
  } catch (error) {
    console.error("❌ Error fetching Bitrix lead:", error?.response?.data || error.message);
    throw error;
  }
};

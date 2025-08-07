// src/features/bitrixApi.js
import axios from "axios";
import { baseUrl } from "../features/config";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("bictoken");

// Auth header with token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Fetch full lead details by ID
export const getBitrixLeadDetailsById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/bitrix24/leads/${id}`, authHeader());
    console.log("📦 Bitrix API Response:", response.data); // ✅ Debug log
    return response.data.result; // ✅ Unwrap result
  } catch (error) {
    console.error("❌ Error fetching Bitrix lead:", error?.response?.data || error.message);
    throw error;
  }
};

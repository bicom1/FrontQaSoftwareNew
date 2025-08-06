import axios from "axios";
import { baseUrl } from "../features/config";

// Retrieve token from localStorage
const getAuthToken = () => localStorage.getItem("bictoken");

// Bitrix Auth Header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Fetch full lead details by ID
export const getBitrixLeadDetailsById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/bitrix24/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Bitrix lead:", error);
      throw error;
    }
  };
  

import axios from "axios";
import { baseUrl } from "../features/config";

// const getAuthToken = () => localStorage.getItem("bictoken");


export const createEscalationsApi = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}/api/escalations/`, payload);
      return response.data;
    } catch (error) {
      console.error('Escalation API error:', error.response?.data || error.message);
      throw error;
    }
  };
  
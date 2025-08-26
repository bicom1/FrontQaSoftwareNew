import axios from "axios";
import { baseUrl, getToken } from "../features/config";




// Axios config with auth
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// ✅ CREATE Evaluation
export const createEvaluationsApi = async (data) => {
  const token = getToken(); // should return JWT stored in localStorage/cookies

  const res = await axios.post(`${baseUrl}/api/evaluations`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ✅ READ All Evaluations
export const getEvaluationsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/evaluations/getevaluations`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Get Evaluations Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ READ Single Evaluation by ID
export const getEvaluationByIdApi = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/evaluations/getevaluations/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Get Evaluation By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ UPDATE Evaluation
export const updateEvaluationApi = async (id, payload) => {
  try {
    const response = await axios.put(`${baseUrl}/api/evaluations/evaluations/${id}`, payload, authHeader());
    return response.data;
  } catch (error) {
    console.error("Update Evaluation Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE Evaluation
export const deleteEvaluationApi = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/evaluations/evaluations/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Delete Evaluation Error:", error.response?.data || error.message);
    throw error;
  }
};


  export const totalEvaluationCountsApi = async () => {
    const token = getToken(); 
    const res = await axios.get(`${baseUrl}/api/evaluations/totalevaluationcounts`, {
      withCredentials: true,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data.count; 
  };
  

  export const getEvaluationAnalyticsApi = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/analytics/getEvaluationAnalytics`, authHeader());
      return response.data; 
    } catch (error) {
      console.error("Fetch Escalation Analytics Error:", error.response?.data || error.message);
      throw error;    
    }
  };
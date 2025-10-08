import axios from "axios";
import { baseUrl, getToken } from "../features/config";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

export const getDailyEvaluations = async () => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/dailyEvaluationFormSubmit`,
      authHeader()
    );
    
    // Sort by date ascending and get last 5
    const sortedData = res.data.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return sortedData.slice(-5).map((item) => ({
      date: item.date,
      count: item.count,
    }));
  } catch (error) {
    console.error("Error fetching daily evaluations:", error);
    return [];
  }
};

export const getEvaluationOnwerApi = async (ownerId) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/owner/${ownerId}`,
      authHeader()
    );
    // Always return an array
    return res.data?.evaluations || [];
  } catch (err) {
    console.error("Evaluation API error:", err);
    return [];
  }
};

export const createReportEvaluationsApi = async ({ 
  startDate, 
  endDate, 
  agentName, 
  teamleader 
}) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/datefilterevaluation?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&teamleader=${teamleader}`,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Create Report Evaluations Error:", error.response?.data || error.message);
    throw error;
  }
};

export const createEvaluationApi = async (evaluation, otherReason = "") => {
  try {
    // Create a clean object instead of FormData
    const submissionData = {
      ...evaluation
    };

    // Handle "Other" reason
    if (evaluation.escAction === "Other" && otherReason.trim()) {
      submissionData.escAction = otherReason.trim();
    }

    // Remove audio from the main data if it's a file
    if (submissionData.audio && submissionData.audio instanceof File) {
      delete submissionData.audio;
    }

    // Ensure owner is set
    submissionData.owner = evaluation.owner;

    const response = await axios.post(
      `${baseUrl}/api/evaluations/frontend`,
      submissionData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Create Evaluation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEvaluationsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/getevaluations`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Get Evaluations Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEvaluationByIdApi = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/getevaluations/${id}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Get Evaluation By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateEvaluationApi = async (id, payload) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/evaluations/evaluations/${id}`,
      payload,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Update Evaluation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteEvaluationApi = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/evaluations/evaluations/${id}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Delete Evaluation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const totalEvaluationCountsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/totalevaluationcounts`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Total Evaluation Counts Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEvaluationAnalyticsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/analytics/getEvaluationAnalytics`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Fetch Evaluation Analytics Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEvaluationsByUserEmailApi = async (userEmail) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/useremail/${userEmail}`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Evaluations by User Email Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEvaluationsUseremailPublishedApi = async (userEmail) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/useremail/${userEmail}/published`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Published Evaluations by User Email Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEvaluationsByAgentNameApi = async (agentName) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/evaluations/drafts?agentName=${agentName}`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Evaluations by Agent Name Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEvaluationsPublishedApi = async (agentName) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/evaluations/published?agentName=${agentName}`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Published Evaluations Error:", error.response?.data || error.message);
    return [];
  }
};

export const publishEvaluationApi = async (evaluationId) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/api/evaluations/evaluations/${evaluationId}/publish`,
      {},
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Publish Evaluation Error:", error.response?.data || error.message);
    throw error;
  }
};
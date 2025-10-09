// src/features/api/escalationApi.js
import axios from "axios";
import { baseUrl, getToken } from "../features/config";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

export const getDailyEscalations = async () => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/escalations/dailyescalationformsubmit`,
      authHeader()
    );

    if (res.data.success) {
      return res.data.data.map((item) => ({
        date: item.date,
        count: item.count,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching daily escalations:", error);
    return [];
  }
};

export const getEscalationOnwerApi = async (ownerId) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/escalations/owner/${ownerId}`,
      authHeader()
    );
    // Always return an array
    return res.data?.data || [];
  } catch (err) {
    console.error("Escalation API error:", err);
    return [];
  }
};

export const createReportEscalationsApi = async ({ 
  startDate, 
  endDate, 
  agentName, 
  teamleader 
}) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/escalations/datefiltereescalation?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&teamleader=${teamleader}`,
      authHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Create Report Escalations Error:", error.response?.data || error.message);
    throw error;
  }
};

export const createEscalationApi = async (escalation, otherReason = "") => {
  try {
    // Create a clean object instead of FormData
    const submissionData = {
      ...escalation
    };

    // Handle "Other" reason
    if (escalation.escAction === "Other" && otherReason.trim()) {
      submissionData.escAction = otherReason.trim();
    }

    // Remove audio from the main data if it's a file
    if (submissionData.audio && submissionData.audio instanceof File) {
      delete submissionData.audio;
    }

    // Ensure owner is set
    submissionData.owner = escalation.owner;

    const response = await axios.post(
      `${baseUrl}/api/escalations/frontend`,
      submissionData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Create Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEscalationsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Get Escalations Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEscalationsPublishedApi = async (agentName) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations/escalations/published?agentName=${agentName}`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Published Escalations Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEscalationsByAgentNameApi = async (agentName) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations/escalations/drafts?agentName=${agentName}`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Escalations by Agent Name Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEscalationsByUserEmailApi = async (userEmail) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations/useremail/${userEmail}`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Escalations by User Email Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEscalationsUseremailPublishedApi = async (userEmail) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations/useremail/${userEmail}/published`,
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Get Published Escalations by User Email Error:", error.response?.data || error.message);
    return [];
  }
};

export const getEscalationByIdApi = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations/${id}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Get Escalation By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateEscalationApi = async (id, updatedData) => {
  try {
    const formData = new FormData();

    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key !== "audio") formData.append(key, value);
      }
    });

    if (updatedData.audio) formData.append("audio", updatedData.audio);

    const response = await axios.put(
      `${baseUrl}/api/escalations/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const patchEscalationApi = async (id, updatedData) => {
  try {
    const formData = new FormData();

    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key !== "audio") formData.append(key, value);
      }
    });

    if (updatedData.audio) formData.append("audio", updatedData.audio);

    const response = await axios.patch(
      `${baseUrl}/api/escalations/escalation-patch/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Patch Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteEscalationApi = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/escalations/${id}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Delete Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};

export const totalEscalationCountsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/escalations/totalescalationscounts`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Total Escalation Counts Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEscalationAnalyticsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/analytics/getescalationAnalytics`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Get Escalation Analytics Error:", error.response?.data || error.message);
    throw error;
  }
};

export const overviewAnalyticsRangeApi = async (range = '7d') => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/analytics/evaluations?range=${range}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Overview Analytics Range Error:", error.response?.data || error.message);
    throw error;
  }
};

export const publishEscalationApi = async (escalationId) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/api/escalations/escalations/${escalationId}/publish`,
      {},
      authHeader()
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Publish Escalation Error:", error.response?.data || error.message);
    throw error;
  }
};
// src/features/api/escalationApi.js
import axios from "axios";

import { baseUrl, getToken } from "../features/config"; 

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Create escalation from frontend
 * @param {Object} queryParams - Query data like { leadID, agentName, leadsource }
 * @param {Object} bodyData - Body data like { leadStatus, teamleader, escSeverity, issueIden, escAction, documentation }
 * @param {File} audioFile - Optional audio file
 */
export const createWebhookEscalationApi = async (queryParams, bodyData, audioFile) => {
  try {
    // Construct query string
    const queryString = new URLSearchParams(queryParams).toString();

    // FormData for body + file
    const formData = new FormData();
    Object.entries(bodyData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (audioFile) {
      formData.append("audio", audioFile);
    }

    const response = await axios.post(
      `${baseUrl}/api/bitrix24/webhook?${queryString}`,
      formData,
      {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating escalation:", error.response?.data || error.message);
    throw error;
  }
};



export const getEscalationOnwerApi = async (ownerId) => {
  const token = getToken();
  try {
    const res = await axios.get(`${baseUrl}/api/escalations/owner/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Always return an array
    return res.data?.data || [];
  } catch (err) {
    console.error("Escalation API error:", err);
    return [];
  }
};

export const getEscalationsByAgentNameApi = async (agentName) => {
  const token = getToken();
  try {
    const res = await axios.get(`${baseUrl}/api/escalations/agent/${agentName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Always return an array
    return res.data?.data || [];
  } catch (err) {
    console.error("Escalation API error:", err);
    return [];
  }
};

export const createReportEscalationsApi = async ({ startDate, endDate, agentName,teamleader }) => {
   const token = getToken(); 
  try {
    const res = await axios.get(
      `${baseUrl}/api/escalations/datefiltereescalation?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&teamleader=${teamleader}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};


export const createEscalationApi = async (escalation, otherReason = "") => {
  const formData = new FormData();

  Object.entries(escalation).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (key !== "audio") formData.append(key, value);
    }
  });

  if (escalation.audio) formData.append("audio", escalation.audio);

  if (escalation.escAction === "Other" && otherReason.trim()) {
    formData.set("escAction", otherReason.trim());
  }

  formData.set("owner", escalation.owner);

  const response = await fetch(`${baseUrl}/api/escalations`, {
    method: "POST",
    body: formData,
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit escalation");
  }

  return await response.json();
};


export const getEscalationsApi = async ()=>{
  const responce = await fetch (`${baseUrl}/api/escalations`,{
    headers: authHeader(),
  })
  if (!responce.ok){
    const errorData = await responce.json()
    throw new Error(errorData.message || "fetch Failed")
  }
}

export const getEscalationByIdApi = async (id) => {
  const response = await fetch(`${baseUrl}/api/escalations/${id}`, {
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch escalation");
  }

  return await response.json();
};

export const updateEscalationApi = async (id, updatedData) => {
  const formData = new FormData();

  Object.entries(updatedData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (key !== "audio") formData.append(key, value);
    }
  });

  if (updatedData.audio) formData.append("audio", updatedData.audio);

  const response = await fetch(`${baseUrl}/api/escalations/${id}`, {
    method: "PUT",
    body: formData,
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update escalation");
  }

  return await response.json();
};


export const deleteEscalationApi = async (id) => {
  const response = await fetch(`${baseUrl}/api/escalations/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete escalation");
  }

  return await response.json();
};


export const totalEscalationCountsApi = async () => {
  const response = await fetch(`${baseUrl}/api/escalations/totalescalationscounts`, {
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch escalation count");
  }

  return await response.json();
};

 

  export const getEscalationAnalyticsApi = async ()=> {
    const response = await fetch(`${baseUrl}/api/analytics/getescalationAnalytics`,{
      headers: authHeader()
    })

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Analytics ");
    }
  return await response.json();
    

  }

  export const overviewAnalyticsRangeApi = async (range = '7d') => {
  const res = await axios.get(`/api/analytics/evaluations?range=${range}`);
  return res.data;
};





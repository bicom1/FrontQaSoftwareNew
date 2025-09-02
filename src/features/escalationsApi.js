// src/features/api/escalationApi.js
import axios from "axios";

import { baseUrl, getToken } from "../features/config"; 


// Helper for headers
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- CREATE Escalation ---
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


// --- READ Escalations (all or filtered) ---

export const getEscalationsApi = async ()=>{
  const responce = await fetch (`${baseUrl}/api/escalations`,{
    headers: authHeader(),
  })
  if (!responce.ok){
    const errorData = await responce.json()
    throw new Error(errorData.message || "fetch Failed")
  }
}


// --- READ single Escalation ---
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

// --- UPDATE Escalation ---
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

// --- DELETE Escalation ---
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

// --- GET total escalation counts ---
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



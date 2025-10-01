  // src/features/api/escalationApi.js
  import axios from "axios";

  import { baseUrl, getToken } from "../features/config"; 

  const authHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };


  export const getDailyEscalations = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/escalations/dailyescalationformsubmit`, {
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
      console.error("Error fetching daily escalations:", error);
      return [];
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
    // Create a clean object instead of FormData
    const submissionData = {
      ...escalation
    };

    // Handle "Other" reason
    if (escalation.escAction === "Other" && otherReason.trim()) {
      submissionData.escAction = otherReason.trim();
    }

    // Remove audio from the main data if it's a file (we'll handle it separately if needed)
    if (submissionData.audio && submissionData.audio instanceof File) {
      // If you need to handle file upload, you'll need to use FormData
      // Otherwise, remove it for JSON submission
      delete submissionData.audio;
    }

    // Ensure owner is set
    submissionData.owner = escalation.owner;

    const response = await fetch(`${baseUrl}/api/escalations/escalations/frontend`, {
      method: "POST",
      body: JSON.stringify(submissionData),
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
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

// features/escalationsApi.js
export const getEscalationsPublishedApi = async (agentName) => {
  const response = await fetch(`${baseUrl}/api/escalations/escalations/published?agentName=${agentName}`);
  const data = await response.json();
  return data.data || data; // Adjust based on your API response structure
};

export const getEscalationsByAgentNameApi = async (agentName) => {
  const response = await fetch(`${baseUrl}/api/escalations/escalations/drafts?agentName=${agentName}`);
  const data = await response.json();
  return data.data || data; // Adjust based on your API response structure
};

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
  export const patchEscalationApi = async (id, updatedData) => {
    const formData = new FormData();

    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key !== "audio") formData.append(key, value);
      }
    });

    if (updatedData.audio) formData.append("audio", updatedData.audio);

    const response = await fetch(`${baseUrl}/api/escalations/escalation-patch/${id}`, {
      method: "PATCH",
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

  export const publishEscalationApi = async (escalationId) => {
  try {
    const response = await fetch(`${baseUrl}/api/escalations/escalations/${escalationId}/publish`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to publish escalation: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error publishing escalation:", error);
    throw error;
  }
};





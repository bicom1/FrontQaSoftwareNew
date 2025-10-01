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
    const res = await axios.get(`${baseUrl}/api/evaluations/dailyEvaluationFormSubmit`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
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
  const token = getToken();
  try {
    const res = await axios.get(`${baseUrl}/api/evaluations/owner/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Always return an array
    return res.data?.evaluations || [];
  } catch (err) {
    console.error("Evaluation API error:", err);
    return [];
  }
};



  export const createReportEvaluationsApi = async ({ startDate, endDate, agentName,teamleader }) => {
   const token = getToken(); 
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/datefilterevaluation?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&teamleader=${teamleader}`,
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



export const createEvaluationApi = async (evaluation, otherReason = "") => {
    // Create a clean object instead of FormData
    const submissionData = {
      ...evaluation
    };

    // Handle "Other" reason
    if (evaluation.escAction === "Other" && otherReason.trim()) {
      submissionData.escAction = otherReason.trim();
    }

    // Remove audio from the main data if it's a file (we'll handle it separately if needed)
    if (submissionData.audio && submissionData.audio instanceof File) {
      // If you need to handle file upload, you'll need to use FormData
      // Otherwise, remove it for JSON submission
      delete submissionData.audio;
    }

    // Ensure owner is set
    submissionData.owner = evaluation.owner;

    const response = await fetch(`${baseUrl}/api/evaluations/evaluations/frontend`, {
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


  // export const totalEvaluationCountsApi = async () => {
  //   const token = getToken(); 
  //   const res = await axios.get(`${baseUrl}/api/evaluations/totalevaluationcounts`, {
  //     withCredentials: true,
  //     headers: {
  //       Authorization: token ? `Bearer ${token}` : "",
  //     },
  //   });
  //   return res.data.count; 
  // };

  export const totalEvaluationCountsApi = async () => {
    const response = await fetch(`${baseUrl}/api/evaluations/totalevaluationcounts`, {
      headers: authHeader(),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch Evaluation count");
    }
  
    return await response.json();
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

// export const getEvaluationsByAgentNameApi = async (agentName) => {
//   const token = getToken();
//   try {
//     const res = await axios.get(`${baseUrl}/api/evaluations/agent/${agentName}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     // Always return an array
//     return res.data?.data || [];
//   } catch (err) {
//     console.error("Evaluation API error:", err);
//     return [];
//   }
// };

export const getEvaluationsByAgentNameApi = async (agentName) => {
  const response = await fetch(`${baseUrl}/api/evaluations/evaluations/drafts?agentName=${agentName}`);
  const data = await response.json();
  return data.data || data; // Adjust based on your API response structure
};

export const getEvaluationsPublishedApi = async (agentName) => {
  const response = await fetch(`${baseUrl}/api/evaluations/evaluations/published?agentName=${agentName}`);
  const data = await response.json();
  return data.data || data; // Adjust based on your API response structure
};

export const publishEvaluationApi = async (evaluationId) => {
  try {
    const response = await fetch(`${baseUrl}/api/evaluations/evaluations/${evaluationId}/publish`, {
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


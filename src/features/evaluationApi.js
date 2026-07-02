// // import axios from "axios";
// // import { baseUrl, getToken } from "../features/config";

// // export const getDailyEvaluations = async () => {
// //   try {
// //     const res = await axios.get(
// //       `${baseUrl}/api/evaluations/dailyevaluationformsubmit`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${getToken()}`,
// //         },
// //       }
// //     );
// //     // Sort by date ascending and get last 5
// //     const sortedData = res.data.sort(
// //       (a, b) => new Date(a.date) - new Date(b.date)
// //     );
// //     return sortedData.slice(-5).map((item) => ({
// //       date: item.date,
// //       count: item.count,
// //     }));
// //   } catch (error) {
// //     console.error("Error fetching daily evaluations:", error);
// //     return [];
// //   }
// // };

// // export const getEvaluationOnwerApi = async (ownerId) => {
// //   const token = getToken();
// //   try {
// //     const res = await axios.get(`${baseUrl}/api/evaluations/owner/${ownerId}`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     // Always return an array
// //     return res.data?.evaluations || [];
// //   } catch (err) {
// //     console.error("Evaluation API error:", err);
// //     return [];
// //   }
// // };

// // export const createReportEvaluationsApi = async ({
// //   startDate,
// //   endDate,
// //   agentName,
// //   teamleader,
// // }) => {
// //   const token = getToken();
// //   try {
// //     const res = await axios.get(
// //       `${baseUrl}/api/evaluations/datefilterevaluation?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&teamleader=${teamleader}`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       }
// //     );
// //     return res;
// //   } catch (error) {
// //     if (error.response) {
// //       return error.response;
// //     }
// //     throw error;
// //   }
// // };

// // // Axios config with auth
// // const authHeader = () => ({
// //   headers: {
// //     Authorization: `Bearer ${getToken()}`,
// //     "Content-Type": "application/json",
// //   },
// // });

// // // ✅ CREATE Evaluation
// // export const createEvaluationsApi = async (data) => {
// //   const token = getToken(); // should return JWT stored in localStorage/cookies

// //   // Try primary endpoint first; if not found, fall back to legacy paths
// //   try {
// //     const res = await axios.post(`${baseUrl}/api/evaluations`, data, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });
// //     return res.data;
// //   } catch (err) {
// //     if (err?.response?.status === 404) {
// //       // Fallback 1: legacy frontend route
// //       try {
// //         const resFallbackFrontend = await axios.post(
// //           `${baseUrl}/api/evaluations/frontend`,
// //           data,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         return resFallbackFrontend.data;
// //       } catch (err2) {
// //         if (err2?.response?.status === 404) {
// //           // Fallback 2: possible create route
// //           const resFallbackCreate = await axios.post(
// //             `${baseUrl}/api/evaluations/create`,
// //             data,
// //             {
// //               headers: {
// //                 Authorization: `Bearer ${token}`,
// //               },
// //             }
// //           );
// //           return resFallbackCreate.data;
// //         }
// //         throw err2;
// //       }
// //     }
// //     throw err;
// //   }
// // };

// // // Backward-compatible alias for components importing createEvaluationApi
// // export const createEvaluationApi = async (evaluation, otherReason = "") => {
// //   // Preserve passed evaluation object without mutating caller state
// //   const submissionData = { ...evaluation };

// //   // Map any optional fields if present (kept for compatibility)
// //   if (submissionData.escAction === "Other" && otherReason?.trim()) {
// //     submissionData.escAction = otherReason.trim();
// //   }

// //   // Ensure owner is set from evaluation if available
// //   if (evaluation?.owner && !submissionData.owner) {
// //     submissionData.owner = evaluation.owner;
// //   }

// //   // Delegate to the resilient creator
// //   return await createEvaluationsApi(submissionData);
// // };

// // // ✅ READ All Evaluations
// // export const getEvaluationsApi = async () => {
// //   try {
// //     const response = await axios.get(
// //       `${baseUrl}/api/evaluations/getevaluations`,
// //       authHeader()
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error(
// //       "Get Evaluations Error:",
// //       error.response?.data || error.message
// //     );
// //     throw error;
// //   }
// // };

// // // ✅ READ Single Evaluation by ID
// // export const getEvaluationByIdApi = async (id) => {
// //   try {
// //     const response = await axios.get(
// //       `${baseUrl}/api/evaluations/getevaluations/${id}`,
// //       authHeader()
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error(
// //       "Get Evaluation By ID Error:",
// //       error.response?.data || error.message
// //     );
// //     throw error;
// //   }
// // };

// // // ✅ UPDATE Evaluation
// // export const updateEvaluationApi = async (id, payload) => {
// //   try {
// //     const response = await axios.put(
// //       `${baseUrl}/api/evaluations/evaluations/${id}`,
// //       payload,
// //       authHeader()
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error(
// //       "Update Evaluation Error:",
// //       error.response?.data || error.message
// //     );
// //     throw error;
// //   }
// // };

// // // ✅ DELETE Evaluation
// // export const deleteEvaluationApi = async (id) => {
// //   try {
// //     const response = await axios.delete(
// //       `${baseUrl}/api/evaluations/evaluations/${id}`,
// //       authHeader()
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error(
// //       "Delete Evaluation Error:",
// //       error.response?.data || error.message
// //     );
// //     throw error;
// //   }
// // };

// // // export const totalEvaluationCountsApi = async () => {
// // //   const token = getToken();
// // //   const res = await axios.get(`${baseUrl}/api/evaluations/totalevaluationcounts`, {
// // //     withCredentials: true,
// // //     headers: {
// // //       Authorization: token ? `Bearer ${token}` : "",
// // //     },
// // //   });
// // //   return res.data.count;
// // // };

// // export const totalEvaluationCountsApi = async () => {
// //   const response = await fetch(
// //     `${baseUrl}/api/evaluations/totalevaluationcounts`,
// //     {
// //       headers: authHeader(),
// //     }
// //   );

// //   if (!response.ok) {
// //     const errorData = await response.json();
// //     throw new Error(errorData.message || "Failed to fetch Evaluation count");
// //   }

// //   return await response.json();
// // };

// // export const getEvaluationAnalyticsApi = async () => {
// //   try {
// //     const response = await axios.get(
// //       `${baseUrl}/api/analytics/getEvaluationAnalytics`,
// //       authHeader()
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error(
// //       "Fetch Escalation Analytics Error:",
// //       error.response?.data || error.message
// //     );
// //     throw error;
// //   }
// // };

// // export const getEvaluationsByAgentNameApi = async (agentName) => {
// //   const token = getToken();
// //   try {
// //     const res = await axios.get(
// //       `${baseUrl}/api/evaluations/agent/${agentName}`,
// //       {
// //         headers: { Authorization: `Bearer ${token}` },
// //       }
// //     );
// //     // Always return an array
// //     return res.data?.data || [];
// //   } catch (err) {
// //     console.error("Evaluation API error:", err);
// //     return [];
// //   }
// // };

// // // Optional helper used by some screens: fetch by user email
// // export const getEvaluationsByUserEmailApi = async (userEmail) => {
// //   const token = getToken();
// //   try {
// //     const res = await axios.get(
// //       `${baseUrl}/api/evaluations/useremail/${encodeURIComponent(userEmail)}`,
// //       {
// //         headers: { Authorization: `Bearer ${token}` },
// //       }
// //     );
// //     return res.data?.data || res.data || [];
// //   } catch (err) {
// //     console.error("Evaluation API error:", err);
// //     return [];
// //   }
// // };

// // export const getEvaluationsUseremailPublishedApi = async (userEmail) => {
// //   try {
// //     const response = await axios.get(
// //       `${baseUrl}/api/evaluations/useremail/${encodeURIComponent(
// //         userEmail
// //       )}/published`,
// //       authHeader()
// //     );
// //     return response.data?.data || response.data || [];
// //   } catch (error) {
// //     console.error("Evaluation API error:", error);
// //     return [];
// //   }
// // };

// // // export const getEvaluationOnwerApi = async (ownerId ) => {
// // //   const token = getToken();
// // //   return await axios.get(`${baseUrl}/api/evaluations/owner/${ownerId }`, {
// // //     headers: {
// // //       Authorization: `Bearer ${token}`,
// // //     },
// // //   });
// // // };
// // export const publishEvaluationApi = async (evaluationId) => {
// //   try {
// //     const response = await axios.patch(
// //       `${baseUrl}/api/evaluations/evaluations/${evaluationId}/publish`,
// //       {},
// //       authHeader()
// //     );
// //     return response.data?.data || response.data;
// //   } catch (error) {
// //     console.error(
// //       "Publish Evaluation Error:",
// //       error.response?.data || error.message
// //     );
// //     throw error;
// //   }
// // };
// import axios from "axios";
// import { baseUrl, getToken } from "./config";

// // Axios config with auth
// const authHeader = () => ({
//   headers: {
//     Authorization: `Bearer ${getToken()}`,
//     "Content-Type": "application/json",
//   },
// });

// export const getDailyEvaluations = async () => {
//   try {
//     const res = await axios.get(
//       `${baseUrl}/api/evaluations/dailyevaluationformsubmit`,
//       authHeader()
//     );
//     const sortedData = res.data.sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );
//     return sortedData.slice(-5).map((item) => ({
//       date: item.date,
//       count: item.count,
//     }));
//   } catch (error) {
//     console.error("Error fetching daily evaluations:", error);
//     return [];
//   }
// };

// export const createEvaluationsApi = async (data) => {
//   const token = getToken();
//   try {
//     const res = await axios.post(`${baseUrl}/api/evaluations`, data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (err) {
//     // Fallback logic for legacy routes
//     if (err?.response?.status === 404) {
//       try {
//         const resFallback = await axios.post(
//           `${baseUrl}/api/evaluations/frontend`,
//           data,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         return resFallback.data;
//       } catch (err2) {
//         throw err2;
//       }
//     }
//     throw err;
//   }
// };

// // Alias for compatibility
// export const createEvaluationApi = async (evaluation, otherReason = "") => {
//   const submissionData = { ...evaluation };
//   if (submissionData.escAction === "Other" && otherReason?.trim()) {
//     submissionData.escAction = otherReason.trim();
//   }
//   if (evaluation?.owner && !submissionData.owner) {
//     submissionData.owner = evaluation.owner;
//   }
//   return await createEvaluationsApi(submissionData);
// };

// export const getEvaluationsApi = async () => {
//   try {
//     const response = await axios.get(
//       `${baseUrl}/api/evaluations/getevaluations`,
//       authHeader()
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Get Evaluations Error:", error);
//     throw error;
//   }
// };

// export const getEvaluationByIdApi = async (id) => {
//   try {
//     const response = await axios.get(
//       `${baseUrl}/api/evaluations/getevaluationbyid/${id}`,
//       authHeader()
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Get Evaluation By ID Error:", error);
//     throw error;
//   }
// };

// export const updateEvaluationApi = async (id, payload) => {
//   try {
//     const response = await axios.put(
//       `${baseUrl}/api/evaluations/${id}`,
//       payload,
//       authHeader()
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Update Evaluation Error:", error);
//     throw error;
//   }
// };

// export const deleteEvaluationApi = async (id) => {
//   try {
//     const response = await axios.delete(
//       `${baseUrl}/api/evaluations/${id}`,
//       authHeader()
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Delete Evaluation Error:", error);
//     throw error;
//   }
// };

// export const totalEvaluationCountsApi = async () => {
//   const response = await fetch(
//     `${baseUrl}/api/evaluations/totalevaluationcounts`,
//     { headers: authHeader().headers }
//   );

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to fetch Evaluation count");
//   }
//   return await response.json();
// };

// export const getEvaluationsByAgentNameApi = async (agentName) => {
//   const token = getToken();
//   try {
//     const res = await axios.get(
//       `${baseUrl}/api/evaluations/agent/${agentName}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data?.data || [];
//   } catch (err) {
//     console.error("Evaluation API error:", err);
//     return [];
//   }
// };

// // ✅ Fetch by User Email (Submitter)
// export const getEvaluationsByUserEmailApi = async (userEmail) => {
//   const token = getToken();
//   try {
//     const res = await axios.get(
//       `${baseUrl}/api/evaluations/useremail/${encodeURIComponent(userEmail)}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data?.data || res.data || [];
//   } catch (err) {
//     console.error("Evaluation by Email API error:", err);
//     return [];
//   }
// };

// export const getEvaluationsUseremailPublishedApi = async (userEmail) => {
//   try {
//     const response = await axios.get(
//       `${baseUrl}/api/evaluations/useremail/${encodeURIComponent(
//         userEmail
//       )}/published`,
//       authHeader()
//     );
//     return response.data?.data || response.data || [];
//   } catch (error) {
//     console.error("Evaluation Published API error:", error);
//     return [];
//   }
// };

// export const publishEvaluationApi = async (evaluationId) => {
//   try {
//     const response = await axios.patch(
//       `${baseUrl}/api/evaluations/evaluations/${evaluationId}/publish`,
//       {},
//       authHeader()
//     );
//     return response.data?.data || response.data;
//   } catch (error) {
//     console.error("Publish Evaluation Error:", error);
//     throw error;
//   }
// };
import axios from "axios";
import { baseUrl, getToken } from "./config";

// Axios config with auth
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

export const getDailyEvaluations = async () => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/dailyevaluationformsubmit`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
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

export const createReportEvaluationsApi = async ({
  startDate,
  endDate,
  agentName,
  teamleader,
}) => {
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

// ✅ CREATE Evaluation
export const createEvaluationsApi = async (data) => {
  const token = getToken();

  // Try primary endpoint first; if not found, fall back to legacy paths
  try {
    const res = await axios.post(`${baseUrl}/api/evaluations`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      // Fallback 1: legacy frontend route
      try {
        const resFallbackFrontend = await axios.post(
          `${baseUrl}/api/evaluations/frontend`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return resFallbackFrontend.data;
      } catch (err2) {
        if (err2?.response?.status === 404) {
          // Fallback 2: possible create route
          const resFallbackCreate = await axios.post(
            `${baseUrl}/api/evaluations/create`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return resFallbackCreate.data;
        }
        throw err2;
      }
    }
    throw err;
  }
};

// Backward-compatible alias for components importing createEvaluationApi
export const createEvaluationApi = async (evaluation, otherReason = "") => {
  // Preserve passed evaluation object without mutating caller state
  const submissionData = { ...evaluation };

  // Map any optional fields if present (kept for compatibility)
  if (submissionData.escAction === "Other" && otherReason?.trim()) {
    submissionData.escAction = otherReason.trim();
  }

  // Ensure owner is set from evaluation if available
  if (evaluation?.owner && !submissionData.owner) {
    submissionData.owner = evaluation.owner;
  }

  // Delegate to the resilient creator
  return await createEvaluationsApi(submissionData);
};

// ✅ READ All Evaluations
export const getEvaluationsApi = async (params = {}) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/getevaluations`,
      {
        ...authHeader(),
        params: { limit: 1000, page: 1, ...params },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get Evaluations Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ READ Single Evaluation by ID
export const getEvaluationByIdApi = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/getevaluationbyid/${id}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get Evaluation By ID Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ UPDATE Evaluation
export const updateEvaluationApi = async (id, payload) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/evaluations/${id}`,
      payload,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update Evaluation Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ DELETE Evaluation
export const deleteEvaluationApi = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/evaluations/${id}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Delete Evaluation Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const totalEvaluationCountsApi = async () => {
  const response = await fetch(
    `${baseUrl}/api/evaluations/totalevaluationcounts`,
    {
      headers: authHeader().headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch Evaluation count");
  }

  return await response.json();
};

export const getEvaluationAnalyticsApi = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/analytics/getEvaluationAnalytics`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Fetch Escalation Analytics Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEvaluationsByAgentNameApi = async (agentName) => {
  const token = getToken();
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/agent/${agentName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Always return an array
    return res.data?.data || [];
  } catch (err) {
    console.error("Evaluation API error:", err);
    return [];
  }
};

// Optional helper used by some screens: fetch by user email
export const getEvaluationsByUserEmailApi = async (userEmail) => {
  const token = getToken();
  try {
    const res = await axios.get(
      `${baseUrl}/api/evaluations/useremail/${encodeURIComponent(userEmail)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data?.data || res.data || [];
  } catch (err) {
    console.error("Evaluation API error:", err);
    return [];
  }
};

export const getEvaluationsUseremailPublishedApi = async (userEmail) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/evaluations/useremail/${encodeURIComponent(
        userEmail
      )}/published`,
      authHeader()
    );
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Evaluation API error:", error);
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
    console.error(
      "Publish Evaluation Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

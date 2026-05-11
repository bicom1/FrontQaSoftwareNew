import axios from "axios";
import { baseUrl } from "../features/config";


export const getAgentFormSubmitsApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/analytics/agent-form-submits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching agent form submissions:", error);
    return { success: false, data: [] };
  }
};

export const getContentOverviewApi = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/analytics/content-overview`);
    return response.data;
  } catch (error) {
    console.error("Error fetching content overview:", error);
    return { success: false, draftCount: 0, publishedCount: 0, recentActivity: [] };
  }
};

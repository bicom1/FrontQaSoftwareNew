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

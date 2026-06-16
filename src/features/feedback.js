import axios from "axios";
import { baseUrl, getToken } from "./config";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const createAppealApi = async (formData) => {
  return axios.post(`${baseUrl}/api/feedback/appeal`, formData, {
    headers: {
      ...authHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyAppealsApi = async () => {
  const response = await axios.get(`${baseUrl}/api/feedback/my`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const getAllFeedbackApi = async () => {
  return axios.get(`${baseUrl}/api/feedback`, {
    headers: authHeaders(),
  });
};

export const getFeedbackApi = async (id) => {
  return axios.get(`${baseUrl}/api/feedback/${id}`, {
    headers: authHeaders(),
  });
};

export const updateFeedbackApi = async (id, feedbackData) => {
  return axios.put(`${baseUrl}/api/feedback/${id}`, feedbackData, {
    headers: authHeaders(),
  });
};

export const deleteFeedbackApi = async (id) => {
  return axios.delete(`${baseUrl}/api/feedback/${id}`, {
    headers: authHeaders(),
  });
};

// Legacy alias
export const createFeedbackApi = createAppealApi;

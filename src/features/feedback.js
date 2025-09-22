import axios from "axios";
import { baseUrl, getToken } from "./config";

// Create feedback
export const createFeedbackApi = async (feedbackData) => {
  return axios.post(`${baseUrl}/api/feedback`, feedbackData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Get all feedback
export const getAllFeedbackApi = async () => {
  return axios.get(`${baseUrl}/api/feedback`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Get single feedback by ID
export const getFeedbackApi = async (id) => {
  return axios.get(`${baseUrl}/api/feedback/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Update feedback
export const updateFeedbackApi = async (id, feedbackData) => {
  return axios.put(`${baseUrl}/api/feedback/${id}`, feedbackData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Delete feedback
export const deleteFeedbackApi = async (id) => {
  return axios.delete(`${baseUrl}/api/feedback/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

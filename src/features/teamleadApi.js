import axios from "axios";
import { baseUrl, getToken } from "./config";

// Create team leader
const createTeamLeadApi = async (teamleadData) => {
  console.log("Creating team lead with data:", teamleadData);
  const response = await axios.post(`${baseUrl}/api/teamlead/create`, teamleadData);
  return response.data;
};

// Get all team leads
export const getTeamLeadsApi = async () => {
  const response = await axios.get(`${baseUrl}/api/teamlead`, {});
  return response.data;
};

// Team lead profile for logged-in user (by email match)
export const getMyTeamLeaderApi = async () => {
  const token = getToken();
  const response = await axios.get(`${baseUrl}/api/teamlead/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get single team lead by ID
const getTeamLeadApi = async (id) => {
  const token = getToken();
  const response = await axios.get(`${baseUrl}/api/teamlead/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update team lead - FIXED URL
const updateTeamLeadApi = async (id, teamLeadData) => {
  console.log("Updating team lead ID:", id, "with data:", teamLeadData);
  const token = getToken();
  const response = await axios.put(`${baseUrl}/api/teamlead/${id}`, teamLeadData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete team lead - FIXED URL  
const deleteTeamLeadApi = async (id) => {
  console.log("Deleting team lead ID:", id);
  const token = getToken();
  const response = await axios.delete(`${baseUrl}/api/teamlead/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const teamlead = {
  createTeamLeadApi,
  getTeamLeadsApi,
  getTeamLeadApi,
  updateTeamLeadApi,
  deleteTeamLeadApi,
};

export default teamlead;
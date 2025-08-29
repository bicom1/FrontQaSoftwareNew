import axios from "axios";
import { baseUrl, getToken } from "./config";


// Create team leader
const createTeamLeadApi = async (teamleadData) => {
  const response = await axios.post(`${baseUrl}/api/teamlead/create`, teamleadData);
  return response.data;
};

// Get all team leads
export const getTeamLeadsApi = async () => {
  const response = await axios.get(`${baseUrl}/api/teamlead`, {});
  return response.data;
};

// Get single team lead by ID
const getTeamLeadApi = async (id) => {
  const token = getToken();
  const response = await axios.get(`${baseUrl}/teamlead/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update team lead
const updateTeamLeadApi = async (id, teamLeadData) => {
  const token = getToken();
  const response = await axios.put(`${baseUrl}/teamlead/${id}`, teamLeadData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete team lead
const deleteTeamLeadApi = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${baseUrl}/teamlead/${id}`, {
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

import axios from "axios";
import { baseUrl, getToken } from "./config";

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getQcModuleDashboardApi = async () => {
  const res = await axios.get(`${baseUrl}/api/analytics/qc-module-dashboard`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getQcModuleFormsApi = async (params = {}) => {
  const res = await axios.get(`${baseUrl}/api/analytics/qc-module-forms`, {
    headers: authHeaders(),
    params,
  });
  return res.data;
};

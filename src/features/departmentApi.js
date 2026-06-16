import axios from "axios";
import { baseUrl } from "./config";

export const getDepartmentsApi = async () => {
  const response = await axios.get(`${baseUrl}/api/departments`);
  return response.data;
};

export const createDepartmentApi = async (name) => {
  const response = await axios.post(`${baseUrl}/api/departments/create`, {
    name,
  });
  return response.data;
};

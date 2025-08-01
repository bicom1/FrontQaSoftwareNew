// src/features/userApis.js
import axios from "axios";
import { baseUrl } from "../features/config";

const getAuthToken = () => localStorage.getItem("bictoken");

export const LeadRegister = async (data) => {
  const res = await axios.post(`${baseUrl}/api/users/register-user`, data);
  return res;
};

export const LoginApi = async (data) => {
  
  const res = await axios.post(`${baseUrl}/api/users/login-user`, data);
  return res;
};

export const forgotPasswordApi = async (email) => {
  const res = await axios.post(`${baseUrl}/api/users/forgot-password`, { email });
  return res;
};

export const resetPasswordApi = async (data) => {
  const token = getAuthToken();
  const res = await axios.post(`${baseUrl}/api/users/reset-password`, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const getProfileApi = async () => {
  const token = getAuthToken(); // if you're using token-based auth
  const res = await axios.get(`${baseUrl}/api/users/my-profile`, {
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const getallusersApi = async () =>{
  const token = getAuthToken();
  const res = await axios.get(`${baseUrl}/api/users/getallusers`, {
    headers: {
      withCredentials: true,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
} 

export const totalUserCountApi = async () => {
  const token = getAuthToken(); // if required
  const res = await axios.get(`${baseUrl}/api/users/totalUserCount`, {
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.count; 
};

// userApis.js
export const logoutApi = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${baseUrl}/api/users/logout`, {
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};


// import axios from "axios";
// import { baseUrl, getToken } from "../features/config";

// // Auth header helper
// const authHeader = () => {
//   const token = getToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // ===============================
// // 🔹 Online Users Count
// // ===============================
// export const onlineUsersCountApi = async () => {
//   const token = getToken();
//   if (!token) return null;

//   const response = await axios.get(`${baseUrl}/api/users/online-users-count`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

// // ===============================
// // 🔹 Register New User (Admin / Sales Agent)
// // ===============================
// export const LeadRegister = async (data) => {
//   const res = await axios.post(`${baseUrl}/api/users/register-user`, data);
//   return res;
// };

// // ===============================
// // 🔹 Login User
// // ===============================
// export const LoginApi = async (data) => {
//   const res = await axios.post(`${baseUrl}/api/users/login-user`, data);
//   return res;
// };

// // ===============================
// // 🔹 Forgot Password
// // ===============================
// export const forgotPasswordApi = async (email) => {
//   const res = await axios.post(`${baseUrl}/api/users/forgot-password`, {
//     email,
//   });
//   return res;
// };

// // ===============================
// // 🔹 Reset Password
// // ===============================
// export const resetPasswordApi = async (data) => {
//   const token = getToken();
//   const res = await axios.post(`${baseUrl}/api/users/reset-password`, data, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   return res;
// };

// // ===============================
// // 🔹 Patch / Update User
// // ===============================
// export const patchUserApi = async (id, userData) => {
//   const token = getToken();
//   const res = await axios.patch(`${baseUrl}/api/users/patch/${id}`, userData, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   return res;
// };

// // ===============================
// // 🔹 Delete User
// // ===============================
// export const deleteUserApi = async (id) => {
//   const token = getToken();
//   const res = await axios.delete(`${baseUrl}/api/users/delete/${id}`, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   return res;
// };

// // ===============================
// // 🔹 Get Logged-in User Profile
// // ===============================
// export const getProfileApi = async () => {
//   const token = getToken();
//   const res = await axios.get(`${baseUrl}/api/users/my-profile`, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   return res;
// };

// // ===============================
// // 🔹 Get All Users (Admins + Agents)
// // ===============================
// export const getallusersApi = async () => {
//   const token = getToken();
//   const res = await axios.get(`${baseUrl}/api/users/getallusers`, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   return res;
// };

// // ===============================
// // 🔹 Get Only Sales Agents
// // ===============================
// export const getAgentsApi = async () => {
//   const token = getToken();
//   const res = await axios.get(`${baseUrl}/api/users/getagents`, {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   return res;
// };

// // ===============================
// // 🔹 Total User Count
// // ===============================
// export const totalUserCountApi = async () => {
//   const response = await fetch(`${baseUrl}/api/users/totalUserCount`, {
//     headers: authHeader(),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to fetch User count");
//   }

//   return await response.json();
// };

// // ===============================
// // 🔹 Logout
// // ===============================
// export const logoutApi = async () => {
//   const token = getToken();
//   if (!token) return null;

//   return await axios.get(`${baseUrl}/api/users/logout`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
import axios from "axios";
import { baseUrl, getToken } from "./config";

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const onlineUsersCountApi = async () => {
  const token = getToken();
  if (!token) return null;

  const response = await axios.get(`${baseUrl}/api/users/online-users-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const LeadRegister = async (data) => {
  const res = await axios.post(`${baseUrl}/api/users/register-user`, data);
  return res;
};

export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/users/login-user`, data);
  return res;
};

export const forgotPasswordApi = async (email) => {
  const res = await axios.post(`${baseUrl}/api/users/forgot-password`, {
    email,
  });
  return res;
};

export const resetPasswordApi = async (data) => {
  const token = getToken();
  const res = await axios.post(`${baseUrl}/api/users/reset-password`, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const patchUserApi = async (id, userData) => {
  const token = getToken();
  const res = await axios.patch(`${baseUrl}/api/users/patch/${id}`, userData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const deleteUserApi = async (id) => {
  const token = getToken();
  const res = await axios.delete(`${baseUrl}/api/users/delete/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const getProfileApi = async () => {
  const token = getToken();
  const res = await axios.get(`${baseUrl}/api/users/my-profile`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const getallusersApi = async () => {
  const token = getToken();
  const res = await axios.get(`${baseUrl}/api/users/getallusers`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const getAllLeadsApi = async () => {
  const token = getToken();
  const res = await axios.get(`${baseUrl}/api/leads/get-all`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res;
};

export const totalUserCountApi = async () => {
  const response = await fetch(`${baseUrl}/api/users/totalUserCount`, {
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch User count");
  }

  return await response.json();
};

export const logoutApi = async () => {
  const token = getToken();
  if (!token) return null; 

  return await axios.get(`${baseUrl}/api/users/logout`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

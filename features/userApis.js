import axios from 'axios';
import Cookies from "universal-cookie";

const cookie = new Cookies();
const baseUrl = 'http://localhost:5173';

export const LoginApi = async (data) => {
    const res = await axios.post(`${baseUrl}/login-user`, data);
    return res;
  };


  export const LeadRegister = async (data) => {
    const res = await axios.post(`${baseUrl}/register-user`, data);
    return res;
  };

  export const logoutApi = async () => {
    let token = cookie.get("bictoken");
    const res = await axios.get(`${baseUrl}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  };
  export const evaluationApi = async (data) => {
    let token = cookie.get("bictoken");
    const res = await axios.post(`${baseUrl}/evaluations`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res;
};


export const escalationApi = async (data) => {
  let token = cookie.get("bictoken");
  const res = await axios.post(`${baseUrl}/escalations`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res;
};

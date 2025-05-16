import axios from 'axios';
import Cookies from "universal-cookie";

const cookie = new Cookies();
const baseUrl = 'http://localhost:5173';

export const LoginApi = async (data) => {
    const res = await axios.post(`${baseUrl}/login-user`, data);
    return res;
  };
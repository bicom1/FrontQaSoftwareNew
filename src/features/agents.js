import axios from "axios";
import { baseUrl, getToken } from "../features/config";

export const getLowRatingCallApi = async () => {
  try {
    const token = getToken();
    const res = await axios.get(`${baseUrl}/api/agents/low-rating`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching low rating call:", err);
    return [];
  }
};

export const getLowRatingChatsApi = async () => {
  try {
    const token = getToken();
    const res = await axios.get(`${baseUrl}/api/agents/low-rating-chats`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching low rating chats:", err);
    return [];
  }
};

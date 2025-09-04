export const baseUrl =
  // import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  import.meta.env.VITE_API_BASE_URL || "https://backendqasoftware-k62i.onrender.com";


export const getToken = () => localStorage.getItem("token");

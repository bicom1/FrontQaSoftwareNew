const LOCAL_API_URL = "http://localhost:3001";
const PRODUCTION_API_URL = "https://backendqasoftwarenew.onrender.com";

const normalizeBaseUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
};

/**
 * API base URL (no trailing slash).
 * Priority: VITE_API_URL → VITE_API_BASE_URL → production Render URL → localhost (dev).
 */
const resolveApiBaseUrl = () => {
  const fromEnv = normalizeBaseUrl(
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
  );
  if (fromEnv) return fromEnv;
  if (import.meta.env.PROD) return PRODUCTION_API_URL;
  return LOCAL_API_URL;
};

export const baseUrl = resolveApiBaseUrl();

export const getToken = () => localStorage.getItem("token");

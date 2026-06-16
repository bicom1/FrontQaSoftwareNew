import { getDashboardPath, normalizeRole } from "./roles";

/**
 * Save JWT session to localStorage (same shape as Login page).
 */
export const persistAuthSession = (user, token) => {
  if (!user || !token) return;
  const role = normalizeRole(user.role);
  const normalized = { ...user, role };

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(normalized));
  localStorage.setItem("userRole", role);
  localStorage.setItem("userId", normalized._id);
  localStorage.setItem("userName", normalized.name || "");
  localStorage.setItem("userEmail", normalized.email || "");
};

/** Full navigation so App shell picks up the new session */
export const redirectToRoleDashboard = (role) => {
  const path = getDashboardPath(normalizeRole(role));
  window.location.assign(path);
};

export const loginAndRedirect = (user, token) => {
  persistAuthSession(user, token);
  redirectToRoleDashboard(user.role);
};

/** Normalize register/signup API payloads */
export const parseAuthFromRegisterResponse = (data) => {
  if (!data) return null;
  const token = data.token;
  const user = data.user || {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
  };
  if (!token || !user?._id) return null;
  return {
    user: { ...user, role: normalizeRole(user.role) },
    token,
  };
};

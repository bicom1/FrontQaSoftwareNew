import { normalizeRole, ROLES } from "./roles";
import {
  getEvaluationsApi,
  getEvaluationsByAgentNameApi,
  getEvaluationsByUserEmailApi,
} from "../features/evaluationApi";
import {
  getEscalationsApi,
  getEscalationsByAgentNameApi,
  getEscalationsByUserEmailApi,
} from "../features/escalationsApi";

export const mergeById = (lists) => {
  const map = new Map();
  lists.flat().forEach((item) => {
    if (item?._id) map.set(String(item._id), item);
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
};

export const getSessionRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded?.role) return normalizeRole(decoded.role);
    }
  } catch {
    /* ignore */
  }
  return normalizeRole(localStorage.getItem("userRole") || "");
};

export const isAgentAdminSession = () =>
  getSessionRole() === ROLES.AGENT_ADMIN;

const parseEvaluationList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const parseEscalationList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

/**
 * Agent User → own submissions (by name + email).
 * Agent Admin → all team evaluations & escalations submitted to date.
 */
export const fetchAgentEvaluations = async ({ name, email, role } = {}) => {
  const sessionRole = normalizeRole(role) || getSessionRole();

  if (sessionRole === ROLES.AGENT_ADMIN) {
    const res = await getEvaluationsApi({ limit: 1000, page: 1 });
    return parseEvaluationList(res);
  }

  const [evalByName, evalByEmail] = await Promise.all([
    name ? getEvaluationsByAgentNameApi(name) : [],
    email ? getEvaluationsByUserEmailApi(email) : [],
  ]);
  return mergeById([evalByName, evalByEmail]);
};

export const fetchAgentEscalations = async ({ name, email, role } = {}) => {
  const sessionRole = normalizeRole(role) || getSessionRole();

  if (sessionRole === ROLES.AGENT_ADMIN) {
    const res = await getEscalationsApi();
    return parseEscalationList(res);
  }

  const [escByName, escByEmail] = await Promise.all([
    name ? getEscalationsByAgentNameApi(name) : [],
    email ? getEscalationsByUserEmailApi(email) : [],
  ]);
  return mergeById([escByName, escByEmail]);
};

export const fetchAgentFormData = async ({ name, email, role } = {}) => {
  const [evaluations, escalations] = await Promise.all([
    fetchAgentEvaluations({ name, email, role }),
    fetchAgentEscalations({ name, email, role }),
  ]);
  return { evaluations, escalations, isTeamView: isAgentAdminSession() };
};

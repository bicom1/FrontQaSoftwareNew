export const ROLES = {
  SUPER_ADMIN: "superadmin",
  AGENT_ADMIN: "agent_admin",
  AGENT_USER: "agent_user",
  QC_ADMIN: "qc_admin",
  QC_USER: "qc_user",
};

/** @deprecated use ROLES.SUPER_ADMIN — kept for route compatibility */
export const ADMIN = ROLES.SUPER_ADMIN;

const LEGACY_ROLE_MAP = {
  admin: ROLES.SUPER_ADMIN,
  superadmin: ROLES.SUPER_ADMIN,
  "super admin": ROLES.SUPER_ADMIN,
  user: ROLES.AGENT_USER,
  agent: ROLES.AGENT_USER,
  "agent user": ROLES.AGENT_USER,
  agent_user: ROLES.AGENT_USER,
  "agent admin": ROLES.AGENT_ADMIN,
  agent_admin: ROLES.AGENT_ADMIN,
  "sales agent": ROLES.AGENT_USER,
  qc_admin: ROLES.QC_ADMIN,
  "qc admin": ROLES.QC_ADMIN,
  qc_user: ROLES.QC_USER,
  "qc user": ROLES.QC_USER,
  qc: ROLES.QC_USER,
};

const ALL_ROLES = Object.values(ROLES);

export const normalizeRole = (role) => {
  if (!role) return "";
  const key = role.toString().trim().toLowerCase().replace(/\s+/g, " ");
  const underscored = key.replace(/ /g, "_");
  if (ALL_ROLES.includes(underscored)) return underscored;
  return LEGACY_ROLE_MAP[key] || underscored;
};

export const isSuperAdmin = (role) =>
  normalizeRole(role) === ROLES.SUPER_ADMIN;

/** Alias for legacy components */
export const isAdmin = isSuperAdmin;

export const isAgentAdmin = (role) =>
  normalizeRole(role) === ROLES.AGENT_ADMIN;

export const isAgentUser = (role) =>
  normalizeRole(role) === ROLES.AGENT_USER;

export const isQcAdmin = (role) => normalizeRole(role) === ROLES.QC_ADMIN;

export const isQcUser = (role) => normalizeRole(role) === ROLES.QC_USER;

export const isAgentRole = (role) => {
  const r = normalizeRole(role);
  return r === ROLES.AGENT_USER || r === ROLES.AGENT_ADMIN;
};

export const isQcRole = (role) => {
  const r = normalizeRole(role);
  return r === ROLES.QC_USER || r === ROLES.QC_ADMIN;
};

export const isUserManager = (role) =>
  isSuperAdmin(role) || isAgentAdmin(role) || isQcAdmin(role);

export const getManageableRoles = (actorRole) => {
  const actor = normalizeRole(actorRole);
  if (isSuperAdmin(actor)) return [...ALL_ROLES];
  if (isAgentAdmin(actor)) return [ROLES.AGENT_USER];
  if (isQcAdmin(actor)) return [ROLES.QC_USER];
  return [];
};

export const canManageRole = (actorRole, targetRole) =>
  getManageableRoles(actorRole).includes(normalizeRole(targetRole));

export const getVisibleUserRoles = (actorRole) => {
  const actor = normalizeRole(actorRole);
  if (isSuperAdmin(actor)) return [...ALL_ROLES];
  if (isAgentAdmin(actor)) return [ROLES.AGENT_USER];
  if (isQcAdmin(actor)) return [ROLES.QC_USER];
  return [];
};

export const getDashboardPath = (role) => {
  const r = normalizeRole(role);
  if (r === ROLES.SUPER_ADMIN) return "/admin";
  if (r === ROLES.AGENT_USER || r === ROLES.AGENT_ADMIN) return "/agent";
  if (r === ROLES.QC_ADMIN || r === ROLES.QC_USER) return "/dashboard/qc-team";
  return "/login";
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.AGENT_USER]: "Agent User",
  [ROLES.AGENT_ADMIN]: "Agent Admin",
  [ROLES.QC_USER]: "QC User",
  [ROLES.QC_ADMIN]: "QC Admin",
};

export const CREATABLE_ROLES = [
  ROLES.AGENT_USER,
  ROLES.AGENT_ADMIN,
  ROLES.QC_USER,
  ROLES.QC_ADMIN,
];

/** Super Admin can assign any role in Add User modal */
export const SUPER_ADMIN_PANEL_ROLES = [...ALL_ROLES];

export const getAddUserRoleOptions = (actorRole) => {
  const manageable = getManageableRoles(actorRole);
  return manageable.map((r) => ({ value: r, label: ROLE_LABELS[r] || r }));
};

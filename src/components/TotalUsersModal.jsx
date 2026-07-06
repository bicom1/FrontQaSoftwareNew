import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Crown,
  Edit,
  Loader2,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { getallusersApi } from "../features/userApis";
import {
  ROLE_LABELS,
  ROLES,
  getVisibleUserRoles,
  normalizeRole,
} from "../utils/roles";

const VISIBLE_LIMIT = 3;

const ALL_TABS = [
  {
    key: ROLES.SUPER_ADMIN,
    label: ROLE_LABELS[ROLES.SUPER_ADMIN],
    icon: Shield,
  },
  {
    key: ROLES.AGENT_USER,
    label: ROLE_LABELS[ROLES.AGENT_USER],
    icon: UserCheck,
  },
  {
    key: ROLES.AGENT_ADMIN,
    label: ROLE_LABELS[ROLES.AGENT_ADMIN],
    icon: UserCheck,
  },
  {
    key: ROLES.QC_USER,
    label: ROLE_LABELS[ROLES.QC_USER],
    icon: Shield,
  },
  {
    key: ROLES.QC_ADMIN,
    label: ROLE_LABELS[ROLES.QC_ADMIN],
    icon: Shield,
  },
];

const initials = (name) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const TotalUsersModal = ({
  show,
  onHide,
  actorRole,
  onEditUser,
  onDeleteUser,
  refreshKey = 0,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);

  const visibleRoles = getVisibleUserRoles(normalizeRole(actorRole));
  const tabs = ALL_TABS.filter((tab) => visibleRoles.includes(tab.key));

  const fetchUsers = useCallback(async () => {
    if (!show) return;
    try {
      setError("");
      const res = await getallusersApi();
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setUsers(list);
    } catch (err) {
      setUsers([]);
      setError(
        err?.response?.data?.message ||
          "Failed to load users. Please try again."
      );
    }
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;
    setSearchTerm("");
    setExpanded(false);
    setError("");
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [show, refreshKey, fetchUsers]);

  useEffect(() => {
    if (!show || !tabs.length) return;
    if (!tabs.find((t) => t.key === activeTab)) {
      setActiveTab(tabs[0].key);
    }
  }, [show, tabs, activeTab]);

  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onHide?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onHide]);

  const usersByRole = useMemo(() => {
    const map = {};
    for (const tab of tabs) {
      map[tab.key] = users.filter(
        (u) => normalizeRole(u.role) === tab.key
      );
    }
    return map;
  }, [users, tabs]);

  const activeRoleUsers = usersByRole[activeTab] || [];

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return activeRoleUsers;
    const q = searchTerm.toLowerCase();
    return activeRoleUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [activeRoleUsers, searchTerm]);

  const visibleUsers = expanded
    ? filteredUsers
    : filteredUsers.slice(0, VISIBLE_LIMIT);

  const activeTabLabel =
    tabs.find((t) => t.key === activeTab)?.label || "users";

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="total-users-modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onHide}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={20} />
            </span>
            <div>
              <h2
                id="total-users-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Total Users
              </h2>
              <p className="text-xs text-slate-500">
                Browse and manage users by role
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onHide}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Role tabs */}
          <div className="mb-4 flex gap-2 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {tabs.map(({ key, label, icon: TabIcon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setExpanded(false);
                }}
                className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TabIcon size={14} />
                {label} ({usersByRole[key]?.length ?? 0})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setExpanded(false);
              }}
              placeholder={`Search ${activeTabLabel.toLowerCase()} by name or email...`}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
          </div>

          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <Users size={32} className="text-slate-300" />
              <span className="text-sm">
                {searchTerm
                  ? "No matches for your search"
                  : `No ${activeTabLabel.toLowerCase()} users found`}
              </span>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {visibleUsers.map((user) => {
                const role = normalizeRole(user.role);
                const isSuperAdminUser = role === ROLES.SUPER_ADMIN;
                return (
                  <li
                    key={user._id || user.email}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {initials(user.name)}
                      {isSuperAdminUser && (
                        <Crown
                          size={10}
                          className="absolute -right-0.5 -top-0.5 text-amber-500"
                        />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium capitalize text-slate-800">
                        {user.name || "Unknown User"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="truncate text-xs text-slate-500">
                          {user.email || "—"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {ROLE_LABELS[role] || role}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditUser?.(user)}
                        title="Edit user"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUser?.(user)}
                        title="Delete user"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {filteredUsers.length > VISIBLE_LIMIT && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                {expanded
                  ? "See less"
                  : `See more (${filteredUsers.length - VISIBLE_LIMIT} more)`}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-xs text-slate-500">
            {users.length} total · showing {filteredUsers.length}{" "}
            {activeTabLabel.toLowerCase()}
          </span>
          <button
            type="button"
            onClick={onHide}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalUsersModal;

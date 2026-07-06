import React, { useCallback, useEffect, useState } from "react";
import { Circle, Loader2, Users, X } from "lucide-react";
import { getUsersByPresenceApi } from "../features/userApis";
import { ROLE_LABELS, normalizeRole } from "../utils/roles";

const POLL_MS = 15000;

const formatWhen = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const initials = (name) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const VISIBLE_LIMIT = 3;

const UserPresenceModal = ({ show, onHide, status = "active" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const isActive = status === "active";
  const title = isActive ? "Active Users" : "Inactive Users";

  const loadUsers = useCallback(async () => {
    if (!show) return;
    try {
      setError("");
      const res = await getUsersByPresenceApi(status);
      if (res?.success) {
        setUsers(Array.isArray(res.data) ? res.data : []);
      } else {
        setUsers([]);
        setError(res?.message || "Failed to load users");
      }
    } catch (err) {
      setUsers([]);
      setError(
        err?.response?.data?.message || "Failed to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [show, status]);

  useEffect(() => {
    if (!show) return undefined;
    setExpanded(false);
    setLoading(true);
    loadUsers();
    const timer = setInterval(loadUsers, POLL_MS);
    return () => clearInterval(timer);
  }, [show, loadUsers]);

  useEffect(() => {
    setExpanded(false);
  }, [status]);

  // Close on Escape
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onHide?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onHide]);

  if (!show) return null;

  const visibleUsers = expanded ? users : users.slice(0, VISIBLE_LIMIT);
  const hiddenCount = Math.max(0, users.length - VISIBLE_LIMIT);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-presence-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onHide}
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={20} />
            </span>
            <div className="flex items-center gap-2">
              <h2
                id="user-presence-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                {title}
              </h2>
              <span className="inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {users.length}
              </span>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-400">
              <Users size={28} className="text-slate-300" />
              <span className="text-sm">
                No {isActive ? "active" : "inactive"} users found
              </span>
            </div>
          ) : (
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="whitespace-nowrap px-6 py-3 font-medium">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">
                    Role
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">
                    Last Active
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                          {initials(user.name)}
                        </span>
                        <span className="font-medium capitalize text-slate-800">
                          {user.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-slate-600">
                      {user.email || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-slate-600">
                      {ROLE_LABELS[normalizeRole(user.role)] ||
                        normalizeRole(user.role)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-xs text-slate-500">
                      {formatWhen(user.lastActive)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.isOnline
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Circle
                          size={7}
                          fill="currentColor"
                          className={
                            user.isOnline ? "text-emerald-500" : "text-slate-400"
                          }
                        />
                        {user.isOnline ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && users.length > VISIBLE_LIMIT && (
            <div className="border-t border-slate-100 py-3 text-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                {expanded
                  ? "See less"
                  : `See more (${hiddenCount} more)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPresenceModal;
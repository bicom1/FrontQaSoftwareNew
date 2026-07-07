import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Search,
  Send,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import {
  deleteInviteApi,
  getInvitedUsersApi,
  resendInviteApi,
  sendInviteApi,
  totalUserCountApi,
} from "../features/userApis";
import { ROLE_LABELS, ROLES, normalizeRole } from "../utils/roles";
import { computeInviteStats } from "../utils/inviteStats";

const POLL_MS = 15000;
const ACCEPTED_VISIBLE_DAYS = 7;
const VISIBLE_LIMIT = 3;

const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const isRecentAccepted = (invite) => {
  if (!invite?.acceptedAt) return true;
  const ageMs = Date.now() - new Date(invite.acceptedAt).getTime();
  return ageMs <= ACCEPTED_VISIBLE_DAYS * 24 * 60 * 60 * 1000;
};

const InvitedUsersModal = ({
  show,
  onHide,
  roleOptions = [],
  onCountsChange,
}) => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOlderAccepted, setShowOlderAccepted] = useState(false);
  const [expandedList, setExpandedList] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: roleOptions[0] || ROLES.AGENT_USER,
  });
  const [isSending, setIsSending] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const prevInvitesRef = useRef([]);

  // Keep the latest onCountsChange without making it an effect dependency,
  // otherwise a new function identity each parent render causes an update loop.
  const onCountsChangeRef = useRef(onCountsChange);
  useEffect(() => {
    onCountsChangeRef.current = onCountsChange;
  }, [onCountsChange]);

  const refreshCounts = useCallback(async () => {
    try {
      const users = await totalUserCountApi().catch(() => null);
      onCountsChangeRef.current?.({
        totalUsers: users?.count ?? null,
      });
    } catch {
      /* ignore */
    }
  }, []);

  const fetchInvites = useCallback(async () => {
    if (!show) return;
    try {
      const res = await getInvitedUsersApi();
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      const prev = prevInvitesRef.current;
      const newlyAccepted = list.some(
        (inv) =>
          inv.status === "accepted" &&
          !prev.find((p) => p._id === inv._id && p.status === "accepted")
      );
      if (newlyAccepted) {
        setTab("accepted");
      }
      prevInvitesRef.current = list;
      setInvites(list);
    } catch (err) {
      console.error("Error fetching invites:", err);
      setInvites([]);
    }
  }, [show]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchInvites(), refreshCounts()]);
    setLoading(false);
  }, [fetchInvites, refreshCounts]);

  useEffect(() => {
    if (!show) return undefined;
    setTab("pending");
    setSearchTerm("");
    setShowOlderAccepted(false);
    setExpandedList(false);
    setAlert({ type: "", message: "" });
    setFormData({ email: "", role: roleOptions[0] || ROLES.AGENT_USER });
    loadAll();
    const timer = setInterval(() => {
      fetchInvites();
      refreshCounts();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [show, roleOptions, loadAll, fetchInvites, refreshCounts]);

  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onHide?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onHide]);

  const stats = useMemo(() => computeInviteStats(invites), [invites]);

  const pendingRaw = useMemo(
    () => invites.filter((i) => (i.status || "pending") !== "accepted"),
    [invites]
  );
  const acceptedRaw = useMemo(
    () => invites.filter((i) => i.status === "accepted"),
    [invites]
  );

  useEffect(() => {
    if (!show) return;
    onCountsChangeRef.current?.({
      ...stats,
      invited: stats.pending,
    });
  }, [show, stats]);

  const acceptedVisible = useMemo(() => {
    if (showOlderAccepted) return acceptedRaw;
    return acceptedRaw.filter(isRecentAccepted);
  }, [acceptedRaw, showOlderAccepted]);

  const hiddenAcceptedCount = acceptedRaw.length - acceptedVisible.length;

  const filterBySearch = (list) => {
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((i) => i.email?.toLowerCase().includes(q));
  };

  const pendingList = filterBySearch(pendingRaw);
  const acceptedList = filterBySearch(acceptedVisible);
  const activeList = tab === "accepted" ? acceptedList : pendingList;
  const visibleList = expandedList
    ? activeList
    : activeList.slice(0, VISIBLE_LIMIT);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setAlert({ type: "", message: "" });

    try {
      if (!formData.email.trim()) {
        setAlert({ type: "danger", message: "Email is required." });
        return;
      }

      const res = await sendInviteApi(formData);
      if (res?.data?.success || res.status === 201) {
        const roleLabel =
          ROLE_LABELS[normalizeRole(formData.role)] || formData.role;
        setAlert({
          type: "success",
          message: `User saved as ${roleLabel}. Invite sent to ${formData.email.trim()}.`,
        });
        setFormData({ email: "", role: roleOptions[0] || ROLES.AGENT_USER });
        setTab("pending");
        await fetchInvites();
        await refreshCounts();
      }
    } catch (err) {
      setAlert({
        type: "danger",
        message:
          err?.response?.data?.message || "Failed to send invite. Try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async (invite) => {
    try {
      setResendingId(invite._id);
      await resendInviteApi(invite._id);
      setAlert({
        type: "success",
        message: `Invite resent to ${invite.email}.`,
      });
      await fetchInvites();
    } catch (err) {
      setAlert({
        type: "danger",
        message: err?.response?.data?.message || "Failed to resend invite.",
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (invite) => {
    const msg =
      invite.status === "accepted"
        ? `Remove accepted invite record for ${invite.email}? The user account stays active.`
        : `Delete invite for ${invite.email}? This removes the pending user from the database.`;
    if (!window.confirm(msg)) return;

    try {
      setDeletingId(invite._id);
      await deleteInviteApi(invite._id);
      setAlert({
        type: "success",
        message: `Invite for ${invite.email} deleted.`,
      });
      await fetchInvites();
      await refreshCounts();
    } catch (err) {
      setAlert({
        type: "danger",
        message: err?.response?.data?.message || "Failed to delete invite.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!show) return null;

  const statusPill = (status) => {
    const s = status || "pending";
    if (s === "accepted") return "bg-emerald-50 text-emerald-700";
    if (s === "expired") return "bg-slate-100 text-slate-600";
    return "bg-amber-50 text-amber-800";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invited-users-modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onHide}
      />

      <div className="relative z-10 flex max-h-[70vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <UserPlus size={20} />
            </span>
            <div>
              <h2
                id="invited-users-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Invited Users
              </h2>
              <p className="text-xs text-slate-500">
                 View all invited users and manage their invitation status.
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
          {alert.message && (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {alert.message}
            </div>
          )}

          {/* Send invite */}
          <form
            onSubmit={handleSendInvite}
            className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail size={16} className="text-indigo-500" />
              Send new invite
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-5">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@company.com"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-indigo-500 focus:ring-2"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-indigo-500 focus:ring-2"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role] || role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {isSending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
                Users are saved first, then invited by email.

            </p>
          </form>

          {/* Live stats */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              {
                label: "Total",
                value: stats.total,
                chip: "bg-indigo-50 text-indigo-700",
              },
              {
                label: "Pending",
                value: stats.pending,
                chip: "bg-amber-50 text-amber-800",
              },
              {
                label: "Accepted",
                value: stats.accepted,
                chip: "bg-emerald-50 text-emerald-700",
              },
              {
                label: "Expired",
                value: stats.expired,
                chip: "bg-slate-100 text-slate-600",
              },
            ].map(({ label, value, chip }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p
                  className={`mt-1 inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-semibold tabular-nums ${chip}`}
                >
                  {loading && invites.length === 0 ? "—" : value}
                </p>
              </div>
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
                setExpandedList(false);
              }}
              placeholder="Search by email..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("pending");
                setExpandedList(false);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === "pending"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock size={15} />
              Pending ({stats.awaiting})
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("accepted");
                setExpandedList(false);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === "accepted"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 size={15} />
              Accepted ({stats.accepted})
            </button>
          </div>

          {tab === "accepted" && hiddenAcceptedCount > 0 && !showOlderAccepted && (
            <p className="mb-3 text-xs text-slate-500">
              Hiding {hiddenAcceptedCount} accepted invite
              {hiddenAcceptedCount !== 1 ? "s" : ""} older than{" "}
              {ACCEPTED_VISIBLE_DAYS} days.{" "}
              <button
                type="button"
                onClick={() => setShowOlderAccepted(true)}
                className="font-medium text-indigo-600 hover:underline"
              >
                Show all
              </button>
            </p>
          )}

          {loading && invites.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">Loading invites...</span>
            </div>
          ) : activeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              {tab === "accepted" ? (
                <CheckCircle2 size={32} className="text-slate-300" />
              ) : (
                <UserPlus size={32} className="text-slate-300" />
              )}
              <span className="text-sm">
                {searchTerm
                  ? "No matches for your search"
                  : tab === "accepted"
                    ? "No accepted invites yet"
                    : "No pending invites"}
              </span>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {visibleList.map((invite) => {
                const status = invite.status || "pending";
                const isPending = status === "pending";
                return (
                  <li
                    key={invite._id || invite.email}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {invite.email?.charAt(0)?.toUpperCase() || "?"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {invite.email}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {ROLE_LABELS[normalizeRole(invite.role)] ||
                            invite.role}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusPill(status)}`}
                        >
                          {status}
                        </span>
                        {invite.invitedAt && (
                          <span className="text-xs text-slate-400">
                            Sent {timeAgo(invite.invitedAt)}
                          </span>
                        )}
                        {invite.acceptedAt && (
                          <span className="text-xs text-slate-400">
                            Accepted {timeAgo(invite.acceptedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleResend(invite)}
                          disabled={resendingId === invite._id}
                          title="Resend invite"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
                        >
                          {resendingId === invite._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Send size={15} />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(invite)}
                        disabled={deletingId === invite._id}
                        title="Delete invite"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === invite._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {activeList.length > VISIBLE_LIMIT && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setExpandedList((v) => !v)}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                {expandedList
                  ? "See less"
                  : `See more (${activeList.length - VISIBLE_LIMIT} more)`}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-xs text-slate-500 tabular-nums">
            {stats.total} total · {stats.pending} pending · {stats.accepted}{" "}
            accepted
            {stats.expired > 0 ? ` · ${stats.expired} expired` : ""}
            {searchTerm
              ? ` · showing ${activeList.length} in ${tab}`
              : ""}
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

export default InvitedUsersModal;

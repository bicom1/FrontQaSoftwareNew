import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  forwardFlaggedToQcApi,
  getFlaggedReviewsApi,
} from "../../features/flaggedReviewApi";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100];

const TABS = [
  { id: "agent_admin_active", label: "Active", countKey: "active" },
  { id: "agent_admin_accepted", label: "Accepted", countKey: "accepted" },
  { id: "agent_admin_rejected", label: "Rejected", countKey: "rejected" },
];

const formatDateTime = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel = (status) => {
  if (status === "approved") return "Accepted";
  if (status === "rejected") return "Rejected";
  if (status === "forwarded_to_qc") return "With QC Admin";
  return "Pending";
};

const statusClass = (status) => {
  if (status === "approved")
    return "bg-emerald-100 text-emerald-800 ring-emerald-600/20";
  if (status === "rejected")
    return "bg-rose-100 text-rose-800 ring-rose-600/20";
  if (status === "forwarded_to_qc")
    return "bg-sky-100 text-sky-800 ring-sky-600/20";
  return "bg-amber-100 text-amber-800 ring-amber-600/20";
};

const FlaggedChatsPanel = () => {
  const [activeTab, setActiveTab] = useState("agent_admin_active");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [forwardingId, setForwardingId] = useState(null);
  const [detailRow, setDetailRow] = useState(null);
  const [tabCounts, setTabCounts] = useState({ active: 0, accepted: 0, rejected: 0 });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [activeRes, acceptedRes, rejectedRes] = await Promise.all([
        getFlaggedReviewsApi("agent_admin_active", { startDate, endDate }),
        getFlaggedReviewsApi("agent_admin_accepted", { startDate, endDate }),
        getFlaggedReviewsApi("agent_admin_rejected", { startDate, endDate }),
      ]);

      const byTab = {
        agent_admin_active: activeRes?.data || [],
        agent_admin_accepted: acceptedRes?.data || [],
        agent_admin_rejected: rejectedRes?.data || [],
      };

      setTabCounts({
        active: byTab.agent_admin_active.length,
        accepted: byTab.agent_admin_accepted.length,
        rejected: byTab.agent_admin_rejected.length,
      });
      setRows(byTab[activeTab] || []);
      setPage(1);
    } catch {
      toast.error("Failed to load flagged chats");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = setInterval(load, 45000);
    return () => clearInterval(timer);
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const hay = [
        row.leadID,
        row.agentName,
        row.submitterName,
        row.evaluatedby,
        row.teamleader,
        row.flaggedReview?.issueSummary,
        statusLabel(row.flaggedReview?.status),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, search, activeTab, startDate, endDate]);

  const handleForward = async (row) => {
    try {
      setForwardingId(row._id);
      const res = await forwardFlaggedToQcApi(row._id);
      if (!res?.success) throw new Error(res?.message || "Forward failed");
      toast.success("Sent to QC admin");
      await load();
    } catch (err) {
      toast.error(err?.message || "Failed to forward");
    } finally {
      setForwardingId(null);
    }
  };

  const isActiveTab = activeTab === "agent_admin_active";
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, filtered.length);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Flagged Chats</h2>
            <p className="text-sm text-slate-500 mt-0.5 mb-0">
              QC low ratings · Accepted & rejected kept 2 days
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {TABS.map(({ id, label, countKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  activeTab === id
                    ? "bg-white/20 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {tabCounts[countKey] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
          <div className="relative lg:col-span-2">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search lead, agent, QC, team lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            title="From date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            title="To date"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                Show {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Date / Time</th>
              <th className="px-4 py-3 whitespace-nowrap">Type</th>
              <th className="px-4 py-3 whitespace-nowrap">Lead</th>
              <th className="px-4 py-3 whitespace-nowrap">QC User</th>
              <th className="px-4 py-3 whitespace-nowrap">Team Lead</th>
              <th className="px-4 py-3 whitespace-nowrap">Agent</th>
              <th className="px-4 py-3 whitespace-nowrap">Rating</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 min-w-[140px]">Issue</th>
              <th className="px-4 py-3 whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-slate-500">
                  <Loader2 size={20} className="animate-spin inline-block mr-2" />
                  Loading...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-slate-400">
                  No forms in this list.
                </td>
              </tr>
            ) : (
              visible.map((row) => {
                const status = row.flaggedReview?.status || "pending";
                const isEval = row.formType === "evaluation";
                const rowKey = `${row.formType}-${row._id}`;
                const issue =
                  row.flaggedReview?.issueSummary || "Low score / bad rating";
                const displayDate =
                  activeTab === "agent_admin_accepted" ||
                  activeTab === "agent_admin_rejected"
                    ? row.flaggedReview?.qcResolvedAt || row.createdAt
                    : row.createdAt;

                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-600 text-xs">
                      {formatDateTime(displayDate)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                          isEval
                            ? "bg-blue-50 text-blue-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isEval ? "Eval" : "Esc"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                      #{row.leadID || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 max-w-[120px] truncate">
                      {row.submitterName || row.evaluatedby || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 max-w-[120px] truncate">
                      {row.teamleader ||
                        row.teamLeadReview?.teamLeaderName ||
                        "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 max-w-[120px] truncate">
                      {row.agentName || "—"}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="font-semibold text-rose-600">
                        {isEval ? row.rating ?? "—" : row.userrating || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusClass(status)}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setDetailRow(row)}
                        className="text-left text-xs text-slate-600 line-clamp-2 hover:text-blue-600 max-w-[180px]"
                        title={issue}
                      >
                        {issue}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      {isActiveTab && status === "pending" && (
                        <button
                          type="button"
                          disabled={forwardingId === row._id}
                          onClick={() => handleForward(row)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
                          style={{
                            background:
                              "linear-gradient(90deg, #4CAF50, #2196F3)",
                          }}
                        >
                          {forwardingId === row._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>
                              Forward
                              <ArrowRight size={12} />
                            </>
                          )}
                        </button>
                      )}
                      {isActiveTab && status === "forwarded_to_qc" && (
                        <span className="text-xs text-sky-600 font-medium">
                          Awaiting QC
                        </span>
                      )}
                      {status === "approved" && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                          <CheckCircle2 size={14} />
                          Accepted
                        </span>
                      )}
                      {status === "rejected" && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-700 font-medium">
                          <XCircle size={14} />
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
        <span className="text-xs text-slate-500">
          {filtered.length > 0
            ? `Showing ${showingFrom}–${showingTo} of ${filtered.length}`
            : "No results"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-600 min-w-[4rem] text-center">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {detailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 mb-0">
                Lead #{detailRow.leadID || "—"}
              </h3>
              <button
                type="button"
                onClick={() => setDetailRow(null)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">QC User</span>
                  <p className="font-medium text-slate-800 mb-0">
                    {detailRow.submitterName || detailRow.evaluatedby || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Team Lead</span>
                  <p className="font-medium text-slate-800 mb-0">
                    {detailRow.teamleader || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Agent</span>
                  <p className="font-medium text-slate-800 mb-0">
                    {detailRow.agentName || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Status</span>
                  <p className="font-medium mb-0">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(detailRow.flaggedReview?.status || "pending")}`}
                    >
                      {statusLabel(detailRow.flaggedReview?.status || "pending")}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Flagged issue</span>
                <p className="text-slate-700 whitespace-pre-wrap mb-0 mt-1 text-sm leading-relaxed">
                  {detailRow.flaggedReview?.issueSummary ||
                    "Low score / bad rating"}
                </p>
              </div>
              {detailRow.flaggedReview?.qcNote && (
                <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                  <span className="text-slate-400 text-xs">QC note</span>
                  <p className="text-slate-700 mb-0 mt-1">
                    {detailRow.flaggedReview.qcNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedChatsPanel;

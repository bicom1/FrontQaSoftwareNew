
import {
  SquarePen,
  Trash,
  Loader,
  FileWarning,
  CheckCircle,
  Edit,
  AlertCircle,
  Send,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  getEvaluationsByAgentNameApi,
  getEvaluationsByUserEmailApi,
} from "../features/evaluationApi";
import {
  getEscalationsByAgentNameApi,
  getEscalationsByUserEmailApi,
} from "../features/escalationsApi";
import { useNavigate, useParams } from "react-router-dom";

const CACHE_TTL = 1000; // 1 second cache time

const TableAdmin = ({ adminEmail }) => {
  const { agentName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("evaluations");
  const [activeEscalationTab, setActiveEscalationTab] = useState("published");
  const [activeEvaluationTab, setActiveEvaluationTab] = useState("published");
  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);

  // --- LOGIC: DETERMINE STATUS BASED ON SOURCE ---
  const getStatus = (item) => {
    if (
      item.status &&
      (item.status === "published" || item.status === "draft")
    ) {
      return item.status;
    }
    const submissionSource = (item.submissionSource || "").toLowerCase();
    if (submissionSource === "frontend") return "published";
    if (submissionSource === "bitrix") return "draft";

    // Back-compat fallback: infer from legacy "source"/"leadsource" fields
    const source = (item.leadsource || item.source || "").toLowerCase();
    return source.includes("bitrix") ? "draft" : "published";
  };

  /** Same scale as AgentForm: sum of criteria + bonus, max 96. */
  const EVALUATION_MAX_POINTS = 96;

  /**
   * Criteria rows (incl. Bonus Point) are stored as { value, points, comment }.
   * Never coerce to string (avoids "[object Object]").
   */
  const formatBonusPointCell = (field) => {
    if (field == null || field === "") return "";
    if (typeof field === "number" && field !== 0) return `${field} pts`;
    if (typeof field === "string") {
      const s = field.trim();
      return s || "";
    }
    if (typeof field === "object") {
      const points =
        typeof field.points === "number"
          ? field.points
          : typeof field.rateVal === "number"
            ? field.rateVal
            : null;
      const value =
        field.value != null && String(field.value).trim() !== ""
          ? String(field.value).trim()
          : "";
      if (value && points != null && points !== 0)
        return `${value} · ${points} pts`;
      if (points != null && points !== 0) return `${points} pts`;
      if (value) return value;
      const c = field.comment && String(field.comment).trim();
      if (c) return c.length > 36 ? `${c.slice(0, 36)}…` : c;
    }
    return "";
  };

  const publishedEvaluations = evaluations.filter(
    (ev) => getStatus(ev) === "published"
  );
  const draftEvaluations = evaluations.filter(
    (ev) => getStatus(ev) === "draft"
  );

  const publishedEscalations = escalations.filter(
    (esc) => getStatus(esc) === "published"
  );
  const draftEscalations = escalations.filter(
    (esc) => getStatus(esc) === "draft"
  );

  // Cache handling
  const loadFromCache = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const saveToCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === "evaluations") {
          // Use email as cache key priority if available
          const cacheKey = adminEmail
            ? `evaluations_email_${adminEmail}`
            : `evaluations_name_${agentName}`;
          const cached = loadFromCache(cacheKey);
          if (cached) setEvaluations(cached);
          else {
            let evals = [];
            // Priority: Fetch by Email (Submitter) -> Fallback: Fetch by Agent Name (Subject)
            if (adminEmail) {
              evals = await getEvaluationsByUserEmailApi(adminEmail);
            } else {
              evals = await getEvaluationsByAgentNameApi(agentName);
            }
            const data = evals || [];
            setEvaluations(data);
            saveToCache(cacheKey, data);
          }
        } else if (activeTab === "escalations") {
          const cacheKey = adminEmail
            ? `escalations_email_${adminEmail}`
            : `escalations_name_${agentName}`;
          const cached = loadFromCache(cacheKey);
          if (cached) setEscalations(cached);
          else {
            let escs = [];
            if (adminEmail) {
              escs = await getEscalationsByUserEmailApi(adminEmail);
            } else {
              escs = await getEscalationsByAgentNameApi(agentName);
            }
            const data = escs || [];
            setEscalations(data);
            saveToCache(cacheKey, data);
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          "Note: Could not load data. Please ensure the backend is running and you are logged in."
        );
        setEvaluations([]);
        setEscalations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, agentName, adminEmail]);

  const getCurrentEvaluations = () => {
    const currentData =
      activeEvaluationTab === "published"
        ? publishedEvaluations
        : draftEvaluations;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getCurrentEscalations = () => {
    const currentData =
      activeEscalationTab === "published"
        ? publishedEscalations
        : draftEscalations;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvaluations = getCurrentEvaluations();
  const currentEscalations = getCurrentEscalations();

  const getTotalPages = () => {
    if (activeTab === "evaluations") {
      const dataLengths =
        activeEvaluationTab === "published"
          ? publishedEvaluations.length
          : draftEvaluations.length;
      return Math.ceil(dataLengths / itemsPerPage);
    }
    if (activeTab === "escalations") {
      const dataLength =
        activeEscalationTab === "published"
          ? publishedEscalations.length
          : draftEscalations.length;
      return Math.ceil(dataLength / itemsPerPage);
    }
    return Math.ceil(marketing.length / itemsPerPage);
  };

  const totalPages = getTotalPages();

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "-";

  const handleEdit = (id, rowData) => {
    navigate(`/dashboard/qc-team/editescalation/${id}`, {
      state: { row: rowData },
    });
  };
  const handleEdits = (id, rowData) => {
    navigate(`/dashboard/qc-team/editevaluation/${id}`, {
      state: { row: rowData },
    });
  };

  // --- STYLES ---
  const containerStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    width: "100%",
  };

  const tabContainerStyle = {
    display: "flex",
    gap: "32px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "24px",
  };

  const getTabStyle = (isActive) => ({
    paddingBottom: "16px",
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
    color: isActive ? "#2563eb" : "#64748b",
    backgroundColor: "transparent",
    borderLeft: "none",
    borderRight: "none",
    borderTop: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  const getSubTabStyle = (isActive, color = "#2563eb") => ({
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    borderRadius: "8px",
    color: isActive ? "#ffffff" : "#475569",
    backgroundColor: isActive ? color : "#f1f5f9",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  const getStatusBadgeStyle = (status) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    backgroundColor: status === "published" ? "#dcfce7" : "#fef3c7",
    color: status === "published" ? "#166534" : "#b45309",
    border: status === "published" ? "1px solid #bbf7d0" : "1px solid #fde68a",
  });

  return (
    <div style={containerStyle}>
      {/* Main Tabs */}
      <div style={tabContainerStyle}>
        {["evaluations", "escalations"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            style={getTabStyle(activeTab === tab)}
          >
            <span style={{ textTransform: "capitalize" }}>{tab}</span>
            <span
              style={{
                backgroundColor: activeTab === tab ? "#eff6ff" : "#f1f5f9",
                color: activeTab === tab ? "#1d4ed8" : "#64748b",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "11px",
              }}
            >
              {tab === "evaluations" ? evaluations.length : escalations.length}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-100">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* --- ESCALATIONS CONTENT --- */}
      {activeTab === "escalations" && (
        <div>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setActiveEscalationTab("published");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(
                activeEscalationTab === "published",
                "#16a34a"
              )}
            >
              <CheckCircle size={14} />
              Published
            </button>
            <button
              onClick={() => {
                setActiveEscalationTab("draft");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEscalationTab === "draft", "#d97706")}
            >
              <Edit size={14} />
              Drafts (Bitrix)
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Lead ID</th>
                      <th className="px-6 py-4">Agent</th>
                      <th className="px-6 py-4">Issue</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentEscalations.length > 0 ? (
                      currentEscalations.map((row, index) => {
                        const status = getStatus(row);
                        const source = row.leadsource || row.source || "N/A";
                        return (
                          <tr
                            key={row._id || index}
                            className="hover:bg-slate-50/50 transition-colors bg-white"
                          >
                            <td className="px-6 py-4">
                              <span style={getStatusBadgeStyle(status)}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {source}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {row.leadID || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">
                              {row.agentName || "-"}
                            </td>
                            <td
                              className="px-6 py-4 text-slate-500 max-w-xs truncate"
                              title={row.issueIden}
                            >
                              {row.issueIden || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(row._id, row)}
                                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                    status === "draft"
                                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                      : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                                  }`}
                                  title={
                                    status === "draft"
                                      ? "Edit & Publish"
                                      : "Edit"
                                  }
                                >
                                  {status === "draft" ? (
                                    <>
                                      <Send size={14} />{" "}
                                      <span className="text-xs font-bold">
                                        Publish
                                      </span>
                                    </>
                                  ) : (
                                    <SquarePen size={16} />
                                  )}
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          No records found in {activeEscalationTab}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Slider */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <span className="text-xs text-slate-400">Page 1</span>
                  <input
                    type="range"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-400">
                    Page {totalPages}
                  </span>
                  <span className="ml-2 text-sm font-bold text-blue-600 border border-blue-100 px-3 py-1 rounded bg-blue-50">
                    {currentPage}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* --- EVALUATIONS CONTENT --- */}
      {activeTab === "evaluations" && (
        <div>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setActiveEvaluationTab("published");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(
                activeEvaluationTab === "published",
                "#16a34a"
              )}
            >
              <CheckCircle size={14} />
              Published
            </button>
            <button
              onClick={() => {
                setActiveEvaluationTab("draft");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEvaluationTab === "draft", "#d97706")}
            >
              <Edit size={14} />
              Drafts (Bitrix)
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Lead ID</th>
                      <th className="px-6 py-4">Agent</th>
                      <th className="px-6 py-4">Evaluation result</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentEvaluations.length > 0 ? (
                      currentEvaluations.map((row, index) => {
                        const status = getStatus(row);
                        const source = row.leadsource || row.source || "N/A";
                        return (
                          <tr
                            key={row._id || index}
                            className="hover:bg-slate-50/50 transition-colors bg-white"
                          >
                            <td className="px-6 py-4">
                              <span style={getStatusBadgeStyle(status)}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {source}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {row.leadID || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">
                              {row.agentName || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-700 max-w-[260px]">
                              {(() => {
                                const rating = row?.rating;
                                const hasScore =
                                  typeof rating === "number" && rating > 0;
                                const bonusText = formatBonusPointCell(
                                  row?.bonus
                                );
                                if (!hasScore && !bonusText) {
                                  return (
                                    <span className="text-slate-400">-</span>
                                  );
                                }
                                return (
                                  <div className="flex flex-col gap-1">
                                    {hasScore ? (
                                      <span className="font-semibold text-slate-900">
                                        Final score: {rating} /{" "}
                                        {EVALUATION_MAX_POINTS}
                                      </span>
                                    ) : null}
                                    {bonusText ? (
                                      <span className="text-xs text-slate-600 leading-snug">
                                        Bonus point: {bonusText}
                                      </span>
                                    ) : null}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdits(row._id, row)}
                                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                    status === "draft"
                                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                      : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                                  }`}
                                  title={
                                    status === "draft"
                                      ? "Edit & Publish"
                                      : "Edit"
                                  }
                                >
                                  {status === "draft" ? (
                                    <>
                                      <Send size={14} />{" "}
                                      <span className="text-xs font-bold">
                                        Publish
                                      </span>
                                    </>
                                  ) : (
                                    <SquarePen size={16} />
                                  )}
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          No records found in {activeEvaluationTab}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Slider */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <span className="text-xs text-slate-400">Page 1</span>
                  <input
                    type="range"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-400">
                    Page {totalPages}
                  </span>
                  <span className="ml-2 text-sm font-bold text-blue-600 border border-blue-100 px-3 py-1 rounded bg-blue-50">
                    {currentPage}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TableAdmin;

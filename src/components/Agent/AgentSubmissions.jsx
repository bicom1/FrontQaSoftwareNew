import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  ShieldAlert,
  Megaphone,
  Loader2,
  Search,
  CheckCircle2,
  Database,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getToken } from "../../features/config";
import { getMarketingApi, getAllMarketingAdminApi } from "../../features/marketingApi";
import {
  fetchAgentEvaluations,
  fetchAgentEscalations,
  isAgentAdminSession,
} from "../../utils/agentSubmissions";

const PAGE_SIZE = 10;

const badgeStyle = (type) => {
  if (type === "published") return { background: "#dcfce7", color: "#166534" };
  if (type === "draft") return { background: "#fef3c7", color: "#92400e" };
  if (type === "bitrix") return { background: "#f3e8ff", color: "#7e22ce" };
  if (type === "frontend") return { background: "#dbeafe", color: "#1e40af" };
  return { background: "#e5e7eb", color: "#374151" };
};

const normalizeSubmissionSource = (val) => (val || "").toString().toLowerCase();
const normalizeStatus = (val) => (val || "").toString().toLowerCase();

const getSourceAndStatus = (item) => {
  const submissionSource = normalizeSubmissionSource(item.submissionSource);
  const status = normalizeStatus(item.status);

  const source = submissionSource === "bitrix" ? "bitrix" : "frontend";
  const derivedStatus =
    status === "published" || status === "draft"
      ? status
      : source === "bitrix"
      ? "draft"
      : "published";

  return { source, status: derivedStatus };
};

const formatDate = (val) =>
  val ? new Date(val).toLocaleString() : "-";

const formatCriterion = (criterion) => {
  if (!criterion || typeof criterion !== "object") {
    return criterion || "-";
  }
  const parts = [];
  if (criterion.value) parts.push(`Value: ${criterion.value}`);
  if (criterion.points != null) parts.push(`Points: ${criterion.points}`);
  if (criterion.reason) parts.push(`Reason: ${criterion.reason}`);
  if (criterion.otherReason) parts.push(`Other: ${criterion.otherReason}`);
  if (criterion.comment) parts.push(`Comment: ${criterion.comment}`);
  return parts.length ? parts.join(" | ") : "-";
};

const DetailGrid = ({ fields }) => (
  <div className="row g-3 p-3 bg-light rounded-3 mt-2">
    {fields.map(({ label, value }) => (
      <div className="col-md-6 col-lg-4" key={label}>
        <div className="small text-muted text-uppercase fw-semibold mb-1">
          {label}
        </div>
        <div className="text-break">{value ?? "-"}</div>
      </div>
    ))}
  </div>
);

const getEvaluationFields = (row) => [
  { label: "Lead ID", value: row.leadID },
  { label: "Agent Name", value: row.agentName },
  { label: "MOD", value: row.mod },
  { label: "Team Leader", value: row.teamleader },
  { label: "User Email", value: row.useremail },
  { label: "Evaluated By", value: row.evaluatedby },
  { label: "Response Time", value: formatCriterion(row.responsetime) },
  { label: "Greetings", value: formatCriterion(row.greetings) },
  { label: "Accuracy", value: formatCriterion(row.accuracy) },
  { label: "Building Rapport", value: formatCriterion(row.building) },
  { label: "Presenting", value: formatCriterion(row.presenting) },
  { label: "Closing", value: formatCriterion(row.closing) },
  { label: "Bonus", value: formatCriterion(row.bonus) },
  { label: "Evaluation Summary", value: row.evaluationsummary },
  { label: "Total Rating", value: row.rating },
  { label: "Submission Source", value: row.submissionSource },
  { label: "Status", value: row.status },
  { label: "Audio", value: row.audio ? "Attached" : "None" },
  { label: "Bitrix Submitted", value: row.bitrixSubmitted ? "Yes" : "No" },
  { label: "Published At", value: formatDate(row.publishedAt) },
  { label: "Created At", value: formatDate(row.createdAt) },
  { label: "Updated At", value: formatDate(row.updatedAt) },
];

const getEscalationFields = (row) => [
  { label: "Lead ID", value: row.leadID },
  { label: "Agent Name", value: row.agentName },
  { label: "Team Leader", value: row.teamleader },
  { label: "User Email", value: row.useremail },
  { label: "Evaluated By", value: row.evaluatedby },
  { label: "Lead Source", value: row.leadSource },
  { label: "User Rating", value: row.userrating },
  { label: "Lead Status", value: row.leadStatus },
  { label: "Escalation Severity", value: row.escSeverity },
  { label: "Issue Identification", value: row.issueIden },
  { label: "Escalation Action", value: row.escAction },
  { label: "Other Action", value: row.otherAction },
  { label: "Documentation", value: row.documentation },
  { label: "Success Narration", value: row.successmaration },
  { label: "Audio", value: row.audio ? "Attached" : "None" },
  { label: "Submission Source", value: row.submissionSource },
  { label: "Status", value: row.status },
  { label: "Bitrix Submitted", value: row.bitrixSubmitted ? "Yes" : "No" },
  { label: "Published At", value: formatDate(row.publishedAt) },
  { label: "Created At", value: formatDate(row.createdAt) },
  { label: "Updated At", value: formatDate(row.updatedAt) },
];

const ShowMoreLessControl = ({ visibleCount, totalCount, onShowMore, onShowLess }) => {
  if (totalCount <= PAGE_SIZE) return null;

  const hasMore = visibleCount < totalCount;
  const isExpanded = visibleCount > PAGE_SIZE;

  return (
    <div className="d-flex flex-column align-items-center gap-2 pt-3 mt-2 border-top">
      <div className="text-muted small">
        Showing {Math.min(visibleCount, totalCount)} of {totalCount}
      </div>
      <div className="d-flex gap-2">
        {hasMore && (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary px-4"
            onClick={onShowMore}
          >
            <ChevronDown size={14} className="me-1" />
            Show more
          </button>
        )}
        {isExpanded && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary px-4"
            onClick={onShowLess}
          >
            <ChevronUp size={14} className="me-1" />
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

const AgentSubmissions = () => {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [marketing, setMarketing] = useState([]);

  const token = getToken();
  const decoded = useMemo(() => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }, [token]);

  const userEmail = decoded?.email;
  const teamView = isAgentAdminSession();

  useEffect(() => {
    const run = async () => {
      if (!userEmail && !teamView) {
        setError("No user email found in session. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const name = decoded?.name || "";
        const [evals, escs, marketingRes] = await Promise.all([
          fetchAgentEvaluations({ name, email: userEmail }),
          fetchAgentEscalations({ name, email: userEmail }),
          teamView ? getAllMarketingAdminApi() : getMarketingApi(),
        ]);

        setEvaluations(Array.isArray(evals) ? evals : []);
        setEscalations(Array.isArray(escs) ? escs : []);
        const marketingData = marketingRes?.data ?? marketingRes;
        setMarketing(Array.isArray(marketingData) ? marketingData : []);
      } catch (e) {
        console.error(e);
        setError(
          "Could not load your submissions. Please ensure backend is running and you are logged in."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [userEmail, teamView, decoded?.name]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const match = (s) => (s || "").toString().toLowerCase().includes(term);

    if (activeTab === "evaluations") {
      return evaluations.filter(
        (e) =>
          match(e.agentName) ||
          match(e.teamleader) ||
          match(e.mod) ||
          match(e.useremail) ||
          match(e.leadID) ||
          match(e.evaluationsummary)
      );
    }
    if (activeTab === "escalations") {
      return escalations.filter(
        (e) =>
          match(e.agentName) ||
          match(e.teamleader) ||
          match(e.useremail) ||
          match(e.leadID) ||
          match(e.leadSource) ||
          match(e.issueIden) ||
          match(e.successmaration)
      );
    }
    return marketing.filter(
      (m) =>
        match(m.teamleader) ||
        match(m.branch) ||
        match(m.source) ||
        match(m.leadQuality) ||
        match(m.leadID)
    );
  }, [activeTab, evaluations, escalations, marketing, search]);

  // Reset pagination whenever the active tab or search term changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, search]);

  const visibleItems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  };

  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    setExpandedId(null);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Loader2 className="me-2" size={22} style={{ animation: "spin 1s linear infinite" }} />
        <span>{teamView ? "Loading team submissions..." : "Loading your submissions..."}</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">
            {teamView ? "All Agent Submissions" : "My Submitted Forms"}
          </h1>
          <div className="text-muted small d-flex align-items-center gap-2">
            <Mail size={14} /> {userEmail || "-"}
            {teamView && (
              <span className="badge bg-primary-subtle text-primary">
                Agent Admin — full team history
              </span>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="badge rounded-pill px-3 py-2 text-dark" style={{ background: "#f1f5f9" }}>
            Evaluations: {evaluations.length}
          </span>
          <span className="badge rounded-pill px-3 py-2 text-dark" style={{ background: "#f1f5f9" }}>
            Escalations: {escalations.length}
          </span>
          <span className="badge rounded-pill px-3 py-2 text-dark" style={{ background: "#f1f5f9" }}>
            Marketing: {marketing.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div
          className="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center py-3"
          style={{ borderBottom: "1px solid #eef2f7" }}
        >
          <div className="btn-group" role="group" aria-label="tabs">
            <button
              className={`btn ${activeTab === "evaluations" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => {
                setActiveTab("evaluations");
                setExpandedId(null);
              }}
            >
              <FileText size={16} className="me-2" />
              Evaluations
            </button>
            <button
              className={`btn ${activeTab === "escalations" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => {
                setActiveTab("escalations");
                setExpandedId(null);
              }}
            >
              <ShieldAlert size={16} className="me-2" />
              Escalations
            </button>
            <button
              className={`btn ${activeTab === "marketing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => {
                setActiveTab("marketing");
                setExpandedId(null);
              }}
            >
              <Megaphone size={16} className="me-2" />
              Marketing
            </button>
          </div>

          <div className="position-relative" style={{ minWidth: 320 }}>
            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <input
              className="form-control ps-5"
              placeholder="Search in your submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body">
          {filtered.length === 0 ? (
            <div className="text-center text-muted py-5">
              No submissions found.
            </div>
          ) : activeTab === "marketing" ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Lead ID</th>
                      <th>Team Lead</th>
                      <th>Branch</th>
                      <th>Source</th>
                      <th>Lead Quality</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((row) => (
                      <tr key={row._id}>
                        <td className="fw-semibold">{row.leadID || "-"}</td>
                        <td>{row.teamleader || "-"}</td>
                        <td>{row.branch || "-"}</td>
                        <td>{row.source || "-"}</td>
                        <td>{row.leadQuality || "-"}</td>
                        <td className="text-muted small">
                          <span className="d-inline-flex align-items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(row.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ShowMoreLessControl
                visibleCount={visibleCount}
                totalCount={filtered.length}
                onShowMore={handleShowMore}
                onShowLess={handleShowLess}
              />
            </>
          ) : (
            <>
              <div className="d-flex flex-column gap-3">
                {visibleItems.map((row) => {
                  const { source, status } = getSourceAndStatus(row);
                  const isOpen = expandedId === row._id;
                  const fields =
                    activeTab === "evaluations"
                      ? getEvaluationFields(row)
                      : getEscalationFields(row);

                  return (
                    <div key={row._id} className="border rounded-3 overflow-hidden">
                      <button
                        type="button"
                        className="w-100 btn btn-light text-start d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 border-0"
                        onClick={() => toggleExpand(row._id)}
                      >
                        <div className="d-flex flex-wrap align-items-center gap-3">
                          <span className="fw-bold">Lead #{row.leadID || "-"}</span>
                          <span>{row.agentName || "-"}</span>
                          <span className="text-muted small">TL: {row.teamleader || "-"}</span>
                          <span className="badge rounded-pill" style={badgeStyle(source)}>
                            {source === "bitrix" ? "Bitrix" : "Frontend"}
                          </span>
                          <span className="badge rounded-pill" style={badgeStyle(status)}>
                            {status === "published" ? (
                              <span className="d-inline-flex align-items-center gap-1">
                                <CheckCircle2 size={12} /> Published
                              </span>
                            ) : (
                              <span className="d-inline-flex align-items-center gap-1">
                                <Database size={12} /> Draft
                              </span>
                            )}
                          </span>
                          <span className="text-muted small d-inline-flex align-items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(row.createdAt)}
                          </span>
                        </div>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && <DetailGrid fields={fields} />}
                    </div>
                  );
                })}
              </div>
              <ShowMoreLessControl
                visibleCount={visibleCount}
                totalCount={filtered.length}
                onShowMore={handleShowMore}
                onShowLess={handleShowLess}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSubmissions;
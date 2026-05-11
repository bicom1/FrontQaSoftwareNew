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
} from "lucide-react";
import { getToken } from "../../features/config";
import { getEvaluationsByUserEmailApi } from "../../features/evaluationApi";
import { getEscalationsByUserEmailApi } from "../../features/escalationsApi";
import { getMarketingApi } from "../../features/marketingApi";

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

const AgentSubmissions = () => {
  const [activeTab, setActiveTab] = useState("evaluations"); // evaluations | escalations | marketing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    const run = async () => {
      if (!userEmail) {
        setError("No user email found in session. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [evals, escs, marketingRes] = await Promise.all([
          getEvaluationsByUserEmailApi(userEmail),
          getEscalationsByUserEmailApi(userEmail),
          getMarketingApi(),
        ]);

        setEvaluations(Array.isArray(evals) ? evals : []);
        setEscalations(Array.isArray(escs) ? escs : []);
        setMarketing(Array.isArray(marketingRes?.data) ? marketingRes.data : []);
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
  }, [userEmail]);

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
          match(e.leadID)
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
          match(e.issueIden)
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

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Loader2 className="me-2" size={22} style={{ animation: "spin 1s linear infinite" }} />
        <span>Loading your submissions...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">My Submitted Forms</h1>
          <div className="text-muted small d-flex align-items-center gap-2">
            <Mail size={14} /> {userEmail || "-"}
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
              onClick={() => setActiveTab("evaluations")}
            >
              <FileText size={16} className="me-2" />
              Evaluations
            </button>
            <button
              className={`btn ${activeTab === "escalations" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveTab("escalations")}
            >
              <ShieldAlert size={16} className="me-2" />
              Escalations
            </button>
            <button
              className={`btn ${activeTab === "marketing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveTab("marketing")}
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
          ) : (
            <div className="table-responsive">
              {activeTab !== "marketing" ? (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Lead ID</th>
                      <th>Agent</th>
                      <th>Team Lead</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => {
                      const { source, status } = getSourceAndStatus(row);
                      return (
                        <tr key={row._id}>
                          <td className="fw-semibold">{row.leadID || "-"}</td>
                          <td>{row.agentName || "-"}</td>
                          <td>{row.teamleader || "-"}</td>
                          <td>
                            <span className="badge rounded-pill" style={badgeStyle(source)}>
                              {source === "bitrix" ? "Bitrix" : "Frontend"}
                            </span>
                          </td>
                          <td>
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
                          </td>
                          <td className="text-muted small">
                            <span className="d-inline-flex align-items-center gap-1">
                              <Calendar size={14} />
                              {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
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
                    {filtered.map((row) => (
                      <tr key={row._id}>
                        <td className="fw-semibold">{row.leadID || "-"}</td>
                        <td>{row.teamleader || "-"}</td>
                        <td>{row.branch || "-"}</td>
                        <td>{row.source || "-"}</td>
                        <td>{row.leadQuality || "-"}</td>
                        <td className="text-muted small">
                          <span className="d-inline-flex align-items-center gap-1">
                            <Calendar size={14} />
                            {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSubmissions;


import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FileText,
  ShieldAlert,
  Send,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  Paperclip,
  Clock,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../features/config";
import { getEvaluationsByAgentNameApi, getEvaluationsByUserEmailApi } from "../../features/evaluationApi";
import {
  getEscalationsByAgentNameApi,
  getEscalationsByUserEmailApi,
} from "../../features/escalationsApi";
import { createAppealApi, getMyAppealsApi } from "../../features/feedback";
import { isAgentAdminSession } from "../../utils/agentSubmissions";
import FlaggedChatsPanel from "./FlaggedChatsPanel";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".zip"];
const PAGE_SIZE = 10;

const mergeForms = (lists) => {
  const map = new Map();
  lists.flat().forEach((item) => {
    if (item?._id) map.set(String(item._id), item);
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
};

const formatDate = (val) =>
  val ? new Date(val).toLocaleString() : "-";

const AgentFeedbackBox = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedKey, setExpandedKey] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [appealText, setAppealText] = useState({});
  const [appealFiles, setAppealFiles] = useState({});

  const isAgentAdmin = isAgentAdminSession();

  // Pagination state
  const [formsVisibleCount, setFormsVisibleCount] = useState(PAGE_SIZE);
  const [appealsVisibleCount, setAppealsVisibleCount] = useState(PAGE_SIZE);

  const token = getToken();
  const decoded = useMemo(() => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }, [token]);

  const agentName = decoded?.name || "";
  const agentEmail = decoded?.email || "";

  const loadData = useCallback(async () => {
    if (!agentEmail && !agentName) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [evalByName, evalByEmail, escByName, escByEmail, appealsRes] =
        await Promise.all([
          agentName ? getEvaluationsByAgentNameApi(agentName) : [],
          agentEmail ? getEvaluationsByUserEmailApi(agentEmail) : [],
          agentName ? getEscalationsByAgentNameApi(agentName) : [],
          agentEmail ? getEscalationsByUserEmailApi(agentEmail) : [],
          getMyAppealsApi(),
        ]);

      setEvaluations(mergeForms([evalByName, evalByEmail]));
      setEscalations(mergeForms([escByName, escByEmail]));
      setAppeals(appealsRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load forms and appeals");
    } finally {
      setLoading(false);
    }
  }, [agentEmail, agentName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const forms = useMemo(() => {
    const evalItems = evaluations.map((e) => ({
      key: `evaluation-${e._id}`,
      formType: "evaluation",
      formId: e._id,
      leadID: e.leadID,
      agentName: e.agentName,
      teamleader: e.teamleader,
      rating: e.rating,
      mod: e.mod,
      createdAt: e.createdAt,
      label: "Evaluation",
      Icon: FileText,
      badgeClass: "bg-primary",
    }));
    const escItems = escalations.map((e) => ({
      key: `escalation-${e._id}`,
      formType: "escalation",
      formId: e._id,
      leadID: e.leadID,
      agentName: e.agentName,
      teamleader: e.teamleader,
      escSeverity: e.escSeverity,
      leadStatus: e.leadStatus,
      createdAt: e.createdAt,
      label: "Escalation",
      Icon: ShieldAlert,
      badgeClass: "bg-danger",
    }));
    const all = [...evalItems, ...escItems].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    if (filter === "evaluations") return evalItems;
    if (filter === "escalations") return escItems;
    return all;
  }, [evaluations, escalations, filter]);

  const appealedFormIds = useMemo(
    () => new Set(appeals.map((a) => `${a.formType}-${a.formId}`)),
    [appeals]
  );

  // Reset pagination when filter changes
  useEffect(() => {
    setFormsVisibleCount(PAGE_SIZE);
  }, [filter]);

  const visibleForms = useMemo(
    () => forms.slice(0, formsVisibleCount),
    [forms, formsVisibleCount]
  );

  const visibleAppeals = useMemo(
    () => appeals.slice(0, appealsVisibleCount),
    [appeals, appealsVisibleCount]
  );

  const validateFiles = (files) => {
    if (!files?.length) return { ok: true, files: [] };
    if (files.length > MAX_FILES) {
      return { ok: false, message: `Maximum ${MAX_FILES} files allowed` };
    }
    for (const file of files) {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!ALLOWED_EXT.includes(ext)) {
        return {
          ok: false,
          message: "Only images (JPG, PNG, GIF, WEBP), PDF, and ZIP are allowed",
        };
      }
      if (file.size > MAX_FILE_SIZE) {
        return { ok: false, message: `"${file.name}" exceeds 5MB limit` };
      }
    }
    return { ok: true, files: [...files] };
  };

  const handleFileChange = (formKey, fileList) => {
    const result = validateFiles(Array.from(fileList || []));
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setAppealFiles((prev) => ({ ...prev, [formKey]: result.files }));
  };

  const removeFile = (formKey, index) => {
    setAppealFiles((prev) => ({
      ...prev,
      [formKey]: (prev[formKey] || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmitAppeal = async (form) => {
    const message = (appealText[form.key] || "").trim();
    if (message.length < 20) {
      toast.error("Please describe your case in at least 20 characters");
      return;
    }

    const files = appealFiles[form.key] || [];
    const fileCheck = validateFiles(files);
    if (!fileCheck.ok) {
      toast.error(fileCheck.message);
      return;
    }

    const data = new FormData();
    data.append("formType", form.formType);
    data.append("formId", form.formId);
    data.append("leadID", form.leadID ?? "");
    data.append("agentName", form.agentName || agentName);
    data.append("appealMessage", message);
    files.forEach((file) => data.append("attachments", file));

    try {
      setSubmitting(true);
      await createAppealApi(data);
      toast.success("Appeal submitted successfully");
      setAppealText((prev) => ({ ...prev, [form.key]: "" }));
      setAppealFiles((prev) => ({ ...prev, [form.key]: [] }));
      setExpandedKey(null);
      await loadData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to submit appeal"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Loader2 className="me-2 spin" size={22} />
        <span>Loading your submitted forms...</span>
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 py-5">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {isAgentAdmin ? "Flagged Chats" : "Form Appeals & Feedback"}
          </h1>
          {!isAgentAdmin && (
            <p className="text-slate-500 text-sm mb-0">
              Review QC on your submitted forms and appeal if you believe the
              evaluation was incorrect.
            </p>
          )}
        </div>

        {isAgentAdmin && <FlaggedChatsPanel />}

      {!isAgentAdmin && (
      <>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Submitted Forms</div>
              <div className="fs-3 fw-bold">{evaluations.length + escalations.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">My Appeals</div>
              <div className="fs-3 fw-bold">{appeals.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Pending Review</div>
              <div className="fs-3 fw-bold text-warning">
                {appeals.filter((a) => a.status === "pending").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <h5 className="mb-0">Your Submitted Forms</h5>
          <div className="btn-group btn-group-sm">
            {[
              { id: "all", label: "All" },
              { id: "evaluations", label: "Evaluations" },
              { id: "escalations", label: "Escalations" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`btn ${filter === id ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {forms.length === 0 ? (
            <div className="text-center text-muted py-5">
              No submitted forms found for your account.
            </div>
          ) : (
            <>
              {visibleForms.map((form) => {
                const isOpen = expandedKey === form.key;
                const hasAppeal = appealedFormIds.has(`${form.formType}-${form.formId}`);
                const FormIcon = form.Icon;

                return (
                  <div key={form.key} className="border rounded-3 mb-3 overflow-hidden">
                    <button
                      type="button"
                      className="w-100 btn btn-light text-start d-flex align-items-center justify-content-between p-3 border-0"
                      onClick={() => setExpandedKey(isOpen ? null : form.key)}
                    >
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className={`badge ${form.badgeClass}`}>{form.label}</span>
                        <span className="fw-semibold">Lead #{form.leadID || "-"}</span>
                        <span className="text-muted small">TL: {form.teamleader || "-"}</span>
                        {form.formType === "evaluation" && (
                          <span className="text-muted small">Rating: {form.rating ?? "-"}</span>
                        )}
                        {form.formType === "escalation" && (
                          <span className="text-muted small">{form.escSeverity || "-"}</span>
                        )}
                        <span className="text-muted small d-inline-flex align-items-center gap-1">
                          <Clock size={14} />
                          {formatDate(form.createdAt)}
                        </span>
                        {hasAppeal && (
                          <span className="badge bg-success-subtle text-success border">
                            Appeal submitted
                          </span>
                        )}
                      </div>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {isOpen && (
                      <div className="p-4 border-top bg-light-subtle">
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <div className="small text-muted">Agent</div>
                            <div>{form.agentName || "-"}</div>
                          </div>
                          <div className="col-md-6">
                            <div className="small text-muted">Team Lead</div>
                            <div>{form.teamleader || "-"}</div>
                          </div>
                          {form.formType === "evaluation" && (
                            <>
                              <div className="col-md-6">
                                <div className="small text-muted">MOD</div>
                                <div>{form.mod || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="small text-muted">Rating</div>
                                <div>{form.rating ?? "-"}</div>
                              </div>
                            </>
                          )}
                          {form.formType === "escalation" && (
                            <>
                              <div className="col-md-6">
                                <div className="small text-muted">Severity</div>
                                <div>{form.escSeverity || "-"}</div>
                              </div>
                              <div className="col-md-6">
                                <div className="small text-muted">Lead Status</div>
                                <div>{form.leadStatus || "-"}</div>
                              </div>
                            </>
                          )}
                        </div>

                        <label className="form-label fw-semibold d-flex align-items-center gap-2">
                          <MessageSquare size={16} className="text-primary" />
                          Your Response / Appeal
                        </label>
                        <textarea
                          className="form-control mb-2"
                          rows={5}
                          placeholder="Explain why you disagree with this QC evaluation. Describe your case clearly (e.g. the QC missed context, wrong criteria applied, etc.)..."
                          value={appealText[form.key] || ""}
                          onChange={(e) =>
                            setAppealText((prev) => ({
                              ...prev,
                              [form.key]: e.target.value,
                            }))
                          }
                          maxLength={2000}
                        />
                        <div className="text-end text-muted small mb-3">
                          {(appealText[form.key] || "").length}/2000 (min 20)
                        </div>

                        <label className="form-label fw-semibold d-flex align-items-center gap-2">
                          <Upload size={16} className="text-primary" />
                          Supporting Documents
                        </label>
                        <p className="text-muted small mb-2">
                          Images, PDF, or ZIP — up to {MAX_FILES} files, 5MB each
                        </p>
                        <input
                          type="file"
                          className="form-control mb-2"
                          accept="image/*,.pdf,.zip,application/zip"
                          multiple
                          onChange={(e) => handleFileChange(form.key, e.target.files)}
                        />
                        {(appealFiles[form.key] || []).length > 0 && (
                          <ul className="list-group mb-3">
                            {(appealFiles[form.key] || []).map((file, idx) => (
                              <li
                                key={`${file.name}-${idx}`}
                                className="list-group-item d-flex justify-content-between align-items-center py-2"
                              >
                                <span className="small d-flex align-items-center gap-2">
                                  <Paperclip size={14} />
                                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeFile(form.key, idx)}
                                >
                                  <X size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-primary d-inline-flex align-items-center gap-2"
                            disabled={submitting}
                            onClick={() => handleSubmitAppeal(form)}
                          >
                            {submitting ? (
                              <>
                                <Loader2 size={16} className="spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Submit Appeal
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {forms.length > formsVisibleCount && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary px-4"
                    onClick={() => setFormsVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    View More ({forms.length - formsVisibleCount} remaining)
                  </button>
                </div>
              )}

              {formsVisibleCount > PAGE_SIZE && (
                <div className="d-flex justify-content-center mt-2">
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-muted"
                    onClick={() => setFormsVisibleCount(PAGE_SIZE)}
                  >
                    Show Less
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {appeals.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">My Submitted Appeals</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Form</th>
                    <th>Lead ID</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAppeals.map((appeal) => (
                    <tr key={appeal._id}>
                      <td className="text-capitalize">{appeal.formType}</td>
                      <td>{appeal.leadID || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            appeal.status === "pending"
                              ? "bg-warning text-dark"
                              : appeal.status === "resolved"
                              ? "bg-success"
                              : "bg-info"
                          }`}
                        >
                          {appeal.status}
                        </span>
                      </td>
                      <td className="small text-muted">{formatDate(appeal.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {appeals.length > appealsVisibleCount && (
              <div className="d-flex justify-content-center py-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-primary px-4"
                  onClick={() => setAppealsVisibleCount((c) => c + PAGE_SIZE)}
                >
                  View More ({appeals.length - appealsVisibleCount} remaining)
                </button>
              </div>
            )}

            {appealsVisibleCount > PAGE_SIZE && (
              <div className="d-flex justify-content-center pb-3">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-muted"
                  onClick={() => setAppealsVisibleCount(PAGE_SIZE)}
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </>
      )}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
};

export default AgentFeedbackBox;
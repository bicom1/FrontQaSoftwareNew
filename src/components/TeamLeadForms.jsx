import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { getTeamLeadReviewsApi } from "../features/teamLeadReviewApi";
import { getMyTeamLeaderApi } from "../features/teamleadApi";
import TeamLeadReviewBlock from "./TeamLeadReviewBlock";

const formatDate = (v) => (v ? new Date(v).toLocaleString() : "—");

/**
 * Low-score QC forms for the logged-in team lead only (matched by email in Team Lead list).
 * Not shown in the agent submissions page.
 */
const TeamLeadForms = () => {
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState([]);
  const [forms, setForms] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [denied, setDenied] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await getMyTeamLeaderApi();
      if (!profile?.isTeamLead || !profile?.data?.length) {
        setDenied(true);
        setLeaders([]);
        setForms([]);
        return;
      }
      setLeaders(profile.data);
      const res = await getTeamLeadReviewsApi({ limit: 100 });
      setForms(Array.isArray(res?.data) ? res.data : []);
      setDenied(false);
    } catch {
      setDenied(true);
      setForms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReviewUpdated = (updated) => {
    if (!updated?._id) return;
    setForms((prev) =>
      prev.map((f) => (f._id === updated._id ? { ...f, ...updated } : f))
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Loader2 size={22} className="me-2 spin" />
        Loading...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertCircle size={20} />
          <span>
            This page is only for registered team leads. Your login email must
            match a team lead in Add Team Lead.
          </span>
        </div>
      </div>
    );
  }

  const leaderNames = leaders.map((l) => l.name).join(", ");

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-bold mb-1">Low Score QC Forms</h4>
      <p className="text-muted small mb-4">
        Forms routed to you as team lead: <strong>{leaderNames}</strong>. Ask
        the QC reviewer questions and resolve when done.
      </p>

      {forms.length === 0 ? (
        <div className="alert alert-info mb-0">
          No low-score forms for your team right now.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {forms.map((row) => {
            const open = expandedId === row._id;
            return (
              <div key={row._id} className="card border-0 shadow-sm">
                <button
                  type="button"
                  className="card-body btn text-start w-100 border-0 d-flex justify-content-between align-items-center"
                  onClick={() => setExpandedId(open ? null : row._id)}
                >
                  <div>
                    <span className="fw-semibold me-2">
                      {row.formType === "escalation" ? "Escalation" : "Eval"} #
                      {row.leadID || "—"}
                    </span>
                    <span className="text-muted">{row.agentName}</span>
                    <span className="badge bg-danger ms-2">
                      {row.formType === "escalation"
                        ? `Rating ${row.userrating || "bad"}`
                        : `Score ${row.rating}/96`}
                    </span>
                    <span className="badge bg-secondary ms-1 text-capitalize">
                      {row.teamLeadReview?.status || "pending"}
                    </span>
                    <div className="small text-muted mt-1">
                      QC: {row.evaluatedby || row.useremail || "—"} ·{" "}
                      {formatDate(row.createdAt)}
                    </div>
                  </div>
                  {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {open && (
                  <div className="border-top">
                    <div className="p-3 small bg-light">
                      <strong>Summary:</strong>{" "}
                      {row.evaluationsummary || "—"}
                    </div>
                    <TeamLeadReviewBlock
                      evaluationId={row._id}
                      initialReview={row.teamLeadReview}
                      onReviewUpdated={handleReviewUpdated}
                      isTeamLeadView
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamLeadForms;

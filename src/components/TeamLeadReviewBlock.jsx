import React, { useEffect, useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  getTeamLeadReviewApi,
  askTeamLeadQuestionApi,
  answerTeamLeadQuestionApi,
  resolveTeamLeadReviewApi,
} from "../features/teamLeadReviewApi";
import {
  isQcRole,
  isQcAdmin,
  normalizeRole,
  ROLES,
} from "../utils/roles";

/**
 * Inline Q&A for low-score evaluations — embed inside existing form detail views.
 * Team lead (agent admin) asks; QC submitter answers.
 */
const TeamLeadReviewBlock = ({
  evaluationId,
  initialReview,
  onReviewUpdated,
  isTeamLeadView = false,
  canAnswerReview = false,
}) => {
  const role = normalizeRole(localStorage.getItem("userRole"));
  const canAsk = isTeamLeadView;
  const canAnswer =
    !isTeamLeadView &&
    (canAnswerReview ||
      isQcRole(role) ||
      isQcAdmin(role) ||
      normalizeRole(role) === ROLES.SUPER_ADMIN);
  const canResolve =
    canAsk ||
    isQcAdmin(role) ||
    normalizeRole(role) === ROLES.SUPER_ADMIN;

  const [review, setReview] = useState(initialReview);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({});

  const load = async () => {
    if (!evaluationId) return;
    try {
      setLoading(true);
      const res = await getTeamLeadReviewApi(evaluationId);
      if (res?.data?.teamLeadReview) {
        setReview(res.data.teamLeadReview);
        onReviewUpdated?.(res.data);
      }
    } catch {
      /* keep initial */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (evaluationId) load();
  }, [evaluationId]);

  if (!review?.required) return null;

  const threads = review.threads || [];
  const status = review.status || "pending";

  const handleAsk = async (e) => {
    e.preventDefault();
    if (question.trim().length < 10) {
      toast.error("Question must be at least 10 characters");
      return;
    }
    try {
      setSubmitting(true);
      const res = await askTeamLeadQuestionApi(evaluationId, question.trim());
      setQuestion("");
      if (res?.data) onReviewUpdated?.(res.data);
      await load();
      toast.success("Question sent");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (threadId) => {
    const answer = (answers[threadId] || "").trim();
    if (answer.length < 10) {
      toast.error("Answer must be at least 10 characters");
      return;
    }
    try {
      setSubmitting(true);
      const res = await answerTeamLeadQuestionApi(
        evaluationId,
        threadId,
        answer
      );
      setAnswers((prev) => ({ ...prev, [threadId]: "" }));
      if (res?.data) onReviewUpdated?.(res.data);
      await load();
      toast.success("Answer submitted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    try {
      setSubmitting(true);
      const res = await resolveTeamLeadReviewApi(evaluationId);
      if (res?.data) onReviewUpdated?.(res.data);
      await load();
      toast.success("Marked as resolved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resolve");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-top bg-warning-subtle px-3 py-3 mt-0">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div>
          <span className="fw-semibold small text-danger">
            Low score — team lead review
          </span>
          <span className="badge bg-secondary ms-2 text-capitalize">{status}</span>
        </div>
        {canResolve && status !== "resolved" && (
          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            disabled={submitting}
            onClick={handleResolve}
          >
            <CheckCircle2 size={14} className="me-1" />
            Resolve
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-muted small py-2">
          <Loader2 size={14} className="me-1 spin" />
          Loading review...
        </div>
      ) : (
        <>
          {threads.length === 0 ? (
            <p className="text-muted small mb-2">
              {canAsk
                ? "Ask the QC reviewer about this low score below."
                : "Waiting for team lead questions."}
            </p>
          ) : (
            <div className="d-flex flex-column gap-2 mb-3">
              {threads.map((t) => (
                <div key={t._id} className="bg-white border rounded p-2 small">
                  <div className="fw-semibold text-primary">
                    {t.askedByName || "Team lead"} asked:
                  </div>
                  <div className="mb-2">{t.question}</div>
                  {t.answer ? (
                    <div className="border-start border-success ps-2 text-success">
                      <strong>{t.answeredByName || "QC"}:</strong> {t.answer}
                    </div>
                  ) : canAnswer ? (
                    <div className="mt-2">
                      <textarea
                        className="form-control form-control-sm mb-1"
                        rows={2}
                        placeholder="Your answer (min 10 chars)..."
                        value={answers[t._id] || ""}
                        onChange={(e) =>
                          setAnswers((p) => ({
                            ...p,
                            [t._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        disabled={submitting}
                        onClick={() => handleAnswer(t._id)}
                      >
                        Submit answer
                      </button>
                    </div>
                  ) : (
                    <span className="text-warning">Awaiting QC answer</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {canAsk && status !== "resolved" && (
            <form onSubmit={handleAsk} className="mt-2">
              <label className="form-label small fw-semibold mb-1">
                Ask QC reviewer
              </label>
              <textarea
                className="form-control form-control-sm mb-2"
                rows={2}
                placeholder="e.g. Why was greeting marked down on this call?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                minLength={10}
              />
              <button
                type="submit"
                className="btn btn-sm btn-dark"
                disabled={submitting}
              >
                <Send size={14} className="me-1" />
                Send question
              </button>
            </form>
          )}
        </>
      )}
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default TeamLeadReviewBlock;

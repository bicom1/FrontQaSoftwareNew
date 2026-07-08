import React, { useEffect, useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  getTeamLeadReviewApi,
  askTeamLeadQuestionApi,
  answerTeamLeadQuestionApi,
  resolveTeamLeadReviewApi,
} from "../features/teamLeadReviewApi";
import { isQcRole, normalizeRole, ROLES } from "../utils/roles";

const TeamLeadReviewBlock = ({
  evaluationId,
  initialReview,
  onReviewUpdated,
  isTeamLeadView = false,
  canAnswerReview = false,
}) => {
  const role = normalizeRole(localStorage.getItem("userRole"));
  const canAsk = Boolean(isTeamLeadView);
  const canAnswer =
    !canAsk &&
    (canAnswerReview ||
      isQcRole(role) ||
      role === ROLES.SUPER_ADMIN);
  const canResolveRole = canAsk;

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

  useEffect(() => {
    setReview(initialReview);
  }, [initialReview]);

  if (!review?.required) return null;

  const threads = review.threads || [];
  const status = review.status || "pending";
  const isResolved = status === "resolved";
  const discussionComplete =
    threads.length > 0 &&
    threads.every((t) => t.question?.trim() && t.answer?.trim());
  const canShowResolve = canResolveRole && discussionComplete;

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
      toast.success("Answer sent");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!discussionComplete) {
      toast.info("Ask a question and wait for an answer first");
      return;
    }
    try {
      setSubmitting(true);
      const res = await resolveTeamLeadReviewApi(evaluationId);
      if (res?.data) onReviewUpdated?.(res.data);
      await load();
      toast.success("The issue is resolved", { autoClose: 4000 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resolve");
    } finally {
      setSubmitting(false);
    }
  };

  if (isResolved) {
    return (
      <div className="border rounded border-success bg-success-subtle px-3 py-3">
        <div className="d-flex align-items-center gap-2 text-success fw-semibold">
          <CheckCircle2 size={20} />
          The issue is resolved
        </div>
        {threads.length > 0 && (
          <div className="mt-3 d-flex flex-column gap-2">
            {threads.map((t) => (
              <div key={t._id} className="bg-white border rounded p-2 small">
                <div className="text-primary fw-semibold">Q: {t.question}</div>
                {t.answer && (
                  <div className="text-success mt-1">A: {t.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded bg-warning-subtle px-3 py-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <span className="fw-semibold text-danger">Low score review</span>
        {canShowResolve && (
          <button
            type="button"
            className="btn btn-sm btn-success"
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
          Loading...
        </div>
      ) : (
        <>
          {threads.length > 0 && (
            <div className="d-flex flex-column gap-2 mb-3">
              {threads.map((t) => (
                <div key={t._id} className="bg-white border rounded p-2 small">
                  <div className="fw-semibold text-primary">
                    {t.askedByName || "Team lead"}:
                  </div>
                  <div className="mb-2">{t.question}</div>
                  {t.answer ? (
                    <div className="border-start border-success ps-2 text-success">
                      <strong>{t.answeredByName || "Submitter"}:</strong>{" "}
                      {t.answer}
                    </div>
                  ) : canAnswer ? (
                    <div className="mt-2">
                      <textarea
                        className="form-control form-control-sm mb-1"
                        rows={2}
                        placeholder="Your answer..."
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
                        Send answer
                      </button>
                    </div>
                  ) : (
                    <span className="text-warning">Waiting for answer...</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {canAsk && (
            <form onSubmit={handleAsk} className="mt-2">
              <textarea
                className="form-control form-control-sm mb-2"
                rows={2}
                placeholder="Ask a question..."
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

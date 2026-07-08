import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { resolveFlaggedReviewApi } from "../features/flaggedReviewApi";

const FlaggedReviewDecisionBlock = ({
  formId,
  initialReview,
  onUpdated,
  canDecide = false,
}) => {
  const [review, setReview] = useState(initialReview);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!review?.required) return null;

  const status = review.status || "pending";

  if (status === "approved") {
    return (
      <div className="border rounded border-success bg-success-subtle px-3 py-3 small">
        <div className="text-success fw-semibold d-flex align-items-center gap-2">
          <CheckCircle2 size={18} />
          Issue resolved — valid reason accepted
        </div>
        {review.qcNote && <p className="mb-0 mt-2">{review.qcNote}</p>}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="border rounded border-danger bg-danger-subtle px-3 py-3 small">
        <div className="text-danger fw-semibold d-flex align-items-center gap-2">
          <XCircle size={18} />
          Issue not resolved — reason not accepted
        </div>
        {review.qcNote && <p className="mb-0 mt-2">{review.qcNote}</p>}
      </div>
    );
  }

  if (status !== "forwarded_to_qc" || !canDecide) {
    if (status === "forwarded_to_qc") {
      return (
        <div className="alert alert-info py-2 small mb-0">
          Awaiting QC admin decision.
        </div>
      );
    }
    return null;
  }

  const handleDecision = async (decision) => {
    try {
      setSubmitting(true);
      const res = await resolveFlaggedReviewApi(formId, decision, note.trim());
      if (!res?.success) {
        throw new Error(res?.message || "Failed");
      }
      setReview(res.data?.flaggedReview || review);
      onUpdated?.(res.data);
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.message || "Failed to submit decision");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded bg-light px-3 py-3">
      <h6 className="fw-semibold mb-2">QC Admin decision</h6>
      <p className="small text-muted mb-2">
        Review the issue below. Approve if there is a valid reason; otherwise reject.
      </p>
      <textarea
        className="form-control form-control-sm mb-2"
        rows={3}
        placeholder="Optional note for your decision..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={2000}
      />
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-sm btn-success"
          disabled={submitting}
          onClick={() => handleDecision("approved")}
        >
          Accept — resolve issue
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          disabled={submitting}
          onClick={() => handleDecision("rejected")}
        >
          Reject — not resolved
        </button>
      </div>
    </div>
  );
};

export default FlaggedReviewDecisionBlock;

import React from "react";

const Row = ({ label, value }) => (
  <div className="col-12 col-md-6 mb-2">
    <span className="text-muted small">{label}</span>
    <div className="fw-semibold">{value ?? "—"}</div>
  </div>
);

const LowScoreFormSummary = ({ record, type }) => {
  if (!record) return null;

  if (type === "escalation") {
    return (
      <div className="row g-1 p-3 bg-light border-bottom small">
        <Row label="Submitted by" value={record.submitterName} />
        <Row label="Agent" value={record.agentName} />
        <Row label="Team lead" value={record.teamleader} />
        <Row label="Lead ID" value={record.leadID} />
        <Row label="User rating" value={record.userrating} />
        <Row label="Severity" value={record.escSeverity} />
        <Row label="Issue" value={record.issueIden} />
        <Row label="Action" value={record.escAction} />
        {record.successmaration && (
          <div className="col-12 mb-2">
            <span className="text-muted small">Notes</span>
            <div>{record.successmaration}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="row g-1 p-3 bg-light border-bottom small">
      <Row label="Submitted by" value={record.submitterName} />
      <Row label="Agent" value={record.agentName} />
      <Row label="Team lead" value={record.teamleader} />
      <Row label="Lead ID" value={record.leadID} />
      <Row label="MOD" value={record.mod} />
      <Row label="Score" value={`${record.rating ?? "—"}/96`} />
      {record.evaluationsummary && (
        <div className="col-12 mb-2">
          <span className="text-muted small">Evaluation summary</span>
          <div>{record.evaluationsummary}</div>
        </div>
      )}
    </div>
  );
};

export default LowScoreFormSummary;

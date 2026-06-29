import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ContentOverviewCard = ({
  evaluationCount = 0,
  escalationCount = 0,
  recentActivity = [],
  viewPath,
  timeAgo,
  headerStyle,
}) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  const hasBoth = evaluationCount > 0 && escalationCount > 0;

  const displayTotal = useMemo(() => {
    if (selectedType === "evaluations") return evaluationCount;
    if (selectedType === "escalations") return escalationCount;
    return evaluationCount + escalationCount;
  }, [selectedType, evaluationCount, escalationCount]);

  const filteredActivity = useMemo(() => {
    if (!hasBoth || selectedType === "all") return recentActivity;
    if (selectedType === "evaluations") {
      return recentActivity.filter((item) =>
        String(item.action || "").toLowerCase().includes("evaluation")
      );
    }
    return recentActivity.filter((item) =>
      String(item.action || "").toLowerCase().includes("escalation")
    );
  }, [recentActivity, selectedType, hasBoth]);

  const defaultHeaderStyle = {
    background: "linear-gradient(90deg, #4CAF50, #2196F3)",
    borderRadius: "0.5rem 0.5rem 0 0",
    fontSize: "23px",
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <p
          style={headerStyle || defaultHeaderStyle}
          className="text-white p-2 mb-4"
        >
          Content Overview
        </p>

        <div className="p-2 rounded bg-light mb-3">
          <h5 className="mb-2 fw-semibold">Total Submissions</h5>
          <div className="d-flex align-items-center gap-2">
            {hasBoth ? (
              <Form.Select
                size="sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-grow-1"
              >
                <option value="all">
                  All ({evaluationCount + escalationCount})
                </option>
                <option value="evaluations">
                  Evaluations ({evaluationCount})
                </option>
                <option value="escalations">
                  Escalations ({escalationCount})
                </option>
              </Form.Select>
            ) : (
              <span className="text-muted flex-grow-1">{displayTotal}</span>
            )}
            {viewPath && (
              <Button
                variant="dark"
                size="sm"
                className="flex-shrink-0"
                onClick={() => navigate(viewPath)}
              >
                View
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h5 className="text-muted mb-3 fw-bold">Recent Activity</h5>
          <ul className="list-group list-group-flush">
            {filteredActivity?.length > 0 ? (
              filteredActivity.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center px-0"
                >
                  <span className="small">
                    {item.actorName} {item.action}
                  </span>
                  <small className="text-muted">
                    {timeAgo ? timeAgo(item.createdAt) : ""}
                  </small>
                </li>
              ))
            ) : (
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span className="text-muted">No recent activity</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentOverviewCard;

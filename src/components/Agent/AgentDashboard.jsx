import React, { useEffect, useState } from "react";

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentName, setAgentName] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);

  const API_BASE_URL = "http://localhost:3001/api";

  const calculateWeeklyPerformance = (evaluations) => {
    const now = new Date();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(now.getDate() - i);
      return date;
    }).reverse();

    const dailyCounts = last7Days.map((date) => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      return evaluations.filter((evaluation) => {
        const evalDate = new Date(evaluation.date || evaluation.createdAt);
        return evalDate >= dayStart && evalDate <= dayEnd;
      }).length;
    });

    const dayLabels = last7Days.map((date) => daysOfWeek[date.getDay()]);
    return { labels: dayLabels, data: dailyCounts };
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const name = decoded.name;
      setAgentName(name);

      const [evalRes, escRes] = await Promise.all([
        fetch(`${API_BASE_URL}/evaluations/agent/${name}`),
        fetch(`${API_BASE_URL}/escalations`),
      ]);

      const evalData = await evalRes.json();
      const escData = await escRes.json();

      if (evalData.success && escData.success) {
        const evaluations = evalData.data;
        const escalations = escData.data;

        const agentEscalations = escalations.filter(
          (esc) => esc.agentName === name || esc.useremail === name
        );

        const totalEvaluations = evaluations.length;
        const totalPoints = evaluations.reduce(
          (sum, e) => sum + Number(e.rating || 0),
          0
        );
        const averageRating =
          totalEvaluations > 0
            ? (totalPoints / totalEvaluations).toFixed(1)
            : 0;

        const totalEscalations = agentEscalations.length;
        const completedEscalations = agentEscalations.filter(
          (esc) =>
            esc.leadStatus === "Completed" || esc.leadStatus === "Resolved"
        ).length;
        const pendingEscalations = totalEscalations - completedEscalations;

        const weeklyPerformance = calculateWeeklyPerformance(evaluations);

        setDashboardData({
          evaluations: {
            total: totalEvaluations,
            totalPoints,
            averageRating,
          },
          escalations: {
            total: totalEscalations,
            completed: completedEscalations,
            pending: pendingEscalations,
          },
          weeklyPerformance,
        });

        setLastUpdate(new Date());
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e9ecef",
              borderTop: "4px solid #4CAF50",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#495057",
              marginBottom: "8px",
            }}
          >
            Loading...
          </h3>
          <p style={{ color: "#6c757d", fontSize: "14px" }}>
            Fetching your performance data
          </p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              color: "#dc3545",
              marginBottom: "12px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            ⚠️ Error Loading Data
          </h3>
          <p
            style={{ color: "#6c757d", marginBottom: "20px", fontSize: "14px" }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(90deg, #4CAF50, #2196F3)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { evaluations, escalations, weeklyPerformance } = dashboardData || {};
  const totalForms = (evaluations?.total || 0) + (escalations?.total || 0);
  const maxWeekly = Math.max(...(weeklyPerformance?.data || [0]), 5);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "4px",
              }}
            >
              {agentName}
            </h1>
            <p style={{ color: "#6c757d", fontSize: "16px", margin: 0 }}>
              Performance Dashboard
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#adb5bd",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Last Updated
            </div>
            <div
              style={{ fontSize: "16px", color: "#495057", fontWeight: "600" }}
            >
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Average Rating */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Average Rating
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "700",
                  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                }}
              >
                {evaluations?.averageRating || "0.0"}%
              </div>
              <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                {evaluations?.totalPoints || 0} total points
              </div>
            </div>
          </div>

          {/* Total Evaluations */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Total Evaluations
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "700",
                  color: "#28a745",
                  marginBottom: "8px",
                }}
              >
                {evaluations?.total || 0}
              </div>
              <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                Calls & Chats
              </div>
            </div>
          </div>

          {/* Total Escalations */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                Total Escalations
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "700",
                  color: "#ffc107",
                  marginBottom: "8px",
                }}
              >
                {escalations?.total || 0}
              </div>
              <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                {escalations?.pending || 0} pending
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Weekly Performance */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Weekly Activity (Last 7 Days)
              </h3>
            </div>
            <svg
              viewBox="0 0 600 280"
              style={{ width: "100%", height: "280px" }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2196F3" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              <line
                x1="50"
                y1="20"
                x2="50"
                y2="240"
                stroke="#e0e0e0"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="240"
                x2="580"
                y2="240"
                stroke="#e0e0e0"
                strokeWidth="2"
              />

              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="50"
                  y1={240 - i * 55}
                  x2="580"
                  y2={240 - i * 55}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}

              {(weeklyPerformance?.data || [0, 0, 0, 0, 0, 0, 0]).map(
                (value, index) => {
                  const barHeight =
                    maxWeekly > 0 ? (value / maxWeekly) * 180 : 0;
                  const x = 80 + index * 75;
                  return (
                    <g key={index}>
                      <rect
                        x={x}
                        y={240 - barHeight}
                        width="50"
                        height={Math.max(barHeight, 0)}
                        fill={value > 0 ? "url(#barGradient)" : "#e9ecef"}
                        rx="6"
                      />
                      <text
                        x={x + 25}
                        y={260}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#6b7280"
                        fontWeight="500"
                      >
                        {weeklyPerformance?.labels[index] || ""}
                      </text>
                      {value > 0 && (
                        <text
                          x={x + 25}
                          y={230 - barHeight}
                          textAnchor="middle"
                          fontSize="13"
                          fill="#374151"
                          fontWeight="700"
                        >
                          {value}
                        </text>
                      )}
                    </g>
                  );
                }
              )}

              {[0, 1, 2, 3, 4].map((i) => (
                <text
                  key={i}
                  x="42"
                  y={245 - i * 55}
                  textAnchor="end"
                  fontSize="11"
                  fill="#9ca3af"
                  fontWeight="500"
                >
                  {Math.round((maxWeekly / 4) * i)}
                </text>
              ))}
            </svg>
          </div>

          {/* Forms Distribution */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Forms Distribution
              </h3>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "20px",
              }}
            >
              {totalForms} total submissions
            </p>
            <div style={{ textAlign: "center" }}>
              <svg
                viewBox="0 0 200 200"
                style={{ width: "180px", height: "180px", margin: "0 auto" }}
              >
                <defs>
                  <linearGradient
                    id="pieGradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4CAF50" />
                    <stop offset="100%" stopColor="#66bb6a" />
                  </linearGradient>
                  <linearGradient
                    id="pieGradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#2196F3" />
                    <stop offset="100%" stopColor="#42a5f5" />
                  </linearGradient>
                </defs>
                {(() => {
                  if (totalForms === 0) {
                    return (
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="#f5f5f5"
                        stroke="#e0e0e0"
                        strokeWidth="2"
                      />
                    );
                  }

                  const evalPercentage = (evaluations.total / totalForms) * 100;
                  const evalAngle = (evalPercentage / 100) * 360;

                  const x1 = 100 + 80 * Math.cos((Math.PI * 0) / 180);
                  const y1 = 100 + 80 * Math.sin((Math.PI * 0) / 180);
                  const x2 = 100 + 80 * Math.cos((Math.PI * evalAngle) / 180);
                  const y2 = 100 + 80 * Math.sin((Math.PI * evalAngle) / 180);
                  const largeArc = evalAngle > 180 ? 1 : 0;

                  return (
                    <>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill="url(#pieGradient1)"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path
                        d={`M 100 100 L ${x2} ${y2} A 80 80 0 ${
                          1 - largeArc
                        } 1 ${x1} ${y1} Z`}
                        fill="url(#pieGradient2)"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </>
                  );
                })()}
              </svg>
              <div style={{ marginTop: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    padding: "8px 12px",
                    background: "#f8f9fa",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        background: "linear-gradient(135deg, #4CAF50, #66bb6a)",
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#495057",
                        fontWeight: "500",
                      }}
                    >
                      Evaluations
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#212529",
                    }}
                  >
                    {evaluations?.total || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#f8f9fa",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        background: "linear-gradient(135deg, #2196F3, #42a5f5)",
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#495057",
                        fontWeight: "500",
                      }}
                    >
                      Escalations
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#212529",
                    }}
                  >
                    {escalations?.total || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Status */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e9ecef",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #4CAF50, #2196F3)",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Escalation Status
            </h3>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                borderRadius: "10px",
                border: "1px solid #dee2e6",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  marginBottom: "8px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Total Escalations
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#495057",
                }}
              >
                {escalations?.total || 0}
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
                borderRadius: "10px",
                border: "1px solid #c3e6cb",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#155724",
                  marginBottom: "8px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Completed
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#28a745",
                }}
              >
                {escalations?.completed || 0}
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                borderRadius: "10px",
                border: "1px solid #ffeaa7",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#856404",
                  marginBottom: "8px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Pending
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#ffc107",
                }}
              >
                {escalations?.pending || 0}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: "#6c757d",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              <span>Completion Progress</span>
              <span>
                {escalations?.total > 0
                  ? `${(
                      (escalations.completed / escalations.total) *
                      100
                    ).toFixed(0)}%`
                  : "0%"}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                background: "#e9ecef",
                borderRadius: "10px",
                height: "12px",
                overflow: "hidden",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: `${
                    escalations?.total > 0
                      ? (escalations.completed / escalations.total) * 100
                      : 0
                  }%`,
                  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                  height: "100%",
                  transition: "width 0.5s ease",
                  borderRadius: "10px",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

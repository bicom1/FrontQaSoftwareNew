import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  ShieldAlert,
  MessageSquare,
  TrendingUp,
  ClipboardList,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { fetchAgentFormData, isAgentAdminSession } from "../../utils/agentSubmissions";

const buildWeeklyChartData = (evaluations, escalations) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(now.getDate() - (6 - i));
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const inRange = (item) => {
      const d = new Date(item.createdAt || item.date);
      return d >= dayStart && d <= dayEnd;
    };

    return {
      day: days[date.getDay()],
      evaluations: evaluations.filter(inRange).length,
      escalations: escalations.filter(inRange).length,
    };
  });
};

const formatDate = (val) =>
  val ? new Date(val).toLocaleString() : "-";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const name = decoded.name || "";
      const email = decoded.email || "";
      setAgentName(name);
      setAgentEmail(email);

      const { evaluations: evals, escalations: escs } = await fetchAgentFormData({
        name,
        email,
      });

      setEvaluations(evals);
      setEscalations(escs);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const totalEvaluations = evaluations.length;
    const totalPoints = evaluations.reduce(
      (sum, e) => sum + Number(e.rating || 0),
      0
    );
    const averageRating =
      totalEvaluations > 0 ? (totalPoints / totalEvaluations).toFixed(1) : "0.0";
    const totalEscalations = escalations.length;
    const pendingEscalations = escalations.filter(
      (esc) =>
        esc.leadStatus !== "Completed" && esc.leadStatus !== "Resolved"
    ).length;

    return {
      evaluations: { total: totalEvaluations, totalPoints, averageRating },
      escalations: { total: totalEscalations, pending: pendingEscalations },
      totalForms: totalEvaluations + totalEscalations,
    };
  }, [evaluations, escalations]);

  const weeklyData = useMemo(
    () => buildWeeklyChartData(evaluations, escalations),
    [evaluations, escalations]
  );

  const recentForms = useMemo(() => {
    const evalItems = evaluations.slice(0, 5).map((e) => ({
      id: e._id,
      type: "Evaluation",
      leadID: e.leadID,
      teamleader: e.teamleader,
      detail: e.mod ? `MOD: ${e.mod}` : `Rating: ${e.rating ?? "-"}`,
      createdAt: e.createdAt,
      badge: "primary",
    }));
    const escItems = escalations.slice(0, 5).map((e) => ({
      id: e._id,
      type: "Escalation",
      leadID: e.leadID,
      teamleader: e.teamleader,
      detail: e.escSeverity || e.leadStatus || "-",
      createdAt: e.createdAt,
      badge: "danger",
    }));
    return [...evalItems, ...escItems]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [evaluations, escalations]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          />
          <h5 className="text-muted">Loading your dashboard...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="card border-0 shadow-sm text-center p-4" style={{ maxWidth: 420 }}>
          <h5 className="text-danger mb-2">Could not load dashboard</h5>
          <p className="text-muted small mb-3">{error}</p>
          <button type="button" className="btn btn-primary" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Evaluations",
      value: stats.evaluations.total,
      sub: `${stats.evaluations.totalPoints} total points`,
      icon: FileText,
      color: "success",
      onClick: () => navigate("/agent/submissions"),
    },
    {
      label: "Escalations",
      value: stats.escalations.total,
      sub: `${stats.escalations.pending} pending`,
      icon: ShieldAlert,
      color: "warning",
      onClick: () => navigate("/agent/submissions"),
    },
    {
      label: "Average Score",
      value: stats.evaluations.averageRating,
      sub: "Across your evaluations",
      icon: TrendingUp,
      color: "primary",
      onClick: () => navigate("/agent/submissions"),
    },
    {
      label: "Total Submissions",
      value: stats.totalForms,
      sub: "Evaluations + escalations",
      icon: ClipboardList,
      color: "info",
      onClick: () => navigate("/agent/submissions"),
    },
  ];

  const quickLinks = [
    {
      title: "My Submitted Forms",
      desc: "View all your evaluations and escalations",
      path: "/agent/submissions",
      icon: FileText,
      btn: "View Forms",
    },
    {
      title: "Form Appeals",
      desc: "Appeal QC decisions on your submitted forms",
      path: "/agent/feedback",
      icon: MessageSquare,
      btn: "Open Appeals",
    },
  ];

  return (
    <div className="container-fluid px-0">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <p className="text-muted small mb-1 text-uppercase fw-semibold">
              Agent Dashboard
            </p>
            <h1 className="h3 fw-bold mb-0 text-capitalize">{agentName}</h1>
            <p className="text-muted mb-0 mt-1 small">{agentEmail}</p>
            {isAgentAdminSession() && (
              <p className="text-primary small mb-0 mt-2">
                Team view — showing all agent evaluations and escalations
              </p>
            )}
          </div>
          <div className="text-end">
            <div className="text-muted small text-uppercase">Last updated</div>
            <div className="fw-semibold">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {quickLinks.map(({ title, desc, path, icon: Icon, btn }) => (
          <div className="col-md-6" key={path}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 48,
                      height: 48,
                      background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                    }}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{title}</h6>
                    <p className="text-muted small mb-0">{desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm flex-shrink-0"
                  onClick={() => navigate(path)}
                >
                  {btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic stats — from this user's evaluations & escalations */}
      <div className="row g-3 mb-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, onClick }) => (
          <div className="col-sm-6 col-xl-3" key={label}>
            <button
              type="button"
              className="card border-0 shadow-sm h-100 w-100 text-start"
              style={{ cursor: "pointer" }}
              onClick={onClick}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted small text-uppercase fw-semibold">
                    {label}
                  </span>
                  <span
                    className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle`}
                  >
                    <Icon size={14} />
                  </span>
                </div>
                <div className="display-6 fw-bold mb-1">{value}</div>
                <div className="text-muted small">{sub}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {/* User-specific weekly chart */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-1">Your Weekly Activity</h5>
              <p className="text-muted small mb-3">
                Your evaluations and escalations — last 7 days
              </p>
              {weeklyData.some((d) => d.evaluations > 0 || d.escalations > 0) ? (
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="evaluations" fill="#2575fc" name="Evaluations" />
                      <Bar dataKey="escalations" fill="#4CAF50" name="Escalations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted text-center py-5 mb-0">
                  No submissions in the last 7 days.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent submissions */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Recent Submissions</h5>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none p-0"
                  onClick={() => navigate("/agent/submissions")}
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>
              {recentForms.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  No forms submitted yet.
                </p>
              ) : (
                <ul className="list-group list-group-flush flex-grow-1">
                  {recentForms.map((form) => (
                    <li
                      key={`${form.type}-${form.id}`}
                      className="list-group-item px-0 d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <span className={`badge bg-${form.badge} me-2`}>
                          {form.type}
                        </span>
                        <span className="fw-semibold">Lead #{form.leadID || "-"}</span>
                        <div className="text-muted small mt-1">{form.detail}</div>
                        <div className="text-muted small">TL: {form.teamleader || "-"}</div>
                      </div>
                      <span className="text-muted small d-flex align-items-center gap-1 flex-shrink-0 ms-2">
                        <Calendar size={12} />
                        {formatDate(form.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── REMOVED (commented for future use): global WeeklyStatsChart (all users) ─ */}
      {/*
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <WeeklyStatsChart height={280} />
        </div>
      </div>
      */}

      {/* ── REMOVED (commented for future use): Assigned Users panel ─────────── */}
      {/*
      <div className="row g-3 mb-4"> ... assigned users ... </div>
      */}

      {/* ── REMOVED (commented for future use): duplicate weekly SVG bar chart ─ */}
      {/*
      <div className="row g-3 mb-4"> ... custom SVG chart ... </div>
      */}

      {/* ── REMOVED (commented for future use): Escalation Status breakdown ─── */}
      {/*
      <div className="card border-0 shadow-sm"> ... escalation status ... </div>
      */}
    </div>
  );
};

export default AgentDashboard;

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { getQcModuleDashboardApi } from "../features/qcAnalytics";
import { getModuleBasePath, isQcAdmin, isSuperAdmin, normalizeRole } from "../utils/roles";
import GradientButton, {
  GRADIENT_HEADER_STYLE,
} from "./common/GradientButton";
import ContentOverviewCard from "./ContentOverviewCard";

const HEADER_STYLE = GRADIENT_HEADER_STYLE;

const timeAgo = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

const QcDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const actorRole = normalizeRole(localStorage.getItem("userRole") || "");
  const userName = localStorage.getItem("userName") || "QC User";
  const moduleBase = getModuleBasePath(actorRole);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getQcModuleDashboardApi();
        if (!active) return;
        if (res?.success) setData(res);
        else setError(res?.message || "Failed to load dashboard");
      } catch (e) {
        if (active) {
          setError(
            e?.response?.data?.message || "Failed to load QC dashboard"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const severityChart = useMemo(() => {
    const counts = data?.severityCounts || {};
    const labels = Object.keys(counts);
    if (!labels.length) {
      return {
        labels: ["No Data"],
        datasets: [{ data: [1], backgroundColor: ["#e0e0e0"] }],
      };
    }
    return {
      labels,
      datasets: [
        {
          label: "Escalation Severity",
          data: Object.values(counts),
          backgroundColor: ["#ef4444", "#facc15", "#22c55e", "#3b82f6"],
          borderWidth: 1,
          hoverOffset: 15,
        },
      ],
    };
  }, [data?.severityCounts]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 analytics-dashboard">
        <Spinner animation="border" className="me-2" />
        <span className="text-muted">Loading dashboard...</span>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data) return <Alert variant="warning">No dashboard data available.</Alert>;

  const isAdminView =
    data.isAdmin || isQcAdmin(actorRole) || isSuperAdmin(actorRole);
  const displayName = data.actor?.name || userName;
  const totalForms =
    (data.totalEvaluations || 0) +
    (data.totalEscalations || 0) +
    (data.totalMarketing || 0);

  return (
    <div className="container-fluid px-4 py-3 analytics-dashboard">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="fw-bold h4 mb-1">
            {isAdminView ? "QC Team Dashboard" : `${displayName}'s Dashboard`}
          </h1>
          <small className="text-muted">
            {isAdminView
              ? "All QC user submissions and analytics"
              : "Your submissions and performance"}
          </small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <GradientButton as={Link} to="/evaluation" size="sm">
            + Evaluation
          </GradientButton>
          <GradientButton as={Link} to="/escalation" size="sm">
            + Escalation
          </GradientButton>
          <GradientButton as={Link} to={`${moduleBase}/submitted-forms`} size="sm">
            Submitted Forms ({totalForms})
          </GradientButton>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <ContentOverviewCard
            evaluationCount={data.totalEvaluations ?? 0}
            escalationCount={data.totalEscalations ?? 0}
            recentActivity={data.recentActivity || []}
            viewPath={`${moduleBase}/qc-members`}
            timeAgo={timeAgo}
            headerStyle={{ ...HEADER_STYLE, borderRadius: "0.5rem" }}
          />
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-header text-white border-0 rounded-top-4" style={HEADER_STYLE}>
              <p className="mb-0">Daily Evaluations (Last 5 Days)</p>
            </div>
            <div className="card-body p-2">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.dailyEvaluations || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fill: "#333", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#333", fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-header text-white border-0 rounded-top-4" style={HEADER_STYLE}>
              <p className="mb-0">Daily Escalation Form Submissions</p>
            </div>
            <div className="card-body p-2">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.dailyEscalations || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fill: "#333", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#333", fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#42a5f5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-header text-white p-2 border-0 rounded-top-4" style={HEADER_STYLE}>
              <p className="mb-0">Top 5 Evaluation Form Submissions</p>
            </div>
            <div
              className="card-body d-flex justify-content-center align-items-center"
              style={{ minHeight: "280px" }}
            >
              {(data.topSubmitters || []).length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.topSubmitters}>
                    <defs>
                      <linearGradient id="qcBarColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#42a5f5" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#66bb6a" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="agentName" tick={{ fill: "#333", fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#333", fontSize: 11 }} />
                    <Tooltip />
                    <Bar
                      dataKey="formSubmit"
                      fill="url(#qcBarColor)"
                      name="Form Submits"
                      radius={[8, 8, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted mb-0">No submission data yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-header text-white p-2 border-0 rounded-top-4" style={HEADER_STYLE}>
              <p className="mb-0">Escalation Ratings</p>
            </div>
            <div
              className="card-body d-flex justify-content-center align-items-center"
              style={{ minHeight: "280px" }}
            >
              <div style={{ width: "100%", maxWidth: "400px", height: "250px" }}>
                <Doughnut
                  data={severityChart}
                  options={{
                    maintainAspectRatio: false,
                    cutout: "60%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { padding: 12, font: { size: 11 } },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="row g-3">
            {[
              {
                title: "Total Escalation Forms",
                value: data.totalEscalations,
                desc: isAdminView ? "All QC team escalations" : "Your escalations",
              },
              {
                title: "Total Evaluation Forms",
                value: data.totalEvaluations,
                desc: "Published evaluation records",
              },
              {
                title: "Total Marketing Forms",
                value: data.totalMarketing,
                desc: isAdminView ? "All QC team marketing" : "Your marketing forms",
              },
            ].map((item) => (
              <div className="col-12" key={item.title}>
                <div className="card border-0 shadow-sm h-100 rounded-4">
                  <div className="card-body py-3">
                    <h6 className="text-muted mb-1 small">{item.title}</h6>
                    <h2 className="mb-0 fw-bold" style={{ fontSize: "2.25rem" }}>
                      {item.value ?? 0}
                    </h2>
                    <div className="text-muted small mt-1">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .analytics-dashboard {
          font-family: "Inter", "Segoe UI", sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default QcDashboard;

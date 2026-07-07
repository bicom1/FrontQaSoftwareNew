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
      .slice(0, 5);
  }, [evaluations, escalations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <h5 className="text-gray-500 font-medium">Loading your dashboard...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-sm text-center p-6 max-w-md w-full">
          <h5 className="text-red-600 font-bold mb-2">Could not load dashboard</h5>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            onClick={fetchDashboardData}
          >
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
      color: "green",
      onClick: () => navigate("/agent/submissions"),
    },
    {
      label: "Escalations",
      value: stats.escalations.total,
      sub: `${stats.escalations.pending} pending`,
      icon: ShieldAlert,
      color: "amber",
      onClick: () => navigate("/agent/submissions"),
    },
    {
      label: "Average Score",
      value: stats.evaluations.averageRating,
      sub: "Across your evaluations",
      icon: TrendingUp,
      color: "blue",
      onClick: () => navigate("/agent/submissions"),
    },
    {
      label: "Total Submissions",
      value: stats.totalForms,
      sub: "Evaluations + escalations",
      icon: ClipboardList,
      color: "cyan",
      onClick: () => navigate("/agent/submissions"),
    },
  ];

  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  };

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
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
        <div className="p-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-gray-400 text-xs mb-1.5 uppercase font-semibold tracking-widest">
              Agent Dashboard
            </p>
            <h1 className="text-2xl font-bold mb-0 capitalize text-gray-900 tracking-tight">
              {agentName}
            </h1>
            <p className="text-gray-500 mb-0 mt-1 text-sm">{agentEmail}</p>
            {isAgentAdminSession() && (
              <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                Team view — showing all agent evaluations and escalations
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-xs uppercase font-semibold tracking-widest mb-1">
              Last updated
            </div>
            <div className="font-semibold text-gray-900 text-sm">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {quickLinks.map(({ title, desc, path, icon: Icon, btn }) => (
          <div
            key={path}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full h-[104px] hover:shadow-md transition-shadow"
          >
            <div className="h-full px-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0 w-11 h-11"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                  }}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h6 className="font-bold mb-0.5 text-gray-900 text-[15px] truncate">
                    {title}
                  </h6>
                  <p className="text-gray-500 text-xs mb-0 truncate">{desc}</p>
                </div>
              </div>
              <button
                type="button"
                className="flex-shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
                onClick={() => navigate(path)}
              >
                {btn}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic stats — from this user's evaluations & escalations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {statCards.map(({ label, value, sub, icon: Icon, color, onClick }) => (
          <button
            key={label}
            type="button"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full h-[110px] text-left cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            onClick={onClick}
          >
            <div className="h-full px-5 py-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-xs uppercase font-semibold tracking-wide">
                  {label}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border flex-shrink-0 ${colorClasses[color]}`}
                >
                  <Icon size={15} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                  {value}
                </div>
                <div className="text-gray-400 text-xs truncate">{sub}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Weekly activity + Recent submissions — equal, fixed height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5 items-stretch">
        {/* User-specific weekly chart */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-[380px] flex flex-col p-5 md:p-6">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h5 className="font-bold text-gray-900 mb-1 text-[15px]">
                  Your Weekly Activity
                </h5>
                <p className="text-gray-400 text-sm mb-0">
                  Evaluations and escalations — last 7 days
                </p>
              </div>
            </div>

            {weeklyData.some((d) => d.evaluations > 0 || d.escalations > 0) ? (
              <div className="w-full flex-1 min-h-[280px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        fontSize: 13,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                      iconType="circle"
                    />
                    <Bar
                      dataKey="evaluations"
                      fill="#2575fc"
                      name="Evaluations"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="escalations"
                      fill="#4CAF50"
                      name="Escalations"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm mb-0">
                  No submissions in the last 7 days.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-[380px] flex flex-col p-5 md:p-6">
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-bold text-gray-900 mb-0 text-[15px]">
                Recent Submissions
              </h5>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 leading-none py-1 transition-colors"
                onClick={() => navigate("/agent/submissions")}
              >
                <span>View all</span>
                <ChevronRight size={15} className="shrink-0" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-3">Your latest 5 forms</p>

            {recentForms.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm mb-0">No forms submitted yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 flex-1 overflow-y-auto -mx-1">
                {recentForms.map((form) => (
                  <li
                    key={`${form.type}-${form.id}`}
                    className="px-1 py-3 flex justify-between items-start gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            form.badge === "danger"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {form.type}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          Lead #{form.leadID || "-"}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm truncate">{form.detail}</div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        TL: {form.teamleader || "-"}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-gray-400 text-xs shrink-0 whitespace-nowrap mt-0.5">
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
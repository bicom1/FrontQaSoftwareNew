import React, { useEffect, useState } from "react";
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
import { getWeeklyStatsApi } from "../features/analytics";

const WeeklyStatsChart = ({ title = "Weekly Activity", height = 300 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getWeeklyStatsApi();
        if (res?.success && Array.isArray(res.data)) {
          setData(res.data);
        }
      } catch (e) {
        console.error("Weekly stats load failed", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-muted mb-0">Loading weekly chart...</p>;
  }

  if (!data.length) {
    return <p className="text-muted mb-0">No weekly data available.</p>;
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="evaluations" fill="#2575fc" name="Evaluations" />
          <Bar dataKey="escalations" fill="#4CAF50" name="Escalations" />
        </BarChart>
      </ResponsiveContainer>
      {title ? <p className="text-muted small mt-2 mb-0">{title}</p> : null}
    </div>
  );
};

export default WeeklyStatsChart;

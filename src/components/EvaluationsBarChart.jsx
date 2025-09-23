import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios";

const EvaluationsBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await axios.get("http://localhost:3001/api/evaluations/dailyEvaluationFormSubmit");
        const res = await axios.get("https://backendqasoftware-1jfe.onrender.com/api/evaluations/dailyEvaluationFormSubmit");

        
        // Sort data by date in ascending order and take last 5 entries
        const sortedData = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastFiveDays = sortedData.slice(-5);

        // Convert to chart format
        const formattedData = lastFiveDays.map(item => ({
          date: item.date,
          count: item.count
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading Daily Evaluations Chart...</p>;

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div
        className="card-header text-white p-3"
        style={{
          background: "linear-gradient(90deg, #2196f3, #03a9f4)",
          borderRadius: "0.5rem 0.5rem 0 0"
        }}
      >
        <h5 className="mb-0">Daily Evaluations (Last 5 Days)</h5>
      </div>
      <div className="card-body">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
                }}
              />
              <Legend wrapperStyle={{ fontWeight: "bold" }} />
              <Bar
                dataKey="count"
                fill="#2196f3"
                stroke="#1976d2"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted">No data available</p>
        )}
      </div>
    </div>
  );
};

export default EvaluationsBarChart;
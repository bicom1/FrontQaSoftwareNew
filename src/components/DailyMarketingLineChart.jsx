import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { getDailyMarketingSubmissions } from "../features/marketingApi";


const DailyMarketingLineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDailyMarketingSubmissions();
      setChartData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <span className="text-muted">Loading Daily Marketing Chart...</span>
      </div>
    );

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div
        className="card-header text-white p-3"
        style={{
          background: "linear-gradient(90deg, #4CAF50, #2196F3)",
          borderRadius: "0.5rem 0.5rem 0 0"
        }}
      >
        <h5 className="mb-0">Daily Marketing Form Submissions</h5>
      </div>
      <div className="card-body">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ff9800"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center">No data available</p>
        )}
      </div>
    </div>
  );
};

export default DailyMarketingLineChart;

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
import axios from "axios";

const DailyMarketingLineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/marketing/dailyMarketingFormSubmit"
        );

        if (res.data.success) {
          const data = res.data.data.map(item => ({
            date: item.date,
            count: item.count
          }));
          setChartData(data);
        }
      } catch (err) {
        console.error("Error fetching daily marketing data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading Daily Marketing Chart...</p>;

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div
        className="card-header text-white p-3"
        style={{
          background: "linear-gradient(90deg, #ff9800, #f44336)",
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
          <p className="text-muted">No data available</p>
        )}
      </div>
    </div>
  );
};

export default DailyMarketingLineChart;

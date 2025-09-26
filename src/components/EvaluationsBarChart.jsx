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
import { getDailyEvaluations } from "../features/evaluationApi";



const EvaluationsBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDailyEvaluations();
      setChartData(data);
      setLoading(false);
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <span className="text-muted">Loading Daily Evaluations Chart...</span>
      </div>
    );

  return (
    <div className="card border-0 shadow-sm h-100">
      <div
        className="card-header text-white"
        style={{
          background: "linear-gradient(90deg, #4CAF50, #2196F3)",
          borderRadius: "0.5rem 0.5rem 0 0",
        }}
      >
        <p style={{fontSize:"23px"}} className="mb-0">Daily Evaluations (Last 5 Days)</p>
      </div>
      <div className="card-body p-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>

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
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontWeight: "bold" }} />
              <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted my-3">No data available</p>

        )}
      </div>
    </div>
  );
};

export default EvaluationsBarChart;


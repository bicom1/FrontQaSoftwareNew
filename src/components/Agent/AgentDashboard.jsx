import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import 'chart.js/auto';

const AgentDashboard = () => {
  // Sample Metrics
  const metrics = {
    responseTime: "2m 30s",
    followUpRate: 85,
    conversionRate: 45
  };

  // Bar Chart Data (Weekly Performance)
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Leads Handled",
        data: [12, 15, 9, 14, 18, 20, 10],
        backgroundColor: "#667eea"
      }
    ]
  };

  // Pie Chart Data (Follow-up Distribution)
  const pieData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [85, 15],
        backgroundColor: ["#28a745", "#dc3545"]
      }
    ]
  };

  return (
    <div className="container">
      <h3 className="mb-4">Agent Performance Dashboard</h3>

      {/* Metrics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Avg Response Time</h6>
              <h4>{metrics.responseTime}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Follow-up Completion</h6>
              <h4>{metrics.followUpRate}%</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Conversion Rate</h6>
              <h4>{metrics.conversionRate}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <h6>Weekly Performance</h6>
            <Bar data={barData} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6>Follow-up Status</h6>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

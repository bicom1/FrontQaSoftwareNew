import React, { useEffect, useState, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";
import 'chart.js/auto';
import axios from "axios";

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPoints: 0,
    evaluationsCount: 0,
    escalationsCount: 0,
    percentage: 0,
    escalationRate: 0,
    weeklyData: { labels: [], data: [] }
  });
  const [loading, setLoading] = useState(true);
  const [agentName, setAgentName] = useState("");

  // Calculate weekly performance data
  const calculateWeeklyPerformance = useCallback((evaluations) => {
    const now = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Create an array for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(now.getDate() - i);
      return date;
    }).reverse();

    // Count evaluations for each day
    const dailyCounts = last7Days.map(date => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      return evaluations.filter(evaluation => {
        const evalDate = new Date(evaluation.date || evaluation.createdAt);
        return evalDate >= dayStart && evalDate <= dayEnd;
      }).length;
    });

    // Get day labels for the chart
    const dayLabels = last7Days.map(date => daysOfWeek[date.getDay()]);
    
    return { labels: dayLabels, data: dailyCounts };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Decode token to get agentName
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setAgentName(decoded.name);

        // Fetch both evaluations and escalations concurrently
        const [evalRes, escRes] = await Promise.all([
//           axios.get(`http://localhost:3001/api/evaluations/agent/${decoded.name}`),
//           axios.get(`http://localhost:3001/api/escalations`)
          axios.get(`https://backendqasoftware-1jfe.onrender.com/api/evaluations/agent/${decoded.name}`),
          axios.get(`https://backendqasoftware-1jfe.onrender.com/api/escalations`)

        ]);

        let evaluationsCount = 0;
        let escalationsCount = 0;
        let totalPoints = 0;
        let percentage = 0;
        let escalationRate = 0;
        let weeklyData = { labels: [], data: [] };

        // Process evaluations data
        if (evalRes.data.success) {
          const evaluations = evalRes.data.data;
          evaluationsCount = evaluations.length;
          totalPoints = evaluations.reduce(
            (sum, evaluation) => sum + Number(evaluation.rating || 0),
            0
          );
          
          percentage = evaluationsCount > 0 
            ? (totalPoints / evaluationsCount).toFixed(2)
            : 0;

          weeklyData = calculateWeeklyPerformance(evaluations);
        }

        // Process escalations data
        if (escRes.data.success) {
          const escalations = escRes.data.data;
          const agentEscalations = escalations.filter(
            esc => esc.agentName === decoded.name || esc.useremail === decoded.name
          );
          
          escalationsCount = agentEscalations.length;
          
          // Calculate escalation metrics
          if (agentEscalations.length > 0) {
            const completedEscalations = agentEscalations.filter(
              esc => esc.leadStatus === "Completed" || esc.leadStatus === "Resolved"
            ).length;
            const pendingEscalations = agentEscalations.length - completedEscalations;
            
            escalationRate = Math.round((pendingEscalations / agentEscalations.length) * 100);
          }
        }

        // Update state with all calculated data
        setDashboardData({
          totalPoints,
          evaluationsCount,
          escalationsCount,
          percentage,
          escalationRate,
          weeklyData
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [calculateWeeklyPerformance]);

  // Chart data
  const barData = {
    labels: dashboardData.weeklyData.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Evaluations Completed",
      data: dashboardData.weeklyData.data || [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "#667eea"
    }]
  };

  const formsPieData = {
    labels: ["Evaluations", "Escalations"],
    datasets: [{
      data: [dashboardData.evaluationsCount, dashboardData.escalationsCount],
      backgroundColor: ["#4caf50", "#ff9800"]
    }]
  };

  const totalFormsSubmitted = dashboardData.evaluationsCount + dashboardData.escalationsCount;

  return (
    <div className="container">
      <h3 className="mb-4">Agent Performance Dashboard - {agentName}</h3>

      {loading ? (
        <div className="text-center">Loading evaluation data...</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Evaluation Points</h6>
                  <h2 className="display-6">{dashboardData.percentage}%</h2>
                  <small className="text-muted">
                    {dashboardData.totalPoints} points from {dashboardData.evaluationsCount} evaluations
                  </small>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Escalation Rate</h6>
                  <h2 className="display-6">{dashboardData.escalationRate}%</h2>
                  <small className="text-muted">
                    Based on {dashboardData.escalationsCount} escalations
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <h6>Weekly Performance (Last 7 Days)</h6>
                <Bar data={barData} options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  }
                }} />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <h6>Forms Distribution ({totalFormsSubmitted} total)</h6>
                {totalFormsSubmitted > 0 ? (
                  <div style={{ position: 'relative', height: '300px' }}>
                    <Pie 
                      data={formsPieData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>No forms submitted yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentDashboard;
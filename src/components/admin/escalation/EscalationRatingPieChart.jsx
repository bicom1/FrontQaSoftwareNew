import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { getEscalationAnalyticsApi } from "../../../features/escalationsApi";

const EscalationRatingDoughnutChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getEscalationAnalyticsApi();

        // ✅ Safely extract data from API response
        const severityCounts =
          response?.severityCounts &&
          typeof response.severityCounts === "object"
            ? response.severityCounts
            : {};

        // ✅ Prepare chart labels and values safely
        const labels = Object.keys(severityCounts).length
          ? Object.keys(severityCounts)
          : ["No Data"];
        const values = Object.keys(severityCounts).length
          ? Object.values(severityCounts)
          : [1];

        // ✅ Set chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "Escalation Severity",
              data: values,
              backgroundColor: ["#ef4444", "#facc15", "#22c55e", "#3b82f6"],
              borderWidth: 1,
              hoverOffset: 15,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching escalation analytics:", error);
        setChartData({
          labels: ["Error"],
          datasets: [
            { data: [1], backgroundColor: ["#ef4444"], borderWidth: 1 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ✅ Loader
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ✅ Render Chart
  return (
    <div className="card border-0 shadow-sm p-4">
      <h5 className="text-dark mb-4">Escalation Severity Overview</h5>

      {chartData ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "350px" }}
        >
          <div style={{ width: "100%", maxWidth: "450px", height: "350px" }}>
            <Doughnut
              data={chartData}
              options={{
                maintainAspectRatio: false,
                cutout: "60%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 15,
                      font: { size: 13 },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const label = chartData.labels[tooltipItem.dataIndex];
                        const value =
                          chartData.datasets[0].data[tooltipItem.dataIndex];
                        return `${label}: ${value}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "350px" }}
        >
          <p className="text-muted">No data available</p>
        </div>
      )}
    </div>
  );
};

export default EscalationRatingDoughnutChart;

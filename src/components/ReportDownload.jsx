// src/components/ReportDownload.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { createReportEvaluationsApi } from "../features/evaluationApi"; 

const ReportDownload = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agentName, setAgentName] = useState("");   // optional filters
  const [teamleader, setTeamleader] = useState(""); // optional filters
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch data from backend
  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return [];
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return [];
    }

    setError("");
    setLoading(true);

    try {
      const res = await createReportEvaluationsApi({ startDate, endDate, agentName, teamleader });
      if (res?.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      } else {
        setError(res?.data?.message || "No data found.");
        return [];
      }
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to fetch data. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Download CSV
  const downloadExcel = async () => {
    setError("");
    setSuccess("");

    const data = await fetchData();
    if (data.length === 0) {
      setError("No data available for the selected filters.");
      return;
    }

    try {
      const headers = [
        "Lead ID",
        "Agent Name",
        "Mod",
        "Team Leader",
        "Greetings",
        "Accuracy",
        "Building",
        "Presenting",
        "Closing",
        "Bonus",
        "Evaluation Summary",
        "Rating",
        "CreatedAt",
        "UpdatedAt",
      ];

      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          [
            `"${row.leadID}"`,
            `"${row.agentName}"`,
            `"${row.mod}"`,
            `"${row.teamleader}"`,
            `"${row.greetings}"`,
            `"${row.accuracy}"`,
            `"${row.building}"`,
            `"${row.presenting}"`,
            `"${row.closing}"`,
            `"${row.bonus}"`,
            `"${row.evaluationsummary}"`,
            `"${row.rating}"`,
            `"${row.createdAt}"`,
            `"${row.updatedAt}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `evaluation_report_${startDate}_to_${endDate}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess("Evaluation report downloaded successfully as CSV");
    } catch (err) {
      console.error("Error generating CSV:", err);
      setError("Failed to generate CSV. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4 text-center">Download Evaluation Reports</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form>
            <Row className="mb-3">
              <Col md={8} className="mx-auto">
                <Form.Group>
                  <Form.Label>Date Range</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="align-self-center">to</span>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Agent Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Optional"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Team Leader</Form.Label>
                  <Form.Control
                    type="text"
                    value={teamleader}
                    onChange={(e) => setTeamleader(e.target.value)}
                    placeholder="Optional"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-4 justify-content-center">
              <Button
                variant="success"
                onClick={downloadExcel}
                disabled={loading || !startDate || !endDate}
                className="px-4"
              >
                {loading ? "Processing..." : "Download CSV"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportDownload;

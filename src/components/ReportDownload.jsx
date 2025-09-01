// src/components/ReportDownload.jsx
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Container, Row, Col, Form, Button, Spinner, Card, Alert } from "react-bootstrap";

const ReportDownload = () => {
  const [reportType, setReportType] = useState("evaluation");
  const [teamleader, setTeamleader] = useState("");
  const [agentName, setAgentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch data from backend
  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return [];
    }
    setError("");

    try {
      setLoading(true);

      let url = "";
      if (reportType === "evaluation") {
        url = `http://localhost:3001/api/evaluations/datefilterevaluation?startDate=${startDate}&endDate=${endDate}&teamleader=${encodeURIComponent(
          teamleader
        )}&agentName=${encodeURIComponent(agentName)}`;
      } else if (reportType === "escalation") {
        url = `http://localhost:3001/api/escalations/datefilter?startDate=${startDate}&endDate=${endDate}&teamleader=${encodeURIComponent(
          teamleader
        )}&agentName=${encodeURIComponent(agentName)}`;
      } else {
        url = `http://localhost:3001/api/ppc/datefilter?startDate=${startDate}&endDate=${endDate}&teamleader=${encodeURIComponent(
          teamleader
        )}&agentName=${encodeURIComponent(agentName)}`;
      }

      const { data } = await axios.get(url);
      if (data.success === false) {
        setError(data.message || "No data found.");
        return [];
      }
      return data;
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to fetch report. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download Excel
  const downloadExcel = async () => {
    const data = await fetchData();
    if (!data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportType);
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };

  // ✅ Download PDF
  const downloadPDF = async () => {
    const data = await fetchData();
    if (!data.length) return;

    const doc = new jsPDF();
    doc.text(`${reportType.toUpperCase()} REPORT`, 14, 10);

    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((h) => row[h]));

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save(`${reportType}_report.pdf`);
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4">Download Reports</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="evaluation">Evaluation</option>
                    <option value="escalation">Escalation</option>
                    <option value="ppc">PPC</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Team Leader</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter team leader"
                    value={teamleader}
                    onChange={(e) => setTeamleader(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Agent Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-4">
              <Button
                variant="danger"
                onClick={downloadPDF}
                disabled={loading || !startDate || !endDate}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Download PDF"}
              </Button>
              <Button
                variant="success"
                onClick={downloadExcel}
                disabled={loading || !startDate || !endDate}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Download Excel"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportDownload;

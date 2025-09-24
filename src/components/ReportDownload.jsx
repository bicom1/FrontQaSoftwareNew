// src/components/ReportDownload.jsx
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Tabs,
  Tab,
  Badge,
  Spinner,
  InputGroup
} from "react-bootstrap";
import { 
  FileSpreadsheet, 
  FileWarning, 
  Download, 
  Calendar, 
  Filter,
  User,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { createReportEvaluationsApi } from "../features/evaluationApi";
import { createReportEscalationsApi } from "../features/escalationsApi";

const ReportDownload = () => {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agentName, setAgentName] = useState("");
  const [teamleader, setTeamleader] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch data based on type
  const fetchData = async (type) => {
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
      const apiCall = type === "evaluations" 
        ? createReportEvaluationsApi 
        : createReportEscalationsApi;

      const res = await apiCall({ startDate, endDate, agentName, teamleader });

      if (res?.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      } else {
        setError(res?.data?.message || "No data found for the selected criteria.");
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

  // Map evaluation data to CSV format
  const mapEvaluationData = (data) => {
    return data.map(item => ({
      "Lead ID": item.leadID || "",
      "Agent Name": item.agentName || "",
      "Mod": item.mod || "",
      "Team Leader": item.teamleader || "",
      "Greetings": item.greetings || "",
      "Accuracy": item.accuracy || "",
      "Building": item.building || "",
      "Presenting": item.presenting || "",
      "Closing": item.closing || "",
      "Bonus": item.bonus || "",
      "Evaluation Summary": item.evaluationsummary || "",
      "Rating": item.rating || "",
      "CreatedAt": item.createdAt || "",
      "UpdatedAt": item.updatedAt || ""
    }));
  };

  // Map escalation data to CSV format
  const mapEscalationData = (data) => {
    return data.map(item => ({
      "User Email": item.useremail || "",
      "Agent Name": item.agentName || "",
      "Team Leader": item.teamleader || "",
      "Evaluated By": item.evaluatedby || "",
      "Lead ID": item.leadID || "",
      "Lead Source": item.leadSource || "",
      "Lead Status": item.leadStatus || "",
      "Escalation Severity": item.escSeverity || "",
      "Issue Identified": item.issueIden || "",
      "Escalation Action": item.escAction || "",
      "Documentation": item.documentation || "",
      "Success Metrics": item.successmaration || "",
      "User Rating": item.userrating || "",
      "Created At": item.createdAt || "",
      "Updated At": item.updatedAt || ""
    }));
  };

  // Download CSV function
  const downloadCSV = async (type) => {
    setError("");
    setSuccess("");

    const data = await fetchData(type);
    if (data.length === 0) {
      if (!error) setError("No data available for the selected filters.");
      return;
    }

    try {
      let headers = [];
      let mappedData = [];
      
      if (type === "evaluations") {
        headers = [
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
          "UpdatedAt"
        ];
        mappedData = mapEvaluationData(data);
      } else {
        headers = [
          "User Email",
          "Agent Name",
          "Team Leader",
          "Evaluated By",
          "Lead ID",
          "Lead Source",
          "Lead Status",
          "Escalation Severity",
          "Issue Identified",
          "Escalation Action",
          "Documentation",
          "Success Metrics",
          "User Rating",
          "Created At",
          "Updated At"
        ];
        mappedData = mapEscalationData(data);
      }

      const csvContent = [
        headers.join(","),
        ...mappedData.map(row => 
          headers.map(header => 
            `"${row[header] || ''}"`
          ).join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute(
        "download",
        `${type}_report_${startDate}_to_${endDate}.csv`
      );
      link.setAttribute("href", url);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(
        `${type === "evaluations" ? "Evaluations" : "Escalations"} report downloaded successfully`
      );
    } catch (err) {
      console.error("Error generating CSV:", err);
      setError("Failed to generate CSV. Please try again.");
    }
  };

  return (
    <Container className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)" }}>
        <div>
          <h2 className="fw-bold text-dark mb-1">Reports Center</h2>
          <p className="text-muted">Download Evaluation and Escalation Reports</p>
        </div>
        <Badge bg="light" text="dark" className="p-2">
          <Calendar size={16} className="me-1" />
          {startDate && endDate ? (
            `${formatDate(startDate)} - ${formatDate(endDate)}`
          ) : (
            "Select date range"
          )}
        </Badge>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Tabs
            id="report-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="px-3 pt-3 border-bottom"
            fill
          >
            <Tab
              eventKey="evaluations"
              title={
                <span className="d-flex align-items-center">
                  <FileSpreadsheet size={18} className="me-2" />
                  Evaluations
                </span>
              }
            />
            <Tab
              eventKey="escalations"
              title={
                <span className="d-flex align-items-center">
                  <FileWarning size={18} className="me-2" />
                  Escalations
                </span>
              }
            />
          </Tabs>

          <div className="p-4">
            {error && (
              <Alert 
                variant="danger" 
                className="d-flex align-items-center"
                dismissible
                onClose={() => setError("")}
              >
                <FileWarning size={20} className="me-2" />
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                variant="success" 
                className="d-flex align-items-center"
                dismissible
                onClose={() => setSuccess("")}
              >
                <FileSpreadsheet size={20} className="me-2" />
                {success}
              </Alert>
            )}

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Date Range</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="d-flex align-items-center"
                >
                  <Filter size={16} className="me-1" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                  {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </div>
              <Row className="mt-3">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Calendar size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border-start-0"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Calendar size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border-start-0"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    disabled={!startDate && !endDate}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </div>

            {showFilters && (
              <div className="mb-4">
                <h5 className="mb-3">Additional Filters</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <User size={16} className="me-2" />
                        Agent Name
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <User size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="Filter by agent name"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <Users size={16} className="me-2" />
                        Team Leader
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Users size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          value={teamleader}
                          onChange={(e) => setTeamleader(e.target.value)}
                          placeholder="Filter by team leader"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            <div className="d-flex justify-content-center mt-4">
              <Button style={{background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
                variant={activeTab === "evaluations" ? "" : "danger"}
                onClick={() => downloadCSV(activeTab)}
                disabled={loading || !startDate || !endDate}
                size="lg"
                className="px-5 py-2 fw-bold d-flex align-items-center"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download size={20} className="me-2" />
                    Download {activeTab === "evaluations" ? "Evaluations" : "Escalations"} Report
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <small className="text-muted">
                Reports will include all records from {formatDate(startDate) || 'start date'} to {formatDate(endDate) || 'end date'}
                {agentName && `, filtered by agent: ${agentName}`}
                {teamleader && `, filtered by team leader: ${teamleader}`}
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>

     
    </Container>
  );
};

export default ReportDownload;
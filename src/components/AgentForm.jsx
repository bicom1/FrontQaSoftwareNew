import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle2,
  User,
  Mail,
  Hash,
  Users,
  MessageSquare,
  Star,
  FileText,
  Award,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";
import { createEvaluationsApi } from "../features/evaluationApi";
import { getTeamLeadsApi } from "../features/teamleadApi";

const AgentForm = () => {
  const [evaluation, setEvaluation] = useState({
    useremail: "",
    leadID: "",
    agentName: "",
    mod: "",
    responsetime: "",
    teamleader: "",
    greetings: "",
    accuracy: "",
    building: "",
    presenting: "",
    closing: "",
    bonus: "",
    evaluationsummary: "",
    rating: 0,
  });

  const [userRate, setUserRate] = useState({
    greeting: { rateVal: 0 },
    accuracy: { rateVal: 0 },
    building: { rateVal: 0 },
    presenting: { rateVal: 0 },
    closing: { rateVal: 0 },
    bonus: { rateVal: 0 },
  });

  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update the useEffect to extract the data array correctly
  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        setLoading(true);
        console.log("Fetching team leaders...");

        // Try to import the module dynamically
        const teamLeadModule = await import("../features/teamleadApi");
        console.log("Team lead module:", teamLeadModule);

        // Check different export patterns
        let getTeamLeadsFunction;

        if (teamLeadModule.getTeamLeadsApi) {
          getTeamLeadsFunction = teamLeadModule.getTeamLeadsApi;
          console.log("Using getTeamLeadsApi export");
        } else if (
          teamLeadModule.default &&
          teamLeadModule.default.getTeamLeadsApi
        ) {
          getTeamLeadsFunction = teamLeadModule.default.getTeamLeadsApi;
          console.log("Using default.getTeamLeadsApi export");
        } else if (teamLeadModule.default) {
          getTeamLeadsFunction = teamLeadModule.default;
          console.log("Using default export");
        } else {
          throw new Error("Team leads API function not found");
        }

        const response = await getTeamLeadsFunction();
        console.log("API response:", response);

        // Extract the data array from the response
        const teamLeadersData = response.data || [];
        console.log("Team leaders data:", teamLeadersData);

        setTeamLeaders(teamLeadersData);
      } catch (error) {
        console.error("Failed to fetch team leaders:", error);
        // Fallback to empty array
        setTeamLeaders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamLeaders();
  }, []);

  const handleChange = (name, value) => {
    setEvaluation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      let user = null;
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          user = JSON.parse(userData);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        alert("Error reading user data. Please log in again.");
        return;
      }

      if (!user || !user._id || !user.email) {
        console.log("User data:", user);
        alert(
          "User is not authenticated or user data is incomplete. Please log in."
        );
        return;
      }

      // Validate required fields before submission to prevent backend errors
      const requiredFields = [
        "leadID",
        "agentName",
        "mod",
        "responsetime",
        "teamleader",
        "greetings",
        "accuracy",
        "building",
        "presenting",
        "closing",
        "bonus",
        "evaluationsummary",
      ];
      const missingFields = requiredFields.filter((field) => {
        const value = (evaluation[field] ?? "").toString().trim();
        return value === "";
      });
      if (missingFields.length > 0) {
        alert("Please fill all required fields: " + missingFields.join(", "));
        return;
      }

      const total = Object.values(userRate).reduce(
        (sum, cat) => sum + cat.rateVal,
        0
      );

      const mapCriterion = (id, userRateKey) => {
        const selectedValue = (evaluation[id] ?? "").toString().trim();
        const points = userRateKey ? userRate[userRateKey]?.rateVal ?? 0 : 0;
        const criterion = { value: selectedValue, points };
        if (id === "greetings" && selectedValue === "mark") {
          const reason = (evaluation[`reason-${id}`] ?? "").toString().trim();
          const otherReason = (evaluation[`otherReason-${id}`] ?? "")
            .toString()
            .trim();
          if (reason) criterion.reason = reason;
          if (reason === "Other" && otherReason)
            criterion.otherReason = otherReason;
        }
        return criterion;
      };

      const payload = {
        owner: user._id,
        useremail: user.email,
        evaluatedby: user.email,
        leadID: (evaluation.leadID ?? "").toString().trim(),
        agentName: (evaluation.agentName ?? "").toString().trim(),
        mod: (evaluation.mod ?? "").toString().trim(),
        responsetime: {
          value: (evaluation.responsetime ?? "").toString().trim(),
        },
        teamleader: (evaluation.teamleader ?? "").toString().trim(),
        greetings: mapCriterion("greetings", "greeting"),
        accuracy: mapCriterion("accuracy", "accuracy"),
        building: mapCriterion("building", "building"),
        presenting: mapCriterion("presenting", "presenting"),
        closing: mapCriterion("closing", "closing"),
        bonus: mapCriterion("bonus", "bonus"),
        evaluationsummary: (evaluation.evaluationsummary ?? "")
          .toString()
          .trim(),
        rating: total,
      };

      console.log("Submitting payload:", payload);

      const res = await createEvaluationsApi(payload);

      toast.success(" Evaluation submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "#10b981",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
      console.log("Saved evaluation:", res);

      // Reset form
      setEvaluation({
        useremail: user.email,
        leadID: "",
        agentName: "",
        teamleader: "",
        mod: "",
        responsetime: "",
        greetings: "",
        accuracy: "",
        building: "",
        presenting: "",
        closing: "",
        bonus: "",
        evaluationsummary: "",
        rating: 0,
      });

      setUserRate({
        greeting: { rateVal: 0 },
        accuracy: { rateVal: 0 },
        building: { rateVal: 0 },
        presenting: { rateVal: 0 },
        closing: { rateVal: 0 },
        bonus: { rateVal: 0 },
      });
    } catch (err) {
      console.error("Failed to save evaluation:", err);
      alert(
        "Error saving evaluation: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setEvaluation((prev) => ({
        ...prev,
        useremail: user.email,
      }));
    }
  }, []);

  const currentRating = Object.values(userRate).reduce(
    (sum, cat) => sum + cat.rateVal,
    0
  );
  const maxRating = 96;
  const ratingPercentage = (currentRating / maxRating) * 100;

  const evaluationCriteria = [
    {
      id: "greetings",
      title: " Greetings",
      description:
        "Demonstrates enthusiasm and a positive tone throughout the call.",
      icon: <MessageSquare size={18} />,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
      goodOption: {
        value: "uses",
        text: "Uses a professional and friendly greeting within the first 3 seconds, including the company name and their own name",
        points: 16,
      },
    },
    {
      id: "accuracy",
      title: "Accuracy & Compliance",
      description: "Provides accurate and up-to-date information...",
      icon: <CheckCircle2 size={18} />,
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.1)",
      goodOption: {
        value: "questions",
        text: "Asks clear and concise questions to accurately identify the customer needs",
        points: 16,
      },
    },
    {
      id: "building",
      title: "Building Rapport & Discovery",
      description: "Identifies potential pain points or opportunities...",
      icon: <Users size={18} />,
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.1)",
      goodOption: {
        value: "skills",
        text: "Demonstrates active listening and open-ended questions",
        points: 16,
      },
    },
    {
      id: "presenting",
      title: "Presenting Solutions & Making the Sale",
      description: "Clearly and concisely presents tailored benefits...",
      icon: <Star size={18} />,
      color: "#7c3aed",
      bgColor: "rgba(124, 58, 237, 0.1)",
      goodOption: {
        value: "appointment",
        text: "Overcomes objections and guides customer to appointment",
        points: 16,
      },
    },
    {
      id: "closing",
      title: "Call Closing & Securing Commitment",
      description: "Confirms details and secures customer commitment...",
      icon: <FileText size={18} />,
      color: "#ea580c",
      bgColor: "rgba(234, 88, 12, 0.1)",
      goodOption: {
        value: "Professionally",
        text: "Summarizes key points, outlines next steps",
        points: 16,
      },
    },
    {
      id: "bonus",
      title: "Bonus Point",
      description: "Going above and beyond customer expectations.",
      icon: <Award size={18} />,
      color: "#0891b2",
      bgColor: "rgba(8, 145, 178, 0.1)",
      goodOption: {
        value: "customer",
        text: "Exceeds customer expectations with knowledge",
        points: 16,
      },
    },
  ];

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80)
      return {
        text: "Excellent",
        class: "text-success",
        bgClass: "bg-success-subtle",
      };
    if (percentage >= 60)
      return {
        text: "Good",
        class: "text-primary",
        bgClass: "bg-primary-subtle",
      };
    if (percentage >= 40)
      return {
        text: "Average",
        class: "text-warning",
        bgClass: "bg-warning-subtle",
      };
    return {
      text: "Needs Improvement",
      class: "text-danger",
      bgClass: "bg-danger-subtle",
    };
  };

  const performanceLevel = getPerformanceLevel(ratingPercentage);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // options: "light", "dark", "colored"
        toastStyle={{
          borderRadius: "12px",
          background: "#ffffff",
          color: "#333",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          fontSize: "15px",
          fontWeight: 500,
          padding: "10px 14px",
        }}
        progressStyle={{
          background: "linear-gradient(90deg, #00b09b, #96c93d)",
        }}
      />
      <style>{`
  .gradient-bg {
    background: #f4f4f4;
    min-height: 100vh;
  }

  .header-section {
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-bottom: 1px solid #e2e8f0;
  }

  .header-gradient {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  }

  .icon-badge {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .custom-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .custom-card:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .progress-header {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    border-radius: 16px 16px 0 0;
  }

  .progress-custom {
    height: 12px;
    background-color: #e2e8f0;
    border-radius: 6px;
  }

  .progress-bar-custom {
    background: linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%);
    border-radius: 6px;
    transition: width 0.7s ease;
  }

  .form-control-modern {
    border-radius: 12px;
    border: 1px solid #d1d5db;
    padding: 12px 16px;
    transition: all 0.2s ease;
  }

  .form-control-modern:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .radio-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .radio-card:hover {
    background-color: #f9fafb;
  }

  .radio-card.selected-primary {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
  }

  .radio-card.selected-success {
    border-color: #10b981;
    background-color: rgba(16, 185, 129, 0.05);
  }

  .radio-card.selected-danger {
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.05);
  }

  .criteria-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-points {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 20px;
  }

  .final-score-card {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    border-radius: 16px;
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  }

  .submit-btn {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    border: none;
    border-radius: 16px;
    padding: 16px 32px;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
  }

  .section-header {
    border-bottom: 1px solid #e5e7eb;
    padding: 1.5rem;
  }

  .datetime-info {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .mode-selection {
    gap: 16px;
  }

  .readonly-field {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }

  .loading-spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

      <div className="gradient-bg">
        {/* Header Section */}
        <div className="header-section">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center mb-2">
                  <div className="icon-badge me-3">
                    <User size={20} />
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-0">
                    Agent Performance Evaluation
                  </h1>
                </div>
                <p className="text-muted mb-0 ms-5">
                  Comprehensive assessment and feedback system
                </p>
              </div>
              <div className="col-auto text-end">
                <div className="datetime-info d-flex align-items-center mb-1">
                  <Calendar size={16} className="me-1" />
                  {today}
                </div>
                <div className="datetime-info d-flex align-items-center">
                  <Clock size={16} className="me-1" />
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              {/* Progress Card */}
              <div className="custom-card mb-4">
                <div
                  style={{
                    background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                  }}
                  className="progress-header text-white p-4"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TrendingUp size={20} className="me-2" />
                      <span className="fw-semibold">Evaluation Progress</span>
                    </div>
                    <div className="text-end">
                      <div className="h3 fw-bold mb-0">{currentRating}</div>
                      <small style={{ color: "rgba(255,255,255,0.8)" }}>
                        out of {maxRating} points
                      </small>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fw-medium text-dark">
                      Completion Status
                    </span>
                    <span
                      className={`badge ${performanceLevel.bgClass} ${performanceLevel.class}`}
                    >
                      {performanceLevel.text}
                    </span>
                  </div>
                  <div className="progress-custom">
                    <div
                      className="progress-bar-custom h-100"
                      style={{ width: `${ratingPercentage}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">0%</small>
                    <small className="text-muted">
                      {Math.round(ratingPercentage)}%
                    </small>
                    <small className="text-muted">100%</small>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-primary" />
                    Basic Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="row g-4">
                    {/* Email Field */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Mail size={16} className="me-2 text-primary" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-modern readonly-field"
                        value={evaluation.useremail}
                        readOnly
                      />
                    </div>

                    {/* Lead ID */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Hash size={16} className="me-2 text-primary" />
                        Lead ID
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-modern"
                        placeholder="Enter Lead ID"
                        value={evaluation.leadID}
                        onChange={(e) => handleChange("leadID", e.target.value)}
                      />
                    </div>

                    {/* Agent Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <User size={16} className="me-2 text-primary" />
                        Agent Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-modern"
                        placeholder="Enter Agent Name"
                        value={evaluation.agentName}
                        onChange={(e) =>
                          handleChange("agentName", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center mb-3">
                        <Users size={16} className="me-2 text-primary" />
                        Team Leader
                        {loading && (
                          <div className="loading-spinner ms-2"></div>
                        )}
                      </label>
                      {teamLeaders.length > 0 ? (
                        <div className="row g-3">
                          {teamLeaders.map((leader) => (
                            <div key={leader._id} className="col-md-6">
                              <div
                                className={`radio-card ${
                                  evaluation.teamleader === leader.name
                                    ? "selected-primary"
                                    : ""
                                }`}
                              >
                                <label className="form-check-label d-flex align-items-center mb-0 w-100">
                                  <input
                                    type="radio"
                                    name="teamleader"
                                    value={leader.name}
                                    checked={
                                      evaluation.teamleader === leader.name
                                    }
                                    onChange={(e) =>
                                      handleChange("teamleader", e.target.value)
                                    }
                                    className="form-check-input me-3"
                                  />
                                  <span className="fw-medium">
                                    {leader.name}
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !loading && (
                          <div className="text-muted">
                            No team leaders available
                          </div>
                        )
                      )}
                    </div>

                    {/* Mode of Communication */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center mb-3">
                        <MessageSquare
                          size={16}
                          className="me-2 text-primary"
                        />
                        Mode of Communication
                      </label>
                      <div className="d-flex mode-selection">
                        {["Chat", "Call", "Both"].map((mode) => (
                          <div
                            key={mode}
                            className={`radio-card ${
                              evaluation.mod === mode ? "selected-primary" : ""
                            }`}
                          >
                            <label className="form-check-label d-flex align-items-center mb-0">
                              <input
                                type="radio"
                                name="communication"
                                value={mode}
                                checked={evaluation.mod === mode}
                                onChange={(e) =>
                                  handleChange("mod", e.target.value)
                                }
                                className="form-check-input me-3"
                              />
                              <span className="fw-medium">{mode}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Response time  */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center mb-3">
                        Response Time *
                      </label>
                      <div className="d-flex mode-selection">
                        {[
                          "with in An Hour",
                          "within A Day",
                          "More Than One Day",
                        ].map((mode) => (
                          <div
                            key={mode}
                            className={`radio-card ${
                              evaluation.responsetime === mode
                                ? "selected-primary"
                                : ""
                            }`}
                          >
                            <label className="form-check-label d-flex align-items-center mb-0">
                              <input
                                type="radio"
                                name="responsetime"
                                value={mode}
                                checked={evaluation.responsetime === mode}
                                onChange={(e) =>
                                  handleChange("responsetime", e.target.value)
                                }
                                className="form-check-input me-3"
                              />
                              <span className="fw-medium">{mode}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              {evaluationCriteria.map((criteria, index) => (
                <div key={criteria.id} className="custom-card mb-4">
                  <div className="section-header">
                    <div className="d-flex align-items-start">
                      <div
                        className="criteria-icon me-3"
                        style={{
                          backgroundColor: criteria.bgColor,
                          color: criteria.color,
                        }}
                      >
                        {criteria.icon}
                      </div>
                      <div className="flex-fill">
                        <h4 className="h5 fw-semibold text-dark mb-1">
                          {criteria.title}
                        </h4>
                        <p className="text-muted small mb-0 lh-base">
                          {criteria.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="row g-3">
                      {/* Good Option */}
                      <div className="col-12">
                        <div
                          className={`radio-card ${
                            evaluation[criteria.id] ===
                            criteria.goodOption.value
                              ? "selected-success"
                              : ""
                          }`}
                        >
                          {/* 🌟 Professional Greeting Option */}
                          <label className="form-check-label d-flex align-items-start mb-0 w-100">
                            <input
                              type="radio"
                              name={criteria.id}
                              value={criteria.goodOption.value}
                              checked={
                                evaluation[criteria.id] ===
                                criteria.goodOption.value
                              }
                              onChange={(e) => {
                                handleChange(criteria.id, e.target.value);
                                setUserRate((pre) => ({
                                  ...pre,
                                  [criteria.id === "greetings"
                                    ? "greeting"
                                    : criteria.id]: {
                                    rateVal: criteria.goodOption.points,
                                  },
                                }));
                              }}
                              className="form-check-input me-3 mt-1"
                            />
                            <div className="flex-fill">
                              <div className="d-flex align-items-start mb-2">
                                <span className="fw-medium text-dark flex-fill">
                                  Professional greeting
                                </span>
                                <span className="badge bg-success badge-points">
                                  +{criteria.goodOption.points} pts
                                </span>
                              </div>
                              <p
                                className="text-muted small mb-0 lh-base"
                                style={{ paddingLeft: "28px" }}
                              >
                                {criteria.goodOption.text}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Poor Option */}
                      <div className="col-12">
                        <div
                          className={`radio-card ${
                            evaluation[criteria.id] === "mark"
                              ? "selected-danger"
                              : ""
                          }`}
                        >
                          <label className="form-check-label d-flex align-items-start mb-0 w-100">
                            <input
                              type="radio"
                              name={criteria.id}
                              value="mark"
                              checked={evaluation[criteria.id] === "mark"}
                              onChange={(e) => {
                                handleChange(criteria.id, e.target.value);
                                setUserRate((pre) => ({
                                  ...pre,
                                  [criteria.id === "greetings"
                                    ? "greeting"
                                    : criteria.id]: {
                                    rateVal: 0,
                                  },
                                }));
                              }}
                              className="form-check-input me-3 mt-1"
                            />
                            <div className="flex-fill">
                              <div className="d-flex align-items-start mb-2">
                                <div
                                  className="me-2 mt-0"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    // border: "2px solid #ef4444",
                                    flexShrink: 0,
                                  }}
                                ></div>
                                <span className="fw-medium text-dark flex-fill">
                                  Not up to standards{" "}
                                </span>
                                <span className="badge bg-danger badge-points">
                                  0 pts
                                </span>
                              </div>
                              <p
                                className="text-muted small mb-0 lh-base"
                                style={{ paddingLeft: "28px" }}
                              >
                                Performance does not meet the required standards
                                for this criteria
                              </p>

                              {/* ✅ Only show "Select Reason" for greetings when selected */}
                              {criteria.id === "greetings" &&
                                evaluation[criteria.id] === "mark" && (
                                  <div
                                    className="p-3 rounded-3 mt-3 ms-4 shadow-sm"
                                    style={{
                                      backgroundColor: "#f9fafb",
                                      border: "1px solid #e5e7eb",
                                    }}
                                  >
                                    <h6
                                      className="fw-semibold text-dark mb-3"
                                      style={{ fontSize: "0.95rem" }}
                                    >
                                      Select Reason
                                    </h6>

                                    <div className="d-flex flex-column">
                                      {[
                                        "Irrelevant Response",
                                        "No Booking Approach",
                                        "Concern Handling",
                                        "Other",
                                      ].map((reason) => (
                                        <div key={reason}>
                                          <label
                                            className="form-check-label d-flex align-items-center justify-content-between mb-2 p-2 rounded-2"
                                            style={{
                                              border: "1px solid #e5e7eb",
                                              backgroundColor:
                                                evaluation[
                                                  `reason-${criteria.id}`
                                                ] === reason
                                                  ? "#ffeaea"
                                                  : "#ffffff",
                                              cursor: "pointer",
                                              transition:
                                                "background-color 0.2s ease, border-color 0.2s ease",
                                            }}
                                          >
                                            <div className="d-flex align-items-center">
                                              <input
                                                type="radio"
                                                name={`reason-${criteria.id}`}
                                                value={reason}
                                                checked={
                                                  evaluation[
                                                    `reason-${criteria.id}`
                                                  ] === reason
                                                }
                                                onChange={(e) =>
                                                  handleChange(
                                                    `reason-${criteria.id}`,
                                                    e.target.value
                                                  )
                                                }
                                                className="form-check-input me-3"
                                              />
                                              <span
                                                className="fw-medium text-dark"
                                                style={{ fontSize: "0.9rem" }}
                                              >
                                                {reason}
                                              </span>
                                            </div>
                                          </label>

                                          {/* ✅ Show comment box when "Other" is selected */}
                                          {reason === "Other" &&
                                            evaluation[
                                              `reason-${criteria.id}`
                                            ] === "Other" && (
                                              <div className="ms-4 mt-2">
                                                {" "}
                                                Comment:
                                                <textarea
                                                  className="form-control shadow-sm"
                                                  rows="3"
                                                  placeholder="Please specify your reason..."
                                                  value={
                                                    evaluation[
                                                      `otherReason-${criteria.id}`
                                                    ] || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleChange(
                                                      `otherReason-${criteria.id}`,
                                                      e.target.value
                                                    )
                                                  }
                                                  style={{
                                                    fontSize: "0.9rem",
                                                    borderColor: "#e5e7eb",
                                                    backgroundColor: "#ffffff",
                                                    resize: "none",
                                                  }}
                                                ></textarea>
                                              </div>
                                            )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Evaluation Summary */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-primary" />
                    Evaluation Summary
                  </h3>
                </div>
                <div className="p-4">
                  <label className="form-label fw-medium text-dark mb-3">
                    Additional Comments & Recommendations
                  </label>
                  <textarea
                    className="form-control form-control-modern"
                    placeholder="Please provide detailed feedback, observations, areas for improvement, and specific recommendations for the agent's professional development..."
                    rows="5"
                    value={evaluation.evaluationsummary}
                    onChange={(e) =>
                      handleChange("evaluationsummary", e.target.value)
                    }
                    style={{ resize: "none" }}
                  />
                </div>
              </div>

              {/* Final Score Summary */}
              <div className="final-score-card text-white mb-4">
                <div className="p-5 text-center">
                  <h2 className="h3 fw-bold mb-4">Final Evaluation Score</h2>
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <div className="display-4 fw-bold me-2">
                      {currentRating}
                    </div>
                    <div
                      className="h4"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      / {maxRating}
                    </div>
                  </div>
                  <div
                    className={`badge ${performanceLevel.bgClass} ${performanceLevel.class} px-3 py-2`}
                  >
                    Performance Level: {performanceLevel.text}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn submit-btn text-white fw-semibold"
                >
                  Submit Evaluation Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentForm;
// import React, { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   User,
//   Mail,
//   Hash,
//   Users,
//   MessageSquare,
//   Star,
//   FileText,
//   Award,
//   TrendingUp,
//   Clock,
//   Calendar,
// } from "lucide-react";

// const AgentForm = () => {
//   const [evaluation, setEvaluation] = useState({
//     useremail: "",
//     leadID: "",
//     agentName: "",
//     mod: "",
//     teamleader: "",
//     greetings: "",
//     accuracy: "",
//     building: "",
//     presenting: "",
//     closing: "",
//     bonus: "",
//     evaluationsummary: "",
//     rating: 0,
//   });

//   const [userRate, setUserRate] = useState({
//     greeting: { rateVal: 0 },
//     accuracy: { rateVal: 0 },
//     building: { rateVal: 0 },
//     presenting: { rateVal: 0 },
//     closing: { rateVal: 0 },
//     bonus: { rateVal: 0 },
//   });

//   const [teamLeaders, setTeamLeaders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchTeamLeaders = async () => {
//       try {
//         setLoading(true);
//         // Simulated team leaders for demo
//         const mockTeamLeaders = [
//           { _id: "1", name: "John Smith" },
//           { _id: "2", name: "Sarah Johnson" },
//           { _id: "3", name: "Michael Brown" },
//           { _id: "4", name: "Emily Davis" },
//         ];
//         setTeamLeaders(mockTeamLeaders);
//       } catch (error) {
//         console.error("Failed to fetch team leaders:", error);
//         setTeamLeaders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeamLeaders();
//   }, []);

//   const handleChange = (name, value) => {
//     setEvaluation((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const total = Object.values(userRate).reduce(
//         (sum, cat) => sum + cat.rateVal,
//         0
//       );

//       const payload = {
//         ...evaluation,
//         rating: total,
//       };

//       console.log("Submitting payload:", payload);
//       alert("Evaluation saved successfully!");

//       // Reset form
//       setEvaluation({
//         useremail: "user@example.com",
//         leadID: "",
//         agentName: "",
//         teamleader: "",
//         mod: "",
//         greetings: "",
//         accuracy: "",
//         building: "",
//         presenting: "",
//         closing: "",
//         bonus: "",
//         evaluationsummary: "",
//         rating: 0,
//       });

//       setUserRate({
//         greeting: { rateVal: 0 },
//         accuracy: { rateVal: 0 },
//         building: { rateVal: 0 },
//         presenting: { rateVal: 0 },
//         closing: { rateVal: 0 },
//         bonus: { rateVal: 0 },
//       });
//     } catch (err) {
//       console.error("Failed to save evaluation:", err);
//       alert("Error saving evaluation: " + err.message);
//     }
//   };

//   useEffect(() => {
//     setEvaluation((prev) => ({
//       ...prev,
//       useremail: "user@example.com",
//     }));
//   }, []);

//   const currentRating = Object.values(userRate).reduce(
//     (sum, cat) => sum + cat.rateVal,
//     0
//   );
//   const maxRating = 96;
//   const ratingPercentage = (currentRating / maxRating) * 100;

//   const evaluationCriteria = [
//     {
//       id: "greetings",
//       title: "Professional Greetings",
//       description:
//         "Demonstrates enthusiasm and a positive tone throughout the call.",
//       icon: <MessageSquare size={18} />,
//       color: "#6366f1",
//       bgColor: "rgba(99, 102, 241, 0.1)",
//       goodOption: {
//         value: "uses",
//         text: "Uses a professional and friendly greeting within the first 3 seconds, including the company name and their own name",
//         points: 16,
//       },
//     },
//     {
//       id: "accuracy",
//       title: "Accuracy & Compliance",
//       description: "Provides accurate and up-to-date information...",
//       icon: <CheckCircle2 size={18} />,
//       color: "#059669",
//       bgColor: "rgba(5, 150, 105, 0.1)",
//       goodOption: {
//         value: "questions",
//         text: "Asks clear and concise questions to accurately identify the customer needs",
//         points: 16,
//       },
//     },
//     {
//       id: "building",
//       title: "Building Rapport & Discovery",
//       description: "Identifies potential pain points or opportunities...",
//       icon: <Users size={18} />,
//       color: "#dc2626",
//       bgColor: "rgba(220, 38, 38, 0.1)",
//       goodOption: {
//         value: "skills",
//         text: "Demonstrates active listening and open-ended questions",
//         points: 16,
//       },
//     },
//     {
//       id: "presenting",
//       title: "Presenting Solutions & Making the Sale",
//       description: "Clearly and concisely presents tailored benefits...",
//       icon: <Star size={18} />,
//       color: "#7c3aed",
//       bgColor: "rgba(124, 58, 237, 0.1)",
//       goodOption: {
//         value: "appointment",
//         text: "Overcomes objections and guides customer to appointment",
//         points: 16,
//       },
//     },
//     {
//       id: "closing",
//       title: "Call Closing & Securing Commitment",
//       description: "Confirms details and secures customer commitment...",
//       icon: <FileText size={18} />,
//       color: "#ea580c",
//       bgColor: "rgba(234, 88, 12, 0.1)",
//       goodOption: {
//         value: "Professionally",
//         text: "Summarizes key points, outlines next steps",
//         points: 16,
//       },
//     },
//     {
//       id: "bonus",
//       title: "Bonus Point",
//       description: "Going above and beyond customer expectations.",
//       icon: <Award size={18} />,
//       color: "#0891b2",
//       bgColor: "rgba(8, 145, 178, 0.1)",
//       goodOption: {
//         value: "customer",
//         text: "Exceeds customer expectations with knowledge",
//         points: 16,
//       },
//     },
//   ];

//   const getPerformanceLevel = (percentage) => {
//     if (percentage >= 80)
//       return {
//         text: "Excellent",
//         class: "text-success",
//         bgClass: "bg-success-subtle",
//       };
//     if (percentage >= 60)
//       return {
//         text: "Good",
//         class: "text-primary",
//         bgClass: "bg-primary-subtle",
//       };
//     if (percentage >= 40)
//       return {
//         text: "Average",
//         class: "text-warning",
//         bgClass: "bg-warning-subtle",
//       };
//     return {
//       text: "Needs Improvement",
//       class: "text-danger",
//       bgClass: "bg-danger-subtle",
//     };
//   };

//   const performanceLevel = getPerformanceLevel(ratingPercentage);
//   const today = new Date().toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <>
//       <style>{`
//   .gradient-bg {
//     background: #f4f4f4;
//     min-height: 100vh;
//   }

//   .header-section {
//     background: white;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//     border-bottom: 1px solid #e2e8f0;
//   }

//   .header-gradient {
//     background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
//   }

//   .icon-badge {
//     width: 40px;
//     height: 40px;
//     background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//   }

//   .custom-card {
//     background: white;
//     border-radius: 16px;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//     border: 1px solid #e2e8f0;
//     transition: all 0.2s ease;
//   }

//   .custom-card:hover {
//     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//   }

//   .progress-header {
//     background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
//     border-radius: 16px 16px 0 0;
//   }

//   .progress-custom {
//     height: 12px;
//     background-color: #e2e8f0;
//     border-radius: 6px;
//   }

//   .progress-bar-custom {
//     background: linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%);
//     border-radius: 6px;
//     transition: width 0.7s ease;
//   }

//   .form-control-modern {
//     border-radius: 12px;
//     border: 1px solid #d1d5db;
//     padding: 12px 16px;
//     transition: all 0.2s ease;
//     font-size: 0.95rem;
//   }

//   .form-control-modern:focus {
//     border-color: #3b82f6;
//     box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//     outline: none;
//   }

//   .radio-card {
//     border: 2px solid #e5e7eb;
//     border-radius: 12px;
//     padding: 14px;
//     transition: all 0.2s ease;
//     cursor: pointer;
//   }

//   .radio-card:hover {
//     background-color: #f9fafb;
//   }

//   .radio-card.selected-primary {
//     border-color: #3b82f6;
//     background-color: rgba(59, 130, 246, 0.05);
//   }

//   .radio-card.selected-success {
//     border-color: #10b981;
//     background-color: rgba(16, 185, 129, 0.05);
//   }

//   .radio-card.selected-danger {
//     border-color: #ef4444;
//     background-color: rgba(239, 68, 68, 0.05);
//   }

//   .criteria-icon {
//     width: 40px;
//     height: 40px;
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .badge-points {
//     font-size: 0.75rem;
//     font-weight: 600;
//     padding: 4px 8px;
//     border-radius: 20px;
//   }

//   .final-score-card {
//     background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
//     border-radius: 16px;
//     box-shadow: 0 10px 15px rgba(0,0,0,0.1);
//   }

//   .submit-btn {
//     background: linear-gradient(135deg, #059669 0%, #10b981 100%);
//     border: none;
//     border-radius: 16px;
//     padding: 16px 32px;
//     font-weight: 600;
//     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//     transition: all 0.2s ease;
//   }

//   .submit-btn:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 15px rgba(0,0,0,0.2);
//     background: linear-gradient(135deg, #047857 0%, #059669 100%);
//   }

//   .section-header {
//     border-bottom: 1px solid #e5e7eb;
//     padding: 1.25rem 1rem;
//   }

//   .datetime-info {
//     font-size: 0.875rem;
//     color: #6b7280;
//   }

//   .mode-selection {
//     gap: 12px;
//     flex-wrap: wrap;
//   }

//   .readonly-field {
//     background-color: #f9fafb;
//     color: #6b7280;
//     cursor: not-allowed;
//   }

//   .loading-spinner {
//     border: 3px solid #f3f3f3;
//     border-top: 3px solid #3498db;
//     border-radius: 50%;
//     width: 20px;
//     height: 20px;
//     animation: spin 1s linear infinite;
//     display: inline-block;
//     margin-left: 10px;
//   }

//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }

//   /* Mobile Responsive Styles */
//   @media (max-width: 767.98px) {
//     .header-section .container-fluid {
//       padding: 1rem !important;
//     }

//     .icon-badge {
//       width: 32px;
//       height: 32px;
//     }

//     .icon-badge svg {
//       width: 16px;
//       height: 16px;
//     }

//     .header-section h1 {
//       font-size: 1.25rem !important;
//     }

//     .header-section p {
//       font-size: 0.85rem;
//       margin-left: 0 !important;
//     }

//     .datetime-info {
//       font-size: 0.75rem;
//     }

//     .custom-card {
//       border-radius: 12px;
//       margin-bottom: 1rem !important;
//     }

//     .section-header {
//       padding: 1rem;
//     }

//     .section-header h3,
//     .section-header h4 {
//       font-size: 1rem !important;
//     }

//     .progress-header {
//       padding: 1.25rem 1rem !important;
//       border-radius: 12px 12px 0 0;
//     }

//     .progress-header .h3 {
//       font-size: 1.5rem !important;
//     }

//     .criteria-icon {
//       width: 32px;
//       height: 32px;
//     }

//     .criteria-icon svg {
//       width: 16px;
//       height: 16px;
//     }

//     .radio-card {
//       padding: 12px;
//     }

//     .form-control-modern {
//       font-size: 0.9rem;
//       padding: 10px 14px;
//     }

//     .mode-selection {
//       flex-direction: column;
//       gap: 10px;
//     }

//     .mode-selection .radio-card {
//       width: 100%;
//     }

//     .final-score-card {
//       border-radius: 12px;
//     }

//     .final-score-card .display-4 {
//       font-size: 2.5rem !important;
//     }

//     .final-score-card h2 {
//       font-size: 1.25rem !important;
//     }

//     .submit-btn {
//       padding: 14px 24px;
//       font-size: 0.95rem;
//     }

//     .badge-points {
//       font-size: 0.7rem;
//       padding: 3px 6px;
//     }
//   }

//   @media (max-width: 575.98px) {
//     .container-fluid {
//       padding-left: 0.75rem !important;
//       padding-right: 0.75rem !important;
//     }

//     .section-header .d-flex {
//       flex-direction: column;
//       align-items: flex-start !important;
//     }

//     .criteria-icon {
//       margin-bottom: 0.5rem;
//     }

//     .form-label {
//       font-size: 0.9rem;
//     }
//   }

//   /* Tablet Responsive */
//   @media (min-width: 768px) and (max-width: 991.98px) {
//     .section-header {
//       padding: 1.25rem;
//     }

//     .progress-header {
//       padding: 1.5rem !important;
//     }
//   }
// `}</style>

//       <div className="gradient-bg">
//         {/* Header Section */}
//         <div className="header-section">
//           <div className="container-fluid py-3 py-md-4">
//             <div className="row align-items-center g-3">
//               <div className="col-12 col-md-8 col-lg-9">
//                 <div className="d-flex align-items-center mb-2">
//                   <div className="icon-badge me-2 me-md-3">
//                     <User size={20} />
//                   </div>
//                   <div>
//                     <h1 className="h2 fw-bold text-dark mb-1">
//                       Agent Performance Evaluation
//                     </h1>
//                     <p className="text-muted mb-0 d-none d-sm-block">
//                       Comprehensive assessment and feedback system
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-12 col-md-4 col-lg-3 text-start text-md-end">
//                 <div className="datetime-info d-flex align-items-center justify-content-start justify-content-md-end mb-1">
//                   <Calendar size={14} className="me-1" />
//                   <span className="d-none d-sm-inline">{today}</span>
//                   <span className="d-inline d-sm-none">
//                     {new Date().toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </span>
//                 </div>
//                 <div className="datetime-info d-flex align-items-center justify-content-start justify-content-md-end">
//                   <Clock size={14} className="me-1" />
//                   {new Date().toLocaleTimeString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="container-fluid py-3 py-md-4">
//           <div className="row justify-content-center">
//             <div className="col-12 col-xl-10">
//               {/* Progress Card */}
//               <div className="custom-card mb-3 mb-md-4">
//                 <div
//                   style={{
//                     background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                   }}
//                   className="progress-header text-white p-3 p-md-4"
//                 >
//                   <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
//                     <div className="d-flex align-items-center">
//                       <TrendingUp size={18} className="me-2" />
//                       <span className="fw-semibold">Evaluation Progress</span>
//                     </div>
//                     <div className="text-end">
//                       <div className="h3 fw-bold mb-0">{currentRating}</div>
//                       <small style={{ color: "rgba(255,255,255,0.8)" }}>
//                         out of {maxRating} points
//                       </small>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 p-md-4">
//                   <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
//                     <span className="fw-medium text-dark">
//                       Completion Status
//                     </span>
//                     <span
//                       className={`badge ${performanceLevel.bgClass} ${performanceLevel.class}`}
//                     >
//                       {performanceLevel.text}
//                     </span>
//                   </div>
//                   <div className="progress-custom">
//                     <div
//                       className="progress-bar-custom h-100"
//                       style={{ width: `${ratingPercentage}%` }}
//                     ></div>
//                   </div>
//                   <div className="d-flex justify-content-between mt-2">
//                     <small className="text-muted">0%</small>
//                     <small className="text-muted">
//                       {Math.round(ratingPercentage)}%
//                     </small>
//                     <small className="text-muted">100%</small>
//                   </div>
//                 </div>
//               </div>

//               {/* Basic Information */}
//               <div className="custom-card mb-3 mb-md-4">
//                 <div className="section-header">
//                   <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
//                     <FileText size={18} className="me-2 text-primary" />
//                     Basic Information
//                   </h3>
//                 </div>
//                 <div className="p-3 p-md-4">
//                   <div className="row g-3 g-md-4">
//                     {/* Email Field */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium d-flex align-items-center mb-2">
//                         <Mail size={16} className="me-2 text-primary" />
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control form-control-modern readonly-field"
//                         value={evaluation.useremail}
//                         readOnly
//                       />
//                     </div>

//                     {/* Lead ID */}
//                     <div className="col-12 col-md-6">
//                       <label className="form-label fw-medium d-flex align-items-center mb-2">
//                         <Hash size={16} className="me-2 text-primary" />
//                         Lead ID
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control form-control-modern"
//                         placeholder="Enter Lead ID"
//                         value={evaluation.leadID}
//                         onChange={(e) => handleChange("leadID", e.target.value)}
//                       />
//                     </div>

//                     {/* Agent Name */}
//                     <div className="col-12 col-md-6">
//                       <label className="form-label fw-medium d-flex align-items-center mb-2">
//                         <User size={16} className="me-2 text-primary" />
//                         Agent Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control form-control-modern"
//                         placeholder="Enter Agent Name"
//                         value={evaluation.agentName}
//                         onChange={(e) =>
//                           handleChange("agentName", e.target.value)
//                         }
//                       />
//                     </div>

//                     {/* Team Leader */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium d-flex align-items-center mb-3">
//                         <Users size={16} className="me-2 text-primary" />
//                         Team Leader
//                         {loading && <div className="loading-spinner"></div>}
//                       </label>
//                       {teamLeaders.length > 0 ? (
//                         <div className="row g-2 g-md-3">
//                           {teamLeaders.map((leader) => (
//                             <div
//                               key={leader._id}
//                               className="col-12 col-sm-6 col-lg-6"
//                             >
//                               <div
//                                 className={`radio-card ${
//                                   evaluation.teamleader === leader.name
//                                     ? "selected-primary"
//                                     : ""
//                                 }`}
//                               >
//                                 <label className="form-check-label d-flex align-items-center mb-0 w-100">
//                                   <input
//                                     type="radio"
//                                     name="teamleader"
//                                     value={leader.name}
//                                     checked={
//                                       evaluation.teamleader === leader.name
//                                     }
//                                     onChange={(e) =>
//                                       handleChange("teamleader", e.target.value)
//                                     }
//                                     className="form-check-input me-2 me-md-3"
//                                   />
//                                   <span className="fw-medium">
//                                     {leader.name}
//                                   </span>
//                                 </label>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         !loading && (
//                           <div className="text-muted">
//                             No team leaders available
//                           </div>
//                         )
//                       )}
//                     </div>

//                     {/* Mode of Communication */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium d-flex align-items-center mb-3">
//                         <MessageSquare
//                           size={16}
//                           className="me-2 text-primary"
//                         />
//                         Mode of Communication
//                       </label>
//                       <div className="d-flex mode-selection">
//                         {["Chat", "Call", "Both"].map((mode) => (
//                           <div
//                             key={mode}
//                             className={`radio-card flex-fill ${
//                               evaluation.mod === mode ? "selected-primary" : ""
//                             }`}
//                           >
//                             <label className="form-check-label d-flex align-items-center mb-0">
//                               <input
//                                 type="radio"
//                                 name="communication"
//                                 value={mode}
//                                 checked={evaluation.mod === mode}
//                                 onChange={(e) =>
//                                   handleChange("mod", e.target.value)
//                                 }
//                                 className="form-check-input me-2 me-md-3"
//                               />
//                               <span className="fw-medium">{mode}</span>
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Evaluation Criteria */}
//               {evaluationCriteria.map((criteria) => (
//                 <div key={criteria.id} className="custom-card mb-3 mb-md-4">
//                   <div className="section-header">
//                     <div className="d-flex align-items-start">
//                       <div
//                         className="criteria-icon me-2 me-md-3"
//                         style={{
//                           backgroundColor: criteria.bgColor,
//                           color: criteria.color,
//                         }}
//                       >
//                         {criteria.icon}
//                       </div>
//                       <div className="flex-fill">
//                         <h4 className="h5 fw-semibold text-dark mb-1">
//                           {criteria.title}
//                         </h4>
//                         <p className="text-muted small mb-0 lh-base">
//                           {criteria.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-3 p-md-4">
//                     <div className="row g-2 g-md-3">
//                       {/* Good Option */}
//                       <div className="col-12">
//                         <div
//                           className={`radio-card ${
//                             evaluation[criteria.id] ===
//                             criteria.goodOption.value
//                               ? "selected-success"
//                               : ""
//                           }`}
//                         >
//                           <label className="form-check-label d-flex align-items-start mb-0 w-100">
//                             <input
//                               type="radio"
//                               name={criteria.id}
//                               value={criteria.goodOption.value}
//                               checked={
//                                 evaluation[criteria.id] ===
//                                 criteria.goodOption.value
//                               }
//                               onChange={(e) => {
//                                 handleChange(criteria.id, e.target.value);
//                                 setUserRate((pre) => ({
//                                   ...pre,
//                                   [criteria.id === "greetings"
//                                     ? "greeting"
//                                     : criteria.id]: {
//                                     rateVal: criteria.goodOption.points,
//                                   },
//                                 }));
//                               }}
//                               className="form-check-input me-2 me-md-3 mt-1"
//                             />
//                             <div className="flex-fill">
//                               <div className="d-flex align-items-start mb-2 flex-wrap gap-2">
//                                 <div className="d-flex align-items-center flex-fill">
//                                   <CheckCircle2
//                                     size={18}
//                                     className="text-success me-2"
//                                     style={{ flexShrink: 0 }}
//                                   />
//                                   <span className="fw-medium text-dark">
//                                     Meets Standards
//                                   </span>
//                                 </div>
//                                 <span className="badge bg-success badge-points">
//                                   +{criteria.goodOption.points} pts
//                                 </span>
//                               </div>
//                               <p className="text-muted small mb-0 lh-base ps-0 ps-md-4">
//                                 {criteria.goodOption.text}
//                               </p>
//                             </div>
//                           </label>
//                         </div>
//                       </div>

//                       {/* Poor Option */}
//                       <div className="col-12">
//                         <div
//                           className={`radio-card ${
//                             evaluation[criteria.id] === "mark"
//                               ? "selected-danger"
//                               : ""
//                           }`}
//                         >
//                           <label className="form-check-label d-flex align-items-start mb-0 w-100">
//                             <input
//                               type="radio"
//                               name={criteria.id}
//                               value="mark"
//                               checked={evaluation[criteria.id] === "mark"}
//                               onChange={(e) => {
//                                 handleChange(criteria.id, e.target.value);
//                                 setUserRate((pre) => ({
//                                   ...pre,
//                                   [criteria.id === "greetings"
//                                     ? "greeting"
//                                     : criteria.id]: { rateVal: 0 },
//                                 }));
//                               }}
//                               className="form-check-input me-3 mt-1"
//                             />
//                             <div className="flex-fill">
//                               <div className="d-flex align-items-start mb-2">
//                                 <div
//                                   className="me-2 mt-0"
//                                   style={{
//                                     width: "20px",
//                                     height: "20px",
//                                     border: "2px solid #ef4444",
//                                     borderRadius: "50%",
//                                     flexShrink: 0,
//                                   }}
//                                 ></div>
//                                 <span className="fw-medium text-dark flex-fill">
//                                   Below Standards
//                                 </span>
//                                 <span className="badge bg-danger badge-points">
//                                   0 pts
//                                 </span>
//                               </div>
//                               <p
//                                 className="text-muted small mb-0 lh-base"
//                                 style={{ paddingLeft: "28px" }}
//                               >
//                                 Performance does not meet the required standards
//                                 for this criteria
//                               </p>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Evaluation Summary */}
//               <div className="custom-card mb-4">
//                 <div className="section-header">
//                   <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
//                     <FileText size={20} className="me-2 text-primary" />
//                     Evaluation Summary
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   <label className="form-label fw-medium text-dark mb-3">
//                     Additional Comments & Recommendations
//                   </label>
//                   <textarea
//                     className="form-control form-control-modern"
//                     placeholder="Please provide detailed feedback, observations, areas for improvement, and specific recommendations for the agent's professional development..."
//                     rows="5"
//                     value={evaluation.evaluationsummary}
//                     onChange={(e) =>
//                       handleChange("evaluationsummary", e.target.value)
//                     }
//                     style={{ resize: "none" }}
//                   />
//                 </div>
//               </div>

//               {/* Final Score Summary */}
//               <div className="final-score-card text-white mb-4">
//                 <div className="p-5 text-center">
//                   <h2 className="h3 fw-bold mb-4">Final Evaluation Score</h2>
//                   <div className="d-flex align-items-center justify-content-center mb-4">
//                     <div className="display-4 fw-bold me-2">
//                       {currentRating}
//                     </div>
//                     <div
//                       className="h4"
//                       style={{ color: "rgba(255,255,255,0.8)" }}
//                     >
//                       / {maxRating}
//                     </div>
//                   </div>
//                   <div
//                     className={`badge ${performanceLevel.bgClass} ${performanceLevel.class} px-3 py-2`}
//                   >
//                     Performance Level: {performanceLevel.text}
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="d-grid">
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   className="btn submit-btn text-white fw-semibold"
//                 >
//                   Submit Evaluation Assessment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AgentForm;

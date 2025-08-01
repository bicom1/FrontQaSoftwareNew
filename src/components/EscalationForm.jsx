import React, { useState } from "react";
import { AlertTriangle, User, Mail, Hash, Users, MessageSquare, Star, FileText, Clock, Calendar, Upload, TrendingUp, CheckCircle2 } from 'lucide-react';
import { createEscalationApi } from "../features/escalationsApi";

const EscalationForm = () => {
  const [otherReason, setOtherReason] = useState(""); 
  const [escalation, setEscalation] = useState({
    owner: "",
    useremail: "",
    leadID: "",
    agentName: "",
    mod: "",
    teamleader: "",
    evaluatedBy: "",
    leadSource: "",
    userrating: "",
    leadStatus: "",
    escSeverity: "",
    issueIden: "",
    escAction: "", 
    documentation: "",
    successmaration: "",
    audio: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEscalation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudioChange = (e) => {
  
    setEscalation((prev) => ({ ...prev, audio: e.target.files[0] }));
  };

  const [userRate, setUserRate] = useState({
    severity: { rateVal: 0 },
    issue: { rateVal: 0 },
    action: { rateVal: 0 },
    documentation: { rateVal: 0 },
  });

  
  const leaders = [
    { _id: "1", leadName: "John Smith" },
    { _id: "2", leadName: "Sarah Johnson" },
    { _id: "3", leadName: "Mike Davis" },
    { _id: "4", leadName: "Emily Wilson" }
  ];

  const handlerEscalation = (name, value) => {
    setEscalation((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handlerOtherChange = (e) => {
    const value = e.target.value;
    setOtherReason(value);
  
    if (escalation.escAction === "Other") {
      setEscalation(prev => ({ ...prev, escAction: value }));
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!escalation.useremail || !escalation.leadID || !escalation.agentName || !escalation.teamleader) {
      alert("Please fill all required fields: Email, Lead ID, Agent Name, and Team Leader");
      return;
    }
    
    const formData = new FormData();
  
    
    Object.entries(escalation).forEach(([key, value]) => {
      if (key !== 'audio' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    
    if (escalation.audio) {
      formData.append('audio', escalation.audio);
    }
  
    
    if (escalation.escAction === "Other" && otherReason.trim() !== "") {
      formData.append('otherReason', otherReason);
    }
  
    try {
      await createEscalationApi(formData);
      
      setEscalation({
        owner: "", useremail: "", leadID: "", agentName: "", mod: "",
        teamleader: "", evaluatedBy: "", leadSource: "", userrating: "",
        leadStatus: "", escSeverity: "", issueIden: "", escAction: "",
        documentation: "", successmaration: "", audio: null,
      });
      setOtherReason("");
      setUserRate({ 
        severity: { rateVal: 0 }, 
        issue: { rateVal: 0 }, 
        action: { rateVal: 0 }, 
        documentation: { rateVal: 0 } 
      });
  
    } catch (error) {
      console.error('Submission error:', error);
      // Error handling is done in the API service
    }
  };

  const currentRating = Object.values(userRate).reduce((sum, cat) => sum + cat.rateVal, 0);
  const maxRating = 64; // Max points if all categories are rated highest
  const ratingPercentage = (currentRating / maxRating) * 100;

  const severityLevels = [
    {
      value: "Urgent Action required",
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.1)",
      points: 16
    },
    {
      value: "High",
      color: "#ea580c",
      bgColor: "rgba(234, 88, 12, 0.1)",
      points: 12
    },
    {
      value: "Repeated",
      color: "#7c3aed",
      bgColor: "rgba(124, 58, 237, 0.1)",
      points: 8
    }
  ];

  const issueTypes = [
    {
      value: "Product Knowledge",
      label: "Product Knowledge: Sales rep lacked knowledge of product features and benefits",
      icon: "📚",
      points: 16
    },
    {
      value: "Sales Process",
      label: "Sales Process: Deviation from established sales process (e.g., not qualifying leads, not handling objections properly).",
      icon: "⚙️",
      points: 16
    },
    {
      value: "Communication",
      label: "Communication: Poor communication skills (e.g., unclear explanations, unprofessional language).",
      icon: "💬",
      points: 16
    },
    {
      value: "Customer Focus",
      label: "Customer Focus: Not actively listening to customer needs, aggressive sales tactics.",
      icon: "🎯",
      points: 16
    },
    {
      value: "SOP's",
      label: "SOP's: Failing to update BITRIX or BOOKING Software in a proper manner",
      icon: "📋",
      points: 16
    }
  ];

  const actionTypes = [
    {
      value: "Coaching Required",
      label: "Coaching Required: Recommend coaching for the sales rep by the Sales Manager.",
      icon: "👨‍🏫",
      points: 16
    },
    {
      value: "Additional Training",
      label: "Additional Training Needed: Recommend specific sales training for the rep.",
      icon: "📖",
      points: 16
    },
    {
      value: "Policy Violation",
      label: "Policy Violation: Report potential policy violation to the Sales Manager.",
      icon: "⚠️",
      points: 16
    },
    {
      value: "Other",
      label: "Other",
      icon: "✏️",
      points: 16
    }
  ];

  const evaluationCriteria = [
    {
      id: 'escSeverity',
      title: 'Escalation Severity',
      description: 'Select the appropriate severity level for this issue',
      icon: <AlertTriangle size={18} />,
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.1)',
      options: severityLevels
    },
    {
      id: 'issueIden',
      title: 'Issue Identification',
      description: 'Select the primary issue category',
      icon: <Star size={18} />,
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.1)',
      options: issueTypes
    },
    {
      id: 'escAction',
      title: 'Recommended Action',
      description: 'Select the appropriate action to resolve this issue',
      icon: <MessageSquare size={18} />,
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)',
      options: actionTypes
    },
    {
      id: 'documentation',
      title: 'Supporting Documentation',
      description: 'Attach relevant recording (call) or transcript (chat)',
      icon: <FileText size={18} />,
      color: '#0891b2',
      bgColor: 'rgba(8, 145, 178, 0.1)',
      goodOption: {
        value: 'provided',
        text: 'All necessary supporting documents have been provided',
        points: 16
      }
    }
  ];

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { text: 'Critical', class: 'text-danger', bgClass: 'bg-danger-subtle' };
    if (percentage >= 60) return { text: 'High Priority', class: 'text-warning', bgClass: 'bg-warning-subtle' };
    if (percentage >= 40) return { text: 'Medium Priority', class: 'text-primary', bgClass: 'bg-primary-subtle' };
    return { text: 'Low Priority', class: 'text-success', bgClass: 'bg-success-subtle' };
  };

  const performanceLevel = getPerformanceLevel(ratingPercentage);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <style>{`
        /* ... (Your CSS styles as provided previously) ... */
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8fafd;
          margin: 0;
          padding: 0;
        }
        .gradient-bg {
          background: linear-gradient(to right, #e0f2f7, #c1e7f3);
          min-height: 100vh;
          padding-bottom: 50px;
        }
        .container-fluid {
          max-width: 1200px;
        }
        .header-section {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .header-section .icon-badge {
          background-color: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 8px rgba(220, 38, 38, 0.1);
        }
        .header-section h1 {
          color: #1a202c;
          font-size: 1.8rem;
        }
        .header-section .text-muted {
          color: #718096 !important;
        }
        .datetime-info {
          font-size: 0.9rem;
          color: #4a5568;
        }
        .custom-card {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .custom-card .section-header {
          background-color: #f7fafc;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #edf2f7;
        }
        .custom-card .section-header h3 {
          color: #2d3748;
          font-size: 1.15rem;
        }
        .form-label {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
        }
        .form-label .text-danger {
          margin-left: 5px;
        }
        .form-control-modern {
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          padding: 12px 15px;
          font-size: 1rem;
          color: #2d3748;
          transition: all 0.3s ease;
        }
        .form-control-modern:focus {
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
          outline: none;
        }
        textarea.form-control-modern {
          min-height: 90px;
        }
        .radio-card {
          background-color: #f7fafc;
          border: 2px solid #edf2f7;
          border-radius: 10px;
          padding: 1rem;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
        }
        .radio-card:hover {
          border-color: #a0aec0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .radio-card.selected-primary {
          border-color: #3182ce;
          background-color: #ebf8ff;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
        }
        .radio-card.selected-severity {
          border-color: var(--severity-color, #dc2626);
          background-color: var(--severity-bg, rgba(220, 38, 38, 0.1));
          box-shadow: 0 0 0 3px var(--severity-bg, rgba(220, 38, 38, 0.2));
        }
        .radio-card.selected-success {
          border-color: #059669;
          background-color: rgba(5, 150, 105, 0.1);
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
        }
        .radio-card.selected-danger {
          border-color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }
        .radio-card .form-check-input {
          flex-shrink: 0;
          margin-top: 0.25rem;
          margin-right: 1rem;
        }
        .radio-card .fw-medium {
          color: #2d3748;
        }
        .issue-emoji {
          font-size: 1.5rem;
          margin-right: 10px;
          line-height: 1;
        }
        .badge-points {
          font-size: 0.75rem;
          padding: 0.4em 0.7em;
          border-radius: 5px;
          font-weight: 600;
          margin-left: 10px;
        }
        .progress-header {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .progress-custom {
          background-color: #e2e8f0;
          border-radius: 10px;
          height: 12px;
          overflow: hidden;
        }
        .progress-bar-custom {
          background: linear-gradient(to right, #63b3ed, #4299e1);
          border-radius: 10px;
          transition: width 0.5s ease-in-out;
        }
        .badge {
          padding: 0.5em 0.8em;
          border-radius: 6px;
          font-weight: bold;
        }
        .text-danger {
          color: #e53e3e !important;
        }
        .bg-danger-subtle {
          background-color: #fef2f2 !important;
          color: #dc2626 !important;
        }
        .text-warning {
          color: #dd6b20 !important;
        }
        .bg-warning-subtle {
          background-color: #fffaf0 !important;
          color: #ea580c !important;
        }
        .text-primary {
          color: #3182ce !important;
        }
        .bg-primary-subtle {
          background-color: #ebf8ff !important;
          color: #3182ce !important;
        }
        .text-success {
          color: #38a169 !important;
        }
        .bg-success-subtle {
          background-color: #f0fff4 !important;
          color: #059669 !important;
        }
        .border-dashed {
          border-style: dashed !important;
          border-color: #cbd5e0 !important;
        }
        .final-score-card {
          background: linear-gradient(135deg, #0b60b0, #001b79);
          border-radius: 12px;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .final-score-card .display-4 {
          font-size: 3.5rem;
        }
        .final-score-card .h4 {
          font-size: 1.5rem;
        }
        .submit-btn {
          background: linear-gradient(to right, #48bb78, #38a169);
          border: none;
          padding: 15px 30px;
          font-size: 1.1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(56, 161, 105, 0.3);
        }
        .submit-btn:hover {
          background: linear-gradient(to right, #38a169, #2f855a);
          box-shadow: 0 6px 15px rgba(56, 161, 105, 0.4);
          transform: translateY(-2px);
        }
        .me-1 { margin-right: 0.25rem !important; }
        .me-2 { margin-right: 0.5rem !important; }
        .me-3 { margin-right: 1rem !important; }
        .mb-0 { margin-bottom: 0 !important; }
        .mb-1 { margin-bottom: 0.25rem !important; }
        .mb-2 { margin-bottom: 0.5rem !important; }
        .mb-3 { margin-bottom: 1rem !important; }
        .mb-4 { margin-bottom: 1.5rem !important; }
        .py-4 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
        .p-4 { padding: 1.5rem !important; }
        .p-5 { padding: 3rem !important; }
        .d-flex { display: flex !important; }
        .align-items-center { align-items: center !important; }
        .align-items-start { align-items: flex-start !important; }
        .justify-content-center { justify-content: center !important; }
        .justify-content-between { justify-content: space-between !important; }
        .d-grid { display: grid !important; }
        .text-center { text-align: center !important; }
        .text-end { text-align: end !important; }
        .fw-bold { font-weight: 700 !important; }
        .fw-semibold { font-weight: 600 !important; }
        .fw-medium { font-weight: 500 !important; }
        .h2 { font-size: 2rem; }
        .h3 { font-size: 1.75rem; }
        .h4 { font-size: 1.5rem; }
        .h5 { font-size: 1.25rem; }
        .small { font-size: 0.875em !important; }
        .lh-base { line-height: 1.5; }
        @media (max-width: 768px) {
          .header-section h1 {
            font-size: 1.5rem;
          }
          .header-section .icon-badge {
            padding: 8px;
            box-shadow: 0 0 0 5px rgba(220, 38, 38, 0.1);
          }
          .custom-card .section-header {
            padding: 1rem;
          }
          .custom-card .section-header h3 {
            font-size: 1rem;
          }
          .p-4 {
            padding: 1rem !important;
          }
          .p-5 {
            padding: 2rem !important;
          }
          .final-score-card .display-4 {
            font-size: 2.5rem;
          }
          .final-score-card .h4 {
            font-size: 1.2rem;
          }
          .submit-btn {
            padding: 12px 20px;
            font-size: 1rem;
          }
        }
        @media (max-width: 576px) {
          .header-section .row {
            flex-direction: column;
            align-items: flex-start !important;
          }
          .header-section .col-auto {
            width: 100%;
            text-align: start !important;
            margin-top: 1rem;
          }
          .header-section .text-muted.mb-0.ms-5 {
            margin-left: 0 !important;
          }
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
                    <AlertTriangle size={20} />
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-0">Issue Escalation Form</h1>
                </div>
                <p className="text-muted mb-0 ms-5">Report and escalate critical issues for immediate attention</p>
              </div>
              <div className="col-auto text-end">
                <div className="datetime-info d-flex align-items-center mb-1">
                  <Calendar size={16} className="me-1" />
                  {today}
                </div>
                <div className="datetime-info d-flex align-items-center">
                  <Clock size={16} className="me-1" />
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              {/* Progress Card */}
              <div className="custom-card mb-4">
                <div className="progress-header text-white p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TrendingUp size={20} className="me-2" />
                      <span className="fw-semibold">Escalation Priority Progress</span>
                    </div>
                    <div className="text-end">
                      <div className="h3 fw-bold mb-0">{currentRating}</div>
                      <small style={{ color: 'rgba(255,255,255,0.8)' }}>out of {maxRating} points</small>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fw-medium text-dark">Priority Level</span>
                    <span className={`badge ${performanceLevel.bgClass} ${performanceLevel.class}`}>
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
                    <small className="text-muted">{Math.round(ratingPercentage)}%</small>
                    <small className="text-muted">100%</small>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-danger" />
                    Reporter Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="row g-4">
                    {/* Email Field */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Mail size={16} className="me-2 text-danger" />
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
    type="email"
    name="useremail"
    className="form-control form-control-modern"
    readOnly
    placeholder="Enter your email"
    value={escalation.useremail}
    required
/>
                    </div>

                    {/* Lead ID */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Hash size={16} className="me-2 text-danger" />
                        Lead ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="leadID"
                        className="form-control form-control-modern"
                        placeholder="Enter Lead ID"
                        value={escalation.leadID}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Evaluated By */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <User size={16} className="me-2 text-danger" />
                        Evaluated By <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="evaluatedBy"
                        className="form-control form-control-modern"
                        placeholder="Enter Your Name"
                        value={escalation.evaluatedBy}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Agent Name */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <User size={16} className="me-2 text-danger" />
                        Agent Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="agentName"
                        className="form-control form-control-modern"
                        placeholder="Enter Agent Name"
                        value={escalation.agentName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Leader Selection */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <Users size={20} className="me-2 text-danger" />
                    Team Leader <span className="text-danger">*</span>
                  </h3>
                </div>
                <div className="p-4">
                  <div className="row g-3">
                    {leaders.map((leader) => (
                      <div key={leader._id} className="col-md-6">
                        <div className={`radio-card ${escalation.teamleader === leader.leadName ? 'selected-primary' : ''}`}>
                          <label className="form-check-label d-flex align-items-center mb-0 w-100">
                            <input
                              type="radio"
                              name="teamleader"
                              value={leader.leadName}
                              checked={escalation.teamleader === leader.leadName}
                              onChange={handleChange}
                              className="form-check-input me-3"
                              required
                            />
                            <span className="fw-medium">{leader.leadName}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <TrendingUp size={20} className="me-2 text-danger" />
                    Lead Details
                  </h3>
                </div>
                <div className="p-4">
                  <div className="row g-4">
                    {/* Lead Source */}
                    <div className="col-12">
                      <label className="form-label fw-medium mb-3">
                        Lead Source <span className="text-danger">*</span>
                      </label>
                      <div className="row g-3">
                        {["Facebook", "Instagram", "Live chat", "Call", "WhatsApp", "PPC"].map((source) => (
                          <div key={source} className="col-md-4 col-sm-6">
                            <div className={`radio-card ${escalation.leadSource === source ? 'selected-primary' : ''}`}>
                              <label className="form-check-label d-flex align-items-center mb-0 w-100">
                                <input
                                  type="radio"
                                  name="leadSource"
                                  value={source}
                                  checked={escalation.leadSource === source}
                                  onChange={handleChange}
                                  className="form-check-input me-3"
                                  required
                                />
                                <span className="fw-medium">{source}</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Rating */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        User Rating <span className="text-danger">*</span>
                      </label>
                      <select
                        name="userrating"
                        value={escalation.userrating}
                        onChange={handleChange}
                        className="form-control form-control-modern"
                        required
                      >
                        <option value="">Select rating</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="bad">Bad</option>
                      </select>
                    </div>

                    {/* Lead Status */}
                    <div className="col-12">
                      <label className="form-label fw-medium">
                        Lead Status <span className="text-danger">*</span>
                      </label>
                      <p className="text-muted small mb-2">What is the parked status of the lead?</p>
                      <textarea
                        name="leadStatus"
                        placeholder="Describe the current status of the lead..."
                        rows="3"
                        value={escalation.leadStatus}
                        onChange={handleChange}
                        className="form-control form-control-modern"
                        style={{ resize: 'none' }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              {evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="custom-card mb-4">
                  <div className="section-header">
                    <div className="d-flex align-items-start">
                      <div
                        className="criteria-icon me-3"
                        style={{ backgroundColor: criteria.bgColor, color: criteria.color }}
                      >
                        {criteria.icon}
                      </div>
                      <div className="flex-fill">
                        <h4 className="h5 fw-semibold text-dark mb-1">{criteria.title}</h4>
                        <p className="text-muted small mb-0 lh-base">{criteria.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="row g-3">
                      {criteria.options ? (
                        criteria.options.map((option) => (
                          <div key={option.value} className="col-12">
                            <div
                              className={`radio-card ${escalation[criteria.id] === option.value ? 'selected-severity' : ''}`}
                              style={escalation[criteria.id] === option.value ? {
                                '--severity-color': option.color || criteria.color,
                                '--severity-bg': option.bgColor || criteria.bgColor
                              } : {}}
                              onClick={() => {
                                handlerEscalation(criteria.id, option.value);
                                setUserRate(pre => ({
                                  ...pre,
                                  [criteria.id === 'escSeverity' ? 'severity' :
                                    criteria.id === 'issueIden' ? 'issue' :
                                    criteria.id === 'escAction' ? 'action' : 'documentation']:
                                  { rateVal: option.points }
                                }));
                              }}
                            >
                              <label className="form-check-label d-flex align-items-start mb-0 w-100">
                                <input
                                  type="radio"
                                  name={criteria.id}
                                  value={option.value}
                                  checked={escalation[criteria.id] === option.value}
                                  onChange={() => { }} // No direct onChange needed here as onClick handles state
                                  className="form-check-input me-3 mt-1"
                                  required
                                />
                                <div className="flex-fill">
                                  <div className="d-flex align-items-start mb-2">
                                    {option.icon && (
                                      <span className="issue-emoji">{option.icon}</span>
                                    )}
                                    <span className="fw-medium text-dark flex-fill">{option.label || option.value}</span>
                                    <span className="badge bg-primary badge-points">
                                      {option.points} pts
                                    </span>
                                  </div>
                                  {option.value === "Other" && escalation.escAction === "Other" && (
                                    <textarea
                                      name="otherReason"
                                      placeholder="Please specify the other action..."
                                      className="form-control form-control-modern mt-2"
                                      value={otherReason}
                                      onChange={handlerOtherChange}
                                      onClick={(e) => e.stopPropagation()} // Prevent parent div's onClick
                                      rows="2"
                                      required // Make it required if 'Other' is selected
                                    />
                                  )}
                                </div>
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Handling for 'documentation' criteria (which has goodOption instead of options)
                        <div className="col-12">
                          <div
                            className={`radio-card ${escalation[criteria.id] === criteria.goodOption.value ? 'selected-success' : ''}`}
                            onClick={() => {
                              handlerEscalation(criteria.id, criteria.goodOption.value);
                              setUserRate(pre => ({
                                ...pre,
                                documentation: { rateVal: criteria.goodOption.points }
                              }));
                            }}
                          >
                            <label className="form-check-label d-flex align-items-center mb-0 w-100">
                              <input
                                type="radio"
                                name={criteria.id}
                                value={criteria.goodOption.value}
                                checked={escalation[criteria.id] === criteria.goodOption.value}
                                onChange={() => { }}
                                className="form-check-input me-3"
                                required
                              />
                              <CheckCircle2 size={20} className="me-2 text-success" />
                              <span className="fw-medium text-dark flex-fill">{criteria.goodOption.text}</span>
                              <span className="badge bg-primary badge-points">
                                {criteria.goodOption.points} pts
                              </span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Audio Upload Field - only if documentation is 'provided' or specific criteria met */}
                      {criteria.id === 'documentation' && escalation.documentation === 'provided' && (
                        <div className="col-12 mt-4">
                          <label className="form-label fw-medium d-flex align-items-center">
                            <Upload size={16} className="me-2 text-primary" />
                            Attach Audio Recording (Optional)
                          </label>
                          <input
                            type="file"
                            name="audio"
                            accept="audio/*"
                            className="form-control form-control-modern"
                            onChange={handleAudioChange}
                          />
                          {escalation.audio && (
                            <p className="text-muted small mt-2">
                              Selected file: {escalation.audio.name} ({(escalation.audio.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Success Narration */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <CheckCircle2 size={20} className="me-2 text-success" />
                    Success Narration <span className="text-danger">*</span>
                  </h3>
                </div>
                <div className="p-4">
                  <label className="form-label fw-medium">
                    Detailed Explanation
                  </label>
                  <textarea
                    name="successmaration"
                    placeholder="Provide a detailed narration of the issue and resolution (minimum 20 characters)"
                    rows="4"
                    value={escalation.successmaration}
                    onChange={handleChange}
                    className="form-control form-control-modern"
                    style={{ resize: 'none' }}
                    minLength="20"
                    required
                  />
                  <small className="text-muted">Minimum 20 characters required.</small>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-5">
                <button type="submit" onClick={handleSubmit} className="btn submit-btn fw-bold">
                  Submit Escalation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EscalationForm;
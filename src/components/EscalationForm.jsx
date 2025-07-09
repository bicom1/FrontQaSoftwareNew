import React, { useState } from "react";
import { AlertTriangle, User, Mail, Hash, Users, MessageSquare, Star, FileText, Clock, Calendar, Upload, TrendingUp, CheckCircle2, Award } from 'lucide-react';

const EscalationForm = () => {
  const [otherReason, setOtherReason] = useState("");
  const [escalation, setEscalation] = useState({
    email: "user@example.com",
    leadId: "",
    evaluatedBy: "",
    agentName: "",
    teamLeader: "",
    leadSource: "",
    leadStatus: "",
    escSeverity: "",
    issueIden: "",
    escAction: "",
    successmaration: "",
    userrating: "",
    audio: null,
  });

  const [userRate, setUserRate] = useState({
    severity: { rateVal: 0 },
    issue: { rateVal: 0 },
    action: { rateVal: 0 },
    documentation: { rateVal: 0 },
  });

  // Static data for team leaders
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
    if (value.trim() !== "") {
      handlerEscalation("escAction", value);
    }
  };

  const handlerEscForm = () => {
    // Basic validation
    if (
      escalation.leadId.trim() === "" ||
      escalation.evaluatedBy.trim() === "" ||
      escalation.agentName.trim() === "" ||
      escalation.teamLeader.trim() === "" ||
      escalation.leadSource.trim() === "" ||
      escalation.leadStatus.trim() === "" ||
      escalation.escSeverity.trim() === "" ||
      escalation.issueIden.trim() === "" ||
      escalation.userrating.trim() === "" ||
      (escalation.escAction === "Call" && otherReason.trim() === "") ||
      escalation.successmaration.trim() === ""
    ) {
      alert("Please fill all required fields!");
      return;
    }
    
    console.log("Form Data:", escalation);
    alert("Escalation submitted successfully! The relevant team has been notified.");
  };

  const currentRating = Object.values(userRate).reduce((sum, cat) => sum + cat.rateVal, 0);
  const maxRating = 64; // Adjusted max rating for escalation form
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
      <style jsx>{`
        .gradient-bg {
          background: #f4f4f4;
          min-height: 100vh;
        }
        
        .header-section {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-bottom: 1px solid #e2e8f0;
        }
        
        .escalation-header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        }
        
        .icon-badge {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
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
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          border-radius: 16px 16px 0 0;
        }
        
        .progress-custom {
          height: 12px;
          background-color: #e2e8f0;
          border-radius: 6px;
        }
        
        .progress-bar-custom {
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
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
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
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
          border-color: #dc2626;
          background-color: rgba(220, 38, 38, 0.05);
        }
        
        .radio-card.selected-severity {
          border-color: var(--severity-color);
          background-color: var(--severity-bg);
        }
        
        .section-header {
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem;
        }
        
        .datetime-info {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .readonly-field {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
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
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
        }
        
        .escalation-priority {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          border-radius: 16px;
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .criteria-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .issue-emoji {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }
        
        .badge-points {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 20px;
        }
        
        .final-score-card {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          border-radius: 16px;
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
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
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-modern readonly-field"
                        value={escalation.email}
                        readOnly
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
                        className="form-control form-control-modern"
                        placeholder="Enter Lead ID"
                        value={escalation.leadId}
                        onChange={(e) => handlerEscalation("leadId", e.target.value)}
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
                        className="form-control form-control-modern"
                        placeholder="Enter Your Name"
                        value={escalation.evaluatedBy}
                        onChange={(e) => handlerEscalation("evaluatedBy", e.target.value)}
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
                        className="form-control form-control-modern"
                        placeholder="Enter Agent Name"
                        value={escalation.agentName}
                        onChange={(e) => handlerEscalation("agentName", e.target.value)}
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
                        <div className={`radio-card ${escalation.teamLeader === leader.leadName ? 'selected-primary' : ''}`}>
                          <label className="form-check-label d-flex align-items-center mb-0 w-100">
                            <input
                              type="radio"
                              name="teamLeader"
                              value={leader.leadName}
                              checked={escalation.teamLeader === leader.leadName}
                              onChange={(e) => handlerEscalation("teamLeader", e.target.value)}
                              className="form-check-input me-3"
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
                                  onChange={(e) => handlerEscalation("leadSource", e.target.value)}
                                  className="form-check-input me-3"
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
                        value={escalation.userrating}
                        onChange={(e) => handlerEscalation("userrating", e.target.value)}
                        className="form-control form-control-modern"
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
                        placeholder="Describe the current status of the lead..."
                        rows="3"
                        value={escalation.leadStatus}
                        onChange={(e) => handlerEscalation("leadStatus", e.target.value)}
                        className="form-control form-control-modern"
                        style={{ resize: 'none' }}
                      />
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
                                  onChange={() => {}}
                                  className="form-check-input me-3 mt-1"
                                />
                                <div className="flex-fill">
                                  <div className="d-flex align-items-start mb-2">
                                    {option.icon && (
                                      <span className="issue-emoji">{option.icon}</span>
                                    )}
                                    <span className="fw-medium text-dark flex-fill">{option.label || option.value}</span>
                                    <span className="badge bg-primary badge-points">
                                      +{option.points} pts
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          {/* Good Option */}
                          <div className="col-12">
                            <div className={`radio-card ${escalation[criteria.id] === criteria.goodOption.value ? 'selected-success' : ''}`}>
                              <label className="form-check-label d-flex align-items-start mb-0 w-100">
                                <input
                                  type="radio"
                                  name={criteria.id}
                                  value={criteria.goodOption.value}
                                  checked={escalation[criteria.id] === criteria.goodOption.value}
                                  onChange={(e) => {
                                    handlerEscalation(criteria.id, e.target.value);
                                    setUserRate(pre => ({ 
                                      ...pre, 
                                      documentation: { rateVal: criteria.goodOption.points } 
                                    }));
                                  }}
                                  className="form-check-input me-3 mt-1"
                                />
                                <div className="flex-fill">
                                  <div className="d-flex align-items-start mb-2">
                                    <CheckCircle2 size={20} className="text-success me-2 mt-0" style={{flexShrink: 0}} />
                                    <span className="fw-medium text-dark flex-fill">Meets Standards</span>
                                    <span className="badge bg-success badge-points">
                                      +{criteria.goodOption.points} pts
                                    </span>
                                  </div>
                                  <p className="text-muted small mb-0 lh-base" style={{paddingLeft: '28px'}}>
                                    {criteria.goodOption.text}
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                          
                          {/* Poor Option */}
                          <div className="col-12">
                            <div className={`radio-card ${escalation[criteria.id] === "mark" ? 'selected-danger' : ''}`}>
                              <label className="form-check-label d-flex align-items-start mb-0 w-100">
                                <input
                                  type="radio"
                                  name={criteria.id}
                                  value="mark"
                                  checked={escalation[criteria.id] === "mark"}
                                  onChange={(e) => {
                                    handlerEscalation(criteria.id, e.target.value);
                                    setUserRate(pre => ({ 
                                      ...pre, 
                                      documentation: { rateVal: 0 } 
                                    }));
                                  }}
                                  className="form-check-input me-3 mt-1"
                                />
                                <div className="flex-fill">
                                  <div className="d-flex align-items-start mb-2">
                                    <div 
                                      className="me-2 mt-0" 
                                      style={{
                                        width: '20px', 
                                        height: '20px', 
                                        border: '2px solid #ef4444', 
                                        borderRadius: '50%',
                                        flexShrink: 0
                                      }}
                                    ></div>
                                    <span className="fw-medium text-dark flex-fill">Below Standards</span>
                                    <span className="badge bg-danger badge-points">
                                      0 pts
                                    </span>
                                  </div>
                                  <p className="text-muted small mb-0 lh-base" style={{paddingLeft: '28px'}}>
                                    Performance does not meet the required standards for this criteria
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {criteria.id === 'escAction' && escalation.escAction === "Other" && (
                      <div className="mt-4">
                        <label className="form-label fw-medium">
                          Please specify other action <span className="text-danger">*</span>
                        </label>
                        <textarea
                          placeholder="Describe the specific action needed..."
                          rows="3"
                          value={otherReason}
                          onChange={handlerOtherChange}
                          className="form-control form-control-modern"
                          style={{ resize: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Additional Information */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-danger" />
                    Additional Information <span className="text-danger">*</span>
                  </h3>
                </div>
                <div className="p-4">
                  <label className="form-label fw-medium text-dark mb-3">
                    Provide detailed context and any additional information relevant to this escalation
                  </label>
                  <textarea
                    placeholder="Please provide comprehensive details about the issue, timeline, impact, and any other relevant information that will help in resolution..."
                    rows="5"
                    value={escalation.successmaration}
                    onChange={(e) => handlerEscalation("successmaration", e.target.value)}
                    className="form-control form-control-modern"
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <Upload size={20} className="me-2 text-danger" />
                    Supporting Documentation
                  </h3>
                </div>
                <div className="p-4">
                  <label className="form-label fw-medium mb-3">
                    Attach relevant recording (call) or transcript (chat)
                  </label>
                  <div className="border border-2 border-dashed rounded-3 p-4 text-center">
                    <Upload size={32} className="text-muted mb-3" />
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handlerEscalation("audio", e.target.files[0])}
                      className="form-control form-control-modern"
                    />
                    <p className="text-muted small mt-2 mb-0">
                      Upload audio files, screenshots, or other supporting documents
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Score Summary */}
              <div className="final-score-card text-white mb-4">
                <div className="p-5 text-center">
                  <h2 className="h3 fw-bold mb-4">Final Escalation Priority Score</h2>
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <div className="display-4 fw-bold me-2">{currentRating}</div>
                    <div className="h4" style={{ color: 'rgba(255,255,255,0.8)' }}>/ {maxRating}</div>
                  </div>
                  <div className={`badge ${performanceLevel.bgClass} ${performanceLevel.class} px-3 py-2`}>
                    Priority Level: {performanceLevel.text}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button
                  type="button"
                  onClick={handlerEscForm}
                  className="btn submit-btn text-white fw-semibold"
                >
                  Submit Escalation Report
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
import React, { useEffect, useState } from "react";
import { AlertTriangle, User, Mail, Hash, Users, MessageSquare, Star, FileText, Clock, Calendar, Upload, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getTeamLeadsApi } from "../features/teamleadApi";
import { createEscalationApi } from "../features/escalationsApi";
import axios from "axios";



const EscalationForm = ({ escalationId }) => {
  const [otherReason, setOtherReason] = useState(""); 
  const [escalation, setEscalation] = useState({
  owner: "",
  useremail: "", 
  leadID: "",
  agentName: "",
  teamleader: "",
  evaluatedby: "",
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

useEffect(() => {
    if (escalationId) {
      axios
        .get(`https://7f014f8e80a7.ngrok-free.app/api/bitrix24/${escalationId}`)
        .then((res) => {
          if (res.data.success) {
            setEscalation((prev) => ({ ...prev, ...res.data.data }));
          }
        })
        .catch((err) => console.error("Error fetching escalation:", err));
    }
  }, [escalationId]);



useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("Loaded user:", user); // 🔹 Add this
      setEscalation(prev => ({
        ...prev,
        useremail: user.email || "",
        owner: user._id || ""
      }));
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }
}, []);


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setEscalation((prev) => ({ ...prev, [name]: value }));
  // };
  const handleChange = (e) => {
    setEscalation({ ...escalation, [e.target.name]: e.target.value });
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

    const [teamLeaders, setTeamLeaders] = useState([]);
    const [loading, setLoading] = useState(false);
    

  
  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        setLoading(true);
        console.log("Fetching team leaders...");
        
        // Try to import the module dynamically
        const teamLeadModule = await import('../features/teamleadApi');
        console.log("Team lead module:", teamLeadModule);
        
        // Check different export patterns
        let getTeamLeadsFunction;
        
        if (teamLeadModule.getTeamLeadsApi) {
          getTeamLeadsFunction = teamLeadModule.getTeamLeadsApi;
          console.log("Using getTeamLeadsApi export");
        } else if (teamLeadModule.default && teamLeadModule.default.getTeamLeadsApi) {
          getTeamLeadsFunction = teamLeadModule.default.getTeamLeadsApi;
          console.log("Using default.getTeamLeadsApi export");
        } else if (teamLeadModule.default) {
          getTeamLeadsFunction = teamLeadModule.default;
          console.log("Using default export");
        } else {
          throw new Error('Team leads API function not found');
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

  if (loading) return; // Prevent double submission

  const owner = escalation.owner;
  if (!owner) {
    alert("Owner not found. Please log in.");
    return;
  }

  // Validate required fields
  const requiredFields = [
    "useremail", "leadID", "agentName", "teamleader",
    "evaluatedby", "leadSource", "userrating", "leadStatus",
    "escSeverity", "issueIden", "escAction", "successmaration"
  ];

  for (let field of requiredFields) {
    if (!escalation[field]?.toString().trim()) {
      alert(`Please fill the required field: ${field}`);
      return;
    }
  }

  setLoading(true);

  try {
    // --- API call ---
    await createEscalationApi(escalation, otherReason);

    // --- Only show success alert once ---
    alert("Escalation submitted successfully!");

    // --- Reset form ---
    let parsedUser = { _id: "", email: "" };
    try {
      const userData = localStorage.getItem("user");
      if (userData) parsedUser = JSON.parse(userData);
    } catch (err) {
      console.warn("Failed to parse userData", err);
    }

    setEscalation({
      owner: parsedUser._id || "",
      useremail: parsedUser.email || "",
      leadID: "",
      agentName: "",
      teamleader: "",
      evaluatedby: "",
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

    setOtherReason("");
    setUserRate({
      severity: { rateVal: 0 },
      issue: { rateVal: 0 },
      action: { rateVal: 0 },
      documentation: { rateVal: 0 },
    });
  } catch (error) {
    console.error(error);
    alert("Failed to submit escalation. Check console for details.");
  } finally {
    setLoading(false);
  }
};

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "https://backendqasoftware-1jfe.onrender.com/api/bitrix24/webhook",
//         escalation
//       );
//       alert("Escalation saved!");
//     } catch (err) {
//       alert("Error saving escalation");
//     }
//   };



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
            <div  className="col-12 col-xl-10">
              {/* Progress Card */}
              <div  className="custom-card mb-4">
                <div  style={{background: "linear-gradient(90deg, #4CAF50, #2196F3)" }} className="progress-header text-white p-4">
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
  className="form-control form-control-modern readonly-field"
  placeholder="Enter your email"
  value={escalation.useremail}
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
                        type="number"
                        name="leadID"
                        className="form-control form-control-modern"
                        placeholder="Enter Lead ID"
                        value={escalation.leadID}
                        onChange={(e) => setEscalation({ ...escalation, leadID: e.target.value })}
      
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
                        name="evaluatedby"
                        className="form-control form-control-modern"
                        placeholder="Enter Your Name"
                        value={escalation.evaluatedby}
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
                        onChange={(e) => setEscalation({ ...escalation, agentName: e.target.value })} 
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div >
<div className="col-12 custom-card mb-4 p-3 ">
  <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <TrendingUp size={20} className="me-2 text-danger" />
                    Team Lead <span className="text-danger">*</span>
                  </h3>
                </div>
  {teamLeaders.length > 0 ? (
    <div className="row g-3 mt-2">
      {teamLeaders.map((leader) => (
        <div key={leader._id} className="col-md-6">
          <div className={`radio-card ${escalation.teamleader === leader.name ? 'selected-primary' : ''}`}>
            <label className="form-check-label d-flex align-items-center mb-0 w-100">
              <input
                type="radio"
                name="teamleader"
                value={leader.name}
                checked={escalation.teamleader === leader.name}
                onChange={handleChange}
                className="form-check-input me-3"
                required
              />
              <span className="fw-medium">{leader.name}</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  ) : (
    !loading && <div className="text-muted">No team leaders available</div>
  )}
</div>
              </div>



              {/* Lead Details */}
              <div className="custom-card mb-4 mt-5">
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
                      {criteria.id === 'documentation' && escalation.escAction === 'provided' && (
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
// import React, { useEffect, useRef, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   AlertTriangle,
//   User,
//   Mail,
//   Hash,
//   MessageSquare,
//   Star,
//   FileText,
//   Clock,
//   Calendar,
//   Upload,
//   TrendingUp,
//   CheckCircle2,
// } from "lucide-react";
// import { getTeamLeadsApi } from "../features/teamleadApi";
// import { createEscalationApi } from "../features/escalationsApi";
// import axios from "axios";

// const EMPTY_ESCALATION = {
//   owner: "",
//   useremail: "",
//   leadID: "",
//   agentName: "",
//   teamleader: "",
//   evaluatedby: "",
//   leadSource: "",
//   userrating: "",
//   leadStatus: "",
//   escSeverity: "",
//   issueIden: "",
//   escAction: "",
//   documentation: "",
//   successmaration: "",
//   audio: null,
// };

// const EMPTY_RATE = {
//   severity: { rateVal: 0 },
//   issue: { rateVal: 0 },
//   action: { rateVal: 0 },
//   documentation: { rateVal: 0 },
// };

// const EscalationForm = ({ escalationId }) => {
//   const [otherReason, setOtherReason] = useState("");
//   const [escalation, setEscalation] = useState(EMPTY_ESCALATION);
//   const [userRate, setUserRate] = useState(EMPTY_RATE);
//   const [teamLeaders, setTeamLeaders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchingLeaders, setFetchingLeaders] = useState(false);

//   const audioRef = useRef(null);
//   const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);

//   // ── Load escalation by ID (optional) ────────────────────────────────────────
//   useEffect(() => {
//     if (!escalationId) return;
//     axios
//       .get(`https://7f014f8e80a7.ngrok-free.app/api/bitrix24/${escalationId}`)
//       .then((res) => {
//         if (res.data.success)
//           setEscalation((prev) => ({ ...prev, ...res.data.data }));
//       })
//       .catch((err) => console.error("Error fetching escalation:", err));
//   }, [escalationId]);

//   // ── Pre-fill email + owner from localStorage ─────────────────────────────────
//   useEffect(() => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         const user = JSON.parse(userData);
//         setEscalation((prev) => ({
//           ...prev,
//           useremail: user.email || "",
//           owner: user._id || "",
//         }));
//       }
//     } catch (err) {
//       console.error("Error parsing user data:", err);
//     }
//   }, []);

//   // ── Fetch team leaders ───────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchTeamLeaders = async () => {
//       try {
//         setFetchingLeaders(true);
//         const response = await getTeamLeadsApi();
//         setTeamLeaders(Array.isArray(response) ? response : response.data ?? []);
//       } catch (error) {
//         console.error("Failed to fetch team leaders:", error);
//         setTeamLeaders([]);
//       } finally {
//         setFetchingLeaders(false);
//       }
//     };
//     fetchTeamLeaders();
//   }, []);

//   // ── Audio preview: auto-play from start when file changes ───────────────────
//   useEffect(() => {
//     if (!audioPreviewUrl || !audioRef.current) return;
//     const audioEl = audioRef.current;
//     const playFromStart = () => {
//       audioEl.currentTime = 0;
//       audioEl.play().catch(() => {});
//     };
//     if (audioEl.readyState >= 1) {
//       playFromStart();
//     } else {
//       audioEl.addEventListener("loadedmetadata", playFromStart, { once: true });
//     }
//     return () => audioEl.removeEventListener("loadedmetadata", playFromStart);
//   }, [audioPreviewUrl]);

//   // ── Revoke blob URL on unmount ───────────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
//     };
//   }, [audioPreviewUrl]);

//   // ── Handlers ─────────────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEscalation((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlerEscalation = (name, value) => {
//     setEscalation((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAudioChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setAudioPreviewUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return URL.createObjectURL(file);
//     });
//     setEscalation((prev) => ({ ...prev, audio: file, documentation: "provided" }));
//     setUserRate((prev) => ({ ...prev, documentation: { rateVal: 16 } }));
//   };

//   // ── Submit ───────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     if (!escalation.owner) {
//       toast.error("Owner not found. Please log in.", { position: "top-right", theme: "colored" });
//       return;
//     }

//     const requiredFields = [
//       { key: "useremail",      label: "Email Address" },
//       { key: "leadID",         label: "Lead ID" },
//       { key: "agentName",      label: "Agent Name" },
//       { key: "teamleader",     label: "Team Leader" },
//       { key: "evaluatedby",    label: "Evaluated By" },
//       { key: "leadSource",     label: "Lead Source" },
//       { key: "userrating",     label: "User Rating" },
//       { key: "leadStatus",     label: "Lead Status" },
//       { key: "escSeverity",    label: "Escalation Severity" },
//       { key: "issueIden",      label: "Issue Identification" },
//       { key: "escAction",      label: "Escalation Action" },
//       { key: "successmaration",label: "Success Narration" },
//     ];

//     for (const { key, label } of requiredFields) {
//       if (!escalation[key]?.toString().trim()) {
//         toast.error(`Please fill the required field: ${label}`, {
//           position: "top-right",
//           theme: "colored",
//         });
//         return;
//       }
//     }

//     if (escalation.successmaration.trim().length < 20) {
//       toast.error("Success Narration must be at least 20 characters.", {
//         position: "top-right",
//         theme: "colored",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       await createEscalationApi(escalation, otherReason);

//       toast.success("Escalation submitted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "colored",
//         style: { background: "#10b981", color: "#ffffff", fontWeight: "600" },
//       });

//       // Reset — keep owner & email from localStorage
//       let parsedUser = { _id: "", email: "" };
//       try {
//         const userData = localStorage.getItem("user");
//         if (userData) parsedUser = JSON.parse(userData);
//       } catch (_) {}

//       setEscalation({
//         ...EMPTY_ESCALATION,
//         owner: parsedUser._id || "",
//         useremail: parsedUser.email || "",
//       });
//       setOtherReason("");
//       setUserRate(EMPTY_RATE);
//       setAudioPreviewUrl((prev) => {
//         if (prev) URL.revokeObjectURL(prev);
//         return null;
//       });
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         error.response?.data?.message || "Failed to submit escalation.",
//         { position: "top-right", theme: "colored" }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Derived values ────────────────────────────────────────────────────────────
//   const currentRating = Object.values(userRate).reduce((sum, c) => sum + c.rateVal, 0);
//   const maxRating = 64;
//   const ratingPercentage = (currentRating / maxRating) * 100;

//   const getPerformanceLevel = (pct) => {
//     if (pct >= 80) return { text: "Critical",       class: "text-danger",  bgClass: "bg-danger-subtle"  };
//     if (pct >= 60) return { text: "High Priority",  class: "text-warning", bgClass: "bg-warning-subtle" };
//     if (pct >= 40) return { text: "Medium Priority",class: "text-primary", bgClass: "bg-primary-subtle" };
//     return              { text: "Low Priority",   class: "text-success", bgClass: "bg-success-subtle" };
//   };
//   const performanceLevel = getPerformanceLevel(ratingPercentage);

//   const today = new Date().toLocaleDateString("en-US", {
//     year: "numeric", month: "long", day: "numeric",
//   });

//   // ── Static data ───────────────────────────────────────────────────────────────
//   const severityLevels = [
//     { value: "Urgent Action required", color: "#dc2626", bgColor: "rgba(220,38,38,0.1)",   points: 16 },
//     { value: "High",                   color: "#ea580c", bgColor: "rgba(234,88,12,0.1)",    points: 12 },
//     { value: "Repeated",               color: "#7c3aed", bgColor: "rgba(124,58,237,0.1)",   points: 8  },
//   ];

//   const issueTypes = [
//     { value: "Product Knowledge", icon: "📚", points: 16, label: "Product Knowledge: Sales rep lacked knowledge of product features and benefits" },
//     { value: "Sales Process",     icon: "⚙️", points: 16, label: "Sales Process: Deviation from established sales process (e.g., not qualifying leads, not handling objections properly)." },
//     { value: "Communication",     icon: "💬", points: 16, label: "Communication: Poor communication skills (e.g., unclear explanations, unprofessional language)." },
//     { value: "Customer Focus",    icon: "🎯", points: 16, label: "Customer Focus: Not actively listening to customer needs, aggressive sales tactics." },
//     { value: "Other",             icon: "✏️", points: 16, label: "Other" },
//   ];

//   const actionTypes = [
//     { value: "Coaching Required",    icon: "👨‍🏫", points: 16, label: "Coaching Required: Recommend coaching for the sales rep by the Sales Manager." },
//     { value: "Additional Training",  icon: "📖", points: 16, label: "Additional Training Needed: Recommend specific sales training for the rep." },
//     { value: "Policy Violation",     icon: "⚠️", points: 16, label: "Policy Violation: Report potential policy violation to the Sales Manager." },
//     { value: "Other",                icon: "✏️", points: 16, label: "Other" },
//   ];

//   const evaluationCriteria = [
//     {
//       id: "escSeverity", title: "Escalation Severity",
//       description: "Select the appropriate severity level for this issue",
//       icon: <AlertTriangle size={18} />, color: "#dc2626", bgColor: "rgba(220,38,38,0.1)",
//       options: severityLevels,
//     },
//     {
//       id: "issueIden", title: "Issue Identification",
//       description: "Select the primary issue category",
//       icon: <Star size={18} />, color: "#7c3aed", bgColor: "rgba(124,58,237,0.1)",
//       options: issueTypes,
//     },
//     {
//       id: "escAction", title: "Escalation Action",
//       description: "Select the appropriate action to resolve this issue",
//       icon: <MessageSquare size={18} />, color: "#059669", bgColor: "rgba(5,150,105,0.1)",
//       options: actionTypes,
//     },
//     {
//       id: "documentation", title: "Supporting Documentation",
//       description: "Attach relevant recording (call) or transcript (chat)",
//       icon: <FileText size={18} />, color: "#0891b2", bgColor: "rgba(8,145,178,0.1)",
//       goodOption: { value: "provided", text: "All necessary supporting documents have been provided", points: 16 },
//     },
//   ];

//   const rateKeyMap = { escSeverity: "severity", issueIden: "issue", escAction: "action", documentation: "documentation" };

//   // ── JSX ───────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />

//       <style>{`
//         .gradient-bg { background: #f4f4f4; min-height: 100vh; }
//         .header-section { background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-bottom: 1px solid #e2e8f0; }
//         .icon-badge { width:40px; height:40px; background:linear-gradient(135deg,#2563eb,#4f46e5); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; }
//         .custom-card { background:white; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border:1px solid #e2e8f0; transition:all 0.2s ease; }
//         .custom-card:hover { box-shadow:0 4px 6px rgba(0,0,0,0.1); }
//         .progress-custom { height:12px; background-color:#e2e8f0; border-radius:6px; }
//         .progress-bar-custom { background:linear-gradient(90deg,#3b82f6,#4f46e5); border-radius:6px; transition:width 0.7s ease; }
//         .form-control-modern { border-radius:12px; border:1px solid #d1d5db; padding:12px 16px; transition:all 0.2s ease; width:100%; }
//         .form-control-modern:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); outline:none; }
//         .radio-card { border:2px solid #e5e7eb; border-radius:12px; padding:16px; transition:all 0.2s ease; cursor:pointer; }
//         .radio-card:hover { background-color:#f9fafb; }
//         .radio-card.selected-primary { border-color:#3b82f6; background-color:rgba(59,130,246,0.05); }
//         .radio-card.selected-success { border-color:#10b981; background-color:rgba(16,185,129,0.05); }
//         .criteria-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
//         .badge-points { font-size:0.75rem; font-weight:600; padding:4px 8px; border-radius:20px; }
//         .submit-btn { background:linear-gradient(135deg,#059669,#10b981); border:none; border-radius:16px; padding:16px 48px; font-weight:600; font-size:1rem; box-shadow:0 4px 6px rgba(0,0,0,0.1); transition:all 0.2s ease; color:white; }
//         .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 15px rgba(0,0,0,0.2); background:linear-gradient(135deg,#047857,#059669); }
//         .submit-btn:disabled { opacity:0.65; cursor:not-allowed; }
//         .section-header { border-bottom:1px solid #e5e7eb; padding:1.5rem; }
//         .datetime-info { font-size:0.875rem; color:#6b7280; }
//         .readonly-field { background-color:#f9fafb !important; color:#6b7280; cursor:not-allowed; }
//         .loading-spinner { display:inline-block; width:18px; height:18px; border:3px solid rgba(255,255,255,0.4); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:8px; vertical-align:middle; }
//         @keyframes spin { to { transform:rotate(360deg); } }
//       `}</style>

//       <div className="gradient-bg">

//         {/* ── Header ── */}
//         <div className="header-section">
//           <div className="container-fluid py-4">
//             <div className="row align-items-center">
//               <div className="col">
//                 <div className="d-flex align-items-center mb-2">
//                   <div className="icon-badge me-3"><AlertTriangle size={20} /></div>
//                   <h1 className="h2 fw-bold text-dark mb-0">Issue Escalation Form</h1>
//                 </div>
//                 <p className="text-muted mb-0 ms-5">Report and escalate critical issues for immediate attention</p>
//               </div>
//               <div className="col-auto text-end">
//                 <div className="datetime-info d-flex align-items-center mb-1">
//                   <Calendar size={16} className="me-1" />{today}
//                 </div>
//                 <div className="datetime-info d-flex align-items-center">
//                   <Clock size={16} className="me-1" />
//                   {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Body ── */}
//         <div className="container-fluid py-4">
//           <div className="row justify-content-center">
//             <div className="col-12 col-xl-10">

//               {/* Progress Card */}
//               <div className="custom-card mb-4">
//                 <div className="text-white p-4" style={{ background: "linear-gradient(90deg,#4CAF50,#2196F3)", borderRadius: "16px 16px 0 0" }}>
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center">
//                       <TrendingUp size={20} className="me-2" />
//                       <span className="fw-semibold">Escalation Priority Progress</span>
//                     </div>
//                     <div className="text-end">
//                       <div className="h3 fw-bold mb-0">{currentRating}</div>
//                       <small style={{ color: "rgba(255,255,255,0.8)" }}>out of {maxRating} points</small>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <div className="d-flex align-items-center justify-content-between mb-3">
//                     <span className="fw-medium text-dark">Priority Level</span>
//                     <span className={`badge ${performanceLevel.bgClass} ${performanceLevel.class}`}>{performanceLevel.text}</span>
//                   </div>
//                   <div className="progress-custom">
//                     <div className="progress-bar-custom h-100" style={{ width: `${ratingPercentage}%` }} />
//                   </div>
//                   <div className="d-flex justify-content-between mt-2">
//                     <small className="text-muted">0%</small>
//                     <small className="text-muted">{Math.round(ratingPercentage)}%</small>
//                     <small className="text-muted">100%</small>
//                   </div>
//                 </div>
//               </div>

//               {/* Reporter Information */}
//               <div className="custom-card mb-4">
//                 <div className="section-header">
//                   <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
//                     <FileText size={20} className="me-2 text-danger" />Reporter Information
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   <div className="row g-4">

//                     {/* Email (read-only) */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium d-flex align-items-center">
//                         <Mail size={16} className="me-2 text-danger" />
//                         Email Address <span className="text-danger ms-1">*</span>
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control form-control-modern readonly-field"
//                         value={escalation.useremail}
//                         readOnly
//                         placeholder="Auto-filled from your account"
//                       />
//                     </div>

//                     {/* Lead ID */}
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium d-flex align-items-center">
//                         <Hash size={16} className="me-2 text-danger" />
//                         Lead ID <span className="text-danger ms-1">*</span>
//                       </label>
//                       <input
//                         type="number"
//                         name="leadID"
//                         className="form-control form-control-modern"
//                         placeholder="Enter Lead ID"
//                         value={escalation.leadID}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     {/* Evaluated By */}
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium d-flex align-items-center">
//                         <User size={16} className="me-2 text-danger" />
//                         Evaluated By <span className="text-danger ms-1">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="evaluatedby"
//                         className="form-control form-control-modern"
//                         placeholder="Enter Your Name"
//                         value={escalation.evaluatedby}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     {/* Agent Name */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium d-flex align-items-center">
//                         <User size={16} className="me-2 text-danger" />
//                         Agent Name <span className="text-danger ms-1">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="agentName"
//                         className="form-control form-control-modern"
//                         placeholder="Enter Agent Name"
//                         value={escalation.agentName}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Team Lead Selection */}
//               <div className="custom-card mb-4">
//                 <div className="section-header">
//                   <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
//                     <User size={20} className="me-2 text-danger" />
//                     Team Lead <span className="text-danger ms-1">*</span>
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   {fetchingLeaders ? (
//                     <div className="text-muted d-flex align-items-center">
//                       <span className="loading-spinner" style={{ borderTopColor: "#3498db", borderColor: "#e2e8f0" }} />
//                       Loading team leaders...
//                     </div>
//                   ) : teamLeaders.length > 0 ? (
//                     <div className="row g-3">
//                       {teamLeaders.map((leader) => (
//                         <div key={leader._id} className="col-md-6">
//                           <div className={`radio-card ${escalation.teamleader === leader.name ? "selected-primary" : ""}`}>
//                             <label className="form-check-label d-flex align-items-center mb-0 w-100" style={{ cursor: "pointer" }}>
//                               <input
//                                 type="radio"
//                                 name="teamleader"
//                                 value={leader.name}
//                                 checked={escalation.teamleader === leader.name}
//                                 onChange={handleChange}
//                                 className="form-check-input me-3"
//                                 required
//                               />
//                               <div>
//                                 <span className="fw-medium d-block">{leader.name}</span>
//                                 {leader.department && (
//                                   <small className="text-muted">{leader.department}</small>
//                                 )}
//                               </div>
//                             </label>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-muted fst-italic">No team leaders available</div>
//                   )}
//                 </div>
//               </div>

//               {/* Lead Details */}
//               <div className="custom-card mb-4">
//                 <div className="section-header">
//                   <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
//                     <TrendingUp size={20} className="me-2 text-danger" />Lead Details
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   <div className="row g-4">

//                     {/* Lead Source */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium mb-3">
//                         Lead Source <span className="text-danger">*</span>
//                       </label>
//                       <div className="row g-3">
//                         {["Facebook","Instagram","Live chat","Call","WhatsApp","PPC","SnapChat","TikTok","SEO"].map((source) => (
//                           <div key={source} className="col-md-4 col-sm-6">
//                             <div className={`radio-card ${escalation.leadSource === source ? "selected-primary" : ""}`}>
//                               <label className="form-check-label d-flex align-items-center mb-0 w-100" style={{ cursor: "pointer" }}>
//                                 <input
//                                   type="radio"
//                                   name="leadSource"
//                                   value={source}
//                                   checked={escalation.leadSource === source}
//                                   onChange={handleChange}
//                                   className="form-check-input me-3"
//                                   required
//                                 />
//                                 <span className="fw-medium">{source}</span>
//                               </label>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* User Rating */}
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium">
//                         User Rating <span className="text-danger">*</span>
//                       </label>
//                       <select
//                         name="userrating"
//                         value={escalation.userrating}
//                         onChange={handleChange}
//                         className="form-control form-control-modern"
//                         required
//                       >
//                         <option value="">Select rating</option>
//                         <option value="good">Good</option>
//                         <option value="average">Average</option>
//                         <option value="bad">Bad</option>
//                       </select>
//                     </div>

//                     {/* Lead Status */}
//                     <div className="col-12">
//                       <label className="form-label fw-medium">
//                         Lead Status <span className="text-danger">*</span>
//                       </label>
//                       <p className="text-muted small mb-2">What is the parked status of the lead?</p>
//                       <textarea
//                         name="leadStatus"
//                         placeholder="Describe the current status of the lead..."
//                         rows="3"
//                         value={escalation.leadStatus}
//                         onChange={handleChange}
//                         className="form-control form-control-modern"
//                         style={{ resize: "none" }}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Evaluation Criteria Cards */}
//               {evaluationCriteria.map((criteria) => (
//                 <div key={criteria.id} className="custom-card mb-4">
//                   <div className="section-header">
//                     <div className="d-flex align-items-start">
//                       <div className="criteria-icon me-3" style={{ backgroundColor: criteria.bgColor, color: criteria.color }}>
//                         {criteria.icon}
//                       </div>
//                       <div className="flex-fill">
//                         <h4 className="h5 fw-semibold text-dark mb-1">{criteria.title}</h4>
//                         <p className="text-muted small mb-0">{criteria.description}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <div className="row g-3">

//                       {/* Options (severity / issue / action) */}
//                       {criteria.options ? (
//                         criteria.options.map((option) => (
//                           <div key={option.value} className="col-12">
//                             <div
//                               className={`radio-card ${escalation[criteria.id] === option.value ? "selected-primary" : ""}`}
//                               onClick={() => {
//                                 handlerEscalation(criteria.id, option.value);
//                                 setUserRate((prev) => ({
//                                   ...prev,
//                                   [rateKeyMap[criteria.id]]: { rateVal: option.points },
//                                 }));
//                               }}
//                             >
//                               <label className="form-check-label d-flex align-items-start mb-0 w-100" style={{ cursor: "pointer" }}>
//                                 <input
//                                   type="radio"
//                                   name={criteria.id}
//                                   value={option.value}
//                                   checked={escalation[criteria.id] === option.value}
//                                   onChange={() => {}}
//                                   className="form-check-input me-3 mt-1"
//                                   required
//                                 />
//                                 <div className="flex-fill">
//                                   <div className="d-flex align-items-start mb-1">
//                                     {option.icon && <span className="me-2" style={{ fontSize: "1.1rem" }}>{option.icon}</span>}
//                                     <span className="fw-medium text-dark flex-fill">{option.label || option.value}</span>
//                                     <span className="badge bg-primary badge-points ms-2">{option.points} pts</span>
//                                   </div>

//                                   {/* "Other" textarea — only for escAction */}
//                                   {option.value === "Other" && criteria.id === "escAction" && escalation.escAction === "Other" && (
//                                     <textarea
//                                       placeholder="Please specify the other action..."
//                                       className="form-control form-control-modern mt-2"
//                                       value={otherReason}
//                                       onChange={(e) => setOtherReason(e.target.value)}
//                                       onClick={(e) => e.stopPropagation()}
//                                       onFocus={(e) => e.stopPropagation()}
//                                       rows="2"
//                                       required
//                                     />
//                                   )}
//                                 </div>
//                               </label>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         /* Documentation checkbox-style card */
//                         <div className="col-12">
//                           <div
//                             className={`radio-card ${escalation[criteria.id] === criteria.goodOption.value ? "selected-success" : ""}`}
//                             onClick={() => {
//                               handlerEscalation(criteria.id, criteria.goodOption.value);
//                               setUserRate((prev) => ({ ...prev, documentation: { rateVal: criteria.goodOption.points } }));
//                             }}
//                           >
//                             <label className="form-check-label d-flex align-items-center mb-0 w-100" style={{ cursor: "pointer" }}>
//                               <input
//                                 type="radio"
//                                 name={criteria.id}
//                                 value={criteria.goodOption.value}
//                                 checked={escalation[criteria.id] === criteria.goodOption.value}
//                                 onChange={() => {}}
//                                 className="form-check-input me-3"
//                                 required
//                               />
//                               <CheckCircle2 size={20} className="me-2 text-success" />
//                               <span className="fw-medium text-dark flex-fill">{criteria.goodOption.text}</span>
//                               <span className="badge bg-primary badge-points ms-2">{criteria.goodOption.points} pts</span>
//                             </label>
//                           </div>
//                         </div>
//                       )}

//                       {/* Audio upload — only inside documentation card */}
//                       {criteria.id === "documentation" && (
//                         <div className="col-12 mt-2">
//                           <label className="form-label fw-medium d-flex align-items-center">
//                             <Upload size={16} className="me-2 text-primary" />
//                             Attach Audio Recording <span className="text-muted ms-1">(Optional)</span>
//                           </label>
//                           <input
//                             type="file"
//                             name="audio"
//                             accept="audio/*"
//                             className="form-control form-control-modern"
//                             onChange={handleAudioChange}
//                           />
//                           {escalation.audio && (
//                             <p className="text-muted small mt-2">
//                               Selected: <strong>{escalation.audio.name}</strong> ({(escalation.audio.size / 1024 / 1024).toFixed(2)} MB)
//                             </p>
//                           )}
//                           {audioPreviewUrl && (
//                             <audio
//                               ref={audioRef}
//                               src={audioPreviewUrl}
//                               controls
//                               className="w-100 mt-3"
//                               onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0; }}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Success Narration */}
//               <div className="custom-card mb-4">
//                 <div className="section-header">
//                   <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
//                     <CheckCircle2 size={20} className="me-2 text-success" />
//                     Success Narration <span className="text-danger ms-1">*</span>
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   <label className="form-label fw-medium">Detailed Explanation</label>
//                   <textarea
//                     name="successmaration"
//                     placeholder="Provide a detailed narration of the issue and expected resolution (minimum 20 characters)..."
//                     rows="5"
//                     value={escalation.successmaration}
//                     onChange={handleChange}
//                     className="form-control form-control-modern"
//                     style={{ resize: "vertical" }}
//                     minLength="20"
//                     required
//                   />
//                   <div className="d-flex justify-content-between mt-1">
//                     <small className="text-muted">Minimum 20 characters required</small>
//                     <small className={escalation.successmaration.length >= 20 ? "text-success" : "text-muted"}>
//                       {escalation.successmaration.length} chars
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit */}
//               <div className="text-center mt-4 mb-5">
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="submit-btn"
//                 >
//                   {loading ? (
//                     <><span className="loading-spinner" />Submitting...</>
//                   ) : (
//                     "Submit Escalation"
//                   )}
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EscalationForm;
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AlertTriangle,
  User,
  Mail,
  Hash,
  MessageSquare,
  Star,
  FileText,
  Clock,
  Calendar,
  Upload,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { getTeamLeadsApi } from "../features/teamleadApi";
import { createEscalationApi } from "../features/escalationsApi";
import axios from "axios";

const EMPTY_ESCALATION = {
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
};

const EMPTY_RATE = {
  severity: { rateVal: 0 },
  issue: { rateVal: 0 },
  action: { rateVal: 0 },
  documentation: { rateVal: 0 },
};

const EscalationForm = ({ escalationId }) => {
  const [otherReason, setOtherReason] = useState("");
  const [escalation, setEscalation] = useState(EMPTY_ESCALATION);
  const [userRate, setUserRate] = useState(EMPTY_RATE);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLeaders, setFetchingLeaders] = useState(false);

  const audioRef = useRef(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);

  // ── Load escalation by ID (optional) ────────────────────────────────────────
  useEffect(() => {
    if (!escalationId) return;
    axios
      .get(`https://7f014f8e80a7.ngrok-free.app/api/bitrix24/${escalationId}`)
      .then((res) => {
        if (res.data.success)
          setEscalation((prev) => ({ ...prev, ...res.data.data }));
      })
      .catch((err) => console.error("Error fetching escalation:", err));
  }, [escalationId]);

  // ── Pre-fill email + owner from localStorage ─────────────────────────────────
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setEscalation((prev) => ({
          ...prev,
          useremail: user.email || "",
          owner: user._id || "",
        }));
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }, []);

  // ── Fetch team leaders ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        setFetchingLeaders(true);
        const response = await getTeamLeadsApi();
        setTeamLeaders(Array.isArray(response) ? response : response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch team leaders:", error);
        setTeamLeaders([]);
      } finally {
        setFetchingLeaders(false);
      }
    };
    fetchTeamLeaders();
  }, []);

  // ── Audio preview: auto-play from start when file changes ───────────────────
  useEffect(() => {
    if (!audioPreviewUrl || !audioRef.current) return;
    const audioEl = audioRef.current;
    const playFromStart = () => {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    };
    if (audioEl.readyState >= 1) {
      playFromStart();
    } else {
      audioEl.addEventListener("loadedmetadata", playFromStart, { once: true });
    }
    return () => audioEl.removeEventListener("loadedmetadata", playFromStart);
  }, [audioPreviewUrl]);

  // ── Revoke blob URL on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEscalation((prev) => ({ ...prev, [name]: value }));
  };

  const handlerEscalation = (name, value) => {
    setEscalation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setEscalation((prev) => ({ ...prev, audio: file, documentation: "provided" }));
    setUserRate((prev) => ({ ...prev, documentation: { rateVal: 16 } }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!escalation.owner) {
      toast.error("Owner not found. Please log in.", { position: "top-right", theme: "colored" });
      return;
    }

    const requiredFields = [
      { key: "useremail",      label: "Email Address" },
      { key: "leadID",         label: "Lead ID" },
      { key: "agentName",      label: "Agent Name" },
      { key: "teamleader",     label: "Team Leader" },
      { key: "evaluatedby",    label: "Evaluated By" },
      { key: "leadSource",     label: "Lead Source" },
      { key: "userrating",     label: "User Rating" },
      { key: "leadStatus",     label: "Lead Status" },
      { key: "escSeverity",    label: "Escalation Severity" },
      { key: "issueIden",      label: "Issue Identification" },
      { key: "escAction",      label: "Escalation Action" },
      { key: "successmaration",label: "Success Narration" },
    ];

    for (const { key, label } of requiredFields) {
      if (!escalation[key]?.toString().trim()) {
        toast.error(`Please fill the required field: ${label}`, {
          position: "top-right",
          theme: "colored",
        });
        return;
      }
    }

    if (escalation.successmaration.trim().length < 20) {
      toast.error("Success Narration must be at least 20 characters.", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }

    setLoading(true);
    try {
      await createEscalationApi(escalation, otherReason);

      toast.success("Escalation submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        style: { background: "#10b981", color: "#ffffff", fontWeight: "600" },
      });

      // Reset — keep owner & email from localStorage
      let parsedUser = { _id: "", email: "" };
      try {
        const userData = localStorage.getItem("user");
        if (userData) parsedUser = JSON.parse(userData);
      } catch (_) {}

      setEscalation({
        ...EMPTY_ESCALATION,
        owner: parsedUser._id || "",
        useremail: parsedUser.email || "",
      });
      setOtherReason("");
      setUserRate(EMPTY_RATE);
      setAudioPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to submit escalation.",
        { position: "top-right", theme: "colored" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────────
  const currentRating = Object.values(userRate).reduce((sum, c) => sum + c.rateVal, 0);
  const maxRating = 64;
  const ratingPercentage = (currentRating / maxRating) * 100;

  const getPerformanceLevel = (pct) => {
    if (pct >= 80) return { text: "Critical",       class: "text-danger",  bgClass: "bg-danger-subtle"  };
    if (pct >= 60) return { text: "High Priority",  class: "text-warning", bgClass: "bg-warning-subtle" };
    if (pct >= 40) return { text: "Medium Priority",class: "text-primary", bgClass: "bg-primary-subtle" };
    return              { text: "Low Priority",   class: "text-success", bgClass: "bg-success-subtle" };
  };
  const performanceLevel = getPerformanceLevel(ratingPercentage);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // ── Static data ───────────────────────────────────────────────────────────────
  const severityLevels = [
    { value: "Urgent Action required", color: "#dc2626", bgColor: "rgba(220,38,38,0.1)",   points: 16 },
    { value: "High",                   color: "#ea580c", bgColor: "rgba(234,88,12,0.1)",    points: 12 },
    { value: "Repeated",               color: "#7c3aed", bgColor: "rgba(124,58,237,0.1)",   points: 8  },
  ];

  const issueTypes = [
    { value: "Product Knowledge", icon: "📚", points: 16, label: "Product Knowledge: Sales rep lacked knowledge of product features and benefits" },
    { value: "Sales Process",     icon: "⚙️", points: 16, label: "Sales Process: Deviation from established sales process (e.g., not qualifying leads, not handling objections properly)." },
    { value: "Communication",     icon: "💬", points: 16, label: "Communication: Poor communication skills (e.g., unclear explanations, unprofessional language)." },
    { value: "Customer Focus",    icon: "🎯", points: 16, label: "Customer Focus: Not actively listening to customer needs, aggressive sales tactics." },
    { value: "Other",             icon: "✏️", points: 16, label: "Other" },
  ];

  const actionTypes = [
    { value: "Coaching Required",    icon: "👨‍🏫", points: 16, label: "Coaching Required: Recommend coaching for the sales rep by the Sales Manager." },
    { value: "Additional Training",  icon: "📖", points: 16, label: "Additional Training Needed: Recommend specific sales training for the rep." },
    { value: "Policy Violation",     icon: "⚠️", points: 16, label: "Policy Violation: Report potential policy violation to the Sales Manager." },
    { value: "Other",                icon: "✏️", points: 16, label: "Other" },
  ];

  const evaluationCriteria = [
    {
      id: "escSeverity", title: "Escalation Severity",
      description: "Select the appropriate severity level for this issue",
      icon: <AlertTriangle size={18} />, color: "#dc2626", bgColor: "rgba(220,38,38,0.1)",
      options: severityLevels,
    },
    {
      id: "issueIden", title: "Issue Identification",
      description: "Select the primary issue category",
      icon: <Star size={18} />, color: "#7c3aed", bgColor: "rgba(124,58,237,0.1)",
      options: issueTypes,
    },
    {
      id: "escAction", title: "Escalation Action",
      description: "Select the appropriate action to resolve this issue",
      icon: <MessageSquare size={18} />, color: "#059669", bgColor: "rgba(5,150,105,0.1)",
      options: actionTypes,
    },
    {
      id: "documentation", title: "Supporting Documentation",
      description: "Attach relevant recording (call) or transcript (chat)",
      icon: <FileText size={18} />, color: "#0891b2", bgColor: "rgba(8,145,178,0.1)",
      goodOption: { value: "provided", text: "All necessary supporting documents have been provided", points: 16 },
    },
  ];

  const rateKeyMap = { escSeverity: "severity", issueIden: "issue", escAction: "action", documentation: "documentation" };

  // ── JSX ───────────────────────────────────────────────────────────────────────
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <style>{`
        .gradient-bg { background: #f4f4f4; min-height: 100vh; }
        .header-section { background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-bottom: 1px solid #e2e8f0; }
        .icon-badge { width:40px; height:40px; background:linear-gradient(135deg,#2563eb,#4f46e5); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; }
        .custom-card { background:white; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border:1px solid #e2e8f0; transition:all 0.2s ease; }
        .custom-card:hover { box-shadow:0 4px 6px rgba(0,0,0,0.1); }
        .progress-custom { height:12px; background-color:#e2e8f0; border-radius:6px; }
        .progress-bar-custom { background:linear-gradient(90deg,#3b82f6,#4f46e5); border-radius:6px; transition:width 0.7s ease; }
        .form-control-modern { border-radius:12px; border:1px solid #d1d5db; padding:12px 16px; transition:all 0.2s ease; width:100%; }
        .form-control-modern:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); outline:none; }
        .radio-card { border:2px solid #e5e7eb; border-radius:12px; padding:16px; transition:all 0.2s ease; cursor:pointer; }
        .radio-card:hover { background-color:#f9fafb; }
        .radio-card.selected-primary { border-color:#3b82f6; background-color:rgba(59,130,246,0.05); }
        .radio-card.selected-success { border-color:#10b981; background-color:rgba(16,185,129,0.05); }
        .criteria-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .badge-points { font-size:0.75rem; font-weight:600; padding:4px 8px; border-radius:20px; }
        .submit-btn { background:linear-gradient(135deg,#059669,#10b981); border:none; border-radius:16px; padding:16px 48px; font-weight:600; font-size:1rem; box-shadow:0 4px 6px rgba(0,0,0,0.1); transition:all 0.2s ease; color:white; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 15px rgba(0,0,0,0.2); background:linear-gradient(135deg,#047857,#059669); }
        .submit-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .section-header { border-bottom:1px solid #e5e7eb; padding:1.5rem; }
        .datetime-info { font-size:0.875rem; color:#6b7280; }
        .readonly-field { background-color:#f9fafb !important; color:#6b7280; cursor:not-allowed; }
        .loading-spinner { display:inline-block; width:18px; height:18px; border:3px solid rgba(255,255,255,0.4); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:8px; vertical-align:middle; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="gradient-bg">

        {/* ── Header ── */}
        <div className="header-section">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center mb-2">
                  <div className="icon-badge me-3"><AlertTriangle size={20} /></div>
                  <h1 className="h2 fw-bold text-dark mb-0">Issue Escalation Form</h1>
                </div>
                <p className="text-muted mb-0 ms-5">Report and escalate critical issues for immediate attention</p>
              </div>
              <div className="col-auto text-end">
                <div className="datetime-info d-flex align-items-center mb-1">
                  <Calendar size={16} className="me-1" />{today}
                </div>
                <div className="datetime-info d-flex align-items-center">
                  <Clock size={16} className="me-1" />
                  {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">

              {/* Progress Card */}
              <div className="custom-card mb-4">
                <div className="text-white p-4" style={{ background: "linear-gradient(90deg,#4CAF50,#2196F3)", borderRadius: "16px 16px 0 0" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TrendingUp size={20} className="me-2" />
                      <span className="fw-semibold">Escalation Priority Progress</span>
                    </div>
                    <div className="text-end">
                      <div className="h3 fw-bold mb-0">{currentRating}</div>
                      <small style={{ color: "rgba(255,255,255,0.8)" }}>out of {maxRating} points</small>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fw-medium text-dark">Priority Level</span>
                    <span className={`badge ${performanceLevel.bgClass} ${performanceLevel.class}`}>{performanceLevel.text}</span>
                  </div>
                  <div className="progress-custom">
                    <div className="progress-bar-custom h-100" style={{ width: `${ratingPercentage}%` }} />
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">0%</small>
                    <small className="text-muted">{Math.round(ratingPercentage)}%</small>
                    <small className="text-muted">100%</small>
                  </div>
                </div>
              </div>

              {/* Reporter Information */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-danger" />Reporter Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="row g-4">

                    {/* Email (read-only) */}
                    <div className="col-12">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Mail size={16} className="me-2 text-danger" />
                        Email Address <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-modern readonly-field"
                        value={escalation.useremail}
                        readOnly
                        placeholder="Auto-filled from your account"
                      />
                    </div>

                    {/* Lead ID */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium d-flex align-items-center">
                        <Hash size={16} className="me-2 text-danger" />
                        Lead ID <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="number"
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
                        Evaluated By <span className="text-danger ms-1">*</span>
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
                        Agent Name <span className="text-danger ms-1">*</span>
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

              {/* Team Lead Selection */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <User size={20} className="me-2 text-danger" />
                    Team Lead <span className="text-danger ms-1">*</span>
                  </h3>
                </div>
                <div className="p-4">
                  {fetchingLeaders ? (
                    <div className="text-muted d-flex align-items-center">
                      <span className="loading-spinner" style={{ borderTopColor: "#3498db", borderColor: "#e2e8f0" }} />
                      Loading team leaders...
                    </div>
                  ) : teamLeaders.length > 0 ? (
                    <div className="row g-3">
                      {teamLeaders.map((leader) => (
                        <div key={leader._id} className="col-md-6">
                          <div className={`radio-card ${escalation.teamleader === leader.name ? "selected-primary" : ""}`}>
                            <label className="form-check-label d-flex align-items-center mb-0 w-100" style={{ cursor: "pointer" }}>
                              <input
                                type="radio"
                                name="teamleader"
                                value={leader.name}
                                checked={escalation.teamleader === leader.name}
                                onChange={handleChange}
                                className="form-check-input me-3"
                                required
                              />
                              <div>
                                <span className="fw-medium d-block">{leader.name}</span>
                                {leader.department && (
                                  <small className="text-muted">{leader.department}</small>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted fst-italic">No team leaders available</div>
                  )}
                </div>
              </div>

              {/* Lead Details */}
              <div className="custom-card mb-4">
                <div className="section-header">
                  <h3 className="h5 fw-semibold text-dark mb-0 d-flex align-items-center">
                    <TrendingUp size={20} className="me-2 text-danger" />Lead Details
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
                        {["Facebook","Instagram","Live chat","Call","WhatsApp","PPC","SnapChat","TikTok","SEO"].map((source) => (
                          <div key={source} className="col-md-4 col-sm-6">
                            <div className={`radio-card ${escalation.leadSource === source ? "selected-primary" : ""}`}>
                              <label className="form-check-label d-flex align-items-center mb-0 w-100" style={{ cursor: "pointer" }}>
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
                        style={{ resize: "none" }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria Cards */}
              {evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="custom-card mb-4">
                  <div className="section-header">
                    <div className="d-flex align-items-start">
                      <div className="criteria-icon me-3" style={{ backgroundColor: criteria.bgColor, color: criteria.color }}>
                        {criteria.icon}
                      </div>
                      <div className="flex-fill">
                        <h4 className="h5 fw-semibold text-dark mb-1">{criteria.title}</h4>
                        <p className="text-muted small mb-0">{criteria.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="row g-3">

                      {/* Options (severity / issue / action) */}
                      {criteria.options ? (
                        criteria.options.map((option) => (
                          <div key={option.value} className="col-12">
                            <div
                              className={`radio-card ${escalation[criteria.id] === option.value ? "selected-primary" : ""}`}
                              onClick={() => {
                                handlerEscalation(criteria.id, option.value);
                                setUserRate((prev) => ({
                                  ...prev,
                                  [rateKeyMap[criteria.id]]: { rateVal: option.points },
                                }));
                              }}
                            >
                              <label className="form-check-label d-flex align-items-start mb-0 w-100" style={{ cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name={criteria.id}
                                  value={option.value}
                                  checked={escalation[criteria.id] === option.value}
                                  onChange={() => {}}
                                  className="form-check-input me-3 mt-1"
                                  required
                                />
                                <div className="flex-fill">
                                  <div className="d-flex align-items-start mb-1">
                                    {option.icon && <span className="me-2" style={{ fontSize: "1.1rem" }}>{option.icon}</span>}
                                    <span className="fw-medium text-dark flex-fill">{option.label || option.value}</span>
                                    <span className="badge bg-primary badge-points ms-2">{option.points} pts</span>
                                  </div>

                                  {/* "Other" textarea — only for escAction */}
                                  {option.value === "Other" && criteria.id === "escAction" && escalation.escAction === "Other" && (
                                    <textarea
                                      placeholder="Please specify the other action..."
                                      className="form-control form-control-modern mt-2"
                                      value={otherReason}
                                      onChange={(e) => setOtherReason(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      onFocus={(e) => e.stopPropagation()}
                                      rows="2"
                                      required
                                    />
                                  )}
                                </div>
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        /* Documentation checkbox-style card */
                        <div className="col-12">
                          <div
                            className={`radio-card ${escalation[criteria.id] === criteria.goodOption.value ? "selected-success" : ""}`}
                            onClick={() => {
                              handlerEscalation(criteria.id, criteria.goodOption.value);
                              setUserRate((prev) => ({ ...prev, documentation: { rateVal: criteria.goodOption.points } }));
                            }}
                          >
                            <label className="form-check-label d-flex align-items-center mb-0 w-100" style={{ cursor: "pointer" }}>
                              <input
                                type="radio"
                                name={criteria.id}
                                value={criteria.goodOption.value}
                                checked={escalation[criteria.id] === criteria.goodOption.value}
                                onChange={() => {}}
                                className="form-check-input me-3"
                                required
                              />
                              <CheckCircle2 size={20} className="me-2 text-success" />
                              <span className="fw-medium text-dark flex-fill">{criteria.goodOption.text}</span>
                              <span className="badge bg-primary badge-points ms-2">{criteria.goodOption.points} pts</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Audio upload — only inside documentation card */}
                      {criteria.id === "documentation" && (
                        <div className="col-12 mt-2">
                          <label className="form-label fw-medium d-flex align-items-center">
                            <Upload size={16} className="me-2 text-primary" />
                            Attach Audio Recording <span className="text-muted ms-1">(Optional)</span>
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
                              Selected: <strong>{escalation.audio.name}</strong> ({(escalation.audio.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                          {audioPreviewUrl && (
                            <audio
                              ref={audioRef}
                              src={audioPreviewUrl}
                              controls
                              className="w-100 mt-3"
                              onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0; }}
                            />
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
                    Success Narration <span className="text-danger ms-1">*</span>
                  </h3>
                </div>
                <div className="p-4">
                  <label className="form-label fw-medium">Detailed Explanation</label>
                  <textarea
                    name="successmaration"
                    placeholder="Provide a detailed narration of the issue and expected resolution (minimum 20 characters)..."
                    rows="5"
                    value={escalation.successmaration}
                    onChange={handleChange}
                    className="form-control form-control-modern"
                    style={{ resize: "vertical" }}
                    minLength="20"
                    required
                  />
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Minimum 20 characters required</small>
                    <small className={escalation.successmaration.length >= 20 ? "text-success" : "text-muted"}>
                      {escalation.successmaration.length} chars
                    </small>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center mt-4 mb-5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <><span className="loading-spinner" />Submitting...</>
                  ) : (
                    "Submit Escalation"
                  )}
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
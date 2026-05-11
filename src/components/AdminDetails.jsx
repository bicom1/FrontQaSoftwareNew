// // src/components/AdminDetails.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import {
//   Crown,
//   Mail,
//   Calendar,
//   Shield,
//   User,
//   Phone,
//   MapPin,
//   Edit,
//   BarChart3,
//   Activity,
//   TrendingUp,
// } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import { getProfileApi } from "../features/userApis";
// import TableAdmin from "./TableAdmin";

// const AdminDetails = ({ setIsLoggedIn }) => {
//   const { adminId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [adminDetails, setAdminDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalLeads: 347,
//     conversionRate: "72%",
//     avgResponse: "1.8m",
//     tasksCompleted: 128,
//   });

//   // State for sidebar and header - use the same state management as Dashboard
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("analytics"); // Set to 'analytics' since we're coming from Analytics
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       text: "New user registration",
//       time: "5 minutes ago",
//       read: false,
//     },
//     {
//       id: 2,
//       text: "Server update completed",
//       time: "2 hours ago",
//       read: false,
//     },
//     { id: 3, text: "Weekly report available", time: "1 day ago", read: true },
//   ]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [formsExpanded, setFormsExpanded] = useState(false);
//   const [profile, setProfile] = useState(null);

//   // Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await getProfileApi();
//         console.log("Fetched user profile:", res);
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Failed to fetch user profile:", err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   // Fetch admin details
//   useEffect(() => {
//     const fetchAdminDetails = async () => {
//       try {
//         setLoading(true);
//         // Mock data for demonstration
//         setTimeout(() => {
//           setAdminDetails({
//             _id: adminId,
//             name: location.state?.adminName || "Admin User",
//             email: "admin@example.com",
//             role: "admin",
//             createdAt: "2023-01-15",
//             lastLogin: new Date().toISOString(),
//             permissions: [
//               "user_management",
//               "content_moderation",
//               "analytics_view",
//             ],
//             phone: "+1 (555) 123-4567",
//             location: "New York, USA",
//             status: "active",
//           });
//           setLoading(false);
//         }, 500);
//       } catch (error) {
//         console.error("Error fetching admin details:", error);
//         setLoading(false);
//       }
//     };

//     fetchAdminDetails();
//   }, [adminId, location.state]);

//   // Function to handle sidebar navigation
//   const handleSidebarNavigation = (tab) => {
//     setActiveTab(tab);

//     // If navigating away from admin details, go to the appropriate route
//     if (tab !== "analytics") {
//       navigate(tab === "overview" ? "/dashboard" : `/${tab}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex" style={{ minHeight: "100vh" }}>
//         <Sidebar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           activeTab={activeTab}
//           setActiveTab={handleSidebarNavigation}
//           formsExpanded={formsExpanded}
//           setFormsExpanded={setFormsExpanded}
//           profile={profile}
//         />
//         <div className="flex-grow-1 d-flex flex-column">
//           <Header
//             setIsLoggedIn={setIsLoggedIn}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//             notifications={notifications}
//             setNotifications={setNotifications}
//             showNotifications={showNotifications}
//             setShowNotifications={setShowNotifications}
//             showUserMenu={showUserMenu}
//             setShowUserMenu={setShowUserMenu}
//           />
//           <div className="flex-grow-1 bg-light p-4 d-flex justify-content-center align-items-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="d-flex" style={{ minHeight: "100vh" }}>
//       {/* Sidebar Component */}
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         activeTab={activeTab}
//         setActiveTab={handleSidebarNavigation}
//         formsExpanded={formsExpanded}
//         setFormsExpanded={setFormsExpanded}
//         profile={profile}
//       />

//       {/* Main Content */}
//       <div className="flex-grow-1 d-flex flex-column">
//         {/* Header Component */}
//         <Header
//           setIsLoggedIn={setIsLoggedIn}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           notifications={notifications}
//           setNotifications={setNotifications}
//           showNotifications={showNotifications}
//           setShowNotifications={setShowNotifications}
//           showUserMenu={showUserMenu}
//           setShowUserMenu={setShowUserMenu}
//         />

//         {/* Content Area */}
//         <div className="flex-grow-1 bg-light p-4 analytics-dashboard">
//           {/* Header - Matches the Analytics dashboard */}
//           <div className="d-flex justify-content-between align-items-center mb-4 header-section">
//             <div>
//               <h1 className="fw-bold d-flex align-items-center gap-2 mb-1">
//                 <BarChart3 size={28} className="text-primary" /> Admin Details
//               </h1>
//               <p className="text-muted mb-0">
//                 View and manage administrator profile
//               </p>
//             </div>
//             <div className="d-flex align-items-center gap-2">
//               <div className="stat-card mini">
//                 <div className="stat-value">{stats.tasksCompleted}</div>
//                 <div className="stat-label">Tasks</div>
//               </div>
//             </div>
//           </div>
//           <TableAdmin />
//           {/* Add the same CSS as in Analytics component */}
//           <style jsx>{`
// //             .analytics-dashboard {
// //               font-family: "Inter", "Segoe UI", sans-serif;
// //               background: #f8fafc;
// //             }

// //             .header-section {
// //               padding: 1rem 0;
// //               border-bottom: 1px solid #e2e8f0;
// //             }

// //             .stat-card {
// //               background: white;
// //               border: none;
// //               border-radius: 12px;
// //               padding: 1.5rem;
// //               box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
// //               transition: transform 0.2s, box-shadow 0.2s;
// //             }

// //             .stat-card:hover {
// //               transform: translateY(-2px);
// //               box-shadow: 0 8px 15px rgba(0, 0, 0, 0.06);
// //             }

// //             .stat-card.mini {
// //               padding: 0.75rem 1rem;
// //               text-align: center;
// //               width: 120px;
// //             }

// //             .stat-card.mini .stat-value {
// //               font-size: 1.5rem;
// //               font-weight: 700;
// //               margin-bottom: 0.25rem;
// //             }

// //             .stat-card.mini .stat-label {
// //               font-size: 0.75rem;
// //               color: #64748b;
// //             }

// //             .stat-value-sm {
// //               font-size: 1.25rem;
// //               font-weight: 700;
// //               color: #1e293b;
// //             }

// //             .stat-label-sm {
// //               font-size: 0.75rem;
// //               color: #64748b;
// //             }

// //             .stat-icon {
// //               width: 48px;
// //               height: 48px;
// //               border-radius: 12px;
// //               display: flex;
// //               align-items: center;
// //               justify-content: center;
// //             }

// //             .stat-value {
// //               font-size: 1.75rem;
// //               font-weight: 700;
// //               margin-bottom: 0.25rem;
// //               color: #1e293b;
// //             }

// //             .stat-label {
// //               font-size: 0.875rem;
// //               color: #64748b;
// //               margin-bottom: 0;
// //             }

// //             .stat-trend {
// //               font-size: 0.75rem;
// //               font-weight: 600;
// //               margin-top: 0.5rem;
// //               display: flex;
// //               align-items: center;
// //               gap: 0.25rem;
// //             }

// //             .stat-trend.positive {
// //               color: #10b981;
// //             }

// //             .stat-trend.negative {
// //               color: #ef4444;
// //             }

// //             .search-box {
// //               position: relative;
// //             }

// //             .search-icon {
// //               position: absolute;
// //               left: 12px;
// //               top: 50%;
// //               transform: translateY(-50%);
// //               color: #94a3b8;
// //               z-index: 10;
// //             }

// //             .search-input {
// //               padding-left: 40px;
// //               border-radius: 8px;
// //               border: 1px solid #cbd5e1;
// //             }

// //             .admin-card {
// //               transition: all 0.3s ease;
// //             }

// //             .admin-card:hover {
// //               box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
// //             }

// //             .admin-card.expanded {
// //               box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
// //             }

// //             .admin-avatar {
// //               width: 50px;
// //               height: 50px;
// //               font-size: 1.25rem;
// //               position: relative;
// //               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
// //             }

// //             .admin-badge {
// //               position: absolute;
// //               bottom: -2px;
// //               right: -2px;
// //               background: #f59e0b;
// //               color: white;
// //               width: 18px;
// //               height: 18px;
// //               border-radius: 50%;
// //               display: flex;
// //               align-items: center;
// //               justify-content: center;
// //               border: 2px solid white;
// //             }

// //             .admin-details {
// //               animation: fadeIn 0.3s ease;
// //             }

// //             .detail-title {
// //               font-size: 0.875rem;
// //               font-weight: 600;
// //               color: #475569;
// //               margin-bottom: 0.75rem;
// //             }

// //             .detail-item {
// //               display: flex;
// //               justify-content: space-between;
// //               margin-bottom: 0.5rem;
// //               font-size: 0.875rem;
// //             }

// //             .detail-label {
// //               color: #64748b;
// //               fontweight: 500;
// //             }

// //             .admin-name-link {
// //               cursor: pointer;
// //               transition: color 0.2s;
// //             }

// //             .admin-name-link:hover {
// //               color: #3b82f6;
// //             }

// //             @keyframes fadeIn {
// //               from {
// //                 opacity: 0;
// //               }
// //               to {
// //                 opacity: 1;
// //               }
// //             }

// //             @keyframes spin {
// //               from {
// //                 transform: rotate(0deg);
// //               }
// //               to {
// //                 transform: rotate(360deg);
// //               }
// //             }

// //             .spin {
// //               animation: spin 1s linear infinite;
// //             }

// //             .bg-primary-gradient {
// //               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
// //             }

// //             @media (max-width: 768px) {
// //               .stat-value {
// //                 font-size: 1.5rem;
// //               }

// //               .admin-avatar {
// //                 width: 40px;
// //                 height: 40px;
// //                 font-size: 1rem;
// //               }
// //             }
// //           `}</style>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDetails;
//TableAdmin.jsx
// import {
//   SquarePen,
//   Trash,
//   Loader,
//   FileWarning,
//   CheckCircle,
//   Edit,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { getEvaluationsByAgentNameApi } from "../features/evaluationApi";
// import { getEscalationsByAgentNameApi } from "../features/escalationsApi";
// import { useNavigate, useParams } from "react-router-dom";

// const CACHE_TTL = 1000; // 1 second cache time

// const TableAdmin = () => {
//   const { agentName } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("evaluations");
//   const [activeEscalationTab, setActiveEscalationTab] = useState("published");
//   const [activeEvaluationTab, setActiveEvaluationTab] = useState("published");
//   const [evaluations, setEvaluations] = useState([]);
//   const [escalations, setEscalations] = useState([]);
//   const [marketing, setMarketing] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [hoveredRow, setHoveredRow] = useState(null);

//   const isEvaluationComplete = (evaluation) => {
//     const requiredFields = [
//       "useremail",
//       "leadID",
//       "agentName",
//       "mod",
//       "teamleader",
//       "greetings",
//       "accuracy",
//       "building",
//       "presenting",
//       "closing",
//       "bonus",
//       "evaluationSummary",
//     ];
//     return requiredFields.every(
//       (field) => evaluation[field] && evaluation[field].toString().trim() !== ""
//     );
//   };

//   const publishedEvaluations = evaluations.filter(
//     (ev) => ev.status === "published" || isEvaluationComplete(ev)
//   );
//   const draftEvaluations = evaluations.filter(
//     (ev) => ev.status === "draft" || !isEvaluationComplete(ev)
//   );

//   // Function to check if escalation is complete
//   const isEscalationComplete = (escalation) => {
//     const requiredFields = [
//       "useremail",
//       "leadID",
//       "evaluatedby",
//       "agentName",
//       "teamleader",
//       "leadsource",
//       "leadStatus",
//       "escSeverity",
//       "issueIden",
//       "escAction",
//       "documentation",
//       "successmaration",
//       "userrating",
//     ];

//     return requiredFields.every(
//       (field) => escalation[field] && escalation[field].toString().trim() !== ""
//     );
//   };

//   // Filter escalations based on completion status
//   const publishedEscalations = escalations.filter(
//     (esc) => esc.status === "published" || isEscalationComplete(esc)
//   );
//   const draftEscalations = escalations.filter(
//     (esc) => esc.status === "draft" || !isEscalationComplete(esc)
//   );

//   // Cache handling
//   const loadFromCache = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     const { data, timestamp } = JSON.parse(cached);
//     if (Date.now() - timestamp > CACHE_TTL) {
//       localStorage.removeItem(key);
//       return null;
//     }
//     return data;
//   };

//   const saveToCache = (key, data) => {
//     localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         if (activeTab === "evaluations") {
//           const cacheKey = `evaluations_${agentName}`;
//           const cached = loadFromCache(cacheKey);
//           if (cached) setEvaluations(cached);
//           else {
//             const evals = await getEvaluationsByAgentNameApi(agentName);
//             setEvaluations(evals);
//             saveToCache(cacheKey, evals);
//           }
//         } else if (activeTab === "escalations") {
//           const cacheKey = `escalations_${agentName}`;
//           const cached = loadFromCache(cacheKey);
//           if (cached) setEscalations(cached);
//           else {
//             const escs = await getEscalationsByAgentNameApi(agentName);
//             setEscalations(escs);
//             saveToCache(cacheKey, escs);
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [activeTab, agentName]);

//   const getCurrentEvaluations = () => {
//     const currentData =
//       activeEvaluationTab === "published"
//         ? publishedEvaluations
//         : draftEvaluations;
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return currentData.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   // Get current escalations based on active sub-tab
//   const getCurrentEscalations = () => {
//     const currentData =
//       activeEscalationTab === "published"
//         ? publishedEscalations
//         : draftEscalations;
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return currentData.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentEvaluations = getCurrentEvaluations();
//   const currentEscalations = getCurrentEscalations();

//   const getTotalPages = () => {
//     if (activeTab === "evaluations") {
//       const dataLengths =
//         activeEvaluationTab == "published"
//           ? publishedEvaluations.length
//           : draftEvaluations.length;
//       return Math.ceil(dataLengths / itemsPerPage);
//     }

//     if (activeTab === "escalations") {
//       const dataLength =
//         activeEscalationTab === "published"
//           ? publishedEscalations.length
//           : draftEscalations.length;
//       return Math.ceil(dataLength / itemsPerPage);
//     }
//     return Math.ceil(marketing.length / itemsPerPage);
//   };

//   const totalPages = getTotalPages();

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const formatDate = (dateString) =>
//     dateString ? new Date(dateString).toLocaleString() : "-";

//   const handleEdit = (id, rowData) => {
//     navigate(`/dashboard/qc-team/editescalation/${id}`, {
//       state: { row: rowData },
//     });
//   };
//   const handleEdits = (id, rowData) => {
//     navigate(`/dashboard/qc-team/editevaluation/${id}`, {
//       state: { row: rowData },
//     });
//   };

//   const containerStyle = {
//     backgroundColor: "#ffffff",
//     boxShadow:
//       "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//     borderRadius: "12px",
//     border: "1px solid #d1d5db",
//     padding: "32px",
//     width: "100%",
//     maxWidth: "100%",
//     margin: 0,
//     fontFamily: "system-ui, -apple-system, sans-serif",
//     overflowX: "hidden",
//   };

//   const tabContainerStyle = {
//     display: "flex",
//     gap: "32px",
//     borderBottom: "2px solid #e5e7eb",
//     marginBottom: "24px",
//     paddingBottom: "8px",
//   };

//   const subTabContainerStyle = {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "24px",
//     backgroundColor: "#f9fafb",
//     padding: "8px",
//     borderRadius: "8px",
//     border: "1px solid #e5e7eb",
//   };

//   const getTabStyle = (isActive) => ({
//     paddingBottom: "12px",
//     paddingLeft: "8px",
//     paddingRight: "8px",
//     fontSize: "16px",
//     fontWeight: "600",
//     borderBottom: isActive ? "3px solid #6b7280" : "3px solid transparent",
//     color: isActive ? "#374151" : "#6b7280",
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   });

//   const getSubTabStyle = (isActive) => ({
//     padding: "8px 16px",
//     fontSize: "14px",
//     fontWeight: "600",
//     borderRadius: "6px",
//     color: isActive ? "#ffffff" : "#374151",
//     backgroundColor: isActive ? "#6b7280" : "transparent",
//     border: "none",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   });

//   const getBadgeStyle = (isActive) => ({
//     display: "inline-flex",
//     alignItems: "center",
//     paddingLeft: "8px",
//     paddingRight: "8px",
//     paddingTop: "4px",
//     paddingBottom: "4px",
//     borderRadius: "9999px",
//     fontSize: "12px",
//     fontWeight: "500",
//     backgroundColor: isActive ? "#6b7280" : "#e5e7eb",
//     color: isActive ? "#ffffff" : "#374151",
//   });

//   const getStatusBadgeStyle = (status) => ({
//     display: "inline-flex",
//     alignItems: "center",
//     paddingLeft: "8px",
//     paddingRight: "8px",
//     paddingTop: "2px",
//     paddingBottom: "2px",
//     borderRadius: "12px",
//     fontSize: "11px",
//     fontWeight: "600",
//     backgroundColor: status === "published" ? "#dcfce7" : "#fef3c7",
//     color: status === "published" ? "#166534" : "#92400e",
//   });

//   // Scrollable container style with internal horizontal scrollbar
//   const scrollableContainerStyle = {
//     overflowX: "auto",
//     borderRadius: "8px",
//     border: "1px solid #d1d5db",
//     boxShadow:
//       "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//     width: "100%",
//     maxWidth: "900px",
//     margin: "0 auto",
//   };

//   const tableStyle = {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "1600px",
//   };

//   const headerStyle = {
//     backgroundColor: "#4b5563",
//     color: "#ffffff",
//   };

//   const headerCellStyle = {
//     padding: "16px",
//     textAlign: "left",
//     fontSize: "14px",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: "0.05em",
//     borderRight: "1px solid #6b7280",
//   };

//   const columnWidths = {
//     index: 60,
//     status: 120,
//     email: 220,
//     leadId: 140,
//     evaluatedBy: 160,
//     agentName: 160,
//     teamLeader: 160,
//     leadSource: 160,
//     leadStatus: 160,
//     escSeverity: 160,
//     issueIden: 200,
//     escAction: 200,
//     documentation: 200,
//     successmaration: 200,
//     userrating: 120,
//     createdAt: 180,
//     edit: 100,
//     delete: 100,
//     mod: 120,
//     greetings: 140,
//     accuracy: 120,
//     building: 120,
//     presenting: 120,
//     closing: 120,
//     bonus: 120,
//     evaluationSummary: 220,
//     default: 160,
//   };

//   const getHeaderCellStyleFor = (key) => ({
//     ...headerCellStyle,
//     width: `${columnWidths[key] || columnWidths.default}px`,
//   });

//   const getBodyCellStyleFor = (key) => ({
//     ...cellStyle,
//     width: `${columnWidths[key] || columnWidths.default}px`,
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   });

//   const scrollHintStyle = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "8px",
//     color: "#6b7280",
//     fontSize: "12px",
//     marginTop: "6px",
//   };

//   const lastHeaderCellStyle = {
//     ...headerCellStyle,
//     borderRight: "none",
//   };

//   const getRowStyle = (isHovered) => ({
//     backgroundColor: isHovered ? "#f9fafb" : "#ffffff",
//     transition: "background-color 0.2s ease",
//     borderBottom: "1px solid #e5e7eb",
//   });

//   const cellStyle = {
//     padding: "16px",
//     borderRight: "1px solid #e5e7eb",
//     fontSize: "14px",
//     color: "#374151",
//   };

//   const lastCellStyle = {
//     ...cellStyle,
//     borderRight: "none",
//   };

//   const paginationContainerStyle = {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: "24px",
//   };

//   const paginationStyle = {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     border: "1px solid #d1d5db",
//     borderRadius: "6px",
//     boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//     overflow: "hidden",
//   };

//   const paginationButtonStyle = {
//     paddingLeft: "12px",
//     paddingRight: "12px",
//     paddingTop: "8px",
//     paddingBottom: "8px",
//     fontSize: "14px",
//     fontWeight: "500",
//     color: "#6b7280",
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//   };

//   const activePaginationButtonStyle = {
//     paddingLeft: "16px",
//     paddingRight: "16px",
//     paddingTop: "8px",
//     paddingBottom: "8px",
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#ffffff",
//     backgroundColor: "#6b7280",
//     border: "none",
//     cursor: "pointer",
//     transition: "background-color 0.2s ease",
//   };

//   const emptyStateStyle = {
//     textAlign: "center",
//     paddingTop: "48px",
//     paddingBottom: "48px",
//   };

//   const emptyTextStyle = {
//     color: "#6b7280",
//     fontSize: "16px",
//     fontWeight: "500",
//   };

//   const loadingStyle = {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "40px",
//   };

//   // Slider pagination styles and renderer
//   const sliderContainerStyle = {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "12px",
//     marginTop: "24px",
//   };

//   const sliderInputStyle = {
//     width: "260px",
//   };

//   const renderPageSlider = (pages) => {
//     if (pages <= 1) return null;
//     return (
//       <div style={sliderContainerStyle}>
//         <span style={{ color: "#6b7280", fontSize: "14px" }}>Page</span>
//         <input
//           type="range"
//           min={1}
//           max={pages}
//           value={currentPage}
//           onChange={(e) => setCurrentPage(Number(e.target.value))}
//           style={sliderInputStyle}
//         />
//         <span style={{ color: "#374151", fontSize: "14px", fontWeight: 600 }}>
//           {currentPage}
//         </span>
//         <span style={{ color: "#9ca3af", fontSize: "12px" }}>/ {pages}</span>
//       </div>
//     );
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={tabContainerStyle}>
//         {["evaluations", "escalations", "marketing"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => {
//               setActiveTab(tab);
//               setCurrentPage(1);
//             }}
//             style={getTabStyle(activeTab === tab)}
//             onMouseEnter={(e) => {
//               if (activeTab !== tab) {
//                 e.target.style.color = "#374151";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (activeTab !== tab) {
//                 e.target.style.color = "#6b7280";
//               }
//             }}
//           >
//             <span style={{ textTransform: "capitalize" }}>{tab}</span>
//             <span style={getBadgeStyle(activeTab === tab)}>
//               {tab === "evaluations"
//                 ? evaluations.length
//                 : tab === "escalations"
//                 ? escalations.length
//                 : marketing.length}
//             </span>
//           </button>
//         ))}
//       </div>

//       {error && (
//         <div
//           style={{
//             padding: "12px",
//             backgroundColor: "#fee2e2",
//             color: "#b91c1c",
//             borderRadius: "6px",
//             marginBottom: "16px",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <FileWarning size={16} />
//           {error}
//         </div>
//       )}

//       {/* Escalations Tab with Sub-tabs */}
//       {activeTab === "escalations" && (
//         <div>
//           <div style={subTabContainerStyle}>
//             <button
//               onClick={() => {
//                 setActiveEscalationTab("published");
//                 setCurrentPage(1);
//               }}
//               style={getSubTabStyle(activeEscalationTab === "published")}
//             >
//               <CheckCircle size={16} />
//               Published
//               <span
//                 style={{
//                   ...getBadgeStyle(activeEscalationTab === "published"),
//                   backgroundColor:
//                     activeEscalationTab === "published" ? "#10b981" : "#e5e7eb",
//                   color:
//                     activeEscalationTab === "published" ? "#ffffff" : "#374151",
//                 }}
//               >
//                 {publishedEscalations.length}
//               </span>
//             </button>
//             <button
//               onClick={() => {
//                 setActiveEscalationTab("draft");
//                 setCurrentPage(1);
//               }}
//               style={getSubTabStyle(activeEscalationTab === "draft")}
//             >
//               <Edit size={16} />
//               Drafts
//               <span
//                 style={{
//                   ...getBadgeStyle(activeEscalationTab === "draft"),
//                   backgroundColor:
//                     activeEscalationTab === "draft" ? "#f59e0b" : "#e5e7eb",
//                   color:
//                     activeEscalationTab === "draft" ? "#ffffff" : "#374151",
//                 }}
//               >
//                 {draftEscalations.length}
//               </span>
//             </button>
//           </div>

//           {loading ? (
//             <div style={loadingStyle}>
//               <Loader size={32} className="animate-spin" />
//             </div>
//           ) : (
//             <>
//               <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
//                 <div style={scrollableContainerStyle}>
//                   <table style={tableStyle}>
//                     <thead style={headerStyle}>
//                       <tr>
//                         <th style={getHeaderCellStyleFor("index")}>#</th>
//                         <th style={getHeaderCellStyleFor("status")}>Status</th>
//                         <th style={getHeaderCellStyleFor("email")}>Email</th>
//                         <th style={getHeaderCellStyleFor("leadId")}>Lead ID</th>
//                         <th style={getHeaderCellStyleFor("evaluatedBy")}>
//                           Evaluated By
//                         </th>
//                         <th style={getHeaderCellStyleFor("agentName")}>
//                           Agent Name
//                         </th>
//                         <th style={getHeaderCellStyleFor("teamLeader")}>
//                           Team Leader
//                         </th>
//                         <th style={getHeaderCellStyleFor("leadSource")}>
//                           Lead Source
//                         </th>
//                         <th style={getHeaderCellStyleFor("leadStatus")}>
//                           Lead Status
//                         </th>
//                         <th style={getHeaderCellStyleFor("escSeverity")}>
//                           Esc Severity
//                         </th>
//                         <th style={getHeaderCellStyleFor("issueIden")}>
//                           Issue Identified
//                         </th>
//                         <th style={getHeaderCellStyleFor("escAction")}>
//                           Escalation Action
//                         </th>
//                         <th style={getHeaderCellStyleFor("documentation")}>
//                           Documentation
//                         </th>
//                         <th style={getHeaderCellStyleFor("successmaration")}>
//                           Success Metrics
//                         </th>
//                         <th style={getHeaderCellStyleFor("userrating")}>
//                           User Rating
//                         </th>
//                         <th style={getHeaderCellStyleFor("createdAt")}>
//                           Created At
//                         </th>
//                         <th style={getHeaderCellStyleFor("edit")}>Edit</th>
//                         <th style={getHeaderCellStyleFor("delete")}>Delete</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentEscalations.length > 0 ? (
//                         currentEscalations.map((row, index) => {
//                           const isComplete = isEscalationComplete(row);
//                           const status =
//                             row.status || (isComplete ? "published" : "draft");
//                           return (
//                             <tr
//                               key={row._id || index}
//                               style={getRowStyle(hoveredRow === index)}
//                               onMouseEnter={() => setHoveredRow(index)}
//                               onMouseLeave={() => setHoveredRow(null)}
//                             >
//                               <td style={getBodyCellStyleFor("index")}>
//                                 {indexOfFirstItem + index + 1}
//                               </td>
//                               <td style={getBodyCellStyleFor("status")}>
//                                 <span style={getStatusBadgeStyle(status)}>
//                                   {status === "published"
//                                     ? "✓ Published"
//                                     : "⚠ Draft"}
//                                 </span>
//                               </td>
//                               <td style={getBodyCellStyleFor("email")}>
//                                 {row.useremail || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("leadId")}>
//                                 {row.leadID || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("evaluatedBy")}>
//                                 {row.evaluatedby || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("agentName")}>
//                                 {row.agentName || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("teamLeader")}>
//                                 {row.teamleader || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("leadSource")}>
//                                 {row.leadsource || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("leadStatus")}>
//                                 {row.leadStatus || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("escSeverity")}>
//                                 {row.escSeverity || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("issueIden")}>
//                                 {row.issueIden ? (
//                                   <div
//                                     style={{
//                                       maxWidth: "150px",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                     title={row.issueIden}
//                                   >
//                                     {row.issueIden}
//                                   </div>
//                                 ) : (
//                                   "-"
//                                 )}
//                               </td>
//                               <td style={getBodyCellStyleFor("escAction")}>
//                                 {row.escAction ? (
//                                   <div
//                                     style={{
//                                       maxWidth: "150px",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                     title={row.escAction}
//                                   >
//                                     {row.escAction}
//                                   </div>
//                                 ) : (
//                                   "-"
//                                 )}
//                               </td>
//                               <td style={getBodyCellStyleFor("documentation")}>
//                                 {row.documentation ? (
//                                   <div
//                                     style={{
//                                       maxWidth: "150px",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                     title={row.documentation}
//                                   >
//                                     {row.documentation}
//                                   </div>
//                                 ) : (
//                                   "-"
//                                 )}
//                               </td>
//                               <td
//                                 style={getBodyCellStyleFor("successmaration")}
//                               >
//                                 {row.successmaration ? (
//                                   <div
//                                     style={{
//                                       maxWidth: "150px",
//                                       overflow: "hidden",
//                                       textOverflow: "ellipsis",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                     title={row.successmaration}
//                                   >
//                                     {row.successmaration}
//                                   </div>
//                                 ) : (
//                                   "-"
//                                 )}
//                               </td>
//                               <td style={getBodyCellStyleFor("userrating")}>
//                                 {row.userrating || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("createdAt")}>
//                                 {formatDate(row.createdAt)}
//                               </td>
//                               <td style={getBodyCellStyleFor("edit")}>
//                                 <button
//                                   onClick={() => handleEdit(row._id, row)}
//                                   style={{
//                                     border: "none",
//                                     background: "none",
//                                     cursor: "pointer",
//                                     color:
//                                       status === "draft"
//                                         ? "#f59e0b"
//                                         : "#6b7280",
//                                   }}
//                                   title={
//                                     status === "draft"
//                                       ? "Complete and publish"
//                                       : "Edit"
//                                   }
//                                 >
//                                   <SquarePen size={18} />
//                                 </button>
//                               </td>
//                               <td style={getBodyCellStyleFor("delete")}>
//                                 <button
//                                   style={{
//                                     border: "none",
//                                     background: "none",
//                                     cursor: "pointer",
//                                     color: "#ef4444",
//                                   }}
//                                 >
//                                   <Trash size={18} />
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan="18"
//                             style={{ ...cellStyle, textAlign: "center" }}
//                           >
//                             {activeEscalationTab === "published"
//                               ? "No published escalations found"
//                               : "No draft escalations found"}
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               <div style={scrollHintStyle}>↔ Scroll to see more columns</div>
//               {/* Pagination (Slider) */}
//               {renderPageSlider(totalPages)}
//             </>
//           )}
//         </div>
//       )}

//       {/* Evaluations Tab */}
//       {activeTab === "evaluations" && (
//         <div>
//           <div style={subTabContainerStyle}>
//             <button
//               onClick={() => {
//                 setActiveEvaluationTab("published"); // ✅ Correct
//                 setCurrentPage(1);
//               }}
//               style={getSubTabStyle(activeEvaluationTab === "published")} // ✅ Correct
//             >
//               <CheckCircle size={16} />
//               Published
//               <span
//                 style={{
//                   ...getBadgeStyle(activeEvaluationTab === "published"),
//                   backgroundColor:
//                     activeEvaluationTab === "published" ? "#10b981" : "#e5e7eb",
//                   color:
//                     activeEvaluationTab === "published" ? "#ffffff" : "#374151",
//                 }}
//               >
//                 {publishedEvaluations.length} // ✅ Correct data
//               </span>
//             </button>
//             <button
//               onClick={() => {
//                 setActiveEvaluationTab("draft"); // ✅ Correct
//                 setCurrentPage(1);
//               }}
//               style={getSubTabStyle(activeEvaluationTab === "draft")} // ✅ Correct
//             >
//               <Edit size={16} />
//               Drafts
//               <span
//                 style={{
//                   ...getBadgeStyle(activeEvaluationTab === "draft"),
//                   backgroundColor:
//                     activeEvaluationTab === "draft" ? "#f59e0b" : "#e5e7eb",
//                   color:
//                     activeEvaluationTab === "draft" ? "#ffffff" : "#374151",
//                 }}
//               >
//                 {draftEvaluations.length} // ✅ Correct data
//               </span>
//             </button>
//           </div>
//           {loading ? (
//             <div style={loadingStyle}>
//               <Loader size={32} className="animate-spin" />
//             </div>
//           ) : (
//             <>
//               <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
//                 <div style={scrollableContainerStyle}>
//                   <table style={tableStyle}>
//                     <thead style={headerStyle}>
//                       <tr>
//                         <th style={getHeaderCellStyleFor("index")}>#</th>
//                         <th style={getHeaderCellStyleFor("status")}>Status</th>
//                         <th style={getHeaderCellStyleFor("email")}>Email</th>
//                         <th style={getHeaderCellStyleFor("leadId")}>Lead ID</th>
//                         <th style={getHeaderCellStyleFor("agentName")}>
//                           Agent Name
//                         </th>
//                         <th style={getHeaderCellStyleFor("mod")}>MOD</th>
//                         <th style={getHeaderCellStyleFor("teamLeader")}>
//                           Team Leader
//                         </th>
//                         <th style={getHeaderCellStyleFor("greetings")}>
//                           Greetings
//                         </th>
//                         <th style={getHeaderCellStyleFor("accuracy")}>
//                           Accuracy
//                         </th>
//                         <th style={getHeaderCellStyleFor("building")}>
//                           Building
//                         </th>
//                         <th style={getHeaderCellStyleFor("presenting")}>
//                           Presenting
//                         </th>
//                         <th style={getHeaderCellStyleFor("closing")}>
//                           Closing
//                         </th>
//                         <th style={getHeaderCellStyleFor("bonus")}>Bonus</th>
//                         <th style={getHeaderCellStyleFor("evaluationSummary")}>
//                           Evaluation Summary
//                         </th>
//                         <th style={getHeaderCellStyleFor("createdAt")}>
//                           Created At
//                         </th>
//                         <th style={getHeaderCellStyleFor("edit")}>Edit</th>
//                         <th style={getHeaderCellStyleFor("delete")}>Delete</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentEvaluations.length > 0 ? (
//                         currentEvaluations.map((row, index) => {
//                           const isComplete = isEvaluationComplete(row);
//                           const status =
//                             row.status || (isComplete ? "published" : "draft");
//                           return (
//                             <tr
//                               key={row._id || index}
//                               style={getRowStyle(hoveredRow === index)}
//                               onMouseEnter={() => setHoveredRow(index)}
//                               onMouseLeave={() => setHoveredRow(null)}
//                             >
//                               <td style={getBodyCellStyleFor("index")}>
//                                 {indexOfFirstItem + index + 1}
//                               </td>
//                               <td style={getBodyCellStyleFor("status")}>
//                                 <span style={getStatusBadgeStyle(status)}>
//                                   {status === "published"
//                                     ? "✓ Published"
//                                     : "⚠ Draft"}
//                                 </span>
//                               </td>
//                               <td style={getBodyCellStyleFor("email")}>
//                                 {row.useremail || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("leadId")}>
//                                 {row.leadID || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("agentName")}>
//                                 {row.agentName || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("mod")}>
//                                 {row.mod || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("teamLeader")}>
//                                 {row.teamleader || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("greetings")}>
//                                 {row.greetings || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("accuracy")}>
//                                 {row.accuracy || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("building")}>
//                                 {row.building || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("presenting")}>
//                                 {row.presenting || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("closing")}>
//                                 {row.closing || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("bonus")}>
//                                 {row.bonus || "-"}
//                               </td>
//                               <td
//                                 style={getBodyCellStyleFor("evaluationSummary")}
//                               >
//                                 {row.evaluationsummary || "-"}
//                               </td>
//                               <td style={getBodyCellStyleFor("createdAt")}>
//                                 {formatDate(row.createdAt)}
//                               </td>
//                               <td style={getBodyCellStyleFor("edit")}>
//                                 <button
//                                   style={{
//                                     border: "none",
//                                     background: "none",
//                                     cursor: "pointer",
//                                   }}
//                                 >
//                                   <SquarePen
//                                     onClick={() => handleEdits(row._id, row)}
//                                     size={18}
//                                   />
//                                 </button>
//                               </td>
//                               <td style={getBodyCellStyleFor("delete")}>
//                                 <button
//                                   style={{
//                                     border: "none",
//                                     background: "none",
//                                     cursor: "pointer",
//                                     color: "#ef4444",
//                                   }}
//                                 >
//                                   <Trash size={18} />
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan="17"
//                             style={{ ...cellStyle, textAlign: "center" }}
//                           >
//                             No evaluations found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               <div style={scrollHintStyle}>↔ Scroll to see more columns</div>
//               {/* Pagination (Slider) */}
//               {renderPageSlider(totalPages)}
//             </>
//           )}
//         </div>
//       )}

//       {/* Marketing Tab */}
//       {activeTab === "marketing" && (
//         <div>
//           {marketing.length > 0 ? (
//             <p style={{ color: "#374151", fontSize: "16px" }}>
//               Marketing records go here.
//             </p>
//           ) : (
//             <div style={emptyStateStyle}>
//               <p style={emptyTextStyle}>No marketing records available.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TableAdmin;
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ArrowLeft,
  User,
  Shield,
  Mail,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import { getProfileApi, getallusersApi } from "../features/userApis";
import TableAdmin from "./TableAdmin";

const AdminDetails = () => {
  const { agentName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  // Try to get email from navigation state first
  const [adminEmail, setAdminEmail] = useState(location.state?.email || null);

  const adminName = agentName || "Admin User";

  useEffect(() => {
    // 1. Fetch current user profile (viewer context)
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();

    // 2. If email is missing (e.g. page refresh), try to find it via API matching the agentName in URL
    if (!adminEmail && agentName) {
      const findUserEmail = async () => {
        try {
          const res = await getallusersApi();
          if (res.data && res.data.data) {
            const users = Array.isArray(res.data.data) ? res.data.data : [];
            const foundUser = users.find((u) => u.name === agentName);
            if (foundUser && foundUser.email) {
              setAdminEmail(foundUser.email);
            }
          }
        } catch (err) {
          console.error("Could not find user email by name", err);
        }
      };
      findUserEmail();
    }
  }, [adminEmail, agentName]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation Back */}
        <button
          onClick={() => navigate("/dashboard/qc-team")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Overview
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {adminName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Administrator
                  </span>
                  {adminEmail && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {adminEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  Role
                </div>
                <div className="font-semibold text-slate-700">QC Admin</div>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  Status
                </div>
                <div className="font-semibold text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
          {/* Header inside table container */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Performance & Evaluations
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage evaluations, escalations, and marketing records.
              </p>
            </div>
          </div>

          <div className="p-0">
            {/* Pass the email explicitly so table can fetch records BY this user (submitter) */}
            <TableAdmin adminEmail={adminEmail} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;

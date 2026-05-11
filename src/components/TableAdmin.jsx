// // TableAdmin.jsx
// import {
//   SquarePen,
//   Trash,
//   Loader,
//   FileWarning,
//   CheckCircle,
//   Edit,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import {
//   getEvaluationsByUserEmailApi,
//   getEvaluationsUseremailPublishedApi,
//   publishEvaluationApi,
//   deleteEvaluationApi,
// } from "../features/evaluationApi";
// import {
//   getEscalationsByUserEmailApi,
//   getEscalationsUseremailPublishedApi,
//   publishEscalationApi,
//   deleteEscalationApi,
// } from "../features/escalationsApi";
// import { getMarketingApi, deleteMarketingApi } from "../features/marketingApi";
// import { useNavigate, useParams } from "react-router-dom";

// const CACHE_TTL = 1000;

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
//   const [dataVersion, setDataVersion] = useState(0); // Force refresh trigger

//   const getCurrentUserEmail = () => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       return user.email || user.useremail || "Unknown";
//     }

//     if (agentName) {
//       return agentName;
//     }

//     return "Unknown";
//   };

//   const currentUserEmail = getCurrentUserEmail();

//   // Filter evaluations for current user only
//   const userEvaluations = evaluations.filter(
//     (ev) =>
//       ev.useremail === currentUserEmail || ev.agentName === currentUserEmail
//   );

//   // Filter evaluations based on source - Bitrix goes to drafts, Frontend goes to published
//   const publishedEvaluations = userEvaluations.filter(
//     (ev) => ev.submissionSource === "frontend"
//   );
//   const draftEvaluations = userEvaluations.filter(
//     (ev) => ev.submissionSource === "bitrix" || !ev.submissionSource
//   );

//   // Filter escalations for current user only
//   const userEscalations = escalations.filter(
//     (esc) =>
//       esc.useremail === currentUserEmail || esc.agentName === currentUserEmail
//   );

//   // Filter escalations based on source - Bitrix goes to drafts, Frontend goes to published
//   const publishedEscalations = userEscalations.filter(
//     (esc) => esc.submissionSource === "frontend"
//   );
//   const draftEscalations = userEscalations.filter(
//     (esc) => esc.submissionSource === "bitrix" || !esc.submissionSource
//   );

//   // Cache handling with clear function
//   const clearCache = (pattern) => {
//     const keys = Object.keys(localStorage);
//     keys.forEach((key) => {
//       if (key.includes(pattern)) {
//         localStorage.removeItem(key);
//       }
//     });
//   };

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
//           if (activeEvaluationTab === "published") {
//             const cacheKey = `published_evaluations_${currentUserEmail}`;
//             const cached = loadFromCache(cacheKey);
//             if (cached && dataVersion === 0) {
//               setEvaluations(cached);
//               setLoading(false);
//             } else {
//               let evals = [];
//               try {
//                 evals = await getEvaluationsUseremailPublishedApi(
//                   currentUserEmail
//                 );
//               } catch (_) {
//                 evals = [];
//               }
//               if (!Array.isArray(evals) || evals.length === 0) {
//                 // Fallback: fetch all by email and filter client-side
//                 const allByEmail = await getEvaluationsByUserEmailApi(
//                   currentUserEmail
//                 );
//                 evals = (allByEmail || []).filter(
//                   (r) =>
//                     r?.status === "published" ||
//                     r?.submissionSource === "frontend"
//                 );
//               }
//               console.log("Published evaluations fetched:", evals);
//               setEvaluations(Array.isArray(evals) ? evals : []);
//               saveToCache(cacheKey, evals);
//             }
//           } else {
//             const cacheKey = `draft_evaluations_${currentUserEmail}`;
//             const cached = loadFromCache(cacheKey);
//             if (cached && dataVersion === 0) {
//               setEvaluations(cached);
//               setLoading(false);
//             } else {
//               const evals = await getEvaluationsByUserEmailApi(
//                 currentUserEmail
//               );
//               console.log("Draft evaluations fetched:", evals);
//               setEvaluations(Array.isArray(evals) ? evals : []);
//               saveToCache(cacheKey, evals);
//             }
//           }
//         } else if (activeTab === "escalations") {
//           if (activeEscalationTab === "published") {
//             const cacheKey = `published_escalations_${currentUserEmail}`;
//             const cached = loadFromCache(cacheKey);
//             if (cached && dataVersion === 0) {
//               setEscalations(cached);
//               setLoading(false);
//             } else {
//               const escs = await getEscalationsUseremailPublishedApi(
//                 currentUserEmail
//               );
//               console.log("Published escalations fetched:", escs);
//               setEscalations(Array.isArray(escs) ? escs : []);
//               saveToCache(cacheKey, escs);
//             }
//           } else {
//             const cacheKey = `draft_escalations_${currentUserEmail}`;
//             const cached = loadFromCache(cacheKey);
//             if (cached && dataVersion === 0) {
//               setEscalations(cached);
//               setLoading(false);
//             } else {
//               const escs = await getEscalationsByUserEmailApi(currentUserEmail);
//               console.log("Draft escalations fetched:", escs);
//               setEscalations(Array.isArray(escs) ? escs : []);
//               saveToCache(cacheKey, escs);
//             }
//           }
//         } else if (activeTab === "marketing") {
//           const cacheKey = `marketing_${currentUserEmail}`;
//           const cached = loadFromCache(cacheKey);
//           if (cached && dataVersion === 0) {
//             setMarketing(cached);
//             setLoading(false);
//           } else {
//             const marketingData = await getMarketingApi();
//             console.log("Marketing data fetched:", marketingData);
//             setMarketing(Array.isArray(marketingData) ? marketingData : []);
//             saveToCache(cacheKey, marketingData);
//           }
//         }
//       } catch (err) {
//         console.error("Fetch data error:", err);
//         setError("Failed to fetch data. Please try again.");
//         // Set empty array on error to prevent undefined issues
//         if (activeTab === "evaluations") {
//           setEvaluations([]);
//         } else if (activeTab === "escalations") {
//           setEscalations([]);
//         } else if (activeTab === "marketing") {
//           setMarketing([]);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUserEmail && currentUserEmail !== "Unknown") {
//       fetchData();
//     }
//   }, [
//     activeTab,
//     activeEscalationTab,
//     activeEvaluationTab,
//     currentUserEmail,
//     dataVersion,
//   ]);

//   const getCurrentEvaluations = () => {
//     const currentData =
//       activeEvaluationTab === "published"
//         ? publishedEvaluations
//         : draftEvaluations;
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return currentData.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const getCurrentEscalations = () => {
//     const currentData =
//       activeEscalationTab === "published"
//         ? publishedEscalations
//         : draftEscalations;
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return currentData.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentEvaluations = getCurrentEvaluations();
//   const currentEscalations = getCurrentEscalations();

//   const getTotalPages = () => {
//     if (activeTab === "evaluations") {
//       const dataLength =
//         activeEvaluationTab === "published"
//           ? publishedEvaluations.length
//           : draftEvaluations.length;
//       return Math.ceil(dataLength / itemsPerPage);
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

//   // Navigation handlers
//   const handleEditEscalation = (id, rowData) => {
//     navigate(`/dashboard/qc-team/editescalation/${id}`, {
//       state: { row: rowData },
//     });
//   };

//   const handleEditEvaluation = (id, rowData) => {
//     navigate(`/dashboard/qc-team/editevaluation/${id}`, {
//       state: { row: rowData },
//     });
//   };

//   // Double click handlers
//   const handleRowDoubleClick = (row, type) => {
//     if (type === "escalation") {
//       handleEditEscalation(row._id, row);
//     } else if (type === "evaluation") {
//       handleEditEvaluation(row._id, row);
//     }
//   };

//   // Publish handlers with proper cache clearing
//   const handlePublishEscalation = async (id) => {
//     try {
//       setLoading(true);
//       await publishEscalationApi(id);

//       // Clear all escalation caches
//       clearCache(`escalations_${currentUserEmail}`);

//       // Fetch fresh data for both tabs
//       const [publishedEscs, draftEscs] = await Promise.all([
//         getEscalationsUseremailPublishedApi(currentUserEmail),
//         getEscalationsByUserEmailApi(currentUserEmail),
//       ]);

//       // Update caches
//       saveToCache(`published_escalations_${currentUserEmail}`, publishedEscs);
//       saveToCache(`draft_escalations_${currentUserEmail}`, draftEscs);

//       // Update state based on current tab
//       if (activeEscalationTab === "published") {
//         setEscalations(publishedEscs);
//       } else {
//         setEscalations(draftEscs);
//       }

//       // Switch to published tab and reset page
//       setActiveEscalationTab("published");
//       setCurrentPage(1);

//       // Force a refresh
//       setDataVersion((prev) => prev + 1);
//     } catch (error) {
//       console.error("Failed to publish escalation:", error);
//       setError("Failed to publish escalation. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePublishEvaluation = async (id) => {
//     try {
//       setLoading(true);
//       await publishEvaluationApi(id);

//       // Clear all evaluation caches
//       clearCache(`evaluations_${currentUserEmail}`);

//       // Fetch fresh data for both tabs
//       const [publishedEvals, draftEvals] = await Promise.all([
//         getEvaluationsUseremailPublishedApi(currentUserEmail),
//         getEvaluationsByUserEmailApi(currentUserEmail),
//       ]);

//       // Update caches
//       saveToCache(`published_evaluations_${currentUserEmail}`, publishedEvals);
//       saveToCache(`draft_evaluations_${currentUserEmail}`, draftEvals);

//       // Update state based on current tab
//       if (activeEvaluationTab === "published") {
//         setEvaluations(publishedEvals);
//       } else {
//         setEvaluations(draftEvals);
//       }

//       // Switch to published tab and reset page
//       setActiveEvaluationTab("published");
//       setCurrentPage(1);

//       // Force a refresh
//       setDataVersion((prev) => prev + 1);
//     } catch (error) {
//       console.error("Failed to publish evaluation:", error);
//       setError("Failed to publish evaluation. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete handlers
//   const handleDeleteEscalation = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this escalation?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await deleteEscalationApi(id);

//       // Clear all escalation caches
//       clearCache(`escalations_${currentUserEmail}`);

//       // Fetch fresh data for both tabs
//       const [publishedEscs, draftEscs] = await Promise.all([
//         getEscalationsUseremailPublishedApi(currentUserEmail),
//         getEscalationsByUserEmailApi(currentUserEmail),
//       ]);

//       // Update caches
//       saveToCache(`published_escalations_${currentUserEmail}`, publishedEscs);
//       saveToCache(`draft_escalations_${currentUserEmail}`, draftEscs);

//       // Update state based on current tab
//       if (activeEscalationTab === "published") {
//         setEscalations(publishedEscs);
//       } else {
//         setEscalations(draftEscs);
//       }

//       // Force a refresh
//       setDataVersion((prev) => prev + 1);
//     } catch (error) {
//       console.error("Failed to delete escalation:", error);
//       setError("Failed to delete escalation. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteEvaluation = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this evaluation?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await deleteEvaluationApi(id);

//       // Clear all evaluation caches
//       clearCache(`evaluations_${currentUserEmail}`);

//       // Fetch fresh data for both tabs
//       const [publishedEvals, draftEvals] = await Promise.all([
//         getEvaluationsUseremailPublishedApi(currentUserEmail),
//         getEvaluationsByUserEmailApi(currentUserEmail),
//       ]);

//       // Update caches
//       saveToCache(`published_evaluations_${currentUserEmail}`, publishedEvals);
//       saveToCache(`draft_evaluations_${currentUserEmail}`, draftEvals);

//       // Update state based on current tab
//       if (activeEvaluationTab === "published") {
//         setEvaluations(publishedEvals);
//       } else {
//         setEvaluations(draftEvals);
//       }

//       // Force a refresh
//       setDataVersion((prev) => prev + 1);
//     } catch (error) {
//       console.error("Failed to delete evaluation:", error);
//       setError("Failed to delete evaluation. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteMarketing = async (id) => {
//     if (
//       !window.confirm("Are you sure you want to delete this marketing entry?")
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await deleteMarketingApi(id);

//       // Clear marketing cache
//       clearCache(`marketing_${currentUserEmail}`);

//       // Fetch fresh data
//       const marketingData = await getMarketingApi();
//       setMarketing(Array.isArray(marketingData) ? marketingData : []);

//       // Force a refresh
//       setDataVersion((prev) => prev + 1);
//     } catch (error) {
//       console.error("Failed to delete marketing entry:", error);
//       setError("Failed to delete marketing entry. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const columnWidths = {
//     index: { width: "50px", minWidth: "50px" },
//     source: { width: "85px", minWidth: "85px" },
//     publish: { width: "80px", minWidth: "80px" },
//     email: { width: "200px", minWidth: "150px" },
//     leadId: { width: "120px", minWidth: "100px" },
//     agentName: { width: "150px", minWidth: "120px" },
//     teamLeader: { width: "140px", minWidth: "120px" },
//     status: { width: "120px", minWidth: "100px" },
//     rating: { width: "100px", minWidth: "90px" },
//     date: { width: "150px", minWidth: "130px" },
//     actions: { width: "70px", minWidth: "60px" },
//     shortField: { width: "100px", minWidth: "90px" },
//     mediumField: { width: "130px", minWidth: "110px" },
//     longField: { width: "180px", minWidth: "150px" },
//   };
//   // Add source badge style
//   const getSourceBadgeStyle = (source) => ({
//     display: "inline-flex",
//     alignItems: "center",
//     paddingLeft: "6px",
//     paddingRight: "6px",
//     paddingTop: "2px",
//     paddingBottom: "2px",
//     borderRadius: "6px",
//     fontSize: "9px",
//     fontWeight: "600",
//     backgroundColor: source === "frontend" ? "#dbeafe" : "#f3e8ff",
//     color: source === "frontend" ? "#1e40af" : "#7e22ce",
//     whiteSpace: "nowrap",
//   });

//   const containerStyle = {
//     backgroundColor: "#ffffff",
//     boxShadow:
//       "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//     borderRadius: "12px",
//     border: "1px solid #d1d5db",
//     padding: "24px", // Reduced from 32px
//     maxWidth: "100%",
//     fontFamily: "system-ui, -apple-system, sans-serif",
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
//     // avoid border shorthand to prevent React warning with borderBottom updates
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
//     // avoid border shorthand
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

//   // Safely render any field (handles primitives and nested objects)
//   const getFieldText = (field) => {
//     if (field === null || field === undefined) return "-";
//     if (typeof field === "object") {
//       const maybe = field?.value ?? field?.text ?? field?.name ?? field?.label;
//       if (
//         maybe !== undefined &&
//         maybe !== null &&
//         String(maybe).trim() !== ""
//       ) {
//         return String(maybe);
//       }
//       try {
//         return JSON.stringify(field);
//       } catch (_) {
//         return "-";
//       }
//     }
//     const str = String(field);
//     return str.trim() === "" ? "-" : str;
//   };

//   const scrollableContainerStyle = {
//     overflowX: "auto",
//     borderRadius: "8px",
//     border: "1px solid #d1d5db",
//     boxShadow:
//       "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//     width: "100%", // Changed from fixed width
//     maxWidth: "1400px", // Maximum width constraint
//     margin: "0 auto",
//   };

//   const tableStyle = {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "1200px", // Reduced from 1800px
//     tableLayout: "auto", // Changed from fixed
//   };

//   // Evaluation-only visuals (restore earlier look without touching APIs)
//   const evaluationScrollableContainerStyle = {
//     ...scrollableContainerStyle,
//     maxWidth: "1300px", // Reduced from 1200px
//   };
//   const evaluationTableStyle = {
//     ...tableStyle,
//     minWidth: "1400px",
//   };
//   const escalationTableStyle = {
//     ...tableStyle,
//     minWidth: "1300px",
//   };

//   const headerStyle = {
//     backgroundColor: "#4b5563",
//     color: "#ffffff",
//   };

//   const headerCellStyle = {
//     padding: "12px 8px",
//     textAlign: "left",
//     fontSize: "12px",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: "0.05em",
//     borderRight: "1px solid #6b7280",
//     backgroundColor: "#4b5563",
//     color: "#ffffff",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   };

//   const lastHeaderCellStyle = {
//     ...headerCellStyle,
//     borderRight: "none",
//   };

//   const getRowStyle = (isHovered) => ({
//     backgroundColor: isHovered ? "#f9fafb" : "#ffffff",
//     transition: "background-color 0.2s ease",
//     borderBottom: "1px solid #e5e7eb",
//     cursor: "pointer",
//   });

//   const cellStyle = {
//     padding: "12px 8px", // Reduced padding
//     borderRight: "1px solid #e5e7eb",
//     fontSize: "13px", // Slightly smaller font
//     color: "#374151",
//     maxWidth: "180px", // Prevent excessive width
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
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
//                 ? userEvaluations.length
//                 : tab === "escalations"
//                 ? userEscalations.length
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

//       {/* Escalations Tab */}
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
//               <div style={evaluationScrollableContainerStyle}>
//                 <table style={evaluationTableStyle}>
//                   <thead style={headerStyle}>
//                     <tr>
//                       <th style={headerCellStyle}>#</th>
//                       <th style={headerCellStyle}>Source</th>
//                       <th style={headerCellStyle}>Publish</th>
//                       <th style={headerCellStyle}>Email</th>
//                       <th style={headerCellStyle}>Lead ID</th>
//                       <th style={headerCellStyle}>Evaluated By</th>
//                       <th style={headerCellStyle}>Agent Name</th>
//                       <th style={headerCellStyle}>Team Leader</th>
//                       <th style={headerCellStyle}>Lead Source</th>
//                       <th style={headerCellStyle}>Lead Status</th>
//                       <th title="Escalation Severity" style={headerCellStyle}>
//                         Severity
//                       </th>
//                       <th title="Issue Identified" style={headerCellStyle}>
//                         Issue
//                       </th>
//                       <th title="Escalation Action" style={headerCellStyle}>
//                         Action
//                       </th>
//                       <th title="Documentation" style={headerCellStyle}>
//                         Docs
//                       </th>
//                       <th title="Success Metrics" style={headerCellStyle}>
//                         Success
//                       </th>
//                       <th style={headerCellStyle}>User Rating</th>
//                       <th style={headerCellStyle}>Created At</th>
//                       <th style={headerCellStyle}>Edit</th>
//                       <th style={lastHeaderCellStyle}>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentEscalations.length > 0 ? (
//                       currentEscalations.map((row, index) => {
//                         const status = row.status || "draft";
//                         const source = row.submissionSource || "bitrix";
//                         return (
//                           <tr
//                             key={row._id || index}
//                             style={getRowStyle(hoveredRow === index)}
//                             onMouseEnter={() => setHoveredRow(index)}
//                             onMouseLeave={() => setHoveredRow(null)}
//                             onDoubleClick={() =>
//                               handleRowDoubleClick(row, "escalation")
//                             }
//                             title="Double-click to edit"
//                           >
//                             <td style={cellStyle}>
//                               {indexOfFirstItem + index + 1}
//                             </td>
//                             <td style={cellStyle}>
//                               <span style={getSourceBadgeStyle(source)}>
//                                 {source === "frontend" ? "Frontend" : "Bitrix"}
//                               </span>
//                             </td>
//                             <td style={cellStyle}>
//                               {status === "draft" ? (
//                                 <button
//                                   onClick={() =>
//                                     handlePublishEscalation(row._id)
//                                   }
//                                   style={{
//                                     border: "none",
//                                     background: "none",
//                                     cursor: "pointer",
//                                     color: "#10b981",
//                                   }}
//                                   title="Publish this escalation"
//                                   disabled={loading}
//                                 >
//                                   <CheckCircle size={18} />
//                                 </button>
//                               ) : (
//                                 <span
//                                   style={{ color: "#6b7280", fontSize: "12px" }}
//                                 >
//                                   Published
//                                 </span>
//                               )}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.useremail)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.leadID)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.evaluatedby)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.agentName)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.teamleader)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.leadSource || row.leadsource)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.leadStatus)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.escSeverity)}
//                             </td>
//                             <td style={cellStyle}>
//                               {row.issueIden ? (
//                                 <div
//                                   style={{
//                                     maxWidth: "150px",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                     whiteSpace: "nowrap",
//                                   }}
//                                   title={getFieldText(row.issueIden)}
//                                 >
//                                   {getFieldText(row.issueIden)}
//                                 </div>
//                               ) : (
//                                 "-"
//                               )}
//                             </td>
//                             <td style={cellStyle}>
//                               {row.escAction ? (
//                                 <div
//                                   style={{
//                                     maxWidth: "150px",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                     whiteSpace: "nowrap",
//                                   }}
//                                   title={getFieldText(row.escAction)}
//                                 >
//                                   {getFieldText(row.escAction)}
//                                 </div>
//                               ) : (
//                                 "-"
//                               )}
//                             </td>
//                             <td style={cellStyle}>
//                               {row.documentation ? (
//                                 <div
//                                   style={{
//                                     maxWidth: "150px",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                     whiteSpace: "nowrap",
//                                   }}
//                                   title={getFieldText(row.documentation)}
//                                 >
//                                   {getFieldText(row.documentation)}
//                                 </div>
//                               ) : (
//                                 "-"
//                               )}
//                             </td>
//                             <td style={cellStyle}>
//                               {row.successmaration ? (
//                                 <div
//                                   style={{
//                                     maxWidth: "150px",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                     whiteSpace: "nowrap",
//                                   }}
//                                   title={getFieldText(row.successmaration)}
//                                 >
//                                   {getFieldText(row.successmaration)}
//                                 </div>
//                               ) : (
//                                 "-"
//                               )}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.userrating)}
//                             </td>
//                             <td style={cellStyle}>
//                               {formatDate(row.createdAt)}
//                             </td>
//                             <td style={cellStyle}>
//                               <button
//                                 onClick={() =>
//                                   handleEditEscalation(row._id, row)
//                                 }
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   cursor: "pointer",
//                                   color: "#6b7280",
//                                 }}
//                                 title="Edit escalation"
//                               >
//                                 <SquarePen size={18} />
//                               </button>
//                             </td>
//                             <td style={lastCellStyle}>
//                               <button
//                                 onClick={() => handleDeleteEscalation(row._id)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   cursor: "pointer",
//                                   color: "#ef4444",
//                                 }}
//                                 title="Delete escalation"
//                                 disabled={loading}
//                               >
//                                 <Trash size={18} />
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="19"
//                           style={{
//                             ...cellStyle,
//                             textAlign: "center",
//                             padding: "40px",
//                           }}
//                         >
//                           <div style={{ color: "#6b7280", fontSize: "16px" }}>
//                             {activeEscalationTab === "published"
//                               ? "📋 No published escalations found for your account"
//                               : "📝 No draft escalations found for your account"}
//                           </div>
//                           <div
//                             style={{
//                               color: "#9ca3af",
//                               fontSize: "14px",
//                               marginTop: "8px",
//                             }}
//                           >
//                             {activeEscalationTab === "published"
//                               ? "Published escalations will appear here once you publish them from the drafts tab."
//                               : "Create new escalations using the escalation form to see them here."}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {((activeEscalationTab === "published" &&
//                 publishedEscalations.length > itemsPerPage) ||
//                 (activeEscalationTab === "draft" &&
//                   draftEscalations.length > itemsPerPage)) && (
//                 <div style={paginationContainerStyle}>
//                   <div style={paginationStyle}>
//                     <button
//                       style={paginationButtonStyle}
//                       onClick={() => paginate(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       ‹
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <button
//                           key={page}
//                           style={
//                             page === currentPage
//                               ? activePaginationButtonStyle
//                               : paginationButtonStyle
//                           }
//                           onClick={() => paginate(page)}
//                         >
//                           {page}
//                         </button>
//                       )
//                     )}
//                     <button
//                       style={paginationButtonStyle}
//                       onClick={() =>
//                         paginate(Math.min(totalPages, currentPage + 1))
//                       }
//                       disabled={currentPage === totalPages}
//                     >
//                       ›
//                     </button>
//                   </div>
//                 </div>
//               )}
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
//                 setActiveEvaluationTab("published");
//                 setCurrentPage(1);
//               }}
//               style={getSubTabStyle(activeEvaluationTab === "published")}
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
//                 {publishedEvaluations.length}
//               </span>
//             </button>
//             <button
//               onClick={() => {
//                 setActiveEvaluationTab("draft");
//                 setCurrentPage(1);
//               }}
//               style={getSubTabStyle(activeEvaluationTab === "draft")}
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
//                 {draftEvaluations.length}
//               </span>
//             </button>
//           </div>

//           {loading ? (
//             <div style={loadingStyle}>
//               <Loader size={32} className="animate-spin" />
//             </div>
//           ) : (
//             <>
//               <div style={evaluationScrollableContainerStyle}>
//                 <table style={evaluationTableStyle}>
//                   <thead style={headerStyle}>
//                     <tr>
//                       <th style={headerCellStyle}>#</th>
//                       <th style={headerCellStyle}>Source</th>
//                       <th style={headerCellStyle}>Publish</th>
//                       <th style={headerCellStyle}>Email</th>
//                       <th style={headerCellStyle}>Lead ID</th>
//                       <th style={headerCellStyle}>Agent Name</th>
//                       <th style={headerCellStyle}>MOD</th>
//                       <th style={headerCellStyle}>Team Leader</th>
//                       <th style={headerCellStyle}>Greetings</th>
//                       <th style={headerCellStyle}>Accuracy</th>
//                       <th style={headerCellStyle}>Building</th>
//                       <th style={headerCellStyle}>Presenting</th>
//                       <th style={headerCellStyle}>Closing</th>
//                       <th style={headerCellStyle}>Bonus</th>
//                       <th style={headerCellStyle}>Evaluation Summary</th>
//                       <th style={headerCellStyle}>Created At</th>
//                       <th style={headerCellStyle}>Edit</th>
//                       <th style={lastHeaderCellStyle}>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentEvaluations.length > 0 ? (
//                       currentEvaluations.map((row, index) => {
//                         const status = row.status || "draft";
//                         const source = row.submissionSource || "bitrix";
//                         return (
//                           <tr
//                             key={row._id || index}
//                             style={getRowStyle(hoveredRow === index)}
//                             onMouseEnter={() => setHoveredRow(index)}
//                             onMouseLeave={() => setHoveredRow(null)}
//                             onDoubleClick={() =>
//                               handleRowDoubleClick(row, "evaluation")
//                             }
//                             title="Double-click to edit"
//                           >
//                             <td style={cellStyle}>
//                               {indexOfFirstItem + index + 1}
//                             </td>
//                             <td style={cellStyle}>
//                               <span style={getSourceBadgeStyle(source)}>
//                                 {source === "frontend" ? "Frontend" : "Bitrix"}
//                               </span>
//                             </td>
//                             <td style={cellStyle}>
//                               {status === "draft" ? (
//                                 <button
//                                   onClick={() =>
//                                     handlePublishEvaluation(row._id)
//                                   }
//                                   style={{
//                                     border: "none",
//                                     background: "none",
//                                     cursor: "pointer",
//                                     color: "#10b981",
//                                   }}
//                                   title="Publish this evaluation"
//                                   disabled={loading}
//                                 >
//                                   <CheckCircle size={18} />
//                                 </button>
//                               ) : (
//                                 <span
//                                   style={{ color: "#6b7280", fontSize: "12px" }}
//                                 >
//                                   Published
//                                 </span>
//                               )}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.useremail)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.leadID)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.agentName)}
//                             </td>

//                             <td style={cellStyle}>{getFieldText(row.mod)}</td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.teamleader)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.greetings)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.accuracy)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.building)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.presenting)}
//                             </td>
//                             <td style={cellStyle}>
//                               {getFieldText(row.closing)}
//                             </td>
//                             <td style={cellStyle}>{getFieldText(row.bonus)}</td>
//                             <td style={cellStyle}>
//                               {row.evaluationsummary ||
//                                 row.evaluationSummary ||
//                                 "-"}
//                             </td>
//                             <td style={cellStyle}>
//                               {formatDate(row.createdAt)}
//                             </td>
//                             <td style={cellStyle}>
//                               <button
//                                 onClick={() =>
//                                   handleEditEvaluation(row._id, row)
//                                 }
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   cursor: "pointer",
//                                   color: "#6b7280",
//                                 }}
//                                 title="Edit evaluation"
//                               >
//                                 <SquarePen size={18} />
//                               </button>
//                             </td>
//                             <td style={lastCellStyle}>
//                               <button
//                                 onClick={() => handleDeleteEvaluation(row._id)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   cursor: "pointer",
//                                   color: "#ef4444",
//                                 }}
//                                 title="Delete evaluation"
//                                 disabled={loading}
//                               >
//                                 <Trash size={18} />
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="18"
//                           style={{ ...cellStyle, textAlign: "center" }}
//                         >
//                           {activeEvaluationTab === "published"
//                             ? "No published evaluations found for your account"
//                             : "No draft evaluations found for your account"}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {((activeEvaluationTab === "published" &&
//                 publishedEvaluations.length > itemsPerPage) ||
//                 (activeEvaluationTab === "draft" &&
//                   draftEvaluations.length > itemsPerPage)) && (
//                 <div style={paginationContainerStyle}>
//                   <div style={paginationStyle}>
//                     <button
//                       style={paginationButtonStyle}
//                       onClick={() => paginate(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       ‹
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <button
//                           key={page}
//                           style={
//                             page === currentPage
//                               ? activePaginationButtonStyle
//                               : paginationButtonStyle
//                           }
//                           onClick={() => paginate(page)}
//                         >
//                           {page}
//                         </button>
//                       )
//                     )}
//                     <button
//                       style={paginationButtonStyle}
//                       onClick={() =>
//                         paginate(Math.min(totalPages, currentPage + 1))
//                       }
//                       disabled={currentPage === totalPages}
//                     >
//                       ›
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* Marketing Tab */}
//       {activeTab === "marketing" && (
//         <div>
//           {loading ? (
//             <div style={loadingStyle}>
//               <Loader size={32} className="animate-spin" />
//             </div>
//           ) : (
//             <>
//               <div style={scrollableContainerStyle}>
//                 <table style={tableStyle}>
//                   <thead style={headerStyle}>
//                     <tr>
//                       <th style={headerCellStyle}>#</th>
//                       <th style={headerCellStyle}>Email</th>
//                       <th style={headerCellStyle}>Campaign Name</th>
//                       <th style={headerCellStyle}>Campaign Type</th>
//                       <th style={headerCellStyle}>Budget</th>
//                       <th style={headerCellStyle}>Start Date</th>
//                       <th style={headerCellStyle}>End Date</th>
//                       <th style={headerCellStyle}>Status</th>
//                       <th style={headerCellStyle}>Created At</th>
//                       <th style={headerCellStyle}>Edit</th>
//                       <th style={lastHeaderCellStyle}>Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {marketing.length > 0 ? (
//                       marketing.map((row, index) => {
//                         const indexOfFirstItem =
//                           (currentPage - 1) * itemsPerPage;
//                         return (
//                           <tr
//                             key={row._id || index}
//                             style={getRowStyle(hoveredRow === index)}
//                             onMouseEnter={() => setHoveredRow(index)}
//                             onMouseLeave={() => setHoveredRow(null)}
//                             title="Double-click to edit"
//                           >
//                             <td style={cellStyle}>
//                               {indexOfFirstItem + index + 1}
//                             </td>
//                             <td style={cellStyle}>{row.email || "-"}</td>
//                             <td style={cellStyle}>{row.campaignName || "-"}</td>
//                             <td style={cellStyle}>{row.campaignType || "-"}</td>
//                             <td style={cellStyle}>{row.budget || "-"}</td>
//                             <td style={cellStyle}>{row.startDate || "-"}</td>
//                             <td style={cellStyle}>{row.endDate || "-"}</td>
//                             <td style={cellStyle}>
//                               <span
//                                 style={getStatusBadgeStyle(
//                                   row.status || "active"
//                                 )}
//                               >
//                                 {row.status || "active"}
//                               </span>
//                             </td>
//                             <td style={cellStyle}>
//                               {formatDate(row.createdAt)}
//                             </td>
//                             <td style={cellStyle}>
//                               <button
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   cursor: "pointer",
//                                   color: "#6b7280",
//                                 }}
//                                 title="Edit marketing entry"
//                               >
//                                 <SquarePen size={18} />
//                               </button>
//                             </td>
//                             <td style={lastCellStyle}>
//                               <button
//                                 onClick={() => handleDeleteMarketing(row._id)}
//                                 style={{
//                                   border: "none",
//                                   background: "none",
//                                   cursor: "pointer",
//                                   color: "#ef4444",
//                                 }}
//                                 title="Delete marketing entry"
//                                 disabled={loading}
//                               >
//                                 <Trash size={18} />
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="11"
//                           style={{ ...cellStyle, textAlign: "center" }}
//                         >
//                           No marketing records found for your account
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {marketing.length > itemsPerPage && (
//                 <div style={paginationContainerStyle}>
//                   <div style={paginationStyle}>
//                     <button
//                       style={paginationButtonStyle}
//                       onClick={() => paginate(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       ‹
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <button
//                           key={page}
//                           style={
//                             page === currentPage
//                               ? activePaginationButtonStyle
//                               : paginationButtonStyle
//                           }
//                           onClick={() => paginate(page)}
//                         >
//                           {page}
//                         </button>
//                       )
//                     )}
//                     <button
//                       style={paginationButtonStyle}
//                       onClick={() =>
//                         paginate(Math.min(totalPages, currentPage + 1))
//                       }
//                       disabled={currentPage === totalPages}
//                     >
//                       ›
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TableAdmin;
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
import {
  SquarePen,
  Trash,
  Loader,
  FileWarning,
  CheckCircle,
  Edit,
  AlertCircle,
  Send,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  getEvaluationsByAgentNameApi,
  getEvaluationsByUserEmailApi,
} from "../features/evaluationApi";
import {
  getEscalationsByAgentNameApi,
  getEscalationsByUserEmailApi,
} from "../features/escalationsApi";
import { useNavigate, useParams } from "react-router-dom";

const CACHE_TTL = 1000; // 1 second cache time

const TableAdmin = ({ adminEmail }) => {
  const { agentName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("evaluations");
  const [activeEscalationTab, setActiveEscalationTab] = useState("published");
  const [activeEvaluationTab, setActiveEvaluationTab] = useState("published");
  const [evaluations, setEvaluations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);

  // --- LOGIC: DETERMINE STATUS BASED ON SOURCE ---
  const getStatus = (item) => {
    if (
      item.status &&
      (item.status === "published" || item.status === "draft")
    ) {
      return item.status;
    }
    const submissionSource = (item.submissionSource || "").toLowerCase();
    if (submissionSource === "frontend") return "published";
    if (submissionSource === "bitrix") return "draft";

    // Back-compat fallback: infer from legacy "source"/"leadsource" fields
    const source = (item.leadsource || item.source || "").toLowerCase();
    return source.includes("bitrix") ? "draft" : "published";
  };

  /** Same scale as AgentForm: sum of criteria + bonus, max 96. */
  const EVALUATION_MAX_POINTS = 96;

  /**
   * Criteria rows (incl. Bonus Point) are stored as { value, points, comment }.
   * Never coerce to string (avoids "[object Object]").
   */
  const formatBonusPointCell = (field) => {
    if (field == null || field === "") return "";
    if (typeof field === "number" && field !== 0) return `${field} pts`;
    if (typeof field === "string") {
      const s = field.trim();
      return s || "";
    }
    if (typeof field === "object") {
      const points =
        typeof field.points === "number"
          ? field.points
          : typeof field.rateVal === "number"
            ? field.rateVal
            : null;
      const value =
        field.value != null && String(field.value).trim() !== ""
          ? String(field.value).trim()
          : "";
      if (value && points != null && points !== 0)
        return `${value} · ${points} pts`;
      if (points != null && points !== 0) return `${points} pts`;
      if (value) return value;
      const c = field.comment && String(field.comment).trim();
      if (c) return c.length > 36 ? `${c.slice(0, 36)}…` : c;
    }
    return "";
  };

  const publishedEvaluations = evaluations.filter(
    (ev) => getStatus(ev) === "published"
  );
  const draftEvaluations = evaluations.filter(
    (ev) => getStatus(ev) === "draft"
  );

  const publishedEscalations = escalations.filter(
    (esc) => getStatus(esc) === "published"
  );
  const draftEscalations = escalations.filter(
    (esc) => getStatus(esc) === "draft"
  );

  // Cache handling
  const loadFromCache = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const saveToCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === "evaluations") {
          // Use email as cache key priority if available
          const cacheKey = adminEmail
            ? `evaluations_email_${adminEmail}`
            : `evaluations_name_${agentName}`;
          const cached = loadFromCache(cacheKey);
          if (cached) setEvaluations(cached);
          else {
            let evals = [];
            // Priority: Fetch by Email (Submitter) -> Fallback: Fetch by Agent Name (Subject)
            if (adminEmail) {
              evals = await getEvaluationsByUserEmailApi(adminEmail);
            } else {
              evals = await getEvaluationsByAgentNameApi(agentName);
            }
            const data = evals || [];
            setEvaluations(data);
            saveToCache(cacheKey, data);
          }
        } else if (activeTab === "escalations") {
          const cacheKey = adminEmail
            ? `escalations_email_${adminEmail}`
            : `escalations_name_${agentName}`;
          const cached = loadFromCache(cacheKey);
          if (cached) setEscalations(cached);
          else {
            let escs = [];
            if (adminEmail) {
              escs = await getEscalationsByUserEmailApi(adminEmail);
            } else {
              escs = await getEscalationsByAgentNameApi(agentName);
            }
            const data = escs || [];
            setEscalations(data);
            saveToCache(cacheKey, data);
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          "Note: Could not load data. Please ensure the backend is running and you are logged in."
        );
        setEvaluations([]);
        setEscalations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, agentName, adminEmail]);

  const getCurrentEvaluations = () => {
    const currentData =
      activeEvaluationTab === "published"
        ? publishedEvaluations
        : draftEvaluations;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getCurrentEscalations = () => {
    const currentData =
      activeEscalationTab === "published"
        ? publishedEscalations
        : draftEscalations;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvaluations = getCurrentEvaluations();
  const currentEscalations = getCurrentEscalations();

  const getTotalPages = () => {
    if (activeTab === "evaluations") {
      const dataLengths =
        activeEvaluationTab === "published"
          ? publishedEvaluations.length
          : draftEvaluations.length;
      return Math.ceil(dataLengths / itemsPerPage);
    }
    if (activeTab === "escalations") {
      const dataLength =
        activeEscalationTab === "published"
          ? publishedEscalations.length
          : draftEscalations.length;
      return Math.ceil(dataLength / itemsPerPage);
    }
    return Math.ceil(marketing.length / itemsPerPage);
  };

  const totalPages = getTotalPages();

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "-";

  const handleEdit = (id, rowData) => {
    navigate(`/dashboard/qc-team/editescalation/${id}`, {
      state: { row: rowData },
    });
  };
  const handleEdits = (id, rowData) => {
    navigate(`/dashboard/qc-team/editevaluation/${id}`, {
      state: { row: rowData },
    });
  };

  // --- STYLES ---
  const containerStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    width: "100%",
  };

  const tabContainerStyle = {
    display: "flex",
    gap: "32px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "24px",
  };

  const getTabStyle = (isActive) => ({
    paddingBottom: "16px",
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
    color: isActive ? "#2563eb" : "#64748b",
    backgroundColor: "transparent",
    borderLeft: "none",
    borderRight: "none",
    borderTop: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  const getSubTabStyle = (isActive, color = "#2563eb") => ({
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    borderRadius: "8px",
    color: isActive ? "#ffffff" : "#475569",
    backgroundColor: isActive ? color : "#f1f5f9",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  const getStatusBadgeStyle = (status) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    backgroundColor: status === "published" ? "#dcfce7" : "#fef3c7",
    color: status === "published" ? "#166534" : "#b45309",
    border: status === "published" ? "1px solid #bbf7d0" : "1px solid #fde68a",
  });

  return (
    <div style={containerStyle}>
      {/* Main Tabs */}
      <div style={tabContainerStyle}>
        {["evaluations", "escalations"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            style={getTabStyle(activeTab === tab)}
          >
            <span style={{ textTransform: "capitalize" }}>{tab}</span>
            <span
              style={{
                backgroundColor: activeTab === tab ? "#eff6ff" : "#f1f5f9",
                color: activeTab === tab ? "#1d4ed8" : "#64748b",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "11px",
              }}
            >
              {tab === "evaluations" ? evaluations.length : escalations.length}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-100">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* --- ESCALATIONS CONTENT --- */}
      {activeTab === "escalations" && (
        <div>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setActiveEscalationTab("published");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(
                activeEscalationTab === "published",
                "#16a34a"
              )}
            >
              <CheckCircle size={14} />
              Published
            </button>
            <button
              onClick={() => {
                setActiveEscalationTab("draft");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEscalationTab === "draft", "#d97706")}
            >
              <Edit size={14} />
              Drafts (Bitrix)
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Lead ID</th>
                      <th className="px-6 py-4">Agent</th>
                      <th className="px-6 py-4">Issue</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentEscalations.length > 0 ? (
                      currentEscalations.map((row, index) => {
                        const status = getStatus(row);
                        const source = row.leadsource || row.source || "N/A";
                        return (
                          <tr
                            key={row._id || index}
                            className="hover:bg-slate-50/50 transition-colors bg-white"
                          >
                            <td className="px-6 py-4">
                              <span style={getStatusBadgeStyle(status)}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {source}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {row.leadID || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">
                              {row.agentName || "-"}
                            </td>
                            <td
                              className="px-6 py-4 text-slate-500 max-w-xs truncate"
                              title={row.issueIden}
                            >
                              {row.issueIden || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(row._id, row)}
                                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                    status === "draft"
                                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                      : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                                  }`}
                                  title={
                                    status === "draft"
                                      ? "Edit & Publish"
                                      : "Edit"
                                  }
                                >
                                  {status === "draft" ? (
                                    <>
                                      <Send size={14} />{" "}
                                      <span className="text-xs font-bold">
                                        Publish
                                      </span>
                                    </>
                                  ) : (
                                    <SquarePen size={16} />
                                  )}
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          No records found in {activeEscalationTab}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Slider */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <span className="text-xs text-slate-400">Page 1</span>
                  <input
                    type="range"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-400">
                    Page {totalPages}
                  </span>
                  <span className="ml-2 text-sm font-bold text-blue-600 border border-blue-100 px-3 py-1 rounded bg-blue-50">
                    {currentPage}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* --- EVALUATIONS CONTENT --- */}
      {activeTab === "evaluations" && (
        <div>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setActiveEvaluationTab("published");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(
                activeEvaluationTab === "published",
                "#16a34a"
              )}
            >
              <CheckCircle size={14} />
              Published
            </button>
            <button
              onClick={() => {
                setActiveEvaluationTab("draft");
                setCurrentPage(1);
              }}
              style={getSubTabStyle(activeEvaluationTab === "draft", "#d97706")}
            >
              <Edit size={14} />
              Drafts (Bitrix)
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Lead ID</th>
                      <th className="px-6 py-4">Agent</th>
                      <th className="px-6 py-4">Evaluation result</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentEvaluations.length > 0 ? (
                      currentEvaluations.map((row, index) => {
                        const status = getStatus(row);
                        const source = row.leadsource || row.source || "N/A";
                        return (
                          <tr
                            key={row._id || index}
                            className="hover:bg-slate-50/50 transition-colors bg-white"
                          >
                            <td className="px-6 py-4">
                              <span style={getStatusBadgeStyle(status)}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {source}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {row.leadID || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">
                              {row.agentName || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-700 max-w-[260px]">
                              {(() => {
                                const rating = row?.rating;
                                const hasScore =
                                  typeof rating === "number" && rating > 0;
                                const bonusText = formatBonusPointCell(
                                  row?.bonus
                                );
                                if (!hasScore && !bonusText) {
                                  return (
                                    <span className="text-slate-400">-</span>
                                  );
                                }
                                return (
                                  <div className="flex flex-col gap-1">
                                    {hasScore ? (
                                      <span className="font-semibold text-slate-900">
                                        Final score: {rating} /{" "}
                                        {EVALUATION_MAX_POINTS}
                                      </span>
                                    ) : null}
                                    {bonusText ? (
                                      <span className="text-xs text-slate-600 leading-snug">
                                        Bonus point: {bonusText}
                                      </span>
                                    ) : null}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdits(row._id, row)}
                                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                    status === "draft"
                                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                      : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                                  }`}
                                  title={
                                    status === "draft"
                                      ? "Edit & Publish"
                                      : "Edit"
                                  }
                                >
                                  {status === "draft" ? (
                                    <>
                                      <Send size={14} />{" "}
                                      <span className="text-xs font-bold">
                                        Publish
                                      </span>
                                    </>
                                  ) : (
                                    <SquarePen size={16} />
                                  )}
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          No records found in {activeEvaluationTab}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Slider */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <span className="text-xs text-slate-400">Page 1</span>
                  <input
                    type="range"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-400">
                    Page {totalPages}
                  </span>
                  <span className="ml-2 text-sm font-bold text-blue-600 border border-blue-100 px-3 py-1 rounded bg-blue-50">
                    {currentPage}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TableAdmin;

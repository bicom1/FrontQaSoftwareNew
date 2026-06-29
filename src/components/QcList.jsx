// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts";
// import {
//   Trash2,
//   Edit,
//   RefreshCw,
//   TrendingUp,
//   Users,
//   FileText,
//   AlertTriangle,
//   Activity,
//   X,
//   Save,
//   Loader,
// } from "lucide-react";
// import { getallusersApi } from "../features/userApis";

// const QcDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [topPerformers, setTopPerformers] = useState([]);
//   const [userSubmissions, setUserSubmissions] = useState({
//     evaluations: [],
//     escalations: [],
//     marketing: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [submissionsTab, setSubmissionsTab] = useState("evaluations");
//   const [refreshing, setRefreshing] = useState(false);
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [loginTime, setLoginTime] = useState("");

//   const [editModal, setEditModal] = useState({
//     isOpen: false,
//     item: null,
//     type: null,
//     loading: false,
//   });
//   const [editFormData, setEditFormData] = useState({});

//   const API_BASE_URL = "http://localhost:3001/api";

//   const getAuthToken = () => localStorage.getItem("token");

//   const getUserFromStorage = () => {
//     try {
//       const userStr = localStorage.getItem("user");
//       if (userStr) return JSON.parse(userStr);

//       const userId = localStorage.getItem("userId");
//       const userName = localStorage.getItem("userName");
//       const userEmail = localStorage.getItem("userEmail");
//       const userRole = localStorage.getItem("userRole");

//       if (userId && userName && userEmail) {
//         return {
//           _id: userId,
//           name: userName,
//           email: userEmail,
//           role: userRole || "qc",
//         };
//       }
//     } catch (error) {
//       console.error("Error parsing user from localStorage:", error);
//     }
//     return null;
//   };

//   const getAuthHeaders = () => {
//     const token = getAuthToken();
//     const headers = { "Content-Type": "application/json" };
//     if (token) headers["Authorization"] = `Bearer ${token}`;
//     return headers;
//   };

//   useEffect(() => {
//     fetchLoggedInUser();
//   }, []);

//   const fetchLoggedInUser = async () => {
//     try {
//       setAuthLoading(true);
//       const storedUser = getUserFromStorage();
//       const token = getAuthToken();

//       if (!token) {
//         setError("No authentication token found. Please log in.");
//         setLoggedInUser(null);
//         setAuthLoading(false);
//         return;
//       }

//       if (storedUser) {
//         setLoggedInUser(storedUser);
//         setAuthLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE_URL}/users/my-profile`, {
//           method: "GET",
//           credentials: "include",
//           headers: getAuthHeaders(),
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           setLoggedInUser(userData);
//           localStorage.setItem("user", JSON.stringify(userData));
//         } else if (response.status === 401) {
//           setError("Session expired. Please log in again.");
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           setLoggedInUser(null);
//         } else {
//           throw new Error("Failed to fetch user profile");
//         }
//       } catch (apiError) {
//         console.error("API Error:", apiError);
//         setError("Unable to verify authentication. Please log in again.");
//         setLoggedInUser(null);
//       }
//     } catch (err) {
//       console.error("Error fetching logged-in user:", err);
//       setError("Authentication error. Please log in again.");
//       setLoggedInUser(null);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   useEffect(() => {
//     const now = new Date();
//     const formattedTime = now.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//     setLoginTime(formattedTime);
//   }, []);

//   useEffect(() => {
//     if (loggedInUser && loggedInUser._id && !authLoading) {
//       fetchDashboardData();
//       fetchTopPerformers();
//       fetchUserSubmissions();
//     }
//   }, [loggedInUser, authLoading]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${API_BASE_URL}/qc-dashboard?userId=${loggedInUser._id}`,
//         {
//           method: "GET",
//           headers: getAuthHeaders(),
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Session expired. Please log in again.");
//         }
//         throw new Error(
//           `Failed to fetch dashboard data: ${response.statusText}`
//         );
//       }

//       const data = await response.json();
//       setDashboardData(data);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching dashboard:", err);
//       setError(err.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTopPerformers = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/qc-top-performers`, {
//         method: "GET",
//         headers: getAuthHeaders(),
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch top performers");
//       }

//       const data = await response.json();
//       const performers = data.topPerformers || data.data || [];
//       setTopPerformers(performers.slice(0, 5));
//     } catch (err) {
//       console.error("Error fetching top performers:", err);
//       setTopPerformers([]);
//     }
//   };

//   const fetchUserSubmissions = async () => {
//     try {
//       const userEmail = loggedInUser?.email;
//       if (!userEmail) {
//         console.warn("No logged-in user email found");
//         return;
//       }

//       const [evalsRes, escsRes, marketingRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/evaluations/getevaluations`, {
//           method: "GET",
//           headers: getAuthHeaders(),
//           credentials: "include",
//         }),
//         fetch(`${API_BASE_URL}/escalations`, {
//           method: "GET",
//           headers: getAuthHeaders(),
//           credentials: "include",
//         }),
//         fetch(`${API_BASE_URL}/marketing/getmarketing`, {
//           method: "GET",
//           headers: getAuthHeaders(),
//           credentials: "include",
//         }),
//       ]);

//       const [evalsData, escsData, marketingData] = await Promise.all([
//         evalsRes.ok ? evalsRes.json() : { data: [] },
//         escsRes.ok ? escsRes.json() : { data: [] },
//         marketingRes.ok ? marketingRes.json() : { data: [] },
//       ]);

//       const evaluations = Array.isArray(evalsData?.data)
//         ? evalsData.data.filter((item) => {
//             return (
//               item.email === userEmail ||
//               item.agentEmail === userEmail ||
//               item.useremail === userEmail ||
//               item.evaluatedby === userEmail
//             );
//           })
//         : [];

//       const escalations = Array.isArray(escsData?.data)
//         ? escsData.data.filter((item) => {
//             return (
//               item.email === userEmail ||
//               item.agentEmail === userEmail ||
//               item.useremail === userEmail ||
//               item.escalatedby === userEmail
//             );
//           })
//         : [];

//       const marketing = Array.isArray(marketingData?.data)
//         ? marketingData.data.filter((item) => {
//             return (
//               item.email === userEmail ||
//               item.useremail === userEmail ||
//               item.createdBy === userEmail
//             );
//           })
//         : [];

//       setUserSubmissions({
//         evaluations: evaluations.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         ),
//         escalations: escalations.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         ),
//         marketing: marketing.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         ),
//       });
//     } catch (err) {
//       console.error("Error fetching user submissions:", err);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchDashboardData(),
//       fetchTopPerformers(),
//       fetchUserSubmissions(),
//     ]);
//     setRefreshing(false);
//   };

//   const handleDelete = async (id, type) => {
//     if (!window.confirm("🗑️ Are you sure you want to delete this item?"))
//       return;

//     try {
//       const endpoints = {
//         evaluations: `/evaluations/${id}`,
//         escalations: `/escalations/${id}`,
//         marketing: `/marketing/${id}`,
//       };

//       if (!endpoints[type]) {
//         throw new Error(`Unknown delete type: ${type}`);
//       }

//       const url = `${API_BASE_URL.replace(/\/$/, "")}${endpoints[type]}`;

//       const response = await fetch(url, {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//         credentials: "include",
//       });

//       if (response.ok) {
//         await fetchUserSubmissions();
//         alert("✅ Item deleted successfully!");
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete item");
//       }
//     } catch (err) {
//       console.error("Error deleting item:", err);
//       alert("❌ Failed to delete item: " + err.message);
//     }
//   };

//   const openEditModal = (item, type) => {
//     setEditModal({
//       isOpen: true,
//       item: item,
//       type: type,
//       loading: false,
//     });
//     setEditFormData({ ...item });
//   };

//   const closeEditModal = () => {
//     setEditModal({
//       isOpen: false,
//       item: null,
//       type: null,
//       loading: false,
//     });
//     setEditFormData({});
//   };

//   const handleEditFormChange = (field, value) => {
//     setEditFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     const { item, type } = editModal;

//     if (!item?._id) {
//       alert("❌ No item selected for update");
//       return;
//     }

//     setEditModal((prev) => ({ ...prev, loading: true }));

//     try {
//       const endpoints = {
//         evaluations: `/evaluations/${item._id}`,
//         escalations: `/escalations/${item._id}`,
//         marketing: `/marketing/${item._id}`,
//       };

//       if (!endpoints[type]) {
//         throw new Error(`Unknown update type: ${type}`);
//       }

//       const url = `${API_BASE_URL.replace(/\/$/, "")}${endpoints[type]}`;

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         credentials: "include",
//         body: JSON.stringify(editFormData),
//       });

//       if (response.ok) {
//         await fetchUserSubmissions();
//         closeEditModal();
//         alert(
//           `✅ ${
//             type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)
//           } updated successfully!`
//         );
//       } else {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || `Failed to update ${type.slice(0, -1)}`
//         );
//       }
//     } catch (err) {
//       console.error(`Error updating ${type}:`, err);
//       alert("❌ Failed to update: " + err.message);
//     } finally {
//       setEditModal((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getSourceBadge = (source) => {
//     const isFrontend = source === "frontend";
//     return (
//       <span
//         style={{
//           ...styles.badge,
//           backgroundColor: isFrontend ? "#dbeafe" : "#f3e8ff",
//           color: isFrontend ? "#1e40af" : "#6b21a8",
//           border: `1px solid ${isFrontend ? "#93c5fd" : "#d8b4fe"}`,
//         }}
//       >
//         {isFrontend ? "Frontend" : "Bitrix"}
//       </span>
//     );
//   };

//   const getStatusBadge = (status) => {
//     const isPublished = status === "published";
//     return (
//       <span
//         style={{
//           ...styles.badge,
//           backgroundColor: isPublished ? "#dcfce7" : "#fef3c7",
//           color: isPublished ? "#166534" : "#92400e",
//           border: `1px solid ${isPublished ? "#86efac" : "#fcd34d"}`,
//         }}
//       >
//         {status?.toUpperCase() || "DRAFT"}
//       </span>
//     );
//   };

//   const getSeverityBadge = (severity) => {
//     const colors = {
//       High: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
//       Medium: { bg: "#fef3c7", color: "#d97706", border: "#fde68a" },
//       Low: { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" },
//     };
//     const style = colors[severity] || colors.Medium;
//     return (
//       <span
//         style={{
//           ...styles.badge,
//           backgroundColor: style.bg,
//           color: style.color,
//           border: `1px solid ${style.border}`,
//         }}
//       >
//         {severity || "Medium"}
//       </span>
//     );
//   };

//   const calculateStats = () => {
//     const totalEvaluations = userSubmissions.evaluations.length;
//     const totalEscalations = userSubmissions.escalations.length;
//     const totalMarketing = userSubmissions.marketing.length;
//     const totalReports = totalEvaluations + totalEscalations + totalMarketing;

//     const today = new Date().toDateString();
//     const evaluationsToday = userSubmissions.evaluations.filter(
//       (item) => new Date(item.createdAt).toDateString() === today
//     ).length;

//     const performanceScore = Math.min(
//       100,
//       Math.round((totalEvaluations * 2 + totalEscalations * 1.5) / 2)
//     );

//     return {
//       evaluationsToday,
//       totalReports,
//       totalEscalations,
//       performanceScore,
//       totalEvaluations,
//       totalMarketing,
//     };
//   };

//   const generateWeeklyData = () => {
//     const weekData = [];
//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       const dateStr = date.toDateString();

//       const dayEvals = userSubmissions.evaluations.filter(
//         (item) => new Date(item.createdAt).toDateString() === dateStr
//       ).length;

//       const dayEscs = userSubmissions.escalations.filter(
//         (item) => new Date(item.createdAt).toDateString() === dateStr
//       ).length;

//       weekData.push({
//         day: days[date.getDay()],
//         Evaluations: dayEvals,
//         Escalations: dayEscs,
//       });
//     }

//     return weekData;
//   };

//   const generateMonthlyTrend = () => {
//     const monthlyData = [];

//     for (let i = 5; i >= 0; i--) {
//       const date = new Date();
//       date.setMonth(date.getMonth() - i);
//       const monthStr = date.toLocaleDateString("en-US", { month: "short" });

//       const monthEvals = userSubmissions.evaluations.filter((item) => {
//         const itemDate = new Date(item.createdAt);
//         return (
//           itemDate.getMonth() === date.getMonth() &&
//           itemDate.getFullYear() === date.getFullYear()
//         );
//       }).length;

//       const monthEscs = userSubmissions.escalations.filter((item) => {
//         const itemDate = new Date(item.createdAt);
//         return (
//           itemDate.getMonth() === date.getMonth() &&
//           itemDate.getFullYear() === date.getFullYear()
//         );
//       }).length;

//       monthlyData.push({
//         month: monthStr,
//         Evaluations: monthEvals,
//         Escalations: monthEscs,
//         Total: monthEvals + monthEscs,
//       });
//     }

//     return monthlyData;
//   };

//   const generatePriorityData = () => {
//     const priorities = { High: 0, Medium: 0, Low: 0 };

//     userSubmissions.escalations.forEach((item) => {
//       const severity = item.escSeverity || item.severity || "Medium";
//       if (priorities[severity] !== undefined) {
//         priorities[severity]++;
//       }
//     });

//     return [
//       { name: "High", value: priorities.High, color: "#dc2626" },
//       { name: "Medium", value: priorities.Medium, color: "#f59e0b" },
//       { name: "Low", value: priorities.Low, color: "#16a34a" },
//     ].filter((item) => item.value > 0);
//   };

//   const generatePerformanceRadar = () => {
//     const stats = calculateStats();
//     const maxValue = 100;

//     return [
//       {
//         metric: "Evaluations",
//         value: Math.min(100, (stats.totalEvaluations / 50) * 100),
//         fullMark: maxValue,
//       },
//       {
//         metric: "Escalations",
//         value: Math.min(100, (stats.totalEscalations / 30) * 100),
//         fullMark: maxValue,
//       },
//       {
//         metric: "Marketing",
//         value: Math.min(100, (stats.totalMarketing / 20) * 100),
//         fullMark: maxValue,
//       },
//       {
//         metric: "Performance",
//         value: stats.performanceScore,
//         fullMark: maxValue,
//       },
//       {
//         metric: "Activity",
//         value: Math.min(100, (stats.evaluationsToday / 10) * 100),
//         fullMark: maxValue,
//       },
//     ];
//   };
//   const renderEditModal = () => {
//     if (!editModal.isOpen) return null;

//     const { type, loading } = editModal;

//     return (
//       <div
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200"
//         onClick={closeEditModal}
//       >
//         <div
//           className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* HEADER */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between shadow-lg">
//             <div className="flex items-center gap-4">
//               <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
//                 <Edit size={22} className="text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-white tracking-tight">
//                 Edit {type?.charAt(0).toUpperCase() + type?.slice(1, -1)}
//               </h2>
//             </div>

//             <button
//               onClick={closeEditModal}
//               className="w-10 h-10 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-xl transition-all text-white"
//             >
//               <X size={22} />
//             </button>
//           </div>

//           {/* BODY */}
//           {/* BODY */}
//           <form
//             onSubmit={handleUpdateSubmit}
//             className="p-6 overflow-y-auto flex-1 flex flex-col gap-8"
//           >
//             {/* SECTION HEADER */}
//             <div className="space-y-1">
//               <h3 className="text-xl font-bold text-gray-800">Edit Details</h3>
//               <p className="text-sm text-gray-500">Update the fields below</p>
//             </div>

//             {/* ==========================================================
//         EVALUATIONS FORM
//   ========================================================== */}
//             {type === "evaluations" && (
//               <div className="space-y-6">
//                 {/* READ ONLY */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="flex flex-col gap-1">
//                     <label className="text-sm font-medium text-gray-700">
//                       Lead ID
//                     </label>
//                     <input
//                       disabled
//                       value={editFormData.leadID || ""}
//                       className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
//                     />
//                   </div>

//                   <div className="flex flex-col gap-1">
//                     <label className="text-sm font-medium text-gray-700">
//                       Source
//                     </label>
//                     <input
//                       disabled
//                       value={editFormData.submissionSource || ""}
//                       className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 {/* INPUTS */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Agent Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     disabled={editFormData.submissionSource === "bitrix"}
//                     value={editFormData.agentName || ""}
//                     onChange={(e) =>
//                       handleEditFormChange("agentName", e.target.value)
//                     }
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${
//                       editFormData.submissionSource === "bitrix"
//                         ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
//                         : "bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-200"
//                     }`}
//                     placeholder="Enter agent name"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Team Leader
//                   </label>
//                   <input
//                     disabled={editFormData.submissionSource === "bitrix"}
//                     value={editFormData.teamleader || ""}
//                     onChange={(e) =>
//                       handleEditFormChange("teamleader", e.target.value)
//                     }
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${
//                       editFormData.submissionSource === "bitrix"
//                         ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
//                         : "bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-200"
//                     }`}
//                     placeholder="Enter team leader name"
//                   />
//                 </div>

//                 {/* STATUS */}
//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     disabled={editFormData.submissionSource === "bitrix"}
//                     value={editFormData.status || "draft"}
//                     onChange={(e) =>
//                       handleEditFormChange("status", e.target.value)
//                     }
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${
//                       editFormData.submissionSource === "bitrix"
//                         ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
//                         : "bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-200 cursor-pointer"
//                     }`}
//                   >
//                     <option value="draft">📝 Draft</option>
//                     <option value="published">✅ Published</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* ==========================================================
//         ESCALATIONS FORM
//   ========================================================== */}
//             {type === "escalations" && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="flex flex-col gap-1">
//                     <label className="text-sm font-medium text-gray-700">
//                       Lead ID
//                     </label>
//                     <input
//                       disabled
//                       value={editFormData.leadID}
//                       className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg"
//                     />
//                   </div>

//                   <div className="flex flex-col gap-1">
//                     <label className="text-sm font-medium text-gray-700">
//                       Source
//                     </label>
//                     <input
//                       disabled
//                       value={editFormData.submissionSource}
//                       className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Agent Name *
//                   </label>
//                   <input
//                     value={editFormData.agentName}
//                     onChange={(e) =>
//                       handleEditFormChange("agentName", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Team Leader
//                   </label>
//                   <input
//                     value={editFormData.teamleader}
//                     onChange={(e) =>
//                       handleEditFormChange("teamleader", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Severity *
//                   </label>
//                   <select
//                     value={editFormData.escSeverity || "Medium"}
//                     onChange={(e) =>
//                       handleEditFormChange("escSeverity", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 cursor-pointer"
//                   >
//                     <option value="Low">🟢 Low</option>
//                     <option value="Medium">🟡 Medium</option>
//                     <option value="High">🔴 High</option>
//                   </select>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Status *
//                   </label>
//                   <select
//                     value={editFormData.status}
//                     onChange={(e) =>
//                       handleEditFormChange("status", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 cursor-pointer"
//                   >
//                     <option value="draft">📝 Draft</option>
//                     <option value="published">✅ Published</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* ==========================================================
//         MARKETING FORM
//   ========================================================== */}
//             {type === "marketing" && (
//               <div className="space-y-6">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Campaign Name *
//                   </label>
//                   <input
//                     value={editFormData.campaignName}
//                     onChange={(e) =>
//                       handleEditFormChange("campaignName", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Campaign Type
//                   </label>
//                   <input
//                     value={editFormData.campaignType}
//                     onChange={(e) =>
//                       handleEditFormChange("campaignType", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                     placeholder="Email / PPC / Social Media"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Budget
//                   </label>
//                   <input
//                     value={editFormData.budget}
//                     onChange={(e) =>
//                       handleEditFormChange("budget", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="flex flex-col gap-1">
//                     <label className="text-sm font-medium text-gray-700">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       value={
//                         editFormData.startDate
//                           ? new Date(editFormData.startDate)
//                               .toISOString()
//                               .split("T")[0]
//                           : ""
//                       }
//                       onChange={(e) =>
//                         handleEditFormChange("startDate", e.target.value)
//                       }
//                       className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                     />
//                   </div>

//                   <div className="flex flex-col gap-1">
//                     <label className="text-sm font-medium text-gray-700">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={
//                         editFormData.endDate
//                           ? new Date(editFormData.endDate)
//                               .toISOString()
//                               .split("T")[0]
//                           : ""
//                       }
//                       onChange={(e) =>
//                         handleEditFormChange("endDate", e.target.value)
//                       }
//                       className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">
//                     Status *
//                   </label>
//                   <select
//                     value={editFormData.status}
//                     onChange={(e) =>
//                       handleEditFormChange("status", e.target.value)
//                     }
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 cursor-pointer"
//                   >
//                     <option value="draft">📝 Draft</option>
//                     <option value="published">✅ Published</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* FOOTER BUTTONS */}
//             <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={closeEditModal}
//                 disabled={loading}
//                 className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
//               >
//                 <X size={18} />
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className="animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };
//   if (authLoading || loading) {
//     return (
//       <div style={styles.wrapper}>
//         <div style={styles.loadingContainer}>
//           <div style={styles.spinner}></div>
//           <p style={styles.loadingText}>
//             {authLoading ? "Authenticating..." : "Loading dashboard..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!loggedInUser) {
//     return (
//       <div style={styles.wrapper}>
//         <div style={styles.errorContainer}>
//           <AlertTriangle size={48} color="#dc2626" />
//           <h2 style={styles.errorTitle}>Authentication Required</h2>
//           <p style={styles.errorText}>
//             Please log in to view your QC dashboard
//           </p>
//           <button
//             style={styles.retryBtn}
//             onClick={() => (window.location.href = "/login")}
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.wrapper}>
//         <div style={styles.errorContainer}>
//           <AlertTriangle size={48} color="#dc2626" />
//           <h2 style={styles.errorTitle}>Unable to Load Dashboard</h2>
//           <p style={styles.errorText}>{error}</p>
//           <button style={styles.retryBtn} onClick={fetchDashboardData}>
//             <RefreshCw size={18} /> Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const stats = calculateStats();
//   const weeklyData = generateWeeklyData();
//   const monthlyTrend = generateMonthlyTrend();
//   const priorityData = generatePriorityData();
//   const radarData = generatePerformanceRadar();
//   const user = dashboardData?.user || loggedInUser;

//   return (
//     <div style={styles.wrapper}>
//       <style>
//         {`
//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//         `}
//       </style>

//       {renderEditModal()}

//       <div style={styles.container}>
//         <div style={styles.header}>
//           <div style={styles.headerContent}>
//             <div style={styles.headerLeft}>
//               <h1 style={styles.title}>Quality Control Dashboard</h1>
//               <p style={styles.subtitle}>Welcome back, {user.name}</p>
//               {loginTime && (
//                 <span style={styles.time}>🕒 Logged in at {loginTime}</span>
//               )}
//             </div>
//             <div style={styles.headerRight}>
//               <div style={styles.userCard}>
//                 <div style={styles.avatar}>
//                   {user.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div style={styles.userInfo}>
//                   <div style={styles.userName}>{user.name}</div>
//                   <div style={styles.userRole}>{user.role?.toUpperCase()}</div>
//                 </div>
//               </div>
//               <button
//                 style={styles.refreshBtn}
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//               >
//                 <RefreshCw
//                   size={18}
//                   style={{
//                     animation: refreshing ? "spin 1s linear infinite" : "none",
//                   }}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* qc admin */}

//         <div style={styles.tabsContainer}>
//           <button
//             style={{
//               ...styles.tabBtn,
//               ...(activeTab === "overview" && styles.activeTabBtn),
//             }}
//             onClick={() => setActiveTab("overview")}
//           >
//             <TrendingUp size={16} />
//             Overview
//           </button>
//           <button
//             style={{
//               ...styles.tabBtn,
//               ...(activeTab === "submissions" && styles.activeTabBtn),
//             }}
//             onClick={() => setActiveTab("submissions")}
//           >
//             <FileText size={16} />
//             My Submissions
//           </button>
//           <button
//             style={{
//               ...styles.tabBtn,
//               ...(activeTab === "performers" && styles.activeTabBtn),
//             }}
//             onClick={() => setActiveTab("performers")}
//           >
//             <Users size={16} />
//             Top Performers
//           </button>
//         </div>

//         {activeTab === "overview" && (
//           <div style={styles.content}>
//             <div style={styles.statsGrid}>
//               <div style={styles.statCard}>
//                 <div style={styles.statHeader}>
//                   <FileText size={24} color="#3b82f6" />
//                   <span style={styles.statLabel}>Total Reports</span>
//                 </div>
//                 <div style={styles.statValue}>{stats.totalReports}</div>
//               </div>

//               <div style={styles.statCard}>
//                 <div style={styles.statHeader}>
//                   <Activity size={24} color="#10b981" />
//                   <span style={styles.statLabel}>Total Evaluations</span>
//                 </div>
//                 <div style={styles.statValue}>{stats.totalEvaluations}</div>
//               </div>

//               <div style={styles.statCard}>
//                 <div style={styles.statHeader}>
//                   <AlertTriangle size={24} color="#ef4444" />
//                   <span style={styles.statLabel}>Total Escalations</span>
//                 </div>
//                 <div style={styles.statValue}>{stats.totalEscalations}</div>
//               </div>

//               <div style={styles.statCard}>
//                 <div style={styles.statHeader}>
//                   <TrendingUp size={24} color="#8b5cf6" />
//                   <span style={styles.statLabel}>Performance Score</span>
//                 </div>
//                 <div style={styles.statValue}>{stats.performanceScore}</div>
//               </div>
//             </div>

//             <div style={styles.chartsGrid}>
//               <div style={styles.chartCard}>
//                 <div style={styles.chartHeader}>
//                   <h3 style={styles.chartTitle}>Weekly Activity</h3>
//                   <span style={styles.chartBadge}>Last 7 Days</span>
//                 </div>
//                 <div style={styles.chartBody}>
//                   {weeklyData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                         <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
//                         <YAxis stroke="#64748b" fontSize={12} />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "#ffffff",
//                             border: "1px solid #e2e8f0",
//                             borderRadius: "8px",
//                           }}
//                         />
//                         <Legend />
//                         <Bar
//                           dataKey="Evaluations"
//                           fill="#3b82f6"
//                           radius={[4, 4, 0, 0]}
//                         />
//                         <Bar
//                           dataKey="Escalations"
//                           fill="#ef4444"
//                           radius={[4, 4, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div style={styles.noData}>No data available</div>
//                   )}
//                 </div>
//               </div>

//               <div style={styles.chartCard}>
//                 <div style={styles.chartHeader}>
//                   <h3 style={styles.chartTitle}>Monthly Trend</h3>
//                   <span style={styles.chartBadge}>Last 6 Months</span>
//                 </div>
//                 <div style={styles.chartBody}>
//                   {monthlyTrend.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <LineChart data={monthlyTrend}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                         <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
//                         <YAxis stroke="#64748b" fontSize={12} />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "#ffffff",
//                             border: "1px solid #e2e8f0",
//                             borderRadius: "8px",
//                           }}
//                         />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="Evaluations"
//                           stroke="#3b82f6"
//                           strokeWidth={2}
//                           dot={{ r: 4 }}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="Escalations"
//                           stroke="#ef4444"
//                           strokeWidth={2}
//                           dot={{ r: 4 }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div style={styles.noData}>No trend data</div>
//                   )}
//                 </div>
//               </div>

//               <div style={styles.chartCard}>
//                 <div style={styles.chartHeader}>
//                   <h3 style={styles.chartTitle}>Priority Distribution</h3>
//                   <span style={styles.chartBadge}>Escalations</span>
//                 </div>
//                 <div style={styles.chartBody}>
//                   {priorityData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <PieChart>
//                         <Pie
//                           data={priorityData}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           label={({ name, percent }) =>
//                             `${name}: ${(percent * 100).toFixed(0)}%`
//                           }
//                           outerRadius={90}
//                           dataKey="value"
//                         >
//                           {priorityData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div style={styles.noData}>No priority data</div>
//                   )}
//                 </div>
//               </div>

//               <div style={styles.chartCard}>
//                 <div style={styles.chartHeader}>
//                   <h3 style={styles.chartTitle}>Performance Metrics</h3>
//                   <span style={styles.chartBadge}>Overview</span>
//                 </div>
//                 <div style={styles.chartBody}>
//                   {radarData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <RadarChart data={radarData}>
//                         <PolarGrid stroke="#e2e8f0" />
//                         <PolarAngleAxis
//                           dataKey="metric"
//                           stroke="#64748b"
//                           fontSize={12}
//                         />
//                         <PolarRadiusAxis stroke="#64748b" fontSize={10} />
//                         <Radar
//                           name="Performance"
//                           dataKey="value"
//                           stroke="#3b82f6"
//                           fill="#3b82f6"
//                           fillOpacity={0.3}
//                         />
//                         <Tooltip />
//                       </RadarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div style={styles.noData}>No performance data</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "submissions" && (
//           <div style={styles.content}>
//             <div style={styles.submissionsTabs}>
//               <button
//                 style={{
//                   ...styles.subTabBtn,
//                   ...(submissionsTab === "evaluations" &&
//                     styles.activeSubTabBtn),
//                 }}
//                 onClick={() => setSubmissionsTab("evaluations")}
//               >
//                 Evaluations ({userSubmissions.evaluations.length})
//               </button>
//               <button
//                 style={{
//                   ...styles.subTabBtn,
//                   ...(submissionsTab === "escalations" &&
//                     styles.activeSubTabBtn),
//                 }}
//                 onClick={() => setSubmissionsTab("escalations")}
//               >
//                 Escalations ({userSubmissions.escalations.length})
//               </button>
//               <button
//                 style={{
//                   ...styles.subTabBtn,
//                   ...(submissionsTab === "marketing" && styles.activeSubTabBtn),
//                 }}
//                 onClick={() => setSubmissionsTab("marketing")}
//               >
//                 Marketing ({userSubmissions.marketing.length})
//               </button>
//             </div>

//             {submissionsTab === "evaluations" && (
//               <div style={styles.tableCard}>
//                 {userSubmissions.evaluations.length > 0 ? (
//                   <div style={styles.tableContainer}>
//                     <table style={styles.table}>
//                       <thead>
//                         <tr>
//                           <th style={styles.th}>#</th>
//                           <th style={styles.th}>Source</th>
//                           <th style={styles.th}>Lead ID</th>
//                           <th style={styles.th}>Agent Name</th>
//                           <th style={styles.th}>Team Leader</th>
//                           <th style={styles.th}>Status</th>
//                           <th style={styles.th}>Created</th>
//                           <th style={styles.th}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userSubmissions.evaluations.map((item, index) => (
//                           <tr key={item._id || index} style={styles.tr}>
//                             <td style={styles.td}>{index + 1}</td>
//                             <td style={styles.td}>
//                               {getSourceBadge(item.submissionSource)}
//                             </td>
//                             <td style={styles.td}>{item.leadID || "-"}</td>
//                             <td style={styles.td}>{item.agentName || "-"}</td>
//                             <td style={styles.td}>{item.teamleader || "-"}</td>
//                             <td style={styles.td}>
//                               {getStatusBadge(item.status)}
//                             </td>
//                             <td style={styles.td}>
//                               {formatDate(item.createdAt)}
//                             </td>
//                             <td style={styles.td}>
//                               <div style={styles.actionBtns}>
//                                 <button
//                                   style={styles.editBtn}
//                                   onClick={() =>
//                                     openEditModal(item, "evaluations")
//                                   }
//                                   title="Edit"
//                                 >
//                                   <Edit size={16} />
//                                 </button>
//                                 <button
//                                   style={styles.deleteBtn}
//                                   onClick={() =>
//                                     handleDelete(item._id, "evaluations")
//                                   }
//                                   title="Delete"
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div style={styles.emptyState}>
//                     <FileText size={48} color="#94a3b8" />
//                     <h3 style={styles.emptyTitle}>No Evaluations Yet</h3>
//                     <p style={styles.emptyText}>
//                       Start creating evaluations to see them here
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {submissionsTab === "escalations" && (
//               <div style={styles.tableCard}>
//                 {userSubmissions.escalations.length > 0 ? (
//                   <div style={styles.tableContainer}>
//                     <table style={styles.table}>
//                       <thead>
//                         <tr>
//                           <th style={styles.th}>#</th>
//                           <th style={styles.th}>Source</th>
//                           <th style={styles.th}>Lead ID</th>
//                           <th style={styles.th}>Agent Name</th>
//                           <th style={styles.th}>Team Leader</th>
//                           <th style={styles.th}>Severity</th>
//                           <th style={styles.th}>Status</th>
//                           <th style={styles.th}>Created</th>
//                           <th style={styles.th}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userSubmissions.escalations.map((item, index) => (
//                           <tr key={item._id || index} style={styles.tr}>
//                             <td style={styles.td}>{index + 1}</td>
//                             <td style={styles.td}>
//                               {getSourceBadge(item.submissionSource)}
//                             </td>
//                             <td style={styles.td}>{item.leadID || "-"}</td>
//                             <td style={styles.td}>{item.agentName || "-"}</td>
//                             <td style={styles.td}>{item.teamleader || "-"}</td>
//                             <td style={styles.td}>
//                               {getSeverityBadge(
//                                 item.escSeverity || item.severity
//                               )}
//                             </td>
//                             <td style={styles.td}>
//                               {getStatusBadge(item.status)}
//                             </td>
//                             <td style={styles.td}>
//                               {formatDate(item.createdAt)}
//                             </td>
//                             <td style={styles.td}>
//                               <div style={styles.actionBtns}>
//                                 <button
//                                   style={styles.editBtn}
//                                   onClick={() =>
//                                     openEditModal(item, "escalations")
//                                   }
//                                   title="Edit"
//                                 >
//                                   <Edit size={16} />
//                                 </button>
//                                 <button
//                                   style={styles.deleteBtn}
//                                   onClick={() =>
//                                     handleDelete(item._id, "escalations")
//                                   }
//                                   title="Delete"
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div style={styles.emptyState}>
//                     <AlertTriangle size={48} color="#94a3b8" />
//                     <h3 style={styles.emptyTitle}>No Escalations Yet</h3>
//                     <p style={styles.emptyText}>
//                       Start creating escalations to see them here
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {submissionsTab === "marketing" && (
//               <div style={styles.tableCard}>
//                 {userSubmissions.marketing.length > 0 ? (
//                   <div style={styles.tableContainer}>
//                     <table style={styles.table}>
//                       <thead>
//                         <tr>
//                           <th style={styles.th}>#</th>
//                           <th style={styles.th}>Campaign Name</th>
//                           <th style={styles.th}>Campaign Type</th>
//                           <th style={styles.th}>Budget</th>
//                           <th style={styles.th}>Start Date</th>
//                           <th style={styles.th}>End Date</th>
//                           <th style={styles.th}>Status</th>
//                           <th style={styles.th}>Created</th>
//                           <th style={styles.th}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userSubmissions.marketing.map((item, index) => (
//                           <tr key={item._id || index} style={styles.tr}>
//                             <td style={styles.td}>{index + 1}</td>
//                             <td style={styles.td}>
//                               {item.campaignName || "-"}
//                             </td>
//                             <td style={styles.td}>
//                               {item.campaignType || "-"}
//                             </td>
//                             <td style={styles.td}>{item.budget || "-"}</td>
//                             <td style={styles.td}>{item.startDate || "-"}</td>
//                             <td style={styles.td}>{item.endDate || "-"}</td>
//                             <td style={styles.td}>
//                               {getStatusBadge(item.status)}
//                             </td>
//                             <td style={styles.td}>
//                               {formatDate(item.createdAt)}
//                             </td>
//                             <td style={styles.td}>
//                               <div style={styles.actionBtns}>
//                                 <button
//                                   style={styles.editBtn}
//                                   onClick={() =>
//                                     openEditModal(item, "marketing")
//                                   }
//                                   title="Edit"
//                                 >
//                                   <Edit size={16} />
//                                 </button>
//                                 <button
//                                   style={styles.deleteBtn}
//                                   onClick={() =>
//                                     handleDelete(item._id, "marketing")
//                                   }
//                                   title="Delete"
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div style={styles.emptyState}>
//                     <Activity size={48} color="#94a3b8" />
//                     <h3 style={styles.emptyTitle}>
//                       No Marketing Campaigns Yet
//                     </h3>
//                     <p style={styles.emptyText}>
//                       Start creating campaigns to see them here
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "performers" && (
//           <div style={styles.content}>
//             <div style={styles.performersHeader}>
//               <h2 style={styles.sectionTitle}>Top 5 Performers</h2>
//               <p style={styles.sectionSubtitle}>
//                 Ranked by evaluations, escalations, and performance score
//               </p>
//             </div>

//             {topPerformers.length > 0 ? (
//               <div style={styles.performersGrid}>
//                 {topPerformers.map((performer, index) => (
//                   <div key={index} style={styles.performerCard}>
//                     <div style={styles.performerRank}>
//                       {index === 0
//                         ? "🥇"
//                         : index === 1
//                         ? "🥈"
//                         : index === 2
//                         ? "🥉"
//                         : `#${index + 1}`}
//                     </div>

//                     <div style={styles.performerAvatar}>
//                       {performer.name?.charAt(0).toUpperCase() || "?"}
//                     </div>

//                     <h3 style={styles.performerName}>{performer.name}</h3>
//                     <p style={styles.performerEmail}>{performer.email}</p>

//                     <div style={styles.performerStats}>
//                       <div style={styles.performerStat}>
//                         <span style={styles.performerStatValue}>
//                           {parseFloat(performer.performanceScore).toFixed(1)}
//                         </span>
//                         <span style={styles.performerStatLabel}>Score</span>
//                       </div>
//                       <div style={styles.performerStat}>
//                         <span style={styles.performerStatValue}>
//                           {performer.totalEvaluations}
//                         </span>
//                         <span style={styles.performerStatLabel}>
//                           Evaluations
//                         </span>
//                       </div>
//                       <div style={styles.performerStat}>
//                         <span style={styles.performerStatValue}>
//                           {performer.totalEscalations}
//                         </span>
//                         <span style={styles.performerStatLabel}>
//                           Escalations
//                         </span>
//                       </div>
//                     </div>

//                     <div style={styles.performerMetrics}>
//                       <div style={styles.metricRow}>
//                         <span style={styles.metricLabel}>Completion Rate</span>
//                         <span style={styles.metricValue}>
//                           {parseFloat(performer.completionRate).toFixed(1)}%
//                         </span>
//                       </div>
//                       <div style={styles.progressBar}>
//                         <div
//                           style={{
//                             ...styles.progressFill,
//                             width: `${performer.completionRate}%`,
//                           }}
//                         />
//                       </div>

//                       <div style={styles.metricRow}>
//                         <span style={styles.metricLabel}>Escalation Rate</span>
//                         <span style={styles.metricValue}>
//                           {parseFloat(performer.escalationRate).toFixed(1)}%
//                         </span>
//                       </div>
//                       <div style={styles.progressBar}>
//                         <div
//                           style={{
//                             ...styles.progressFill,
//                             width: `${performer.escalationRate}%`,
//                             backgroundColor: "#ef4444",
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div style={styles.emptyState}>
//                 <Users size={48} color="#94a3b8" />
//                 <h3 style={styles.emptyTitle}>No Performance Data Yet</h3>
//                 <p style={styles.emptyText}>
//                   Evaluations and escalations are needed to rank performers
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     fontFamily:
//       '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
//     backgroundColor: "#f8fafc",
//     minHeight: "100vh",
//     padding: "1.5rem 1rem",
//   },
//   container: {
//     maxWidth: "1400px",
//     margin: "0 auto",
//   },
//   header: {
//     backgroundColor: "#ffffff",
//     borderRadius: "16px",
//     padding: "1.75rem 2rem",
//     marginBottom: "1.5rem",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//     border: "1px solid #e2e8f0",
//   },
//   headerContent: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: "1.5rem",
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   title: {
//     fontSize: "1.75rem",
//     fontWeight: "700",
//     color: "#1e293b",
//     margin: "0 0 0.4rem 0",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//   },
//   subtitle: {
//     color: "#64748b",
//     fontSize: "0.95rem",
//     margin: "0 0 0.4rem 0",
//   },
//   time: {
//     display: "inline-block",
//     fontSize: "0.85rem",
//     color: "#2563eb",
//     fontWeight: "500",
//     background: "rgba(37, 99, 235, 0.08)",
//     padding: "4px 12px",
//     borderRadius: "6px",
//     marginTop: "4px",
//   },
//   headerRight: {
//     display: "flex",
//     gap: "1rem",
//     alignItems: "center",
//   },
//   userCard: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//     padding: "0.5rem 1rem",
//     backgroundColor: "#f8fafc",
//     borderRadius: "10px",
//     border: "1px solid #e2e8f0",
//   },
//   avatar: {
//     width: "42px",
//     height: "42px",
//     borderRadius: "10px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "1rem",
//     fontWeight: "600",
//     boxShadow: "0 4px 8px rgba(102, 126, 234, 0.3)",
//   },
//   userInfo: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.125rem",
//   },
//   userName: {
//     fontWeight: "600",
//     color: "#1e293b",
//     fontSize: "0.875rem",
//   },
//   userRole: {
//     color: "#64748b",
//     fontSize: "0.75rem",
//     fontWeight: "500",
//   },
//   refreshBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     padding: "0.625rem 1.125rem",
//     borderRadius: "8px",
//     fontWeight: "500",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     transition: "all 0.2s",
//     boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
//   },
//   tabsContainer: {
//     display: "flex",
//     gap: "0.5rem",
//     marginBottom: "1.5rem",
//     backgroundColor: "#ffffff",
//     padding: "0.4rem",
//     borderRadius: "12px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//     border: "1px solid #e2e8f0",
//   },
//   tabBtn: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "0.5rem",
//     padding: "0.65rem 0.9rem",
//     border: "none",
//     backgroundColor: "transparent",
//     borderRadius: "8px",
//     fontSize: "0.85rem",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     color: "#64748b",
//   },
//   activeTabBtn: {
//     backgroundColor: "#3b82f6",
//     color: "white",
//     boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
//   },
//   content: {
//     animation: "fadeIn 0.3s ease",
//   },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
//     gap: "1.25rem",
//     marginBottom: "1.5rem",
//   },
//   statCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: "14px",
//     padding: "1.5rem",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//     border: "1px solid #e2e8f0",
//     transition: "all 0.2s",
//   },
//   statHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//     marginBottom: "1rem",
//   },
//   statLabel: {
//     color: "#64748b",
//     fontSize: "0.85rem",
//     fontWeight: "500",
//   },
//   statValue: {
//     fontSize: "2rem",
//     fontWeight: "700",
//     color: "#1e293b",
//   },
//   chartsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
//     gap: "1.25rem",
//     marginBottom: "1.5rem",
//   },
//   chartCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: "14px",
//     overflow: "hidden",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//     border: "1px solid #e2e8f0",
//   },
//   chartHeader: {
//     backgroundColor: "#f8fafc",
//     padding: "1.125rem 1.5rem",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottom: "1px solid #e2e8f0",
//   },
//   chartTitle: {
//     color: "#1e293b",
//     fontSize: "0.95rem",
//     fontWeight: "600",
//     margin: 0,
//   },
//   chartBadge: {
//     backgroundColor: "#e0f2fe",
//     color: "#0369a1",
//     padding: "0.375rem 0.75rem",
//     borderRadius: "6px",
//     fontSize: "0.75rem",
//     fontWeight: "500",
//   },
//   chartBody: {
//     padding: "1.5rem",
//   },
//   noData: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "300px",
//     color: "#94a3b8",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//   },
//   summaryGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "1.5rem",
//   },
//   summaryCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: "12px",
//     padding: "1.5rem",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//     border: "1px solid #e2e8f0",
//     textAlign: "center",
//   },
//   summaryLabel: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     marginBottom: "0.5rem",
//   },
//   summaryValue: {
//     fontSize: "2rem",
//     fontWeight: "700",
//     color: "#1e293b",
//   },
//   submissionsTabs: {
//     display: "flex",
//     gap: "0.5rem",
//     marginBottom: "1.5rem",
//     backgroundColor: "#ffffff",
//     padding: "0.375rem",
//     borderRadius: "10px",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//     border: "1px solid #e2e8f0",
//   },
//   subTabBtn: {
//     flex: 1,
//     padding: "0.625rem 1rem",
//     border: "none",
//     backgroundColor: "transparent",
//     borderRadius: "8px",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     color: "#64748b",
//   },
//   activeSubTabBtn: {
//     backgroundColor: "#3b82f6",
//     color: "white",
//   },
//   tableCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: "12px",
//     padding: "1.5rem",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//     border: "1px solid #e2e8f0",
//   },
//   tableContainer: {
//     overflowX: "auto",
//     borderRadius: "8px",
//     border: "1px solid #e2e8f0",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "900px",
//   },
//   th: {
//     textAlign: "left",
//     padding: "1rem",
//     backgroundColor: "#f8fafc",
//     color: "#64748b",
//     fontSize: "0.75rem",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//     borderBottom: "1px solid #e2e8f0",
//   },
//   tr: {
//     borderBottom: "1px solid #f1f5f9",
//     transition: "backgroundColor 0.2s",
//   },
//   td: {
//     padding: "1rem",
//     color: "#1e293b",
//     fontSize: "0.875rem",
//   },
//   badge: {
//     display: "inline-flex",
//     padding: "0.25rem 0.75rem",
//     borderRadius: "6px",
//     fontSize: "0.75rem",
//     fontWeight: "500",
//   },
//   severityBadge: {
//     backgroundColor: "#fee2e2",
//     color: "#dc2626",
//     padding: "0.25rem 0.75rem",
//     borderRadius: "6px",
//     fontSize: "0.75rem",
//     fontWeight: "500",
//     border: "1px solid #fecaca",
//   },
//   actionBtns: {
//     display: "flex",
//     gap: "0.5rem",
//   },
//   editBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "0.5rem",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     transition: "backgroundColor 0.2s",
//   },
//   deleteBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "0.5rem",
//     backgroundColor: "#ef4444",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     transition: "backgroundColor 0.2s",
//   },
//   emptyState: {
//     textAlign: "center",
//     padding: "4rem 2rem",
//   },
//   emptyTitle: {
//     fontSize: "1.25rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     margin: "1rem 0 0.5rem 0",
//   },
//   emptyText: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     margin: 0,
//   },
//   performersHeader: {
//     marginBottom: "2rem",
//   },
//   sectionTitle: {
//     fontSize: "1.5rem",
//     fontWeight: "700",
//     color: "#1e293b",
//     margin: "0 0 0.5rem 0",
//   },
//   sectionSubtitle: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     margin: 0,
//   },
//   performersGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//     gap: "1.5rem",
//   },
//   performerCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: "12px",
//     padding: "2rem",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//     border: "1px solid #e2e8f0",
//     position: "relative",
//   },
//   performerRank: {
//     position: "absolute",
//     top: "1rem",
//     right: "1rem",
//     fontSize: "1.5rem",
//   },
//   performerAvatar: {
//     width: "64px",
//     height: "64px",
//     borderRadius: "50%",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "1.5rem",
//     fontWeight: "600",
//     margin: "0 auto 1rem",
//   },
//   performerName: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     margin: "0 0 0.25rem 0",
//     textAlign: "center",
//   },
//   performerEmail: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     margin: "0 0 1.5rem 0",
//     textAlign: "center",
//   },
//   performerStats: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: "1rem",
//     marginBottom: "1.5rem",
//     padding: "1rem",
//     backgroundColor: "#f8fafc",
//     borderRadius: "8px",
//   },
//   performerStat: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "0.25rem",
//   },
//   performerStatValue: {
//     fontSize: "1.5rem",
//     fontWeight: "700",
//     color: "#1e293b",
//   },
//   performerStatLabel: {
//     fontSize: "0.75rem",
//     color: "#64748b",
//     fontWeight: "500",
//   },
//   performerMetrics: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//   },
//   metricRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "0.5rem",
//   },
//   metricLabel: {
//     fontSize: "0.875rem",
//     color: "#64748b",
//     fontWeight: "500",
//   },
//   metricValue: {
//     fontSize: "0.875rem",
//     color: "#1e293b",
//     fontWeight: "600",
//   },
//   progressBar: {
//     width: "100%",
//     height: "6px",
//     backgroundColor: "#e2e8f0",
//     borderRadius: "10px",
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#3b82f6",
//     borderRadius: "10px",
//     transition: "width 0.8s ease",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "70vh",
//     gap: "1.5rem",
//   },
//   spinner: {
//     width: "48px",
//     height: "48px",
//     border: "4px solid #e2e8f0",
//     borderTop: "4px solid #3b82f6",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },
//   loadingText: {
//     color: "#64748b",
//     fontSize: "1rem",
//     fontWeight: "500",
//   },
//   errorContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "60vh",
//     gap: "1.5rem",
//     textAlign: "center",
//     backgroundColor: "#ffffff",
//     borderRadius: "12px",
//     padding: "3rem",
//     maxWidth: "600px",
//     margin: "0 auto",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//     border: "1px solid #e2e8f0",
//   },
//   errorTitle: {
//     color: "#dc2626",
//     margin: 0,
//     fontSize: "1.5rem",
//     fontWeight: "600",
//   },
//   errorText: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     margin: 0,
//   },
//   retryBtn: {
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     padding: "0.75rem 1.5rem",
//     borderRadius: "8px",
//     fontWeight: "500",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     transition: "background-color 0.2s",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//   },
// };

// export default QcDashboard;
import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Loader2,
  Crown,
  Mail,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileSearch,
  UserCheck,
  Zap,
  Users,
  FileText,
  Archive,
  Calendar,
  Globe,
  Database,
  ArrowRight,
  Filter,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getallusersApi,
  getProfileApi,
  patchUserApi,
  deleteUserApi,
} from "../features/userApis";
import { getEvaluationsApi } from "../features/evaluationApi";
import { normalizeRole, ROLES } from "../utils/roles";
import WeeklyStatsChart from "./WeeklyStatsChart";
import { getEscalationsApi } from "../features/escalationsApi";
import { getAllMarketingAdminApi } from "../features/marketingApi";

const QcList = () => {
  const [agents, setAgents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [teamStatusFilter, setTeamStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("team");
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "" });
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileRes, usersRes, evalRes, escRes, marketingRes] =
          await Promise.allSettled([
          getProfileApi(),
          getallusersApi(),
          getEvaluationsApi(),
          getEscalationsApi(),
            getAllMarketingAdminApi(),
        ]);

        // 1. Handle Profile
        if (profileRes.status === "fulfilled" && profileRes.value?.data) {
          const pData = profileRes.value.data;
          const userProfile =
            pData.user ||
            (pData.data && !Array.isArray(pData.data) ? pData.data : pData);
          if (userProfile && (userProfile._id || userProfile.email)) {
            setCurrentUser(userProfile);
          }
        }

        // 2. Handle Users
        if (usersRes.status === "fulfilled" && usersRes.value?.data) {
          const uData = usersRes.value.data;
          const rawUsers = Array.isArray(uData.data)
            ? uData.data
            : Array.isArray(uData)
            ? uData
            : [];
          setAllUsers(rawUsers);
          const qcTeamMembers = rawUsers.filter((u) => {
            const r = normalizeRole(u.role);
            return r === ROLES.QC_USER || r === ROLES.QC_ADMIN;
          });
          setAgents(qcTeamMembers);
        }

        // 3. Handle Forms (Evaluations / Escalations / Marketing)
        const evalRows =
          evalRes.status === "fulfilled" ? evalRes.value?.data?.data || evalRes.value?.data || [] : [];
        const escRows =
          escRes.status === "fulfilled" ? escRes.value?.data?.data || escRes.value?.data || [] : [];
        const marketingRows =
          marketingRes.status === "fulfilled"
            ? marketingRes.value?.data || marketingRes.value || []
            : [];

        const userIndex = new Map(
          (usersRes.status === "fulfilled" && usersRes.value?.data?.data
            ? usersRes.value.data.data
            : []
          ).map((u) => [String(u.email || "").toLowerCase(), u])
        );

        const normalizeSource = (val) =>
          (val || "").toString().toLowerCase().trim();
        const normalizeStatus = (val) =>
          (val || "").toString().toLowerCase().trim();

        const getSubmitter = (row) => {
          const email =
            (row?.owner?.email ||
              row?.useremail ||
              row?.userEmail ||
              row?.email ||
              "").toString();
          const lower = email.toLowerCase();
          const fromUsers = lower ? userIndex.get(lower) : null;
          return {
            email: email || "-",
            name:
              row?.owner?.name ||
              fromUsers?.name ||
              row?.agentName ||
              "Unknown",
          };
        };

        const getSourceAndStatus = (row) => {
          const submissionSource = normalizeSource(row?.submissionSource);
          const status = normalizeStatus(row?.status);

          const source =
            submissionSource === "bitrix"
              ? "bitrix"
              : submissionSource === "frontend"
              ? "frontend"
              : normalizeSource(row?.source).includes("bitrix") ||
                normalizeSource(row?.leadsource).includes("bitrix")
              ? "bitrix"
              : "frontend";

          return { source, status: "published" };
        };

        const unify = (rows, type) =>
          (Array.isArray(rows) ? rows : []).map((row) => {
            const submitter = getSubmitter(row);
            const { source, status } = getSourceAndStatus(row);
            return {
              _id: row?._id,
              type,
              source,
              status,
              submitterName: submitter.name,
              submitterEmail: submitter.email,
              createdAt: row?.createdAt,
              leadID: row?.leadID,
              agentName: row?.agentName,
              teamleader: row?.teamleader,
              raw: row,
            };
          });

        const combined = [
          ...unify(evalRows, "evaluation"),
          ...unify(escRows, "escalation"),
          ...unify(marketingRows, "marketing"),
        ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setForms(combined);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const tab = location?.state?.tab;
    if (tab === "team") {
      setActiveTab(tab);
    }
    const teamStatus = location?.state?.teamStatus; // 'active' | 'inactive' | 'all'
    if (teamStatus === "active" || teamStatus === "inactive" || teamStatus === "all") {
      setTeamStatusFilter(teamStatus);
      setActiveTab("team");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminClick = (agent) => {
    // Pass email explicitly so AdminDetails knows to fetch data by "useremail" (submitter)
    // rather than by "agentName" (subject).
    const email = (agent?.email || "").toString();
    const name = (agent?.name || "").toString();
    const param = email && email.includes("@") ? encodeURIComponent(email) : encodeURIComponent(name);
    navigate(`/dashboard/qc-team/${param}`, { state: { email } });
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditFormData({ name: "", email: "", role: "" });
  };

  const handleSaveUser = async () => {
    if (!editingUser?._id) return;
    try {
      setSavingUser(true);
      const res = await patchUserApi(editingUser._id, editFormData);
      const updated = res?.data?.data || res?.data || null;
      if (updated) {
        setAgents((prev) =>
          prev.map((u) => (u._id === editingUser._id ? { ...u, ...updated } : u))
        );
      }
      closeEditModal();
    } catch (e) {
      console.error("Failed to update user:", e);
    } finally {
      setSavingUser(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser?._id) return;
    try {
      setDeleting(true);
      await deleteUserApi(deletingUser._id);
      setAgents((prev) => prev.filter((u) => u._id !== deletingUser._id));
      setDeletingUser(null);
    } catch (e) {
      console.error("Failed to delete user:", e);
    } finally {
      setDeleting(false);
    }
  };

  // --- QC TEAM LOGIC ---
  const processedAgents = useMemo(() => {
    let combinedList = [...agents];
    if (currentUser) {
      const existsIndex = combinedList.findIndex(
        (a) =>
          a._id === currentUser._id ||
          (a.email && a.email === currentUser.email)
      );
      if (existsIndex > -1) {
        combinedList[existsIndex] = {
          ...combinedList[existsIndex],
          ...currentUser,
        };
      } else if (
        currentUser.role === "admin" ||
        currentUser.role === "superadmin"
      ) {
        combinedList.unshift(currentUser);
      }
    }
    return combinedList.map((agent) => {
      const isMe =
        currentUser &&
        ((agent._id && agent._id === currentUser._id) ||
          (agent.email && agent.email === currentUser.email));
      if (isMe) {
        return {
          ...agent,
          isOnline: true,
          currentActivity: "Evaluations & Escalation",
          name: currentUser.name || agent.name,
          email: currentUser.email || agent.email,
        };
      }
      return agent;
    });
  }, [agents, currentUser]);

  const filteredAdmins = useMemo(() => {
    return processedAgents
      .filter((admin) => {
        const matchesSearch =
          (admin.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTeamStatus =
          teamStatusFilter === "active"
            ? admin.isOnline
            : teamStatusFilter === "inactive"
            ? !admin.isOnline
            : true;
        const matchesStatus = filterOnline ? admin.isOnline : true;
        return matchesSearch && matchesTeamStatus && matchesStatus;
      })
      .sort((a, b) => {
        const isMeA =
          currentUser &&
          ((a._id && a._id === currentUser._id) ||
            (a.email && a.email === currentUser.email));
        if (isMeA) return -1;
        return a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1;
      });
  }, [processedAgents, searchTerm, filterOnline, teamStatusFilter, currentUser]);

  const publishedRecords = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const match = (v) => (v || "").toString().toLowerCase().includes(term);
    return forms.filter(
      (f) =>
        match(f.submitterName) ||
        match(f.submitterEmail) ||
        match(f.agentName) ||
        match(f.teamleader) ||
        match(f.leadID) ||
        match(f.type)
    );
  }, [forms, searchTerm]);

  const stats = useMemo(() => {
    return {
      totalAgents: processedAgents.length,
      onlineAgents: processedAgents.filter((a) => a.isOnline).length,
      publishedCount: publishedRecords.length,
    };
  }, [processedAgents, publishedRecords]);

  const getActivityIcon = (activity) => {
    if (!activity) return <Clock className="w-3.5 h-3.5" />;
    const act = activity.toLowerCase();
    if (act.includes("escalation"))
      return <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />;
    if (act.includes("evaluat"))
      return <FileSearch className="w-3.5 h-3.5 text-blue-600" />;
    return <UserCheck className="w-3.5 h-3.5 text-green-600" />;
  };

  const renderEmptyState = (title, subtitle) => (
    <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 m-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
        <Search className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-slate-900 font-semibold text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">{subtitle}</p>
    </div>
  );

  const getTypeBadge = (type) => {
    if (type === "evaluation") return "Evaluation";
    if (type === "escalation") return "Escalation";
    return "Marketing";
  };

  const getTypeColor = (type) => {
    if (type === "evaluation") return "bg-blue-600";
    if (type === "escalation") return "bg-amber-500";
    return "bg-indigo-600";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="font-bold text-slate-800">Edit Member</div>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                disabled={savingUser}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Role
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                  value={editFormData.role}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, role: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={closeEditModal}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                disabled={savingUser}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-60"
                disabled={savingUser}
              >
                {savingUser ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="font-bold text-slate-800">Delete Member</div>
              <button
                onClick={() => setDeletingUser(null)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                disabled={deleting}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600">
                Delete <span className="font-semibold text-slate-800">{deletingUser.name}</span>?
                This cannot be undone.
              </p>
            </div>
            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Details Modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${getTypeColor(selectedForm.type)}`}>
                  {getTypeBadge(selectedForm.type)}
                </span>
                <span className="text-sm text-slate-600">
                  Published • {selectedForm.source === "bitrix" ? "Bitrix" : "Frontend"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Submitted By</div>
                  <div className="font-semibold text-slate-800">{selectedForm.submitterName}</div>
                  <div className="text-sm text-slate-500">{selectedForm.submitterEmail}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created</div>
                  <div className="text-sm text-slate-700">
                    {selectedForm.createdAt ? new Date(selectedForm.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lead ID</div>
                  <div className="text-sm text-slate-700">{selectedForm.leadID || "-"}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agent / Team Lead</div>
                  <div className="text-sm text-slate-700">
                    {selectedForm.agentName || "-"} {selectedForm.teamleader ? `• ${selectedForm.teamleader}` : ""}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">All Fields</div>
                <pre className="text-xs text-slate-700 overflow-auto m-0">
{JSON.stringify(selectedForm.raw, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-900/10">
              <BarChart3 className="text-white w-7 h-7" />
            </div>
            QC Control Center
          </h1>
          <p className="text-slate-500 mt-2 text-base font-medium ml-1">
            Real-time evaluation monitoring and record management system.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Agents
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {stats.onlineAgents}
              </span>
              <span className="text-sm text-slate-400 font-medium">
                / {stats.totalAgents} Online
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Published
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-800">
              {stats.publishedCount}
            </span>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Weekly QC Activity</h3>
        <WeeklyStatsChart />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === "team"
                ? "text-blue-700 bg-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Users
              className={`w-4 h-4 ${
                activeTab === "team" ? "text-blue-600" : "text-slate-400"
              }`}
            />
            QC Team
            {activeTab === "team" && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
              placeholder={
                activeTab === "team"
                  ? "Find agent by name..."
                  : "Search records..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "team" && (
            <button
              onClick={() => setFilterOnline(!filterOnline)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                filterOnline
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterOnline ? "Showing Online Only" : "Filter Status"}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p className="text-sm font-medium text-slate-500">
                Syncing database...
              </p>
            </div>
          ) : (
            <div className="p-4">
              {/* --- TEAM TAB --- */}
              {activeTab === "team" && (
                <div className="grid grid-cols-1 gap-3">
                  {filteredAdmins.length === 0
                    ? renderEmptyState(
                        "No team members found",
                        "Try adjusting your search filters"
                      )
                    : filteredAdmins.map((agent) => {
                        const isCurrentUser =
                          currentUser &&
                          ((agent._id && agent._id === currentUser._id) ||
                            (agent.email && agent.email === currentUser.email));
                        const isOnline = agent.isOnline;
                        return (
                          <div
                            key={agent._id || agent.email || Math.random()}
                            onClick={() => handleAdminClick(agent)}
                            className={`group relative p-4 flex flex-col sm:flex-row sm:items-center gap-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 cursor-pointer ${
                              isCurrentUser
                                ? "ring-2 ring-blue-500/10 bg-blue-50/10"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                <div
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm transform group-hover:scale-105 transition-transform duration-200 ${
                                    agent.role === "superadmin"
                                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                      : isCurrentUser
                                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                                      : "bg-gradient-to-br from-slate-400 to-slate-500"
                                  }`}
                                >
                                  {agent.name
                                    ? agent.name.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                                <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 bg-white rounded-full items-center justify-center">
                                  <span
                                    className={`relative inline-flex rounded-full h-3 w-3 ${
                                      isOnline ? "bg-green-500" : "bg-slate-300"
                                    }`}
                                  >
                                    {isOnline && (
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    )}
                                  </span>
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3
                                    className={`font-bold text-lg truncate ${
                                      isCurrentUser
                                        ? "text-blue-900"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {agent.name || "Unknown User"}
                                  </h3>
                                  {isCurrentUser && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded border border-blue-200">
                                      You
                                    </span>
                                  )}
                                  {agent.role === "superadmin" && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded text-amber-700 border border-amber-100">
                                      <Crown className="w-3 h-3 fill-amber-500" />
                                      <span className="text-[10px] font-bold uppercase">
                                        Owner
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span className="truncate">
                                    {agent.email || "No email"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 pl-20 sm:pl-0">
                              <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm transition-colors ${
                                  isOnline
                                    ? "bg-green-50/50 border-green-100 text-green-800"
                                    : "bg-slate-50 border-slate-200 text-slate-500"
                                }`}
                              >
                                {isOnline ? (
                                  <>
                                    <span
                                      className={`flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm`}
                                    >
                                      {getActivityIcon(agent.currentActivity)}
                                    </span>
                                    <span className="font-semibold">
                                      {agent.currentActivity || "Online"}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>
                                      Offline{" "}
                                      {agent.lastActive
                                        ? `• ${agent.lastActive}`
                                        : ""}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-end sm:w-auto pl-20 sm:pl-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1.5">
                              <button
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(agent);
                                }}
                                title="Edit"
                              >
                                <SquarePen className="w-5 h-5" />
                              </button>
                              {!isCurrentUser && (
                                <button
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingUser(agent);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <ArrowRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QcList;

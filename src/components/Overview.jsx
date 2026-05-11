// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";
// import axios from "axios";

// import {
//   onlineUsersCountApi,
//   totalUserCountApi,
//   getallusersApi,
//   patchUserApi,
//   deleteUserApi,
// } from "../features/userApis";
// import {
//   totalEscalationCountsApi,
//   getEscalationAnalyticsApi,
// } from "../features/escalationsApi";
// import {
//   totalEvaluationCountsApi,
//   getEvaluationAnalyticsApi,
// } from "../features/evaluationApi";
// import {
//   totalMarketingCountsApi,
//   getMarketingAnalyticsApi,
// } from "../features/marketingApi";

// import { LeadRegister } from "../features/userApis";
// import {
//   Button,
//   Modal,
//   Form,
//   Alert,
//   Tab,
//   Tabs,
//   Spinner,
// } from "react-bootstrap";
// import {
//   Crown,
//   Users,
//   Search,
//   Mail,
//   Shield,
//   UserCheck,
//   XCircle,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { getAgentFormSubmitsApi } from "../features/analytics";
// import EscalationRatingPieChart from "./admin/escalation/EscalationRatingPieChart";
// import jwtDecode from "jwt-decode";
// import EvaluationsBarChart from "./EvaluationsBarChart";
// import ReportDownload from "./ReportDownload";
// import DailyEscalationChart from "./DailyEscalationChart";
// import DailyMarketingLineChart from "./DailyMarketingLineChart.jsx";

// const COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#AA336A",
//   "#6633AA",
// ];

// const Overview = () => {
//   const navigate = useNavigate();
//   const [totalUsers, setTotalUsers] = useState(null);
//   const [onlineUsersCount, setOnlineUsersCount] = useState(null);
//   const [totalEscalationCounts, setTotalEscalationCounts] = useState(null);
//   const [totalEvaluationCounts, setTotalEvaluationCounts] = useState(null);
//   const [totalMarketingCounts, setTotalMarketingCounts] = useState(null);
//   const [chartData, setChartData] = useState([]);

//   const [escalationAnalytics, setEscalationAnalytics] = useState(null);
//   const [evaluationAnalytics, setEvaluationAnalytics] = useState(null);
//   const [marketingAnalytics, setMarketingAnalytics] = useState(null);

//   const token = localStorage.getItem("token");
//   let username = null;
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       username = decoded.name;
//     } catch (err) {
//       console.error("Invalid token", err);
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("🔄 Fetching agent form submits...");
//         const result = await getAgentFormSubmitsApi();
//         console.log("✅ Agent form submits result:", result);

//         if (result.success) {
//           setChartData(result.data);
//           console.log("✅ Chart data set:", result.data);
//         } else {
//           console.warn("⚠️ Agent form submits returned unsuccessful");
//         }
//       } catch (error) {
//         console.error("❌ Error fetching agent form submits:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Modal states for Add User
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "sales agent",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

//   //Admin & Agents
//   const [admins, setAdmins] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [loadingAgents, setLoadingAgents] = useState(false);

//   // Users Modal states
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [activeTab, setActiveTab] = useState("admin");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [usersError, setUsersError] = useState("");

//   // Edit User Modal states
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     email: "",
//   });
//   const [isEditSubmitting, setIsEditSubmitting] = useState(false);
//   const [editAlertMessage, setEditAlertMessage] = useState({
//     type: "",
//     message: "",
//   });

//   // Delete confirmation states
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletingUser, setDeletingUser] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         console.log("🔄 Starting to fetch all dashboard data...");

//         // Fetch counts separately with individual error handling
//         const fetchWithFallback = async (apiCall, fallback = 0) => {
//           try {
//             const result = await apiCall();
//             return result;
//           } catch (error) {
//             console.warn(`⚠️ API call failed, using fallback:`, error.message);
//             return { count: fallback };
//           }
//         };

//         const fetchAnalyticsWithFallback = async (apiCall, name) => {
//           try {
//             const result = await apiCall();
//             console.log(`✅ ${name} fetched:`, result);
//             return result;
//           } catch (error) {
//             console.warn(`⚠️ ${name} failed:`, error.message);
//             return { data: [] };
//           }
//         };

//         // Fetch basic counts
//         const users = await fetchWithFallback(totalUserCountApi);
//         const escalations = await fetchWithFallback(totalEscalationCountsApi);
//         const evaluations = await fetchWithFallback(totalEvaluationCountsApi);
//         const marketing = await fetchWithFallback(totalMarketingCountsApi);
//         const onlineUsers = await fetchWithFallback(onlineUsersCountApi);

//         // Fetch analytics data with error handling
//         const escalationAnalyticsData = await fetchAnalyticsWithFallback(
//           getEscalationAnalyticsApi,
//           "Escalation Analytics"
//         );
//         const evaluationAnalyticsData = await fetchAnalyticsWithFallback(
//           getEvaluationAnalyticsApi,
//           "Evaluation Analytics"
//         );
//         const marketingAnalyticsData = await fetchAnalyticsWithFallback(
//           getMarketingAnalyticsApi,
//           "Marketing Analytics"
//         );

//         console.log("✅ All data fetched successfully:", {
//           users,
//           escalations,
//           evaluations,
//           marketing,
//           escalationAnalyticsData,
//           evaluationAnalyticsData,
//           marketingAnalyticsData,
//           onlineUsers,
//         });

//         // Set counts
//         setTotalUsers(users?.count ?? 0);
//         setTotalEscalationCounts(escalations?.count ?? 0);
//         setTotalEvaluationCounts(evaluations?.count ?? 0);
//         setTotalMarketingCounts(marketing?.count ?? 0);
//         setOnlineUsersCount(onlineUsers?.count ?? 0);

//         // Store analytics data properly
//         const escalationData =
//           escalationAnalyticsData?.data || escalationAnalyticsData || [];
//         const evaluationData =
//           evaluationAnalyticsData?.data || evaluationAnalyticsData || [];
//         const marketingData =
//           marketingAnalyticsData?.data || marketingAnalyticsData || [];

//         setEscalationAnalytics(escalationData);
//         setEvaluationAnalytics(evaluationData);
//         setMarketingAnalytics(marketingData);

//         console.log("✅ Analytics data set:", {
//           escalationAnalytics: escalationData,
//           evaluationAnalytics: evaluationData,
//           marketingAnalytics: marketingData,
//         });
//       } catch (err) {
//         console.error("❌ Failed to fetch dashboard data:", err);
//         console.error("Error details:", {
//           message: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//       }
//     };

//     fetchAllData();
//   }, []);

//   // Fetch QC list and Agents List
//   useEffect(() => {
//     const fetchTeamMembers = async () => {
//       try {
//         setLoadingAgents(true);
//         console.log("🔄 Fetching team members...");

//         const res = await getallusersApi();
//         console.log("✅ Team members API response:", res);

//         if (Array.isArray(res?.data?.data)) {
//           const allUsersData = res.data.data;

//           // Filter admins (QC Team)
//           const adminsList = allUsersData.filter(
//             (u) => u.role === "admin" || u.role === "superadmin"
//           );
//           setAdmins(adminsList);
//           console.log("✅ Admins (QC Team) filtered:", adminsList);

//           // Filter agents (Sales Agents)
//           const agentsList = allUsersData.filter(
//             (u) => u.role === "agent" || u.role === "sales agent"
//           );
//           setAgents(agentsList);
//           console.log("✅ Agents (Sales Team) filtered:", agentsList);
//         } else {
//           console.warn("⚠️ No users data in expected format");
//           setAdmins([]);
//           setAgents([]);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching team members:", err);
//         setAdmins([]);
//         setAgents([]);
//       } finally {
//         setLoadingAgents(false);
//       }
//     };

//     fetchTeamMembers();
//   }, []);

//   // Fetch all users for the modal
//   const fetchAllUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       setUsersError("");
//       console.log("🔄 Fetching all users for modal...");

//       const res = await getallusersApi();
//       console.log("✅ All users API response:", res);

//       if (Array.isArray(res?.data?.data)) {
//         setAllUsers(res.data.data);
//         console.log("✅ All users set:", res.data.data);
//       } else {
//         console.warn("⚠️ No users data found");
//         setAllUsers([]);
//         setUsersError("No users data found");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching users:", err);
//       setUsersError("Failed to fetch users. Please try again.");
//       setAllUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   // Handle users modal
//   const handleShowUsersModal = () => {
//     setShowUsersModal(true);
//     fetchAllUsers();
//   };

//   const handleCloseUsersModal = () => {
//     setShowUsersModal(false);
//     setSearchTerm("");
//     setUsersError("");
//     setActiveTab("admin");
//   };

//   // Filter users based on role and search term
//   const getFilteredUsers = (role) => {
//     const roleUsers = allUsers.filter((user) => {
//       if (role === "admin") {
//         return user.role === "admin" || user.role === "superadmin";
//       }
//       return user.role === "sales agent" || user.role === "agent";
//     });

//     if (!searchTerm) return roleUsers;

//     return roleUsers.filter(
//       (user) =>
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const adminUsers = getFilteredUsers("admin");
//   const salesAgentUsers = getFilteredUsers("sales agent");
//   const currentUsers = activeTab === "admin" ? adminUsers : salesAgentUsers;

//   // Handle edit user
//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setEditFormData({
//       name: user.name || "",
//       email: user.email || "",
//     });
//     setEditAlertMessage({ type: "", message: "" });
//     setShowEditModal(true);
//   };

//   // Handle delete user
//   const handleDeleteUser = (user) => {
//     console.log("🟢 handleDeleteUser triggered for:", user._id);
//     setDeletingUser(user);
//     setShowDeleteModal(true);
//   };

//   // Handle edit form input changes
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Submit edit user form
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setIsEditSubmitting(true);
//     setEditAlertMessage({ type: "", message: "" });

//     try {
//       // Validate form data
//       if (!editFormData.name.trim() || !editFormData.email.trim()) {
//         setEditAlertMessage({
//           type: "danger",
//           message: "Name and email are required.",
//         });
//         setIsEditSubmitting(false);
//         return;
//       }

//       console.log("Editing user:", editingUser._id, "with data:", editFormData);

//       const response = await patchUserApi(editingUser._id, editFormData);

//       console.log("Edit response:", response);

//       if (response.status === 200 || response.status === 201) {
//         setEditAlertMessage({
//           type: "success",
//           message: "User updated successfully!",
//         });

//         // Refresh the users list
//         await fetchAllUsers();

//         // Refresh total users count
//         const updatedUsers = await totalUserCountApi();
//         setTotalUsers(updatedUsers?.count ?? 0);

//         // Close modal after a short delay
//         setTimeout(() => {
//           handleCloseEditModal();
//         }, 1500);
//       } else {
//         setEditAlertMessage({
//           type: "danger",
//           message: "Unexpected response from server.",
//         });
//       }
//     } catch (error) {
//       console.error("Edit user error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to update user. Please try again.";
//       setEditAlertMessage({ type: "danger", message: errorMessage });
//     } finally {
//       setIsEditSubmitting(false);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletingUser?._id) return;
//     setIsDeleting(true);

//     try {
//       console.log("Deleting user:", deletingUser._id);

//       const response = await deleteUserApi(deletingUser._id);

//       console.log("Delete response:", response);

//       if (response.status === 200 || response.status === 201) {
//         // ✅ Refresh users list
//         await fetchAllUsers();

//         // ✅ Update total count
//         const updatedUsers = await totalUserCountApi();
//         setTotalUsers(updatedUsers?.count ?? 0);

//         // ✅ Close modal & reset
//         setShowDeleteModal(false);
//         setDeletingUser(null);

//         // ✅ Success toast (replace alert if using react-toastify)
//         alert("✅ User deleted successfully!");
//       } else {
//         alert("⚠️ Unexpected server response.");
//       }
//     } catch (error) {
//       console.error("Delete user error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to delete user. Please try again.";
//       alert("❌ Error: " + errorMessage);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Close edit modal
//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//     setEditingUser(null);
//     setEditFormData({ name: "", email: "" });
//     setEditAlertMessage({ type: "", message: "" });
//   };

//   // Close delete modal
//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setDeletingUser(null);
//   };

//   // User card component
//   const UserCard = ({ user }) => (
//     <div className="col-12 mb-3">
//       <div className="card border-0 shadow-sm rounded-3 h-100">
//         <div className="card-body py-3">
//           <div className="d-flex align-items-center gap-3">
//             <div className="position-relative">
//               <div
//                 className="admin-avatar rounded-circle bg-primary-gradient text-white d-flex align-items-center justify-content-center fw-bold"
//                 style={{ width: "40px", height: "40px" }}
//               >
//                 {user.name?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//               {user.role === "superadmin" && (
//                 <span className="position-absolute top-0 start-100 translate-middle">
//                   <Crown size={12} className="text-warning" />
//                 </span>
//               )}
//             </div>

//             <div className="flex-grow-1">
//               <h6 className="fw-bold mb-1">{user.name || "Unknown User"}</h6>

//               <div className="d-flex align-items-center gap-1 text-muted">
//                 <Mail size={14} />
//                 <small>{user.email || "No email provided"}</small>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-2">
//               <button
//                 className="btn btn-outline-primary btn-sm p-2"
//                 onClick={() => handleEditUser(user)}
//                 title="Edit User"
//               >
//                 <Edit size={14} />
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-outline-danger btn-sm p-2"
//                 onClick={() => handleDeleteUser(user)}
//                 title="Delete User"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Handle modal open/close for Add User
//   const handleShowModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       role: "sales agent",
//     });
//     setAlertMessage({ type: "", message: "" });
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setAlertMessage({ type: "", message: "" });

//     try {
//       // Validate form data
//       if (
//         !formData.name.trim() ||
//         !formData.email.trim() ||
//         !formData.password.trim()
//       ) {
//         setAlertMessage({
//           type: "danger",
//           message: "All fields are required.",
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       // Call the API
//       const response = await LeadRegister(formData);

//       if (response.status === 200 || response.status === 201) {
//         setAlertMessage({
//           type: "success",
//           message: "User registered successfully!",
//         });

//         // Refresh the total users count
//         const updatedUsers = await totalUserCountApi();
//         setTotalUsers(updatedUsers?.count ?? 0);

//         // Close modal after a short delay
//         setTimeout(() => {
//           handleCloseModal();
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to register user. Please try again.";
//       setAlertMessage({ type: "danger", message: errorMessage });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ADDED: Debug section - remove this after testing
//   console.log("📊 Current State:", {
//     totalUsers,
//     onlineUsersCount,
//     totalEscalationCounts,
//     totalEvaluationCounts,
//     totalMarketingCounts,
//     chartDataLength: chartData?.length,
//     escalationAnalyticsLength: escalationAnalytics?.length,
//     evaluationAnalyticsLength: evaluationAnalytics?.length,
//     marketingAnalyticsLength: marketingAnalytics?.length,
//     adminsCount: admins?.length,
//     agentsCount: agents?.length,
//   });

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex gap-2">
//           <Button variant="success">
//             Active Users : {onlineUsersCount ?? "Loading..."}
//           </Button>
//           <Button variant="danger">
//             Inactive Users :{" "}
//             {totalUsers && onlineUsersCount !== null
//               ? totalUsers - onlineUsersCount
//               : "Loading..."}
//           </Button>
//         </div>

//         <div>
//           <div className="d-flex gap-3">
//             <div>
//               <Button
//                 style={{
//                   background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                 }}
//                 onClick={handleShowUsersModal}
//               >
//                 <Users size={16} className="me-1" />
//                 {totalUsers ?? 0} Total Users
//               </Button>
//             </div>
//             <div>
//               <Button variant="dark" onClick={handleShowModal}>
//                 Add User
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Users List Modal */}
//       <Modal
//         show={showUsersModal}
//         onHide={handleCloseUsersModal}
//         size="xl"
//         centered
//       >
//         <Modal.Header closeButton className="bg-light">
//           <Modal.Title className="d-flex align-items-center gap-2">
//             <Users size={24} className="text-primary" />
//             All Users List
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body className="p-0">
//           {usersError && (
//             <Alert variant="danger" className="mx-3 mt-3 mb-0">
//               {usersError}
//             </Alert>
//           )}

//           {/* Tabs */}
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="mx-3 mt-3 border-bottom-0"
//             fill
//           >
//             <Tab
//               eventKey="admin"
//               title={
//                 <span className="d-flex align-items-center gap-2">
//                   <Shield size={16} />
//                   Admin Team ({adminUsers.length})
//                 </span>
//               }
//             >
//               <div className="p-3">
//                 {/* Search Bar */}
//                 <div className="row mb-4">
//                   <div className="col-md-8">
//                     <div className="search-box position-relative">
//                       <Search
//                         size={18}
//                         className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
//                       />
//                       <Form.Control
//                         type="text"
//                         className="ps-5"
//                         placeholder="Search admin users by name or email..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-4 text-end">
//                     <div className="d-flex align-items-center justify-content-end gap-2">
//                       <Shield size={16} className="text-info" />
//                       <span className="fw-semibold">
//                         {adminUsers.length} Admin
//                         {adminUsers.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Users List */}
//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   {loadingUsers ? (
//                     <div className="d-flex justify-content-center align-items-center py-5">
//                       <Spinner animation="border" className="me-2" />
//                       <span>Loading admin users...</span>
//                     </div>
//                   ) : adminUsers.length > 0 ? (
//                     <div className="row g-2">
//                       {adminUsers.map((user) => (
//                         <UserCard key={user._id || user.email} user={user} />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center text-muted py-5">
//                       <XCircle size={48} className="mb-3 opacity-50" />
//                       <h5>No Admin Users Found</h5>
//                       <p className="mb-0">
//                         {searchTerm
//                           ? "Try adjusting your search terms"
//                           : "No admin users are currently registered"}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Tab>

//             <Tab
//               eventKey="sales-agent"
//               title={
//                 <span className="d-flex align-items-center gap-2">
//                   <UserCheck size={16} />
//                   Sales Agents ({salesAgentUsers.length})
//                 </span>
//               }
//             >
//               <div className="p-3">
//                 {/* Search Bar */}
//                 <div className="row mb-4">
//                   <div className="col-md-8">
//                     <div className="search-box position-relative">
//                       <Search
//                         size={18}
//                         className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
//                       />
//                       <Form.Control
//                         type="text"
//                         className="ps-5"
//                         placeholder="Search sales agents by name or email..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-4 text-end">
//                     <div className="d-flex align-items-center justify-content-end gap-2">
//                       <UserCheck size={16} className="text-success" />
//                       <span className="fw-semibold">
//                         {salesAgentUsers.length} Agent
//                         {salesAgentUsers.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Users List */}
//                 <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   {loadingUsers ? (
//                     <div className="d-flex justify-content-center align-items-center py-5">
//                       <Spinner animation="border" className="me-2" />
//                       <span>Loading sales agents...</span>
//                     </div>
//                   ) : salesAgentUsers.length > 0 ? (
//                     <div className="row g-2">
//                       {salesAgentUsers.map((user) => (
//                         <UserCard key={user._id || user.email} user={user} />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center text-muted py-5">
//                       <XCircle size={48} className="mb-3 opacity-50" />
//                       <h5>No Sales Agents Found</h5>
//                       <p className="mb-0">
//                         {searchTerm
//                           ? "Try adjusting your search terms"
//                           : "No sales agents are currently registered"}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Tab>
//           </Tabs>
//         </Modal.Body>

//         <Modal.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center w-100">
//             <div className="text-muted small">
//               Total Users: {allUsers.length} | Showing: {currentUsers.length}{" "}
//               {activeTab === "admin" ? "admins" : "sales agents"}
//             </div>
//             <div>
//               <Button variant="secondary" onClick={handleCloseUsersModal}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit User Modal */}
//       <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editAlertMessage.message && (
//             <Alert variant={editAlertMessage.type} className="mb-3">
//               {editAlertMessage.message}
//             </Alert>
//           )}

//           <Form onSubmit={handleEditSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Name *</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={editFormData.name}
//                 onChange={handleEditInputChange}
//                 placeholder="Enter full name"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Email *</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={editFormData.email}
//                 onChange={handleEditInputChange}
//                 placeholder="Enter email address"
//                 required
//               />
//             </Form.Group>

//             <div className="text-muted small mb-3">
//               <strong>Current Role:</strong> {editingUser?.role || "Unknown"}
//             </div>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={handleCloseEditModal}
//             disabled={isEditSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleEditSubmit}
//             disabled={isEditSubmitting}
//           >
//             {isEditSubmitting ? "Updating..." : "Update User"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center">
//             <Trash2 size={48} className="text-danger mb-3" />
//             <h5>Are you sure you want to delete this user?</h5>
//             <p className="text-muted mb-3">This action cannot be undone.</p>

//             {deletingUser && (
//               <div className="border rounded p-3 bg-light">
//                 <div className="d-flex align-items-center gap-2 justify-content-center">
//                   <div
//                     className="admin-avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
//                     style={{ width: "32px", height: "32px" }}
//                   >
//                     {deletingUser.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                   <div>
//                     <div className="fw-bold">{deletingUser.name}</div>
//                     <small className="text-muted">{deletingUser.email}</small>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={handleCloseDeleteModal}
//             disabled={isDeleting}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleConfirmDelete}
//             disabled={isDeleting}
//           >
//             {isDeleting ? "Deleting..." : "Delete User"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add User Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title className="fw-semibold text-lg">Add User</Modal.Title>
//         </Modal.Header>

//         <Modal.Body className="bg-light rounded-bottom">
//           <form
//             onSubmit={async (e) => {
//               e.preventDefault();
//               setIsSubmitting(true);
//               setAlertMessage({ message: "", type: "" });

//               try {
//                 // ✅ Create user
//                 const response = await axios.post(
//                   "http://localhost:3001/api/users/register-user",
//                   formData
//                 );

//                 const userData = response?.data?.user;
//                 const role = userData?.role?.trim().toLowerCase();

//                 setAlertMessage({
//                   message: "✅ User added successfully!",
//                   type: "success",
//                 });

//                 // ✅ Redirect logic
//                 setTimeout(() => {
//                   handleCloseModal();

//                   // Redirect based on role
//                   if (role === "qc user" || role === "qc") {
//                     navigate("/dashboard/qc-team");
//                   } else if (role === "agent user" || role === "agent") {
//                     navigate("/agent"); // 👈 this matches your Agent Dashboard route
//                   }
//                 }, 1500);
//               } catch (error) {
//                 console.error("❌ Error adding user:", error);
//                 setAlertMessage({
//                   message:
//                     error.response?.data?.message ||
//                     "❌ Failed to register user. Please try again.",
//                   type: "danger",
//                 });
//               } finally {
//                 setIsSubmitting(false);
//               }
//             }}
//           >
//             {/* Name */}
//             <div className="mb-3">
//               <label className="form-label fw-medium">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control rounded-3 shadow-sm border-gray"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter full name"
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-3">
//               <label className="form-label fw-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 className="form-control rounded-3 shadow-sm border-gray"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter email"
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-3">
//               <label className="form-label fw-medium">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 className="form-control rounded-3 shadow-sm border-gray"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter password"
//                 minLength={6}
//               />
//             </div>

//             {/* Role */}
//             <div className="mb-3">
//               <label className="form-label fw-medium d-block">Role</label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 required
//                 className="form-select rounded-3 shadow-sm border-gray"
//                 style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}
//               >
//                 <option value="">Select Role</option>
//                 <option value="Qc User">QC User</option>
//                 <option value="Agent User">Agent User</option>
//               </select>
//             </div>

//             {/* Alerts */}
//             {alertMessage.message && (
//               <div
//                 className={`alert alert-${alertMessage.type} mt-3 rounded-3 text-center fw-semibold`}
//               >
//                 {alertMessage.message}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="d-flex justify-content-end mt-4 gap-2">
//               <Button
//                 variant="secondary"
//                 onClick={handleCloseModal}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" variant="dark" disabled={isSubmitting}>
//                 {isSubmitting ? "Adding..." : "Add User"}
//               </Button>
//             </div>
//           </form>
//         </Modal.Body>
//       </Modal>

//       <div className="container-fluid p-2">
//         {/* ADDED: Debug Info Panel - Remove this after testing */}
//         {/* <div className="alert alert-info mb-3">
//           <h6 className="fw-bold mb-2">📊 Data Loading Status:</h6>
//           <div className="row">
//             <div className="col-md-6">
//               <small>
//                 <strong>Counts:</strong>
//                 <br />✅ Total Users: {totalUsers}
//                 <br />✅ Online Users: {onlineUsersCount}
//                 <br />✅ Escalations: {totalEscalationCounts}
//                 <br />✅ Evaluations: {totalEvaluationCounts}
//                 <br />✅ Marketing: {totalMarketingCounts}
//               </small>
//             </div>
//             <div className="col-md-6">
//               <small>
//                 <strong>Analytics Data:</strong>
//                 <br />
//                 {escalationAnalytics?.length > 0 ? "✅" : "❌"} Escalation
//                 Analytics: {escalationAnalytics?.length || 0} records
//                 <br />
//                 {evaluationAnalytics?.length > 0 ? "✅" : "❌"} Evaluation
//                 Analytics: {evaluationAnalytics?.length || 0} records
//                 <br />
//                 {marketingAnalytics?.length > 0 ? "✅" : "❌"} Marketing
//                 Analytics: {marketingAnalytics?.length || 0} records
//                 <br />
//                 {chartData?.length > 0 ? "✅" : "❌"} Chart Data:{" "}
//                 {chartData?.length || 0} records
//                 <br />
//                 {admins?.length > 0 ? "✅" : "❌"} Admins: {admins?.length || 0}
//                 <br />
//                 {agents?.length > 0 ? "✅" : "❌"} Agents: {agents?.length || 0}
//               </small>
//             </div>
//           </div>
//         </div> */}

//         {/* Row 1: Content Overview + Charts  */}
//         <div className="row g-3 mb-4">
//           <div className="col-12 col-md-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body">
//                 <p
//                   style={{
//                     background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                     borderRadius: "0.5rem 0.5rem 0 0",
//                     fontSize: "23px",
//                   }}
//                   className="text-white p-2 mb-4"
//                 >
//                   Content Overview
//                 </p>

//                 {/* Draft Section */}
//                 <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded bg-light">
//                   <div>
//                     <h5 className="mb-0 fw-semibold">Total Drafts</h5>
//                   </div>
//                   <Button
//                     variant="dark"
//                     size="sm"
//                     onClick={() => navigate(`/dashboard/qc-team/${username}`)}
//                   >
//                     Publish
//                   </Button>
//                 </div>

//                 {/* Publish Section */}
//                 <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light mb-3">
//                   <div>
//                     <h5 className="mb-0 fw-semibold">Total Published</h5>
//                   </div>
//                   <Button
//                     variant="dark"
//                     size="sm"
//                     onClick={() => navigate(`/dashboard/qc-team/${username}`)}
//                   >
//                     View
//                   </Button>
//                 </div>

//                 {/* Recent Activity Section */}
//                 <div className="mt-4">
//                   <h5 className="text-muted mb-3 fw-bold">Recent Activity</h5>
//                   <ul className="list-group list-group-flush">
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span>John submitted a draft</span>
//                       <small className="text-muted">2h ago</small>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span>Mary published content</span>
//                       <small className="text-muted">5h ago</small>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span>Alex commented on draft</span>
//                       <small className="text-muted">1d ago</small>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span>Emily updated a post</span>
//                       <small className="text-muted">2d ago</small>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Column 2: Evaluations Chart */}
//           <div className="col-12 col-md-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body d-flex flex-column">
//                 <EvaluationsBarChart data={evaluationAnalytics} />
//               </div>
//             </div>
//           </div>

//           {/* Column 3: Daily Escalation Chart */}
//           <div className="col-12 col-md-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body d-flex flex-column">
//                 <DailyEscalationChart data={escalationAnalytics} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 2: Top Charts & Stats */}
//         <div className="row g-4 mb-4">
//           {/* Column 1: Top 5 Evaluation Forms */}
//           <div className="col-12 col-lg-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div
//                 className="card-header text-white p-2"
//                 style={{
//                   background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                   borderRadius: "0.5rem 0.5rem 0 0",
//                   fontSize: "23px",
//                 }}
//               >
//                 <p className="mb-0">Top 5 Evaluation Form Submissions</p>
//               </div>
//               <div
//                 className="card-body d-flex justify-content-center align-items-center"
//                 style={{ minHeight: "300px" }}
//               >
//                 {chartData?.length > 0 ? (
//                   <ResponsiveContainer width="100%" height={250}>
//                     <BarChart data={chartData}>
//                       <defs>
//                         <linearGradient
//                           id="barColor"
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop
//                             offset="0%"
//                             stopColor="#42a5f5"
//                             stopOpacity={0.9}
//                           />
//                           <stop
//                             offset="100%"
//                             stopColor="#66bb6a"
//                             stopOpacity={0.9}
//                           />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                       <XAxis
//                         dataKey="agentName"
//                         tick={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
//                       />
//                       <YAxis
//                         allowDecimals={false}
//                         tick={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
//                       />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#fff",
//                           border: "1px solid #ddd",
//                           borderRadius: "8px",
//                           boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                       <Legend wrapperStyle={{ fontWeight: "bold" }} />
//                       <Bar
//                         dataKey="formSubmit"
//                         fill="url(#barColor)"
//                         name="Form Submits"
//                         radius={[8, 8, 0, 0]}
//                         barSize={35}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <p className="text-muted">Loading Evaluation Chart...</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Column 2: Escalation Ratings */}
//           <div className="col-12 col-lg-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div
//                 className="card-header p-2"
//                 style={{
//                   background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                   borderRadius: "0.5rem 0.5rem 0 0",
//                   fontSize: "23px",
//                 }}
//               >
//                 <p className="mb-0 text-white">Escalation Ratings</p>
//               </div>
//               <div
//                 className="card-body d-flex justify-content-center align-items-center"
//                 style={{ minHeight: "300px" }}
//               >
//                 <EscalationRatingPieChart data={escalationAnalytics} />
//               </div>
//             </div>
//           </div>

//           {/* Column 3: Stats & Report */}
//           <div className="col-12 col-lg-4">
//             <div className="row g-4">
//               {[
//                 {
//                   title: "Total Escalation Forms",
//                   value: totalEscalationCounts,
//                   badge: "+8%",
//                   badgeClass: "bg-success",
//                   desc: "2 projects completed this week",
//                 },
//                 {
//                   title: "Total Evaluation Forms",
//                   value: totalEvaluationCounts,
//                   badge: "+12%",
//                   badgeClass: "bg-success",
//                   desc: "Updated daily at midnight",
//                 },
//                 {
//                   title: "Total Marketing Forms",
//                   value: totalMarketingCounts,
//                   badge: "+24%",
//                   badgeClass: "bg-primary",
//                   desc: "32 tasks pending",
//                 },
//               ].map((item, idx) => (
//                 <div className="col-12" key={idx}>
//                   <div className="card border-0 shadow-sm h-100">
//                     <div className="card-body">
//                       <h6 className="text-muted">{item.title}</h6>
//                       <div className="d-flex align-items-center">
//                         <h2 style={{ fontSize: "50px" }} className="mb-0">
//                           {item.value ?? "Loading..."}
//                         </h2>
//                         <span className={`badge ms-2 ${item.badgeClass}`}>
//                           {item.badge}
//                         </span>
//                       </div>
//                       <div className="text-muted small mt-2">{item.desc}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Report Download */}
//               <div className="col-12">
//                 <div className="card p-3 border-0 shadow-sm h-100 d-flex align-items-center justify-content-center">
//                   <button
//                     style={{
//                       background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                       borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem",
//                     }}
//                     onClick={() => navigate("/dashboard/report-download")}
//                     className="btn text-white w-75"
//                   >
//                     Download Report
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row g-3">
//           {[
//             {
//               title: "QC Team",
//               data: admins,
//               link: "/dashboard/qc-team",
//               description: "Quality Control Team Members",
//               icon: Shield,
//             },
//             {
//               data: agents,
//               link: "/dashboard/sales-team",
//               description: "Sales and Marketing Team",
//               icon: UserCheck,
//             },
//           ].map((team, idx) => (
//             <div className="col-12 col-lg-6" key={idx}>
//               <div className="card border-0 shadow-sm mb-4 h-100">
//                 <div
//                   style={{
//                     background: "linear-gradient(90deg, #4CAF50, #2196F3)",
//                   }}
//                   className="card-header d-flex justify-content-between align-items-center py-3"
//                 >
//                   <div className="d-flex align-items-center gap-2">
//                     <team.icon size={20} className="text-white" />
//                     <div>
//                       <h5 className="mb-0 text-white fw-bold">{team.title}</h5>
//                       <small className="text-white opacity-75">
//                         {team.description}
//                       </small>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-center gap-2">
//                     <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
//                       {team.data.length} Members
//                     </span>
//                     <button
//                       onClick={() => navigate(team.link)}
//                       className="btn btn-light btn-sm"
//                     >
//                       View All
//                     </button>
//                   </div>
//                 </div>
//                 <div className="card-body p-0">
//                   {loadingAgents ? (
//                     <div className="d-flex justify-content-center align-items-center py-5">
//                       <Spinner
//                         animation="border"
//                         variant="primary"
//                         className="me-2"
//                       />
//                       <span className="text-muted">
//                         Loading {team?.title?.toLowerCase() || "team"}...
//                       </span>
//                     </div>
//                   ) : team.data.length > 0 ? (
//                     <ul className="list-group list-group-flush">
//                       {team.data.slice(0, 5).map((member, memberIdx) => (
//                         <li
//                           key={member._id}
//                           className="list-group-item d-flex justify-content-between align-items-center py-3 hover-item"
//                           style={{
//                             cursor: "pointer",
//                             transition: "all 0.2s ease",
//                             borderLeft:
//                               memberIdx === 0 ? "3px solid #4CAF50" : "none",
//                           }}
//                           onClick={() =>
//                             navigate(`${team.link}/${member.name}`)
//                           }
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = "#f8f9fa";
//                             e.currentTarget.style.paddingLeft = "20px";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = "";
//                             e.currentTarget.style.paddingLeft = "";
//                           }}
//                         >
//                           <div className="d-flex align-items-center gap-3 flex-grow-1">
//                             <div className="position-relative">
//                               <div
//                                 style={{
//                                   background:
//                                     "linear-gradient(90deg, #4CAF50, #2196F3)",
//                                   width: "45px",
//                                   height: "45px",
//                                   fontSize: "1.1rem",
//                                 }}
//                                 className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
//                               >
//                                 {member.name?.charAt(0)?.toUpperCase() || "U"}
//                               </div>
//                               {member.role === "superadmin" && (
//                                 <span
//                                   className="position-absolute bottom-0 end-0 bg-warning rounded-circle d-flex align-items-center justify-content-center"
//                                   style={{
//                                     width: "18px",
//                                     height: "18px",
//                                     border: "2px solid white",
//                                   }}
//                                 >
//                                   <Crown size={10} className="text-white" />
//                                 </span>
//                               )}
//                             </div>
//                             <div className="flex-grow-1">
//                               <div className="d-flex align-items-center gap-2">
//                                 <h6 className="mb-0 fw-bold text-capitalize">
//                                   {member.name}
//                                 </h6>
//                                 {member.role === "superadmin" && (
//                                   <span
//                                     className="badge bg-warning text-dark rounded-pill px-2 py-1"
//                                     style={{ fontSize: "0.7rem" }}
//                                   >
//                                     Owner
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="d-flex align-items-center gap-1 text-muted mt-1">
//                                 <Mail size={12} />
//                                 <small>{member.email}</small>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span className="badge bg-light text-dark border">
//                               {member.role}
//                             </span>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="text-center text-muted py-5">
//                       <XCircle size={48} className="mb-3 opacity-50" />
//                       <h6>No {team.title} Members Found</h6>
//                       <p className="small mb-0">
//                         No team members are currently registered
//                       </p>
//                     </div>
//                   )}

//                   {!loadingAgents && team.data.length > 5 && (
//                     <div className="card-footer bg-light text-center py-2">
//                       <button
//                         onClick={() => navigate(team.link)}
//                         className="btn btn-link text-decoration-none p-0"
//                         style={{ color: "#4CAF50" }}
//                       >
//                         View {team.data.length - 5} more members →
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Overview;
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  onlineUsersCountApi,
  totalUserCountApi,
  getallusersApi,
  patchUserApi,
  deleteUserApi,
} from "../features/userApis";
import {
  totalEscalationCountsApi,
  getEscalationAnalyticsApi,
} from "../features/escalationsApi";
import {
  totalEvaluationCountsApi,
  getEvaluationAnalyticsApi,
} from "../features/evaluationApi";
import {
  totalMarketingCountsApi,
  getMarketingAnalyticsApi,
} from "../features/marketingApi";
import { LeadRegister } from "../features/userApis";
import {
  Button,
  Modal,
  Form,
  Alert,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import {
  Crown,
  Users,
  Search,
  Mail,
  Shield,
  UserCheck,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAgentFormSubmitsApi, getContentOverviewApi } from "../features/analytics";
import EscalationRatingPieChart from "./admin/escalation/EscalationRatingPieChart";
import jwtDecode from "jwt-decode";
import EvaluationsBarChart from "./EvaluationsBarChart";
import ReportDownload from "./ReportDownload";
import DailyEscalationChart from "./DailyEscalationChart";
import DailyMarketingLineChart from "./DailyMarketingLineChart.jsx";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#6633AA",
];

const Overview = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(null);
  const [totalEscalationCounts, setTotalEscalationCounts] = useState(null);
  const [totalEvaluationCounts, setTotalEvaluationCounts] = useState(null);
  const [totalMarketingCounts, setTotalMarketingCounts] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [evaluationAnalytics, setEvaluationAnalytics] = useState(null);
  const [draftCount, setDraftCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const token = localStorage.getItem("token");
  let username = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.name;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAgentFormSubmitsApi();
      if (result.success) {
        setChartData(result.data);
      }
    };

    fetchData();
  }, []);

  const timeAgo = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return "";
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  useEffect(() => {
    const fetchContentOverview = async () => {
      const result = await getContentOverviewApi();
      if (result?.success) {
        setDraftCount(result.draftCount ?? 0);
        setPublishedCount(result.publishedCount ?? 0);
        setRecentActivity(Array.isArray(result.recentActivity) ? result.recentActivity : []);
      }
    };
    fetchContentOverview();
  }, []);

  // Modal states for Add User
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales agent",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // Admin, Agents & QC Users
  const [admins, setAdmins] = useState([]);
  const [agents, setAgents] = useState([]);
  const [qcUsers, setQcUsers] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  // Users Modal states
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [usersError, setUsersError] = useState("");

  // Edit User Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editAlertMessage, setEditAlertMessage] = useState({
    type: "",
    message: "",
  });

  // Delete confirmation states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          users,
          escalations,
          evaluations,
          marketing,
          escalationAnalyticsData,
          evaluationAnalyticsData,
          marketingAnalyticsData,
          onlineUsers,
        ] = await Promise.all([
          totalUserCountApi(),
          totalEscalationCountsApi(),
          totalEvaluationCountsApi(),
          totalMarketingCountsApi(),
          getEscalationAnalyticsApi(),
          getEvaluationAnalyticsApi(),
          getMarketingAnalyticsApi(),
          onlineUsersCountApi(),
        ]);

        setTotalUsers(users?.count ?? 0);
        setTotalEscalationCounts(escalations?.count ?? 0);
        setTotalEvaluationCounts(evaluations?.count ?? 0);
        setTotalMarketingCounts(marketing?.count ?? 0);
        setOnlineUsersCount(onlineUsers?.count ?? 0);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchAllData();
  }, []);

  // Fetch ALL users in a single useEffect - QC, Agents, and Admins
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        const users = res?.data?.data || [];

        const normalizeRole = (role) =>
          (role || "").toString().toLowerCase().replace(/\s+/g, " ").trim();

        const isQcUser = (u) => {
          const r = normalizeRole(u.role);
          return r === "qc user" || r === "qc" || r.includes("qc");
        };

        const isAgentUser = (u) => {
          const r = normalizeRole(u.role);
          return (
            r === "agent user" ||
            r === "agent" ||
            r === "sales agent" ||
            r.includes("agent") ||
            r.includes("sales")
          );
        };

        const isAdminUser = (u) => {
          const r = normalizeRole(u.role);
          return r === "admin" || r === "superadmin" || r.includes("admin");
        };

        setQcUsers(users.filter(isQcUser));
        setAgents(users.filter(isAgentUser));
        setAdmins(users.filter(isAdminUser));
      } catch (err) {
        console.error("Error fetching users", err);
        setAgents([]);
        setQcUsers([]);
        setAdmins([]);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch all users for the modal
  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      setUsersError("");
      const res = await getallusersApi();
      if (Array.isArray(res?.data?.data)) {
        setAllUsers(res.data.data);
      } else {
        setAllUsers([]);
        setUsersError("No users data found");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsersError("Failed to fetch users. Please try again.");
      setAllUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle users modal
  const handleShowUsersModal = () => {
    setShowUsersModal(true);
    fetchAllUsers();
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
    setSearchTerm("");
    setUsersError("");
    setActiveTab("admin");
  };

  // Filter users based on role and search term
  const getFilteredUsers = (role) => {
    const roleUsers = allUsers.filter((user) => {
      if (role === "admin") {
        return user.role === "admin" || user.role === "superadmin";
      }
      return user.role === "sales agent" || user.role === "agent";
    });

    if (!searchTerm) return roleUsers;

    return roleUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const adminUsers = getFilteredUsers("admin");
  const salesAgentUsers = getFilteredUsers("sales agent");
  const currentUsers = activeTab === "admin" ? adminUsers : salesAgentUsers;

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
    });
    setEditAlertMessage({ type: "", message: "" });
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit edit user form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditSubmitting(true);
    setEditAlertMessage({ type: "", message: "" });

    try {
      if (!editFormData.name.trim() || !editFormData.email.trim()) {
        setEditAlertMessage({
          type: "danger",
          message: "Name and email are required.",
        });
        setIsEditSubmitting(false);
        return;
      }

      console.log("Editing user:", editingUser._id, "with data:", editFormData);

      const response = await patchUserApi(editingUser._id, editFormData);

      console.log("Edit response:", response);

      if (response.status === 200 || response.status === 201) {
        setEditAlertMessage({
          type: "success",
          message: "User updated successfully!",
        });

        await fetchAllUsers();

        const updatedUsers = await totalUserCountApi();
        setTotalUsers(updatedUsers?.count ?? 0);

        setTimeout(() => {
          handleCloseEditModal();
        }, 1500);
      } else {
        setEditAlertMessage({
          type: "danger",
          message: "Unexpected response from server.",
        });
      }
    } catch (error) {
      console.error("Edit user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user. Please try again.";
      setEditAlertMessage({ type: "danger", message: errorMessage });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Confirm delete user
  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      console.log("Deleting user:", deletingUser._id);

      const response = await deleteUserApi(deletingUser._id);

      console.log("Delete response:", response);

      if (response.status === 200 || response.status === 201) {
        await fetchAllUsers();

        const updatedUsers = await totalUserCountApi();
        setTotalUsers(updatedUsers?.count ?? 0);

        setShowDeleteModal(false);
        setDeletingUser(null);

        alert("User deleted successfully!");
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete user. Please try again.";
      alert("Error: " + errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({ name: "", email: "" });
    setEditAlertMessage({ type: "", message: "" });
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  // User card component
  const UserCard = ({ user }) => (
    <div className="col-12 mb-3">
      <div className="card border-0 shadow-sm rounded-3 h-100">
        <div className="card-body py-3">
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <div
                className="admin-avatar rounded-circle bg-primary-gradient text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "40px", height: "40px" }}
              >
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {user.role === "superadmin" && (
                <span className="position-absolute top-0 start-100 translate-middle">
                  <Crown size={12} className="text-warning" />
                </span>
              )}
            </div>

            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">{user.name || "Unknown User"}</h6>

              <div className="d-flex align-items-center gap-1 text-muted">
                <Mail size={14} />
                <small>{user.email || "No email provided"}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-primary btn-sm p-2"
                onClick={() => handleEditUser(user)}
                title="Edit User"
              >
                <Edit size={14} />
              </button>
              <button
                className="btn btn-outline-danger btn-sm p-2"
                onClick={() => handleDeleteUser(user)}
                title="Delete User"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle modal open/close for Add User
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "sales agent",
    });
    setAlertMessage({ type: "", message: "" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlertMessage({ type: "", message: "" });

    try {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password.trim()
      ) {
        setAlertMessage({
          type: "danger",
          message: "All fields are required.",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await LeadRegister(formData);

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          type: "success",
          message: "User registered successfully!",
        });

        const updatedUsers = await totalUserCountApi();
        setTotalUsers(updatedUsers?.count ?? 0);

        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to register user. Please try again.";
      setAlertMessage({ type: "danger", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={() => navigate("/dashboard/qc-team", { state: { teamStatus: "active" } })}
          >
            Active Users : {onlineUsersCount ?? "Loading..."}
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate("/dashboard/qc-team", { state: { teamStatus: "inactive" } })}
          >
            Inactive Users :{" "}
            {totalUsers && onlineUsersCount !== null
              ? totalUsers - onlineUsersCount
              : "Loading..."}
          </Button>
        </div>

        <div>
          <div className="d-flex gap-3">
            <div>
              <Button
                style={{
                  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                }}
                onClick={handleShowUsersModal}
              >
                <Users size={16} className="me-1" />
                {totalUsers ?? 0} Total Users
              </Button>
            </div>
            <div>
              <Button variant="dark" onClick={handleShowModal}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users List Modal */}
      <Modal
        show={showUsersModal}
        onHide={handleCloseUsersModal}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center gap-2">
            <Users size={24} className="text-primary" />
            All Users List
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          {usersError && (
            <Alert variant="danger" className="mx-3 mt-3 mb-0">
              {usersError}
            </Alert>
          )}

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mx-3 mt-3 border-bottom-0"
            fill
          >
            <Tab
              eventKey="admin"
              title={
                <span className="d-flex align-items-center gap-2">
                  <Shield size={16} />
                  Admin Team ({adminUsers.length})
                </span>
              }
            >
              <div className="p-3">
                {/* Search Bar */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="search-box position-relative">
                      <Search
                        size={18}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      />
                      <Form.Control
                        type="text"
                        className="ps-5"
                        placeholder="Search admin users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <Shield size={16} className="text-info" />
                      <span className="fw-semibold">
                        {adminUsers.length} Admin
                        {adminUsers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {loadingUsers ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" className="me-2" />
                      <span>Loading admin users...</span>
                    </div>
                  ) : adminUsers.length > 0 ? (
                    <div className="row g-2">
                      {adminUsers.map((user) => (
                        <UserCard key={user._id || user.email} user={user} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <XCircle size={48} className="mb-3 opacity-50" />
                      <h5>No Admin Users Found</h5>
                      <p className="mb-0">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "No admin users are currently registered"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            <Tab
              eventKey="sales-agent"
              title={
                <span className="d-flex align-items-center gap-2">
                  <UserCheck size={16} />
                  Sales Agents ({salesAgentUsers.length})
                </span>
              }
            >
              <div className="p-3">
                {/* Search Bar */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="search-box position-relative">
                      <Search
                        size={18}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      />
                      <Form.Control
                        type="text"
                        className="ps-5"
                        placeholder="Search sales agents by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <UserCheck size={16} className="text-success" />
                      <span className="fw-semibold">
                        {salesAgentUsers.length} sales agent
                        {salesAgentUsers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {loadingUsers ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" className="me-2" />
                      <span>Loading sales agents...</span>
                    </div>
                  ) : salesAgentUsers.length > 0 ? (
                    <div className="row g-2">
                      {salesAgentUsers.map((user) => (
                        <UserCard key={user._id || user.email} user={user} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <XCircle size={48} className="mb-3 opacity-50" />
                      <h5>No Sales Agents Found</h5>
                      <p className="mb-0">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "No sales agents are currently registered"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="text-muted small">
              Total Users: {allUsers.length} | Showing: {currentUsers.length}{" "}
              {activeTab === "admin" ? "admins" : "sales agents"}
            </div>
            <div>
              <Button variant="secondary" onClick={handleCloseUsersModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editAlertMessage.message && (
            <Alert variant={editAlertMessage.type} className="mb-3">
              {editAlertMessage.message}
            </Alert>
          )}

          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                placeholder="Enter email address"
                required
              />
            </Form.Group>

            <div className="text-muted small mb-3">
              <strong>Current Role:</strong> {editingUser?.role || "Unknown"}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseEditModal}
            disabled={isEditSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={isEditSubmitting}
          >
            {isEditSubmitting ? "Updating..." : "Update User"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Trash2 size={48} className="text-danger mb-3" />
            <h5>Are you sure you want to delete this user?</h5>
            <p className="text-muted mb-3">This action cannot be undone.</p>

            {deletingUser && (
              <div className="border rounded p-3 bg-light">
                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <div
                    className="admin-avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "32px", height: "32px" }}
                  >
                    {deletingUser.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="fw-bold">{deletingUser.name}</div>
                    <small className="text-muted">{deletingUser.email}</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage.message && (
            <Alert variant={alertMessage.type} className="mb-3">
              {alertMessage.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="sales agent">Sales Agent</option>
                <option value="agent user">Agent User</option>
                <option value="qc user">QC User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Stats Cards */}
      <div className="container-fluid p-2">
        {/* Row 1: Content Overview + Charts */}
        <div className="row g-3 mb-4">
          {/* Column 1: Content Overview */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p
                  style={{
                    background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                    borderRadius: "0.5rem 0.5rem 0 0",
                    fontSize: "23px",
                  }}
                  className="text-white p-2 mb-4"
                >
                  Content Overview
                </p>
                {/* Draft Section */}
                <div className="d-flex align-items-center justify-content-between mb-3 p-2 rounded bg-light">
                  <div>
                    <h5 className="mb-0 fw-semibold">Total Drafts</h5>
                    <small className="text-muted">{draftCount}</small>
                  </div>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => navigate(`/dashboard/qc-team`, { state: { tab: "drafts" } })}
                  >
                    Publish
                  </Button>
                </div>

                {/* Publish Section */}
                <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light mb-3">
                  <div>
                    <h5 className="mb-0 fw-semibold">Total Published</h5>
                    <small className="text-muted">{publishedCount}</small>
                  </div>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/qc-team`, { state: { tab: "published" } })
                    }
                  >
                    View
                  </Button>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-4">
                  <h5 className="text-muted mb-3 fw-bold">Recent Activity</h5>
                  <ul className="list-group list-group-flush">
                    {recentActivity?.length > 0 ? (
                      recentActivity.slice(0, 5).map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {item.actorName} {item.action}
                          </span>
                          <small className="text-muted">
                            {timeAgo(item.createdAt)}
                          </small>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="text-muted">No recent activity</span>
                        <small className="text-muted"></small>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Evaluations Chart */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <EvaluationsBarChart />
              </div>
            </div>
          </div>

          {/* Column 3: Daily Escalation Chart */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <DailyEscalationChart />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Top Charts & Stats */}
        <div className="row g-4 mb-4">
          {/* Column 1: Top 5 Evaluation Forms */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div
                className="card-header text-white p-2"
                style={{
                  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                  borderRadius: "0.5rem 0.5rem 0 0",
                  fontSize: "23px",
                }}
              >
                <p className="mb-0">Top 5 Evaluation Form Submissions</p>
              </div>
              <div
                className="card-body d-flex justify-content-center align-items-center"
                style={{ minHeight: "300px" }}
              >
                {chartData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="barColor"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#42a5f5"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#66bb6a"
                            stopOpacity={0.9}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="agentName"
                        tick={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#333", fontSize: 12, fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontWeight: "bold" }} />
                      <Bar
                        dataKey="formSubmit"
                        fill="url(#barColor)"
                        name="Form Submits"
                        radius={[8, 8, 0, 0]}
                        barSize={35}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted">Loading Evaluation Chart...</p>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Escalation Ratings */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div
                className="card-header p-2"
                style={{
                  background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                  borderRadius: "0.5rem 0.5rem 0 0",
                  fontSize: "23px",
                }}
              >
                <p className="mb-0 text-white">Escalation Ratings</p>
              </div>
              <div
                className="card-body d-flex justify-content-center align-items-center"
                style={{ minHeight: "300px" }}
              >
                <EscalationRatingPieChart />
              </div>
            </div>
          </div>

          {/* Column 3: Stats & Report */}
          <div className="col-12 col-lg-4">
            <div className="row g-4">
              {[
                {
                  title: "Total Escalation Forms",
                  value: totalEscalationCounts,
                  badge: "+8%",
                  badgeClass: "bg-success",
                  desc: "2 projects completed this week",
                },
                {
                  title: "Total Evaluation Forms",
                  value: totalEvaluationCounts,
                  badge: "+12%",
                  badgeClass: "bg-success",
                  desc: "Updated daily at midnight",
                },
                {
                  title: "Total Marketing Forms",
                  value: totalMarketingCounts,
                  badge: "+24%",
                  badgeClass: "bg-primary",
                  desc: "32 tasks pending",
                },
              ].map((item, idx) => (
                <div className="col-12" key={idx}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h6 className="text-muted">{item.title}</h6>
                      <div className="d-flex align-items-center">
                        <h2 style={{ fontSize: "50px" }} className="mb-0">
                          {item.value ?? "Loading..."}
                        </h2>
                        <span className={`badge ms-2 ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-muted small mt-2">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Report Download */}
              <div className="col-12">
                <div className="card p-3 border-0 shadow-sm h-100 d-flex align-items-center justify-content-center">
                  <button
                    style={{
                      background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                      borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem",
                    }}
                    onClick={() => navigate("/dashboard/report-download")}
                    className="btn text-white w-75"
                  >
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: QC & Sales Agent Teams */}
        <div className="row g-3">
          {[
            { title: "QC Team", data: qcUsers, link: "/dashboard/qc-team" },
            {
              title: "Sale Agent Team",
              data: agents,
              link: "/dashboard/sales-team",
            },
          ].map((team, idx) => (
            <div className="col-12 col-lg-6" key={idx}>
              <div className="card border-0 shadow-sm mb-4 h-100">
                <div
                  style={{
                    background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                    borderRadius: "0.5rem 0.5rem 0 0",
                    fontSize: "23px",
                  }}
                  className="card-header d-flex justify-content-between align-items-center"
                >
                  <p className="mb-0 text-white">{team.title}</p>
                  <button
                    onClick={() => navigate(team.link)}
                    className="btn text-white border btn-sm btn-link text-decoration-none"
                  >
                    View All
                  </button>
                </div>
                <div className="card-body">
                  {team.data && team.data.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {team.data.slice(0, 5).map((member) => (
                        <li
                          key={member._id}
                          className="list-group-item text-capitalize d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{member.name}</strong>
                            <div className="text-muted small">
                              {member.email}
                            </div>
                          </div>
                          {/* Edit/Delete Buttons */}
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm p-1"
                              onClick={() => handleEditUser(member)}
                              title="Edit User"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm p-1"
                              onClick={() => handleDeleteUser(member)}
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center my-3">
                      No users found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview

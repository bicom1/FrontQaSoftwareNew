
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
// import { getAgentFormSubmitsApi, getContentOverviewApi } from "../features/analytics";
// import EscalationRatingPieChart from "./admin/escalation/EscalationRatingPieChart";
// import jwtDecode from "jwt-decode";
// import EvaluationsBarChart from "./EvaluationsBarChart";
// import ReportDownload from "./ReportDownload";
// import DailyEscalationChart from "./DailyEscalationChart";
// import DailyMarketingLineChart from "./DailyMarketingLineChart.jsx";
// import ContentOverviewCard from "./ContentOverviewCard";
// import UserPresenceModal from "./UserPresenceModal";
// import {
//   ROLES,
//   normalizeRole,
//   isSuperAdmin,
//   ROLE_LABELS,
//   SUPER_ADMIN_PANEL_ROLES,
//   isAgentRole,
//   isQcRole,
//   getModuleBasePath,
// } from "../utils/roles";

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
//   const [evaluationAnalytics, setEvaluationAnalytics] = useState(null);
//   const [publishedCount, setPublishedCount] = useState(0);
//   const currentUserRole = normalizeRole(localStorage.getItem("userRole") || "");
//   const moduleBase = getModuleBasePath(currentUserRole);
//   const canAddUsers = isSuperAdmin(currentUserRole);
//   const addUserRoleOptions = SUPER_ADMIN_PANEL_ROLES;
//   const [recentActivity, setRecentActivity] = useState([]);
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
//       const result = await getAgentFormSubmitsApi();
//       if (result.success) {
//         setChartData(result.data);
//       }
//     };

//     fetchData();
//   }, []);

//   const timeAgo = (dateInput) => {
//     if (!dateInput) return "";
//     const d = new Date(dateInput);
//     if (Number.isNaN(d.getTime())) return "";
//     const diffMs = Date.now() - d.getTime();
//     const diffSec = Math.max(0, Math.floor(diffMs / 1000));
//     if (diffSec < 60) return `${diffSec}s ago`;
//     const diffMin = Math.floor(diffSec / 60);
//     if (diffMin < 60) return `${diffMin}m ago`;
//     const diffHr = Math.floor(diffMin / 60);
//     if (diffHr < 24) return `${diffHr}h ago`;
//     const diffDay = Math.floor(diffHr / 24);
//     return `${diffDay}d ago`;
//   };

//   useEffect(() => {
//     const fetchContentOverview = async () => {
//       const result = await getContentOverviewApi();
//       if (result?.success) {
//         setPublishedCount(result.publishedCount ?? result.totalEvaluations ?? 0);
//         setRecentActivity(Array.isArray(result.recentActivity) ? result.recentActivity : []);
//         if (result.totalEvaluations != null) {
//           setTotalEvaluationCounts(result.totalEvaluations);
//         }
//         if (result.totalEscalations != null) {
//           setTotalEscalationCounts(result.totalEscalations);
//         }
//       }
//     };
//     fetchContentOverview();
//   }, []);

//   // Modal states for Add User
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: ROLES.AGENT_USER,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

//   // QC Team & Sales Agent Team
//   const [qcTeam, setQcTeam] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [loadingAgents, setLoadingAgents] = useState(false);

//   // Users Modal states
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [activeTab, setActiveTab] = useState("agent_user");
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
//   const [showPresenceModal, setShowPresenceModal] = useState(false);
//   const [presenceStatus, setPresenceStatus] = useState("active");

//   const refreshPresenceCounts = async () => {
//     if (!canAddUsers) return;
//     try {
//       const [users, onlineUsers] = await Promise.all([
//         totalUserCountApi(),
//         onlineUsersCountApi(),
//       ]);
//       setTotalUsers(users?.count ?? 0);
//       setOnlineUsersCount(onlineUsers?.count ?? 0);
//     } catch (err) {
//       console.error("Failed to refresh presence counts:", err);
//     }
//   };

//   const openPresenceModal = (status) => {
//     setPresenceStatus(status);
//     setShowPresenceModal(true);
//   };

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const [
//           users,
//           escalations,
//           evaluations,
//           marketing,
//           escalationAnalyticsData,
//           evaluationAnalyticsData,
//           marketingAnalyticsData,
//           onlineUsers,
//         ] = await Promise.all([
//           totalUserCountApi(),
//           totalEscalationCountsApi(),
//           totalEvaluationCountsApi(),
//           totalMarketingCountsApi(),
//           getEscalationAnalyticsApi(),
//           getEvaluationAnalyticsApi(),
//           getMarketingAnalyticsApi(),
//           canAddUsers ? onlineUsersCountApi() : Promise.resolve(null),
//         ]);

//         setTotalUsers(users?.count ?? 0);
//         setTotalEscalationCounts(escalations?.count ?? 0);
//         setTotalEvaluationCounts(evaluations?.count ?? 0);
//         setTotalMarketingCounts(marketing?.count ?? 0);
//         if (canAddUsers) {
//           setOnlineUsersCount(onlineUsers?.count ?? 0);
//         }
//       } catch (err) {
//         console.error("Failed to fetch data:", err);
//       }
//     };

//     fetchAllData();
//   }, [canAddUsers]);

//   useEffect(() => {
//     if (!canAddUsers) return undefined;
//     const timer = setInterval(refreshPresenceCounts, 15000);
//     return () => clearInterval(timer);
//   }, [canAddUsers]);

//   // Fetch ALL users in a single useEffect - QC, Agents, and Admins
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoadingAgents(true);
//         const res = await getallusersApi();
//         const users = res?.data?.data || [];

//         setQcTeam(users.filter((u) => isQcRole(u.role)));
//         setAgents(users.filter((u) => isAgentRole(u.role)));
//       } catch (err) {
//         console.error("Error fetching users", err);
//         setAgents([]);
//         setQcTeam([]);
//       } finally {
//         setLoadingAgents(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Fetch all users for the modal
//   const fetchAllUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       setUsersError("");
//       const res = await getallusersApi();
//       if (Array.isArray(res?.data?.data)) {
//         setAllUsers(res.data.data);
//       } else {
//         setAllUsers([]);
//         setUsersError("No users data found");
//       }
//     } catch (err) {
//       console.error("Error fetching users:", err);
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
//     setActiveTab("agent_user");
//   };

//   // Filter users based on role and search term
//   const getFilteredUsers = (role) => {
//     const roleUsers = allUsers.filter(
//       (user) => normalizeRole(user.role) === normalizeRole(role)
//     );

//     if (!searchTerm) return roleUsers;

//     return roleUsers.filter(
//       (user) =>
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const agentUserList = getFilteredUsers(ROLES.AGENT_USER);
//   const agentAdminList = getFilteredUsers(ROLES.AGENT_ADMIN);
//   const qcAdminUsers = getFilteredUsers(ROLES.QC_ADMIN);
//   const qcUserList = getFilteredUsers(ROLES.QC_USER);
//   const superAdminList = allUsers.filter(
//     (u) => normalizeRole(u.role) === ROLES.SUPER_ADMIN
//   );
//   const currentUsers =
//     activeTab === "agent_user"
//       ? agentUserList
//       : activeTab === "agent_admin"
//       ? agentAdminList
//       : activeTab === "qc_admin"
//       ? qcAdminUsers
//       : activeTab === "qc_user"
//       ? qcUserList
//       : agentUserList;

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

//         await fetchAllUsers();

//         const updatedUsers = await totalUserCountApi();
//         setTotalUsers(updatedUsers?.count ?? 0);

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

//   // Confirm delete user
//   const handleConfirmDelete = async () => {
//     setIsDeleting(true);

//     try {
//       console.log("Deleting user:", deletingUser._id);

//       const response = await deleteUserApi(deletingUser._id);

//       console.log("Delete response:", response);

//       if (response.status === 200 || response.status === 201) {
//         await fetchAllUsers();

//         const updatedUsers = await totalUserCountApi();
//         setTotalUsers(updatedUsers?.count ?? 0);

//         setShowDeleteModal(false);
//         setDeletingUser(null);

//         alert("User deleted successfully!");
//       } else {
//         alert("Unexpected response from server.");
//       }
//     } catch (error) {
//       console.error("Delete user error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to delete user. Please try again.";
//       alert("Error: " + errorMessage);
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
//       role: ROLES.AGENT_USER,
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

//       const response = await LeadRegister(formData);

//       if (response.status === 200 || response.status === 201) {
//         const roleLabel =
//           ROLE_LABELS[normalizeRole(formData.role)] || formData.role;
//         setAlertMessage({
//           type: "success",
//           message: `User "${formData.name.trim()}" created as ${roleLabel}. They can log in with the credentials you provided.`,
//         });

//         const [updatedUsers, usersRes] = await Promise.all([
//           totalUserCountApi(),
//           getallusersApi(),
//         ]);
//         setTotalUsers(updatedUsers?.count ?? 0);

//         const users = usersRes?.data?.data || [];
//         setQcTeam(users.filter((u) => isQcRole(u.role)));
//         setAgents(users.filter((u) => isAgentRole(u.role)));

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

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         {canAddUsers ? (
//           <div className="d-flex gap-2">
//             <Button
//               variant="success"
//               onClick={() => openPresenceModal("active")}
//             >
//               Active Users : {onlineUsersCount ?? "Loading..."}
//             </Button>
//             <Button
//               variant="danger"
//               onClick={() => openPresenceModal("inactive")}
//             >
//               Inactive Users :{" "}
//               {totalUsers !== null && onlineUsersCount !== null
//                 ? Math.max(0, totalUsers - onlineUsersCount)
//                 : "Loading..."}
//             </Button>
//           </div>
//         ) : (
//           <div />
//         )}

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
//             {canAddUsers ? (
//               <div>
//                 <Button variant="dark" onClick={handleShowModal}>
//                   Add User
//                 </Button>
//               </div>
//             ) : null}
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
//             {[
//               {
//                 key: "superadmin",
//                 label: ROLE_LABELS[ROLES.SUPER_ADMIN],
//                 users: superAdminList,
//                 icon: Shield,
//               },
//               {
//                 key: "agent_user",
//                 label: ROLE_LABELS[ROLES.AGENT_USER],
//                 users: agentUserList,
//                 icon: UserCheck,
//               },
//               {
//                 key: "agent_admin",
//                 label: ROLE_LABELS[ROLES.AGENT_ADMIN],
//                 users: agentAdminList,
//                 icon: UserCheck,
//               },
//               {
//                 key: "qc_user",
//                 label: ROLE_LABELS[ROLES.QC_USER],
//                 users: qcUserList,
//                 icon: Shield,
//               },
//               {
//                 key: "qc_admin",
//                 label: ROLE_LABELS[ROLES.QC_ADMIN],
//                 users: qcAdminUsers,
//                 icon: Shield,
//               },
//             ].map(({ key, label, users, icon: TabIcon }) => (
//               <Tab
//                 key={key}
//                 eventKey={key}
//                 title={
//                   <span className="d-flex align-items-center gap-2">
//                     <TabIcon size={16} />
//                     {label} ({users.length})
//                   </span>
//                 }
//               >
//                 <div className="p-3">
//                   <div className="row mb-4">
//                     <div className="col-md-8">
//                       <div className="search-box position-relative">
//                         <Search
//                           size={18}
//                           className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
//                         />
//                         <Form.Control
//                           type="text"
//                           className="ps-5"
//                           placeholder={`Search ${label.toLowerCase()} by name or email...`}
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-4 text-end">
//                       <span className="fw-semibold">
//                         {users.length} {label}
//                         {users.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>

//                   <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                     {loadingUsers ? (
//                       <div className="d-flex justify-content-center align-items-center py-5">
//                         <Spinner animation="border" className="me-2" />
//                         <span>Loading users...</span>
//                       </div>
//                     ) : users.length > 0 ? (
//                       <div className="row g-2">
//                         {users.map((user) => (
//                           <UserCard key={user._id || user.email} user={user} />
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center text-muted py-5">
//                         <XCircle size={48} className="mb-3 opacity-50" />
//                         <h5>No {label} Users Found</h5>
//                         <p className="mb-0">
//                           {searchTerm
//                             ? "Try adjusting your search terms"
//                             : `No ${label.toLowerCase()} users are currently registered`}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Tab>
//             ))}
//           </Tabs>
//         </Modal.Body>

//         <Modal.Footer className="bg-light">
//           <div className="d-flex justify-content-between align-items-center w-100">
//             <div className="text-muted small">
//               Total Users: {allUsers.length} | Showing: {currentUsers.length}{" "}
//               {ROLE_LABELS[normalizeRole(activeTab)] || "users"}
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

//       {canAddUsers && (
//         <UserPresenceModal
//           show={showPresenceModal}
//           onHide={() => setShowPresenceModal(false)}
//           status={presenceStatus}
//         />
//       )}

//       {/* Add User Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {alertMessage.message && (
//             <Alert variant={alertMessage.type} className="mb-3">
//               {alertMessage.message}
//             </Alert>
//           )}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Name *</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter full name"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Email *</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Enter email address"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Password *</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Enter password"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Role *</Form.Label>
//               <Form.Select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 required
//               >
//                 {addUserRoleOptions.map((role) => (
//                   <option key={role} value={role}>
//                     {ROLE_LABELS[role]}
//                   </option>
//                 ))}
//               </Form.Select>
//               <Form.Text className="text-muted">
//                 New users must log in with their email and password at the login
//                 page. Agent Admin can see all team submissions on /agent.
//               </Form.Text>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={handleCloseModal}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Adding..." : "Add User"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Stats Cards */}
//       <div className="container-fluid p-2">
//         {/* Row 1: Content Overview + Charts */}
//         <div className="row g-3 mb-4">
//           {/* Column 1: Content Overview */}
//           <div className="col-12 col-md-4">
//             <ContentOverviewCard
//               evaluationCount={totalEvaluationCounts ?? 0}
//               escalationCount={totalEscalationCounts ?? 0}
//               recentActivity={recentActivity}
//               viewPath={`${moduleBase}/qc-members`}
//               timeAgo={timeAgo}
//             />
//           </div>

//           {/* Column 2: Evaluations Chart */}
//           <div className="col-12 col-md-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body d-flex flex-column">
//                 <EvaluationsBarChart />
//               </div>
//             </div>
//           </div>

//           {/* Column 3: Daily Escalation Chart */}
//           <div className="col-12 col-md-4">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body d-flex flex-column">
//                 <DailyEscalationChart />
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
//                 <EscalationRatingPieChart />
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

//         {/* QC Team & Sales Agent Team */}
//         <div className="row g-3">
//           {[
//             {
//               title: "QC Team",
//               data: qcTeam,
//               link: `${moduleBase}/qc-members`,
//               description: "Quality Control Team Members",
//               icon: Shield,
//             },
//             {
//               title: "Sales Agent Team",
//               data: agents,
//               link: `${moduleBase}/sales-team`,
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
//                         Loading {team.title.toLowerCase()}...
//                       </span>
//                     </div>
//                   ) : team.data.length > 0 ? (
//                     <ul className="list-group list-group-flush">
//                       {team.data.slice(0, 5).map((member, memberIdx) => (
//                         <li
//                           key={member._id}
//                           className="list-group-item d-flex justify-content-between align-items-center py-3"
//                           style={{
//                             borderLeft:
//                               memberIdx === 0 ? "3px solid #4CAF50" : "none",
//                           }}
//                         >
//                           <div>
//                             <strong>{member.name}</strong>
//                             <div className="text-muted small">
//                               {member.email}
//                             </div>
//                             <span className="badge bg-light text-dark border mt-1">
//                               {ROLE_LABELS[normalizeRole(member.role)] ||
//                                 member.role}
//                             </span>
//                           </div>
//                           <div className="d-flex gap-2">
//                             <button
//                               className="btn btn-outline-primary btn-sm p-1"
//                               onClick={() => handleEditUser(member)}
//                               title="Edit User"
//                             >
//                               <Edit size={14} />
//                             </button>
//                             <button
//                               className="btn btn-outline-danger btn-sm p-1"
//                               onClick={() => handleDeleteUser(member)}
//                               title="Delete User"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-muted text-center my-5">
//                       No users found.
//                     </p>
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

// export default Overview
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
  getInvitedUsersApi,
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
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAgentFormSubmitsApi, getContentOverviewApi } from "../features/analytics";
import EscalationRatingPieChart from "./admin/escalation/EscalationRatingPieChart";
import jwtDecode from "jwt-decode";
import EvaluationsBarChart from "./EvaluationsBarChart";
import ReportDownload from "./ReportDownload";
import DailyEscalationChart from "./DailyEscalationChart";
import DailyMarketingLineChart from "./DailyMarketingLineChart.jsx";
import ContentOverviewCard from "./ContentOverviewCard";
import UserPresenceModal from "./UserPresenceModal";
import InvitedUsersModal from "./InvitedUsersModal";
import TotalUsersModal from "./TotalUsersModal";
import { computeInviteStats } from "../utils/inviteStats";
import {
  ROLES,
  normalizeRole,
  isSuperAdmin,
  ROLE_LABELS,
  SUPER_ADMIN_PANEL_ROLES,
  isAgentRole,
  isQcRole,
  getModuleBasePath,
} from "../utils/roles";

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
  const [publishedCount, setPublishedCount] = useState(0);
  const currentUserRole = normalizeRole(localStorage.getItem("userRole") || "");
  const moduleBase = getModuleBasePath(currentUserRole);
  const canAddUsers = isSuperAdmin(currentUserRole);
  const addUserRoleOptions = SUPER_ADMIN_PANEL_ROLES;
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
        setPublishedCount(result.publishedCount ?? result.totalEvaluations ?? 0);
        setRecentActivity(Array.isArray(result.recentActivity) ? result.recentActivity : []);
        if (result.totalEvaluations != null) {
          setTotalEvaluationCounts(result.totalEvaluations);
        }
        if (result.totalEscalations != null) {
          setTotalEscalationCounts(result.totalEscalations);
        }
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
    role: ROLES.AGENT_USER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // QC Team & Sales Agent Team
  const [qcTeam, setQcTeam] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  // Tracks which team lists (keyed by team.key, e.g. "qc" / "agents") are
  // expanded to show every member instead of just the first 3.
  const [expandedTeams, setExpandedTeams] = useState({});

  const toggleTeamExpanded = (teamKey) => {
    setExpandedTeams((prev) => ({ ...prev, [teamKey]: !prev[teamKey] }));
  };

  // Users modal
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);

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
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState("active");

  // Invited Users modal
  const [inviteStats, setInviteStats] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const applyInviteStats = (invites) => {
    const stats = computeInviteStats(invites);
    setInviteStats(stats);
    return stats;
  };

  const refreshInviteStats = async () => {
    try {
      const res = await getInvitedUsersApi();
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      applyInviteStats(list);
    } catch (err) {
      console.error("Failed to refresh invite stats:", err);
    }
  };

  const refreshPresenceCounts = async () => {
    if (!canAddUsers) return;
    try {
      const [users, onlineUsers] = await Promise.all([
        totalUserCountApi(),
        onlineUsersCountApi(),
      ]);
      setTotalUsers(users?.count ?? 0);
      setOnlineUsersCount(onlineUsers?.count ?? 0);
      await refreshInviteStats();
    } catch (err) {
      console.error("Failed to refresh presence counts:", err);
    }
  };

  const openPresenceModal = (status) => {
    setPresenceStatus(status);
    setShowPresenceModal(true);
  };

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
          canAddUsers ? onlineUsersCountApi() : Promise.resolve(null),
        ]);

        setTotalUsers(users?.count ?? 0);
        setTotalEscalationCounts(escalations?.count ?? 0);
        setTotalEvaluationCounts(evaluations?.count ?? 0);
        setTotalMarketingCounts(marketing?.count ?? 0);
        if (canAddUsers) {
          setOnlineUsersCount(onlineUsers?.count ?? 0);
          await refreshInviteStats();
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchAllData();
  }, [canAddUsers]);

  useEffect(() => {
    if (!canAddUsers) return undefined;
    const timer = setInterval(refreshPresenceCounts, 15000);
    return () => clearInterval(timer);
  }, [canAddUsers]);

  // Fetch ALL users in a single useEffect - QC, Agents, and Admins
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        const users = res?.data?.data || [];

        setQcTeam(users.filter((u) => isQcRole(u.role)));
        setAgents(users.filter((u) => isAgentRole(u.role)));
      } catch (err) {
        console.error("Error fetching users", err);
        setAgents([]);
        setQcTeam([]);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchUsers();
  }, []);

  const refreshTeamsFromApi = async () => {
    try {
      const res = await getallusersApi();
      const users = res?.data?.data || [];
      setQcTeam(users.filter((u) => isQcRole(u.role)));
      setAgents(users.filter((u) => isAgentRole(u.role)));
      setUsersRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Error refreshing users:", err);
    }
  };

  // Handle users modal
  const handleShowUsersModal = () => {
    setShowUsersModal(true);
  };

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

        await refreshTeamsFromApi();

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
        await refreshTeamsFromApi();

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

  // Handle modal open/close for Add User
 const handleShowModal = () => {
  setFormData({
    name: "",
    email: "",
    password: "",
    role: ROLES.AGENT_USER,
  });

  setAlertMessage({ type: "", message: "" });

  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);

  setFormData({
    name: "",
    email: "",
    password: "",
    role: ROLES.AGENT_USER,
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
        const roleLabel =
          ROLE_LABELS[normalizeRole(formData.role)] || formData.role;
        setAlertMessage({
          type: "success",
          message: `User "${formData.name.trim()}" created as ${roleLabel}. They can log in with the credentials you provided.`,
        });

        const [updatedUsers, usersRes] = await Promise.all([
          totalUserCountApi(),
          getallusersApi(),
        ]);
        setTotalUsers(updatedUsers?.count ?? 0);

        const users = usersRes?.data?.data || [];
        setQcTeam(users.filter((u) => isQcRole(u.role)));
        setAgents(users.filter((u) => isAgentRole(u.role)));

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

  const handleInviteCountsChange = (payload) => {
    if (payload?.total != null) {
      setInviteStats({
        total: payload.total,
        pending: payload.pending ?? 0,
        accepted: payload.accepted ?? 0,
        expired: payload.expired ?? 0,
        awaiting: payload.awaiting ?? payload.pending ?? 0,
      });
    }
    if (payload?.totalUsers != null) {
      setTotalUsers(payload.totalUsers);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {canAddUsers ? (
          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={() => openPresenceModal("active")}
            >
              Active Users : {onlineUsersCount ?? "Loading..."}
            </Button>
            <Button
              variant="danger"
              onClick={() => openPresenceModal("inactive")}
            >
              Inactive Users :{" "}
              {totalUsers !== null && onlineUsersCount !== null
                ? Math.max(0, totalUsers - onlineUsersCount)
                : "Loading..."}
            </Button>
            <Button
              variant="warning"
              className="text-dark"
              onClick={() => setShowInviteModal(true)}
            >
              Invited Users :{" "}
              {inviteStats != null ? inviteStats.pending : "Loading..."}
            </Button>
          </div>
        ) : (
          <div />
        )}

        <div>
          <div className="d-flex gap-2 align-items-center">
            <Button
              className="d-flex align-items-center justify-content-center gap-2 text-nowrap border-0"
              style={{
                minHeight: "38px",
                padding: "0.5rem 1rem",
                background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                color: "#fff",
                fontWeight: 500,
              }}
              onClick={handleShowUsersModal}
            >
              <Users size={18} />
              <span>{totalUsers ?? 0} Total Users</span>
            </Button>
            {canAddUsers ? (
              <Button
                variant="dark"
                onClick={handleShowModal}
                className="d-flex align-items-center justify-content-center gap-2 text-nowrap"
                style={{
                  minHeight: "38px",
                  padding: "0.5rem 1rem",
                  fontWeight: 500,
                }}
              >
                <UserPlus size={18} />
                <span>Add User</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <TotalUsersModal
        show={showUsersModal}
        onHide={() => setShowUsersModal(false)}
        actorRole={currentUserRole}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        refreshKey={usersRefreshKey}
      />

      {canAddUsers && (
        <InvitedUsersModal
          show={showInviteModal}
          onHide={() => setShowInviteModal(false)}
          roleOptions={addUserRoleOptions}
          onCountsChange={handleInviteCountsChange}
        />
      )}

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

          <Form onSubmit={handleEditSubmit} autoComplete="off">
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                placeholder="Enter full name"
                autoComplete="off"
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
                autoComplete="off"
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

      {canAddUsers && (
        <UserPresenceModal
          show={showPresenceModal}
          onHide={() => setShowPresenceModal(false)}
          status={presenceStatus}
        />
      )}

      {/* Add User Modal */}
    {/* Add User Modal */}
{showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="add-user-modal-title"
  >
    <div
      className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      onClick={() => !isSubmitting && handleCloseModal()}
    />

    <div className="relative z-10 flex max-h-[70vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <UserPlus size={20} />
          </span>
          <h2
            id="add-user-modal-title"
            className="text-base font-semibold text-slate-900"
          >
            Add New User
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCloseModal}
          disabled={isSubmitting}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {alertMessage.message && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              alertMessage.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {alertMessage.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/*
            Decoy fields: Chrome/Edge ignore autoComplete="off" on real
            login-shaped forms and will still autofill the first saved
            credential into the visible name/email/password inputs below.
            Placing hidden bait inputs before the real ones (with the
            attribute names browsers look for) absorbs that autofill
            instead, so the real fields stay empty on open.
          */}
          <input
            type="text"
            name="fakeusernameremembered"
            autoComplete="username"
            style={{ display: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />
          <input
            type="password"
            name="fakepasswordremembered"
            autoComplete="new-password"
            style={{ display: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              autoComplete="off"
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              autoComplete="off"
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {addUserRoleOptions.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              New users must log in with their email and password at the
              login page.
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button
          type="button"
          onClick={handleCloseModal}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {isSubmitting ? "Adding..." : "Add User"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Stats Cards */}
      <div className="container-fluid p-2">
        {/* Row 1: Content Overview + Charts */}
        <div className="row g-3 mb-4">
          {/* Column 1: Content Overview */}
          <div className="col-12 col-md-4">
            <ContentOverviewCard
              evaluationCount={totalEvaluationCounts ?? 0}
              escalationCount={totalEscalationCounts ?? 0}
              recentActivity={recentActivity}
              viewPath={`${moduleBase}/qc-members`}
              timeAgo={timeAgo}
            />
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

        {/* QC Team & Sales Agent Team */}
        <div className="row g-3">
          {[
            {
              key: "qc",
              title: "QC Team",
              data: qcTeam,
              link: `${moduleBase}/qc-members`,
              description: "Quality Control Team Members",
              icon: Shield,
            },
            {
              key: "agents",
              title: "Sales Agent Team",
              data: agents,
              link: `${moduleBase}/sales-team`,
              description: "Sales and Marketing Team",
              icon: UserCheck,
            },
          ].map((team, idx) => (
            <div className="col-12 col-lg-6" key={idx}>
              <div className="card border-0 shadow-sm mb-4 h-100">
                <div
                  style={{
                    background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                  }}
                  className="card-header d-flex justify-content-between align-items-center py-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <team.icon size={20} className="text-white" />
                    <div>
                      <h5 className="mb-0 text-white fw-bold">{team.title}</h5>
                      <small className="text-white opacity-75">
                        {team.description}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
                      {team.data.length} Members
                    </span>
                    <button
                      onClick={() => navigate(team.link)}
                      className="btn btn-light btn-sm"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  {loadingAgents ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner
                        animation="border"
                        variant="primary"
                        className="me-2"
                      />
                      <span className="text-muted">
                        Loading {team.title.toLowerCase()}...
                      </span>
                    </div>
                  ) : team.data.length > 0 ? (
                    <>
                      <ul className="list-group list-group-flush">
                        {(expandedTeams[team.key]
                          ? team.data
                          : team.data.slice(0, 3)
                        ).map((member, memberIdx) => (
                          <li
                            key={member._id}
                            className="list-group-item d-flex justify-content-between align-items-center py-3"
                            style={{
                              borderLeft:
                                memberIdx === 0 ? "3px solid #4CAF50" : "none",
                            }}
                          >
                            <div>
                              <strong>{member.name}</strong>
                              <div className="text-muted small">
                                {member.email}
                              </div>
                              <span className="badge bg-light text-dark border mt-1">
                                {ROLE_LABELS[normalizeRole(member.role)] ||
                                  member.role}
                              </span>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm p-1"
                                onClick={() => handleEditUser(member)}
                                title="Edit User"
                              >
                                <Edit size={14} />
                              </button>
                              {/* Delete is always available for every member, regardless of role or any status */}
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

                      {team.data.length > 3 && (
                        <div className="text-center py-2 border-top">
                          <button
                            className="btn btn-link btn-sm text-decoration-none fw-semibold"
                            onClick={() => toggleTeamExpanded(team.key)}
                          >
                            {expandedTeams[team.key]
                              ? "See less"
                              : `See more (${team.data.length - 3} more)`}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted text-center my-5">
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

export default Overview;
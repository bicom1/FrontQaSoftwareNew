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
//   TrendingUp
// } from "lucide-react";
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import { getProfileApi } from '../features/userApis';
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
//     tasksCompleted: 128
//   });
  
//   // State for sidebar and header - use the same state management as Dashboard
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState('analytics'); // Set to 'analytics' since we're coming from Analytics
//   const [notifications, setNotifications] = useState([
//     { id: 1, text: 'New user registration', time: '5 minutes ago', read: false },
//     { id: 2, text: 'Server update completed', time: '2 hours ago', read: false },
//     { id: 3, text: 'Weekly report available', time: '1 day ago', read: true },
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
//             permissions: ["user_management", "content_moderation", "analytics_view"],
//             phone: "+1 (555) 123-4567",
//             location: "New York, USA",
//             status: "active"
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
//     if (tab !== 'analytics') {
//       navigate(tab === 'overview' ? '/dashboard' : `/${tab}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex" style={{ minHeight: '100vh' }}>
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
//     <div className="d-flex" style={{ minHeight: '100vh' }}>
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
//               <p className="text-muted mb-0">View and manage administrator profile</p>
//             </div>
//             <div className="d-flex align-items-center gap-2">
//               <div className="stat-card mini">
//                 <div className="stat-value">{stats.tasksCompleted}</div>
//                 <div className="stat-label">Tasks</div>
//               </div>
//             </div>
//           </div>
//           <TableAdmin/>
//           {/* Add the same CSS as in Analytics component */}
//           <style jsx>{`
//             .analytics-dashboard {
//               font-family: 'Inter', 'Segoe UI', sans-serif;
//               background: #f8fafc;
//             }
            
//             .header-section {
//               padding: 1rem 0;
//               border-bottom: 1px solid #e2e8f0;
//             }
            
//             .stat-card {
//               background: white;
//               border: none;
//               border-radius: 12px;
//               padding: 1.5rem;
//               box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
//               transition: transform 0.2s, box-shadow 0.2s;
//             }
            
//             .stat-card:hover {
//               transform: translateY(-2px);
//               box-shadow: 0 8px 15px rgba(0, 0, 0, 0.06);
//             }
            
//             .stat-card.mini {
//               padding: 0.75rem 1rem;
//               text-align: center;
//               width: 120px;
//             }
            
//             .stat-card.mini .stat-value {
//               font-size: 1.5rem;
//               font-weight: 700;
//               margin-bottom: 0.25rem;
//             }
            
//             .stat-card.mini .stat-label {
//               font-size: 0.75rem;
//               color: #64748b;
//             }
            
//             .stat-value-sm {
//               font-size: 1.25rem;
//               font-weight: 700;
//               color: #1e293b;
//             }
            
//             .stat-label-sm {
//               font-size: 0.75rem;
//               color: #64748b;
//             }
            
//             .stat-icon {
//               width: 48px;
//               height: 48px;
//               border-radius: 12px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//             }
            
//             .stat-value {
//               font-size: 1.75rem;
//               font-weight: 700;
//               margin-bottom: 0.25rem;
//               color: #1e293b;
//             }
            
//             .stat-label {
//               font-size: 0.875rem;
//               color: #64748b;
//               margin-bottom: 0;
//             }
            
//             .stat-trend {
//               font-size: 0.75rem;
//               font-weight: 600;
//               margin-top: 0.5rem;
//               display: flex;
//               align-items: center;
//               gap: 0.25rem;
//             }
            
//             .stat-trend.positive {
//               color: #10b981;
//             }
            
//             .stat-trend.negative {
//               color: #ef4444;
//             }
            
//             .search-box {
//               position: relative;
//             }
            
//             .search-icon {
//               position: absolute;
//               left: 12px;
//               top: 50%;
//               transform: translateY(-50%);
//               color: #94a3b8;
//               z-index: 10;
//             }
            
//             .search-input {
//               padding-left: 40px;
//               border-radius: 8px;
//               border: 1px solid #cbd5e1;
//             }
            
//             .admin-card {
//               transition: all 0.3s ease;
//             }
            
//             .admin-card:hover {
//               box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
//             }
            
//             .admin-card.expanded {
//               box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//             }
            
//             .admin-avatar {
//               width: 50px;
//               height: 50px;
//               font-size: 1.25rem;
//               position: relative;
//               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//             }
            
//             .admin-badge {
//               position: absolute;
//               bottom: -2px;
//               right: -2px;
//               background: #f59e0b;
//               color: white;
//               width: 18px;
//               height: 18px;
//               border-radius: 50%;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               border: 2px solid white;
//             }
            
//             .admin-details {
//               animation: fadeIn 0.3s ease;
//             }
            
//             .detail-title {
//               font-size: 0.875rem;
//               font-weight: 600;
//               color: #475569;
//               margin-bottom: 0.75rem;
//             }
            
//             .detail-item {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 0.5rem;
//               font-size: 0.875rem;
//             }
            
//             .detail-label {
//               color: #64748b;
//               fontWeight: 500;
//             }
            
//             .admin-name-link {
//               cursor: pointer;
//               transition: color 0.2s;
//             }
            
//             .admin-name-link:hover {
//               color: #3b82f6;
//             }
            
//             @keyframes fadeIn {
//               from { opacity: 0; }
//               to { opacity: 1; }
//             }
            
//             @keyframes spin {
//               from { transform: rotate(0deg); }
//               to { transform: rotate(360deg); }
//             }
            
//             .spin {
//               animation: spin 1s linear infinite;
//             }
            
//             .bg-primary-gradient {
//               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//             }
            
//             @media (max-width: 768px) {
//               .stat-value {
//                 font-size: 1.5rem;
//               }
              
//               .admin-avatar {
//                 width: 40px;
//                 height: 40px;
//                 font-size: 1rem;
//               }
//             }
//           `}</style>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDetails;
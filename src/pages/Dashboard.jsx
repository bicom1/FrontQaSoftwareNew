// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Bell, Settings, User, BarChart2, PieChart, Activity, Users, Briefcase, Search, Menu, X } from 'lucide-react';

// const Dashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [notifications, setNotifications] = useState([
//     { id: 1, text: 'New user registration', time: '5 minutes ago', read: false },
//     { id: 2, text: 'Server update completed', time: '2 hours ago', read: false },
//     { id: 3, text: 'Weekly report available', time: '1 day ago', read: true },
//   ]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return <Overview />;
//       case 'analytics':
//         return <Analytics />;
//       case 'users':
//         return <Users />;
//       case 'projects':
//         return <Projects />;
//       default:
//         return <Overview />;
//     }
//   };

//   return (
//     <div className="d-flex" style={{ minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <div 
//         className={`bg-dark text-white ${sidebarOpen ? 'p-3 d-flex' : 'p-3 d-none d-md-flex'}`} 
//         style={{ width: sidebarOpen ? '250px' : '70px', flexDirection: 'column', transition: 'width 0.3s ease' }}
//       >
//         <div className="d-flex align-items-center mb-4">
//           {sidebarOpen && (
//             <h4 className="mb-0 flex-grow-1">DashPro</h4>
//           )}
//           <button 
//             className="btn btn-dark p-1" 
//             onClick={toggleSidebar}
//           >
//             {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         <div className="nav flex-column nav-pills">
//           <button 
//             className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'overview' ? 'btn-primary' : 'btn-dark'}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             <BarChart2 size={20} />
//             {sidebarOpen && <span className="ms-2">Overview</span>}
//           </button>
//           <button 
//             className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'analytics' ? 'btn-primary' : 'btn-dark'}`}
//             onClick={() => setActiveTab('analytics')}
//           >
//             <Activity size={20} />
//             {sidebarOpen && <span className="ms-2">Analytics</span>}
//           </button>
//           <button 
//             className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'users' ? 'btn-primary' : 'btn-dark'}`}
//             onClick={() => setActiveTab('users')}
//           >
//             <Users size={20} />
//             {sidebarOpen && <span className="ms-2">Users</span>}
//           </button>
//           <button 
//             className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'projects' ? 'btn-primary' : 'btn-dark'}`}
//             onClick={() => setActiveTab('projects')}
//           >
//             <Briefcase size={20} />
//             {sidebarOpen && <span className="ms-2">Projects</span>}
//           </button>
//         </div>

//         <div className="mt-auto">
//           {sidebarOpen && (
//             <div className="d-flex align-items-center p-2 border-top border-secondary mt-4 pt-2">
//               <div 
//                 className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
//                 style={{ width: '40px', height: '40px' }}
//               >
//                 <span className="fw-bold">JD</span>
//               </div>
//               <div>
//                 <div className="fw-bold">John Doe</div>
//                 <div className="small">Administrator</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1 d-flex flex-column">
//         {/* Header */}
//         <header className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
//           <div className="d-md-none">
//             <button className="btn btn-light" onClick={toggleSidebar}>
//               <Menu size={20} />
//             </button>
//           </div>

//           <div className="d-none d-md-block">
//             <div className="input-group">
//               <span className="input-group-text bg-light border-end-0">
//                 <Search size={18} />
//               </span>
//               <input 
//                 type="text" 
//                 className="form-control border-start-0 bg-light" 
//                 placeholder="Search..."
//                 style={{ width: '250px' }}
//               />
//             </div>
//           </div>

//           <div className="d-flex align-items-center">
//             {/* Notifications */}
//             <div className="dropdown me-3 position-relative">
//               <button 
//                 className="btn btn-light position-relative" 
//                 onClick={() => setShowNotifications(!showNotifications)}
//               >
//                 <Bell size={20} />
//                 {unreadCount > 0 && (
//                   <span 
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
//                     style={{ fontSize: '0.5rem' }}
//                   >
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
              
//               {showNotifications && (
//                 <div 
//                   className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow" 
//                   style={{ width: '300px', zIndex: 1000 }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center px-3 pb-2 border-bottom">
//                     <h6 className="mb-0">Notifications</h6>
//                     <button 
//                       className="btn btn-sm btn-link text-decoration-none" 
//                       onClick={markAllAsRead}
//                     >
//                       Mark all as read
//                     </button>
//                   </div>
//                   <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                     {notifications.length > 0 ? (
//                       notifications.map(note => (
//                         <div 
//                           key={note.id} 
//                           className={`px-3 py-2 border-bottom ${!note.read ? 'bg-light' : ''}`}
//                         >
//                           <div className="d-flex justify-content-between">
//                             <span>{note.text}</span>
//                             {!note.read && <span className="badge bg-primary rounded-pill">New</span>}
//                           </div>
//                           <small className="text-muted">{note.time}</small>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-3 text-center text-muted">No notifications</div>
//                     )}
//                   </div>
//                   <div className="text-center p-2 border-top">
//                     <button className="btn btn-sm btn-link text-decoration-none">View all</button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* User Menu */}
//             <div className="dropdown position-relative">
//               <button 
//                 className="btn btn-light" 
//                 onClick={() => setShowUserMenu(!showUserMenu)}
//               >
//                 <User size={20} />
//               </button>
              
//               {showUserMenu && (
//                 <div 
//                   className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow" 
//                   style={{ width: '200px', zIndex: 1000 }}
//                 >
//                   <button className="dropdown-item d-flex align-items-center">
//                     <User size={16} className="me-2" /> Profile
//                   </button>
//                   <button className="dropdown-item d-flex align-items-center">
//                     <Settings size={16} className="me-2" /> Settings
//                   </button>
//                   <div className="dropdown-divider"></div>
//                   <button className="dropdown-item d-flex align-items-center text-danger">
//                     <X size={16} className="me-2" /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <div className="flex-grow-1 bg-light p-4">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Dashboard Content Components
// const Overview = () => {
//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4>Dashboard Overview</h4>
//         <div>
//           <select className="form-select form-select-sm">
//             <option>Last 7 days</option>
//             <option>Last 30 days</option>
//             <option>This month</option>
//             <option>Last quarter</option>
//           </select>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-4">
//         <div className="col-12 col-md-6 col-lg-3">
//           <div className="card border-0 shadow-sm h-100">
//             <div className="card-body">
//               <h6 className="text-muted">Total Users</h6>
//               <div className="d-flex align-items-center">
//                 <h2 className="mb-0">1,284</h2>
//                 <span className="badge bg-success ms-2">+12%</span>
//               </div>
//               <div className="text-muted small mt-2">Compared to last week</div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-md-6 col-lg-3">
//           <div className="card border-0 shadow-sm h-100">
//             <div className="card-body">
//               <h6 className="text-muted">Active Projects</h6>
//               <div className="d-flex align-items-center">
//                 <h2 className="mb-0">42</h2>
//                 <span className="badge bg-danger ms-2">-3%</span>
//               </div>
//               <div className="text-muted small mt-2">2 projects completed this week</div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-md-6 col-lg-3">
//           <div className="card border-0 shadow-sm h-100">
//             <div className="card-body">
//               <h6 className="text-muted">Total Revenue</h6>
//               <div className="d-flex align-items-center">
//                 <h2 className="mb-0">$86,589</h2>
//                 <span className="badge bg-success ms-2">+8%</span>
//               </div>
//               <div className="text-muted small mt-2">$10,234 this month</div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-md-6 col-lg-3">
//           <div className="card border-0 shadow-sm h-100">
//             <div className="card-body">
//               <h6 className="text-muted">Tasks Completed</h6>
//               <div className="d-flex align-items-center">
//                 <h2 className="mb-0">187</h2>
//                 <span className="badge bg-success ms-2">+24%</span>
//               </div>
//               <div className="text-muted small mt-2">32 tasks pending</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="row g-3 mb-4">
//         <div className="col-12 col-lg-8">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Performance Overview</h5>
//               <div className="btn-group btn-group-sm">
//                 <button className="btn btn-outline-secondary active">Daily</button>
//                 <button className="btn btn-outline-secondary">Weekly</button>
//                 <button className="btn btn-outline-secondary">Monthly</button>
//               </div>
//             </div>
//             <div className="card-body">
//               <div className="text-center py-5 text-muted bg-light rounded">
//                 <BarChart2 size={40} className="mb-2" />
//                 <p>Chart area - Performance metrics visualization</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-lg-4">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Traffic Sources</h5>
//               <button className="btn btn-sm btn-link text-decoration-none">View Details</button>
//             </div>
//             <div className="card-body">
//               <div className="text-center py-5 text-muted bg-light rounded">
//                 <PieChart size={40} className="mb-2" />
//                 <p>Chart area - Traffic source breakdown</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity & Tasks */}
//       <div className="row g-3">
//         <div className="col-12 col-lg-6">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Recent Activity</h5>
//               <button className="btn btn-sm btn-link text-decoration-none">View All</button>
//             </div>
//             <div className="card-body p-0">
//               <ul className="list-group list-group-flush">
//                 <li className="list-group-item d-flex justify-content-between align-items-center p-3">
//                   <div>
//                     <div className="fw-bold">New user registered</div>
//                     <div className="text-muted small">John Smith created an account</div>
//                   </div>
//                   <span className="text-muted small">2 mins ago</span>
//                 </li>
//                 <li className="list-group-item d-flex justify-content-between align-items-center p-3">
//                   <div>
//                     <div className="fw-bold">Project updated</div>
//                     <div className="text-muted small">Mobile App Dashboard v2.0</div>
//                   </div>
//                   <span className="text-muted small">1 hour ago</span>
//                 </li>
//                 <li className="list-group-item d-flex justify-content-between align-items-center p-3">
//                   <div>
//                     <div className="fw-bold">New payment received</div>
//                     <div className="text-muted small">From client #40298</div>
//                   </div>
//                   <span className="text-muted small">3 hours ago</span>
//                 </li>
//                 <li className="list-group-item d-flex justify-content-between align-items-center p-3">
//                   <div>
//                     <div className="fw-bold">Server maintenance completed</div>
//                     <div className="text-muted small">Server #12 restarted successfully</div>
//                   </div>
//                   <span className="text-muted small">Yesterday</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-lg-6">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Upcoming Tasks</h5>
//               <button className="btn btn-sm btn-primary">+ Add Task</button>
//             </div>
//             <div className="card-body p-0">
//               <ul className="list-group list-group-flush">
//                 <li className="list-group-item p-3">
//                   <div className="form-check d-flex align-items-center">
//                     <input className="form-check-input me-3" type="checkbox" id="task1" />
//                     <div className="flex-grow-1">
//                       <label className="form-check-label fw-bold" htmlFor="task1">
//                         Update user interface for client portal
//                       </label>
//                       <div className="d-flex align-items-center mt-1">
//                         <span className="badge bg-warning text-dark me-2">High Priority</span>
//                         <span className="text-muted small">Due in 2 days</span>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//                 <li className="list-group-item p-3">
//                   <div className="form-check d-flex align-items-center">
//                     <input className="form-check-input me-3" type="checkbox" id="task2" />
//                     <div className="flex-grow-1">
//                       <label className="form-check-label fw-bold" htmlFor="task2">
//                         Prepare monthly financial report
//                       </label>
//                       <div className="d-flex align-items-center mt-1">
//                         <span className="badge bg-danger text-white me-2">Urgent</span>
//                         <span className="text-muted small">Due tomorrow</span>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//                 <li className="list-group-item p-3">
//                   <div className="form-check d-flex align-items-center">
//                     <input className="form-check-input me-3" type="checkbox" id="task3" />
//                     <div className="flex-grow-1">
//                       <label className="form-check-label fw-bold" htmlFor="task3">
//                         Schedule team meeting for project kickoff
//                       </label>
//                       <div className="d-flex align-items-center mt-1">
//                         <span className="badge bg-info text-white me-2">Medium</span>
//                         <span className="text-muted small">Due in 3 days</span>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//                 <li className="list-group-item p-3">
//                   <div className="form-check d-flex align-items-center">
//                     <input className="form-check-input me-3" type="checkbox" id="task4" />
//                     <div className="flex-grow-1">
//                       <label className="form-check-label fw-bold" htmlFor="task4">
//                         Review and approve content for marketing campaign
//                       </label>
//                       <div className="d-flex align-items-center mt-1">
//                         <span className="badge bg-secondary text-white me-2">Low</span>
//                         <span className="text-muted small">Due in 5 days</span>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const Analytics = () => {
//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4>Analytics</h4>
//         <div className="btn-group">
//           <button className="btn btn-outline-primary active">Week</button>
//           <button className="btn btn-outline-primary">Month</button>
//           <button className="btn btn-outline-primary">Year</button>
//         </div>
//       </div>

//       <div className="row g-3 mb-4">
//         <div className="col-12">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Revenue Overview</h5>
//               <div className="form-check form-switch">
//                 <input className="form-check-input" type="checkbox" id="compareToggle" defaultChecked />
//                 <label className="form-check-label" htmlFor="compareToggle">Compare to previous period</label>
//               </div>
//             </div>
//             <div className="card-body">
//               <div className="text-center py-5 text-muted bg-light rounded">
//                 <Activity size={40} className="mb-2" />
//                 <p>Chart area - Revenue trends visualization</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row g-3">
//         <div className="col-12 col-md-6">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white">
//               <h5 className="mb-0">User Demographics</h5>
//             </div>
//             <div className="card-body">
//               <div className="text-center py-5 text-muted bg-light rounded">
//                 <PieChart size={40} className="mb-2" />
//                 <p>Chart area - User demographics breakdown</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-md-6">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-white">
//               <h5 className="mb-0">Conversion Rates</h5>
//             </div>
//             <div className="card-body">
//               <div className="text-center py-5 text-muted bg-light rounded">
//                 <BarChart2 size={40} className="mb-2" />
//                 <p>Chart area - Conversion metrics visualization</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const Users = () => {
//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4>Users Management</h4>
//         <button className="btn btn-primary">+ Add User</button>
//       </div>

//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-white p-3">
//           <div className="row g-3 align-items-center">
//             <div className="col-12 col-md-4">
//               <div className="input-group">
//                 <span className="input-group-text bg-light border-end-0">
//                   <Search size={18} />
//                 </span>
//                 <input type="text" className="form-control border-start-0 bg-light" placeholder="Search users..." />
//               </div>
//             </div>
//             <div className="col-12 col-md-3">
//               <select className="form-select">
//                 <option>All Roles</option>
//                 <option>Administrator</option>
//                 <option>Editor</option>
//                 <option>Viewer</option>
//               </select>
//             </div>
//             <div className="col-12 col-md-3">
//               <select className="form-select">
//                 <option>All Status</option>
//                 <option>Active</option>
//                 <option>Inactive</option>
//                 <option>Pending</option>
//               </select>
//             </div>
//             <div className="col-12 col-md-2">
//               <button className="btn btn-outline-secondary w-100">Filter</button>
//             </div>
//           </div>
//         </div>
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th scope="col" className="ps-3">
//                     <div className="form-check">
//                       <input className="form-check-input" type="checkbox" id="selectAll" />
//                     </div>
//                   </th>
//                   <th scope="col">User</th>
//                   <th scope="col">Role</th>
//                   <th scope="col">Status</th>
//                   <th scope="col">Last Login</th>
//                   <th scope="col" className="text-end pe-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[1, 2, 3, 4, 5].map(i => (
//                   <tr key={i}>
//                     <td className="ps-3">
//                       <div className="form-check">
//                         <input className="form-check-input" type="checkbox" id={`select${i}`} />
//                       </div>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-center">
//                         <div 
//                           className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
//                           style={{ width: '40px', height: '40px' }}
//                         >
//                           <span className="fw-bold">{`U${i}`}</span>
//                         </div>
//                         <div>
//                           <div className="fw-bold">{`User ${i}`}</div>
//                           <div className="text-muted small">{`user${i}@example.com`}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={`badge ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-info' : 'bg-secondary'}`}>
//                         {i % 3 === 0 ? 'Administrator' : i % 3 === 1 ? 'Editor' : 'Viewer'}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`badge ${i % 2 === 0 ? 'bg-success' : 'bg-warning text-dark'}`}>
//                         {i % 2 === 0 ? 'Active' : 'Pending'}
//                       </span>
//                     </td>
//                     <td>{`${i} ${i === 1 ? 'hour' : 'hours'} ago`}</td>
//                     <td className="text-end pe-3">
//                       <div className="btn-group btn-group-sm">
//                         <button className="btn btn-outline-secondary">Edit</button>
//                         <button className="btn btn-outline-danger">Delete</button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="card-footer bg-white p-3">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>Showing 1 to 5 of 42 entries</div>
//             <nav>
//               <ul className="pagination pagination-sm mb-0">
//                 <li className="page-item disabled">
//                   <a className="page-link" href="#" tabIndex="-1">Previous</a>
//                 </li>
//                 <li className="page-item active">
//                   <a className="page-link" href="#">1</a>
//                 </li>
//                 <li className="page-item">
//                   <a className="page-link" href="#">2</a>
//                 </li>
//                 <li className="page-item">
//                   <a className="page-link" href="#">3</a>
//                 </li>
//                 <li className="page-item">
//                   <a className="page-link" href="#">Next</a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const Projects = () => {
//     return (
//       <>
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4>Projects</h4>
//           <button className="btn btn-primary">+ New Project</button>
//         </div>
  
//         <div className="row g-3">
//           {[1, 2, 3, 4, 5, 6].map(i => (
//             <div key={i} className="col-12 col-md-6 col-lg-4">
//               <div className="card border-0 shadow-sm h-100">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <span className={`badge ${i % 3 === 0 ? 'bg-success' : i % 3 === 1 ? 'bg-warning text-dark' : 'bg-danger'}`}>
//                       {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'In Progress' : 'Delayed'}
//                     </span>
//                     <div className="dropdown">
//                       <button className="btn btn-sm btn-light" type="button">
//                         <Settings size={16} />
//                       </button>
//                     </div>
//                   </div>
                  
//                   <h5 className="card-title">{`Project ${i}: ${['Website Redesign', 'Mobile App', 'Cloud Migration', 'E-commerce Platform', 'CRM Implementation', 'Marketing Dashboard'][i-1]}`}</h5>
//                   <p className="text-muted small">
//                     {`This project involves ${['redesigning the company website with modern UI/UX principles', 'developing a cross-platform mobile application', 'migrating on-premise systems to cloud infrastructure', 'building a comprehensive e-commerce solution', 'implementing a customer relationship management system', 'creating a marketing analytics dashboard'][i-1]}.`}
//                   </p>
                  
//                   <div className="mb-3">
//                     <div className="d-flex justify-content-between align-items-center mb-1 small">
//                       <span>Progress</span>
//                       <span>{`${[75, 45, 90, 30, 60, 15][i-1]}%`}</span>
//                     </div>
//                     <div className="progress" style={{ height: '6px' }}>
//                       <div 
//                         className={`progress-bar ${i % 3 === 0 ? 'bg-success' : i % 3 === 1 ? 'bg-warning' : 'bg-danger'}`} 
//                         role="progressbar" 
//                         style={{ width: `${[75, 45, 90, 30, 60, 15][i-1]}%` }}
//                         aria-valuenow={[75, 45, 90, 30, 60, 15][i-1]} 
//                         aria-valuemin="0" 
//                         aria-valuemax="100"
//                       ></div>
//                     </div>
//                   </div>
                  
//                   <div className="d-flex align-items-center justify-content-between mb-3">
//                     <div className="d-flex align-items-center">
//                       <div className="text-muted small me-3">
//                         <strong>Due:</strong> {`${new Date().getDate() + i}/${new Date().getMonth() + 1}/2025`}
//                       </div>
//                       <div className="text-muted small">
//                         <strong>Budget:</strong> ${`${(i * 15000).toLocaleString()}`}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="d-flex align-items-center">
//                     <div className="d-flex align-items-center">
//                       {[...Array(3)].map((_, idx) => (
//                         <div 
//                           key={idx} 
//                           className="rounded-circle border border-white bg-primary text-white d-flex align-items-center justify-content-center" 
//                           style={{ width: '30px', height: '30px', marginLeft: idx > 0 ? '-10px' : '0' }}
//                         >
//                           <span className="small fw-bold">{`T${idx+1}`}</span>
//                         </div>
//                       ))}
//                       <div 
//                         className="rounded-circle border border-white bg-light text-dark d-flex align-items-center justify-content-center" 
//                         style={{ width: '30px', height: '30px', marginLeft: '-10px' }}
//                       >
//                         <span className="small">+2</span>
//                       </div>
//                     </div>
                    
//                     <div className="ms-auto">
//                       <button className="btn btn-sm btn-outline-primary">Details</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </>
//     );
//   };

//   export default Dashboard;
import React, { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'settings', label: 'Settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div><h3>Overview</h3><p>Welcome to the admin dashboard.</p></div>;
      case 'users':
        return <div><h3>Users</h3><p>List and manage your users here.</p></div>;
      case 'settings':
        return <div><h3>Settings</h3><p>Manage dashboard settings here.</p></div>;
      default:
        return null;
    }
  };

  const sidebarStyle = {
    width: sidebarCollapsed ? '0' : '240px',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    backgroundColor: '#343a40',
    color: 'white',
    minHeight: '100vh',
    padding: sidebarCollapsed ? '0' : '1rem'
  };

  const mainContentStyle = {
    flexGrow: 1,
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const navLinkStyle = (tabId) => ({
    color: 'white',
    fontWeight: activeTab === tabId ? 'bold' : 'normal',
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h5 className="mb-4">Admin Dashboard</h5>
        <ul className="nav flex-column">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                style={navLinkStyle(tab.id)}
                className="nav-link"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={18} />
            </button>
            <h4 className="m-0">Dashboard</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Bell size={20} />
            <User size={20} />
            <LogOut size={20} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;


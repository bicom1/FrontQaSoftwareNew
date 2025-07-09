import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AgentForm from '../components/AgentForm'; 
import EscalationForm from '../components/EscalationForm';
import PpcForm from '../components/PpcForm';
import Analytics from '../components/Analytics';
import Projects from '../components/Projects';
import UserManagement from '../components/UserManagement';
import Overview from '../components/overview';
import Sidebar from '../components/sidebar';
import Header from '../components/Header';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New user registration', time: '5 minutes ago', read: false },
    { id: 2, text: 'Server update completed', time: '2 hours ago', read: false },
    { id: 3, text: 'Weekly report available', time: '1 day ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formsExpanded, setFormsExpanded] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'projects':
        return <Projects />;
      case 'agent':
        return <AgentForm />; 
      case 'escalation':
        return <EscalationForm />;
      case 'ppc':
        return <PpcForm />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formsExpanded={formsExpanded}
        setFormsExpanded={setFormsExpanded}
      />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header Component */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
        />

        {/* Content Area */}
        <div className="flex-grow-1 bg-light p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// import React, { useState } from 'react';
// import { Menu, Bell, User, LogOut } from 'lucide-react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const tabs = [
//     { id: 'overview', label: 'Overview' },
//     { id: 'users', label: 'Users' },
//     { id: 'settings', label: 'Settings' },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return <div><h3>Overview</h3><p>Welcome to the admin dashboard.</p></div>;
//       case 'users':
//         return <div><h3>Users</h3><p>List and manage your users here.</p></div>;
//       case 'settings':
//         return <div><h3>Settings</h3><p>Manage dashboard settings here.</p></div>;
//       default:
//         return null;
//     }
//   };

//   const sidebarStyle = {
//     width: sidebarCollapsed ? '0' : '240px',
//     transition: 'width 0.3s ease',
//     overflow: 'hidden',
//     backgroundColor: '#343a40',
//     color: 'white',
//     minHeight: '100vh',
//     padding: sidebarCollapsed ? '0' : '1rem'
//   };

//   const mainContentStyle = {
//     flexGrow: 1,
//     padding: '1rem',
//     backgroundColor: '#f8f9fa',
//     minHeight: '100vh',
//   };

//   const headerStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '1rem',
//   };

//   const navLinkStyle = (tabId) => ({
//     color: 'white',
//     fontWeight: activeTab === tabId ? 'bold' : 'normal',
//     padding: '0.5rem 1rem',
//     border: 'none',
//     background: 'none',
//     width: '100%',
//     textAlign: 'left',
//   });

//   return (
//     <div className="d-flex">
//       {/* Sidebar */}
//       <div style={sidebarStyle}>
//         <h5 className="mb-4">Admin Dashboard</h5>
//         <ul className="nav flex-column">
//           {tabs.map((tab) => (
//             <li className="nav-item" key={tab.id}>
//               <button
//                 style={navLinkStyle(tab.id)}
//                 className="nav-link"
//                 onClick={() => setActiveTab(tab.id)}
//               >
//                 {tab.label}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div style={mainContentStyle}>
//         {/* Header */}
//         <div style={headerStyle}>
//           <div className="d-flex align-items-center gap-2">
//             <button
//               className="btn btn-outline-secondary btn-sm"
//               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//             >
//               <Menu size={18} />
//             </button>
//             <h4 className="m-0">Dashboard</h4>
//           </div>
//           <div className="d-flex align-items-center gap-3">
//             <Bell size={20} />
//             <User size={20} />
//             <LogOut size={20} style={{ cursor: 'pointer' }} />
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div>{renderTabContent()}</div>
//       </div>
//     </div>
//   );
// };
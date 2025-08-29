import React, { useEffect, useState } from 'react';
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
import { getProfileApi } from '../features/userApis';
import AddTeamLead from '../components/AddTeamLead';

const Dashboard = ({setIsLoggedIn}) => {
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
  const [profile, setProfile] = useState(null);

  useEffect(() => {
        const fetchProfile = async () => {
          try {
            const res = await getProfileApi();
            console.log("Fetched user profile:", res);
            setProfile(res.data); // Save profile data
          } catch (err) {
            console.error("Failed to fetch user profile:", err);
          }
        };
        fetchProfile();
      }, []);
  

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'teamlead':
        return <AddTeamLead/>
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
        setProfile={profile}
      />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header Component */}
        <Header
          setIsLoggedIn={setIsLoggedIn}
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
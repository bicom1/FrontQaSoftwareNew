// components/Layout.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar';
import Header from '../../Header';

const Layout = ({ children, setIsLoggedIn }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New user registration', time: '5 minutes ago', read: false },
    { id: 2, text: 'Server update completed', time: '2 hours ago', read: false },
    { id: 3, text: 'Weekly report available', time: '1 day ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profile, setProfile] = useState(null);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        profile={profile}
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
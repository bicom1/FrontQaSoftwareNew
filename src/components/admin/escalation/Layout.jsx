// components/Layout.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import { getProfileApi } from "../../../features/userApis";
import { normalizeProfileResponse } from "../../../utils/profileUtils";

const Layout = ({ children, setIsLoggedIn }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New user registration", time: "5 minutes ago", read: false },
    { id: 2, text: "Server update completed", time: "2 hours ago", read: false },
    { id: 3, text: "Weekly report available", time: "1 day ago", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profile, setProfile] = useState(null);

  const refreshProfile = React.useCallback(async () => {
    try {
      const res = await getProfileApi();
      setProfile(normalizeProfileResponse(res.data));
    } catch (e) {
      console.error("Layout: failed to load profile", e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getProfileApi();
        const u = normalizeProfileResponse(res.data);
        if (!cancelled) setProfile(u);
      } catch (e) {
        console.error("Layout: failed to load profile", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.addEventListener("qasoft-profile-changed", refreshProfile);
    return () => window.removeEventListener("qasoft-profile-changed", refreshProfile);
  }, [refreshProfile]);

  const isAccountPage =
    location.pathname.includes("/dashboard/profile") ||
    location.pathname.includes("/dashboard/settings");

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
          userProfile={profile}
        />

        {/* Content Area — account pages use full width (no centered gutter padding) */}
        <div
          className={`flex-grow-1 bg-light ${isAccountPage ? "" : "p-4"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
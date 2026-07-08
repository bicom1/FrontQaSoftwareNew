import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AgentSidebar from "../../components/Agent/AgentSidebar";
import AgentHeader from "../../components/Agent/AgentHeader";
import useAgentFormNotifications from "../../hooks/useAgentFormNotifications";

const pathnameToTab = (pathname) => {
  const clean = pathname.replace(/\/+$/, "");
  if (clean === "/agent") return "agent";
  if (clean.endsWith("team-lead-forms")) return "team-lead-forms";
  if (clean.endsWith("team-users")) return "team-users";
  if (clean.endsWith("feedback")) return "feedback";
  if (clean.endsWith("submissions")) return "submissions";
  return "agent";
};

const AgentLayout = ({ setIsLoggedIn }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamic notifications — evaluations & escalations for logged-in agent
  const { notifications, markAllAsRead, markAsRead } = useAgentFormNotifications();

  // ── REMOVED (commented for future use): static placeholder notifications ───
  // const [notifications, setNotifications] = useState([
  //   { id: 1, text: "New user registration", time: "5 minutes ago", read: false },
  //   { id: 2, text: "Server update completed", time: "2 hours ago", read: false },
  //   { id: 3, text: "Weekly report available", time: "1 day ago", read: true },
  // ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formsExpanded, setFormsExpanded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = pathnameToTab(location.pathname);

  const handleNav = (tabKey) => {
    navigate(`/agent${tabKey}`);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <AgentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        onNav={handleNav}
        formsExpanded={formsExpanded}
        setFormsExpanded={setFormsExpanded}
      />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ transition: "margin-left 0.3s ease" }}
      >
        <AgentHeader
          setIsLoggedIn={setIsLoggedIn}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notifications={notifications}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          onViewAllSubmissions={() => navigate("/agent/submissions")}
        />

        <div className="flex-grow-1 bg-light p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;

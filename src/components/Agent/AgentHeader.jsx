// src/components/Agent/AgentHeader.jsx
import React, { useEffect, useState } from "react";
import {
  Bell,
  Settings,
  User,
  Search,
  Menu,
  LogOut,
  UserCircle,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfileApi } from "../../features/userApis";

const AgentHeader = ({
  sidebarOpen,
  setSidebarOpen,
  notifications,
  markAllAsRead,
  markAsRead,
  showNotifications,
  setShowNotifications,
  showUserMenu,
  setShowUserMenu,
  setIsLoggedIn,
  onViewAllSubmissions,
}) => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        console.log("Profile fetched:", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    markAllAsRead?.();
  };

  const handleNotificationClick = (note) => {
    markAsRead?.(note.id);
    setShowNotifications(false);
    onViewAllSubmissions?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setIsLoggedIn?.(false);
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header
      className="bg-white border-bottom shadow-sm px-4 py-3 d-flex align-items-center justify-content-between position-sticky top-0"
      style={{
        zIndex: 1020,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      {/* Mobile sidebar toggle */}
      <div className="d-md-none">
        <button
          className="btn btn-outline-light border-0 p-2 rounded-3 shadow-sm hover-lift"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            transition: "all 0.3s ease",
          }}
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Search */}
      <div
        className="d-none d-md-block flex-grow-1 me-4"
        style={{ maxWidth: "400px" }}
      >
        <div className="position-relative">
          <div
            className="input-group rounded-pill overflow-hidden shadow-sm border-0"
            style={{ background: "#f8f9fa" }}
          >
            <span className="input-group-text bg-transparent border-0 ps-4">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none ps-2 pe-4"
              placeholder="Search anything..."
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="d-flex align-items-center gap-2">
        {/* Notifications */}
        <div className="dropdown position-relative">
          <button
            className="btn btn-light border-0 rounded-3 p-2 position-relative hover-lift"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background:
                unreadCount > 0
                  ? "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
                  : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              transition: "all 0.3s ease",
            }}
            title={`${unreadCount} unread notifications`}
          >
            <Bell size={18} className="text-dark" />
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill d-flex align-items-center justify-content-center"
                style={{
                  fontSize: "10px",
                  background:
                    "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
                  color: "white",
                  minWidth: "18px",
                  height: "18px",
                  animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 999 }}
                onClick={() => setShowNotifications(false)}
              />
              <div
                className="position-absolute end-0 mt-3 bg-white rounded-4 shadow-lg border-0 overflow-hidden"
                style={{
                  width: "350px",
                  zIndex: 1000,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-gradient"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <h6 className="mb-0 text-white fw-semibold">
                    Form Notifications
                  </h6>
                  <button
                    className="btn btn-sm btn-link text-white text-decoration-none fw-medium p-0 hover-underline"
                    onClick={handleMarkAllAsRead}
                    style={{ fontSize: "12px" }}
                    type="button"
                  >
                    Mark all as read
                  </button>
                </div>
                <div
                  style={{ maxHeight: "350px", overflowY: "auto" }}
                  className="custom-scrollbar"
                >
                  {notifications.length > 0 ? (
                    notifications.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        className={`w-100 text-start px-4 py-3 border-bottom position-relative hover-bg-light transition-all border-0 ${
                          !note.read ? "bg-light" : ""
                        }`}
                        style={{
                          borderLeft: !note.read
                            ? "3px solid #667eea"
                            : "3px solid transparent",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => handleNotificationClick(note)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <span
                              className={`badge me-2 ${
                                note.formType === "evaluation"
                                  ? "bg-primary"
                                  : "bg-danger"
                              }`}
                              style={{ fontSize: "10px" }}
                            >
                              {note.formType === "evaluation"
                                ? "Evaluation"
                                : "Escalation"}
                            </span>
                            <p
                              className="mb-1 fw-medium d-inline"
                              style={{ fontSize: "14px", lineHeight: "1.4" }}
                            >
                              {note.text}
                            </p>
                            <small className="text-muted d-flex align-items-center mt-1">
                              <div
                                className="rounded-circle me-2"
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  backgroundColor: !note.read
                                    ? "#667eea"
                                    : "#dee2e6",
                                }}
                              />
                              {note.time}
                            </small>
                          </div>
                          {!note.read && (
                            <span
                              className="badge rounded-pill ms-2"
                              style={{
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                fontSize: "10px",
                                padding: "4px 8px",
                              }}
                            >
                              New
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-5 text-center text-muted">
                      <Bell size={32} className="text-muted mb-2 opacity-50" />
                      <p className="mb-0">No evaluation or escalation updates</p>
                    </div>
                  )}
                </div>
                <div className="text-center p-3 border-top bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-medium"
                    onClick={() => {
                      setShowNotifications(false);
                      onViewAllSubmissions?.();
                    }}
                  >
                    View all submissions
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="dropdown position-relative">
          <button
            className="btn btn-light border-0 rounded-3 p-2 d-flex align-items-center gap-2 hover-lift"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              transition: "all 0.3s ease",
            }}
            title="User Menu"
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-white"
              style={{ width: "24px", height: "24px" }}
            >
              <User size={14} className="text-primary" />
            </div>
            <span
              className="text-capitalize d-none d-lg-inline text-white fw-medium"
              style={{ fontSize: "14px" }}
            >
              {profile?.name || "Loading..."}
            </span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 999 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div
                className="position-absolute end-0 mt-3 bg-white rounded-4 shadow-lg border-0 overflow-hidden"
                style={{
                  width: "220px",
                  zIndex: 1000,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  className="px-4 py-3 border-bottom bg-gradient"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <div
                        className="text-capitalize fw-semibold"
                        style={{ fontSize: "14px" }}
                      >
                        {profile?.name || "Loading..."}
                      </div>
                      <div
                        className="text-capitalize"
                        style={{ fontSize: "12px" }}
                      >
                        {profile?.role || "Loading..."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="dropdown-item d-flex align-items-center px-4 py-2 border-0 hover-bg-light transition-all">
                    <UserCircle size={16} className="me-3 text-muted" />
                    <span style={{ fontSize: "14px" }}>Profile</span>
                  </button>
                  <button className="dropdown-item d-flex align-items-center px-4 py-2 border-0 hover-bg-light transition-all">
                    <Settings size={16} className="me-3 text-muted" />
                    <span style={{ fontSize: "14px" }}>Settings</span>
                  </button>
                  <div className="dropdown-divider mx-3 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item d-flex align-items-center px-4 py-2 border-0 text-danger hover-bg-danger-light transition-all"
                  >
                    <LogOut size={16} className="me-3" />
                    <span style={{ fontSize: "14px" }}>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .hover-bg-danger-light:hover { background-color: #f8d7da !important; }
        .hover-underline:hover { text-decoration: underline !important; }
        .transition-all { transition: all 0.2s ease; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
      `}</style>
    </header>
  );
};

export default AgentHeader;

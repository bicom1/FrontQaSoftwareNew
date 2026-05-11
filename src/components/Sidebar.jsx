// components/Sidebar.js
import React, { useEffect, useState } from "react";
import {
  Briefcase,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  Target,
  CircleUser,
  Home,
  LayoutDashboard,
} from "lucide-react";
import { getProfileApi } from "../features/userApis";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formsExpanded, setFormsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        setProfile(res.data);

        // ✅ Auto redirect QC user to QC dashboard
        const userRole = res.data?.role?.toLowerCase();
        if (
          (userRole === "qc user" || userRole === "qc") &&
          location.pathname === "/dashboard"
        ) {
          navigate("/dashboard/qc-team");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, [location.pathname, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFormsClick = () => setFormsExpanded(!formsExpanded);
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const role = profile?.role?.toLowerCase();

  return (
    <div
      className={`bg-dark text-white ${
        sidebarOpen ? "p-3 d-flex" : "p-3 d-none d-md-flex"
      }`}
      style={{
        width: sidebarOpen ? "250px" : "70px",
        minWidth: sidebarOpen ? "250px" : "70px",
        maxWidth: sidebarOpen ? "250px" : "70px",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        {sidebarOpen && <h4 className="mb-0 flex-grow-1">Bicomm</h4>}
        <button className="btn btn-dark p-1" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="nav flex-column nav-pills">
        {/* ✅ QC User Sidebar */}
        {role === "qc user" || role === "qc" || role === "qcuser" ? (
          <>
            {/* Dashboard */}
            <Link
              to="/dashboard/qc-team"
              className={`btn text-start mb-2 d-flex align-items-center ${
                isActive("/dashboard/qc-team") ? "btn-primary" : "btn-dark"
              }`}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span className="ms-2">Dashboard</span>}
            </Link>

            {/* Add Form */}
            <div className="mb-2">
              <button
                className={`btn text-start w-100 d-flex align-items-center ${
                  isActive("/evaluation") || isActive("/escalation")
                    ? "btn-primary"
                    : "btn-dark"
                }`}
                onClick={handleFormsClick}
              >
                <Briefcase size={20} />
                {sidebarOpen && <span className="ms-2">Add Form</span>}
                {sidebarOpen && (
                  <span className="ms-auto">
                    {formsExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>

              {formsExpanded && sidebarOpen && (
                <div className="ms-3 mt-2">
                  <Link
                    to="/evaluation"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/evaluation") ? "btn-primary" : "btn-dark"
                    }`}
                  >
                    <User size={20} />
                    <span className="ms-2">Evaluation</span>
                  </Link>

                  <Link
                    to="/escalation"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/escalation") ? "btn-primary" : "btn-dark"
                    }`}
                  >
                    <ArrowUp size={20} />
                    <span className="ms-2">Escalation</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Download Report */}
            <Link
              to="/dashboard/report-download"
              className={`btn text-start mb-2 d-flex align-items-center ${
                isActive("/dashboard/report-download")
                  ? "btn-primary"
                  : "btn-dark"
              }`}
            >
              <Target size={20} />
              {sidebarOpen && <span className="ms-2">Download Report</span>}
            </Link>
          </>
        ) : (
          <>
            {/* 🔹 Non-QC Users Sidebar */}
            <Link
              to="/dashboard/home"
              className={`btn text-start mb-2 d-flex align-items-center ${
                isActive("/dashboard/home") ? "btn-primary" : "btn-dark"
              }`}
            >
              <Home size={20} />
              {sidebarOpen && <span className="ms-2">Home</span>}
            </Link>

            {/* Feedbacks */}
            <div className="mb-2">
              <button
                className={`btn text-start w-100 d-flex align-items-center ${
                  isActive("dashboard/qc-team") ||
                  isActive("dashboard/sales-team")
                    ? "btn-primary"
                    : "btn-dark"
                }`}
                onClick={handleFormsClick}
              >
                <Briefcase size={20} />
                {sidebarOpen && <span className="ms-2">Feedbacks</span>}
                {sidebarOpen && (
                  <span className="ms-auto">
                    {formsExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>

              {formsExpanded && sidebarOpen && (
                <div className="mt-2">
                  <Link
                    to="/dashboard/qc-team"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/dashboard/qc-team")
                        ? "btn-primary"
                        : "btn-dark"
                    }`}
                  >
                    <User size={20} />
                    <span className="ms-2">QC Team</span>
                  </Link>

                  <Link
                    to="/dashboard/sales-team"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/dashboard/sales-team")
                        ? "btn-primary"
                        : "btn-dark"
                    }`}
                  >
                    <ArrowUp size={20} />
                    <span className="ms-2">Sales Team</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Add Team Lead */}
            <Link
              to="/dashboard/add-teamlead"
              className={`btn text-start mb-2 d-flex align-items-center ${
                isActive("/dashboard/add-teamlead") ? "btn-primary" : "btn-dark"
              }`}
            >
              <CircleUser size={20} />
              {sidebarOpen && <span className="ms-2">Add Team Lead</span>}
            </Link>

            {/* Add Form */}
            <div className="mb-2">
              <button
                className={`btn text-start w-100 d-flex align-items-center ${
                  isActive("/evaluation") ||
                  isActive("/marketing") ||
                  isActive("/escalation")
                    ? "btn-primary"
                    : "btn-dark"
                }`}
                onClick={handleFormsClick}
              >
                <Briefcase size={20} />
                {sidebarOpen && <span className="ms-2">Add Form</span>}
                {sidebarOpen && (
                  <span className="ms-auto">
                    {formsExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>

              {formsExpanded && sidebarOpen && (
                <div className="ms-3 mt-2">
                  <Link
                    to="/evaluation"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/evaluation") ? "btn-primary" : "btn-dark"
                    }`}
                  >
                    <User size={20} />
                    <span className="ms-2">Evaluation</span>
                  </Link>

                  <Link
                    to="/escalation"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/escalation") ? "btn-primary" : "btn-dark"
                    }`}
                  >
                    <ArrowUp size={20} />
                    <span className="ms-2">Escalation</span>
                  </Link>

                  <Link
                    to="/marketing"
                    className={`btn text-start mb-2 d-flex align-items-center ${
                      isActive("/marketing") ? "btn-primary" : "btn-dark"
                    }`}
                  >
                    <Target size={20} />
                    <span className="ms-2">Marketing Lead QC</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Download Report */}
            <Link
              to="/dashboard/report-download"
              className={`btn text-start mb-2 d-flex align-items-center ${
                isActive("/dashboard/report-download")
                  ? "btn-primary"
                  : "btn-dark"
              }`}
            >
              <Target size={20} />
              {sidebarOpen && <span className="ms-2">Download Report</span>}
            </Link>
          </>
        )}
      </div>

      {/* Footer (Profile) */}
      <div className="mt-auto">
        {sidebarOpen && (
          <div className="d-flex align-items-center p-2 border-top border-secondary mt-4 pt-2">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: "40px", height: "40px" }}
            >
              <span className="text-capitalize fw-bold">
                {profile?.name?.charAt(0) || "L"}
              </span>
            </div>
            <div>
              <div className="text-capitalize fw-bold">
                {profile?.name || "Loading..."}
              </div>
              <div className="text-capitalize small">
                {profile?.role || "Loading..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

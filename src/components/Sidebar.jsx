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
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { normalizeRole, ROLES, isSuperAdmin, getModuleBasePath } from "../utils/roles";
import { getQcModuleDashboardApi } from "../features/qcAnalytics";

const Sidebar = ({ sidebarOpen, setSidebarOpen, profile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [addFormExpanded, setAddFormExpanded] = useState(false);
  const [formsExpanded, setFormsExpanded] = useState(false);
  const [lowRatingExpanded, setLowRatingExpanded] = useState(false);
  const [submittedFormsCount, setSubmittedFormsCount] = useState(null);

  const role = normalizeRole(profile?.role || "");
  const isQcRole = role === ROLES.QC_USER || role === ROLES.QC_ADMIN;
  const isQcAdminRole = role === ROLES.QC_ADMIN;

  // Auto-expand "Add Form" when on evaluation/escalation routes
  useEffect(() => {
    if (
      location.pathname.startsWith("/evaluation") ||
      location.pathname.startsWith("/escalation")
    ) {
      setAddFormExpanded(true);
    }
  }, [location.pathname]);

  // Auto-expand "Forms" when on submitted-forms/qc-members routes
  useEffect(() => {
    if (
      location.pathname.startsWith("/dashboard/submitted-forms") ||
      location.pathname.startsWith("/dashboard/qc-members") ||
      location.pathname.startsWith("/admin/submitted-forms")
    ) {
      setFormsExpanded(true);
    }
    const flaggedQueue = new URLSearchParams(location.search).get("flaggedQueue");
    if (flaggedQueue) {
      setFormsExpanded(true);
      setLowRatingExpanded(true);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isQcRole) return;
    let active = true;
    (async () => {
      try {
        const res = await getQcModuleDashboardApi();
        if (!active || !res?.success) return;
        const total =
          (res.totalEvaluations || 0) +
          (res.totalEscalations || 0) +
          (res.totalMarketing || 0);
        setSubmittedFormsCount(total);
      } catch {
        if (active) setSubmittedFormsCount(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [isQcRole, location.pathname]);

  useEffect(() => {
    if (!profile?.role) return;
    const userRole = normalizeRole(profile.role);
    if (
      (userRole === ROLES.QC_USER || userRole === ROLES.QC_ADMIN) &&
      location.pathname === "/dashboard"
    ) {
      navigate("/dashboard/qc-team");
    }
  }, [profile?.role, location.pathname, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleAddFormClick = () => setAddFormExpanded(!addFormExpanded);
  const handleFormsClick = () => setFormsExpanded(!formsExpanded);
  const handleLowRatingClick = () => setLowRatingExpanded(!lowRatingExpanded);
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);
  const isExactActive = (path) => location.pathname === path;

  const homePath = isSuperAdmin(role) ? "/admin/home" : "/dashboard/home";
  const moduleBase = getModuleBasePath(role);
  const profilePath = `${moduleBase}/profile`;

  const navLinkClass = (active) =>
    `sidebar-nav-link w-100 text-start d-flex align-items-center gap-2 border-0 ${
      active ? "active" : ""
    }`;

  const NavIcon = ({ children }) => (
    <span className="sidebar-nav-icon d-flex align-items-center justify-content-center flex-shrink-0">
      {children}
    </span>
  );

  const CountBadge = ({ count }) =>
    count === null ? null : (
      <span className="sidebar-count-badge flex-shrink-0">{count}</span>
    );

  return (
    <div
      className={`sidebar-shell text-white ${
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
      <div className="d-flex align-items-center mb-4 px-1">
        {sidebarOpen && (
          <h5 className="mb-0 flex-grow-1 fw-semibold sidebar-brand">Bicomm</h5>
        )}
        <button
          type="button"
          className="sidebar-toggle-btn border-0"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className="nav flex-column sidebar-nav flex-grow-0">
        {role === ROLES.QC_USER || role === ROLES.QC_ADMIN ? (
          <>
            {sidebarOpen && (
              <div className="sidebar-section-label"></div>
            )}

            {/* Dashboard */}
            <Link
              to="/dashboard/qc-team"
              className={navLinkClass(isExactActive("/dashboard/qc-team"))}
            >
              <NavIcon>
                <LayoutDashboard size={18} />
              </NavIcon>
              {sidebarOpen && <span>Dashboard</span>}
            </Link>

            {sidebarOpen && (
              <div className="sidebar-section-label mt-2"></div>
            )}

            {/* Add Form -> Evaluation, Escalation */}
            <div className="sidebar-nav-group">
              <button
                type="button"
                className={navLinkClass(
                  isActive("/evaluation") || isActive("/escalation")
                )}
                onClick={handleAddFormClick}
              >
                <NavIcon>
                  <Briefcase size={18} />
                </NavIcon>
                {sidebarOpen && (
                  <>
                    <span className="flex-grow-1 text-start">Add Form</span>
                    <span className="sidebar-chevron">
                      {addFormExpanded ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {addFormExpanded && sidebarOpen && (
                <div className="sidebar-nav-sub">
                  <Link
                    to="/evaluation"
                    className={navLinkClass(isActive("/evaluation"))}
                  >
                    <NavIcon>
                      <User size={16} />
                    </NavIcon>
                    <span>Evaluation</span>
                  </Link>

                  <Link
                    to="/escalation"
                    className={navLinkClass(isActive("/escalation"))}
                  >
                    <NavIcon>
                      <ArrowUp size={16} />
                    </NavIcon>
                    <span>Escalation</span>
                  </Link>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <div className="sidebar-section-label mt-2"></div>
            )}

            {/* Forms -> Total Submitted Forms, QC Team */}
            <div className="sidebar-nav-group">
              <button
                type="button"
                className={navLinkClass(
                  isActive("/dashboard/submitted-forms") ||
                    isActive("/dashboard/qc-members")
                )}
                onClick={handleFormsClick}
              >
                <NavIcon>
                  <FileText size={18} />
                </NavIcon>
                {sidebarOpen && (
                  <>
                    <span className="flex-grow-1 text-start">Forms</span>
                    <span className="sidebar-chevron">
                      {formsExpanded ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {formsExpanded && sidebarOpen && (
                <div className="sidebar-nav-sub">
                  <Link
                    to="/dashboard/submitted-forms"
                    className={`${navLinkClass(
                      isActive("/dashboard/submitted-forms")
                    )} sidebar-submitted-link`}
                  >
                    <NavIcon>
                      <FileText size={16} />
                    </NavIcon>
                    <span className="sidebar-submitted-label flex-grow-1 text-start">
                      Total Submitted Forms
                    </span>
                    <CountBadge count={submittedFormsCount} />
                  </Link>

                  <Link
                    to="/dashboard/qc-members"
                    className={navLinkClass(isActive("/dashboard/qc-members"))}
                  >
                    <NavIcon>
                      <CircleUser size={16} />
                    </NavIcon>
                    <span>QC Team</span>
                  </Link>

                  {isQcAdminRole && (
                    <div className="sidebar-nav-group mt-1">
                      <button
                        type="button"
                        className={navLinkClass(
                          location.search.includes("flaggedQueue=")
                        )}
                        onClick={handleLowRatingClick}
                      >
                        <NavIcon>
                          <ArrowUp size={16} />
                        </NavIcon>
                        <span className="flex-grow-1 text-start">Low Rating</span>
                        <span className="sidebar-chevron">
                          {lowRatingExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </span>
                      </button>
                      {lowRatingExpanded && (
                        <div className="sidebar-nav-sub ms-2">
                          <Link
                            to="/dashboard/submitted-forms?flaggedQueue=forwarded"
                            className={navLinkClass(
                              location.search.includes("flaggedQueue=forwarded")
                            )}
                          >
                            <span>Pending Review</span>
                          </Link>
                          <Link
                            to="/dashboard/submitted-forms?flaggedQueue=accepted"
                            className={navLinkClass(
                              location.search.includes("flaggedQueue=accepted")
                            )}
                          >
                            <span>Accepted</span>
                          </Link>
                          <Link
                            to="/dashboard/submitted-forms?flaggedQueue=rejected"
                            className={navLinkClass(
                              location.search.includes("flaggedQueue=rejected")
                            )}
                          >
                            <span>Rejected</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {sidebarOpen && (
              <div className="sidebar-section-label mt-2"></div>
            )}

            {/* Download Report */}
            <Link
              to="/dashboard/report-download"
              className={navLinkClass(isActive("/dashboard/report-download"))}
            >
              <NavIcon>
                <Target size={18} />
              </NavIcon>
              {sidebarOpen && <span>Download Report</span>}
            </Link>
          </>
        ) : (
          <>
            <Link
              to={homePath}
              className={navLinkClass(
                isActive(homePath) ||
                  isActive("/dashboard/home") ||
                  isActive("/admin/home")
              )}
            >
              <NavIcon>
                <Home size={18} />
              </NavIcon>
              {sidebarOpen && <span>Home</span>}
            </Link>

            <div className="sidebar-nav-group">
              <button
                type="button"
                className={navLinkClass(
                  isActive(`${moduleBase}/qc-members`) ||
                    isActive(`${moduleBase}/sales-team`) ||
                    isActive("/dashboard/qc-members") ||
                    isActive("/dashboard/sales-team") ||
                    isActive("/admin/qc-members") ||
                    isActive("/admin/sales-team")
                )}
                onClick={handleFormsClick}
              >
                <NavIcon>
                  <Briefcase size={18} />
                </NavIcon>
                {sidebarOpen && (
                  <>
                    <span className="flex-grow-1 text-start">Feedbacks</span>
                    <span className="sidebar-chevron">
                      {formsExpanded ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {formsExpanded && sidebarOpen && (
                <div className="sidebar-nav-sub">
                  <Link
                    to={`${moduleBase}/qc-members`}
                    className={navLinkClass(
                      isActive(`${moduleBase}/qc-members`) ||
                        isActive("/dashboard/qc-members")
                    )}
                  >
                    <NavIcon>
                      <User size={16} />
                    </NavIcon>
                    <span>QC Team</span>
                  </Link>

                  <Link
                    to={`${moduleBase}/sales-team`}
                    className={navLinkClass(
                      isActive(`${moduleBase}/sales-team`) ||
                        isActive("/dashboard/sales-team")
                    )}
                  >
                    <NavIcon>
                      <ArrowUp size={16} />
                    </NavIcon>
                    <span>Sales Team</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to={`${moduleBase}/add-teamlead`}
              className={navLinkClass(
                isActive(`${moduleBase}/add-teamlead`) ||
                  isActive("/dashboard/add-teamlead")
              )}
            >
              <NavIcon>
                <CircleUser size={18} />
              </NavIcon>
              {sidebarOpen && <span>Add Team Lead</span>}
            </Link>

            <div className="sidebar-nav-group">
              <button
                type="button"
                className={navLinkClass(
                  isActive("/evaluation") ||
                    isActive("/marketing") ||
                    isActive("/escalation")
                )}
                onClick={handleAddFormClick}
              >
                <NavIcon>
                  <Briefcase size={18} />
                </NavIcon>
                {sidebarOpen && (
                  <>
                    <span className="flex-grow-1 text-start">Add Form</span>
                    <span className="sidebar-chevron">
                      {addFormExpanded ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {addFormExpanded && sidebarOpen && (
                <div className="sidebar-nav-sub">
                  <Link
                    to="/evaluation"
                    className={navLinkClass(isActive("/evaluation"))}
                  >
                    <NavIcon>
                      <User size={16} />
                    </NavIcon>
                    <span>Evaluation</span>
                  </Link>

                  <Link
                    to="/escalation"
                    className={navLinkClass(isActive("/escalation"))}
                  >
                    <NavIcon>
                      <ArrowUp size={16} />
                    </NavIcon>
                    <span>Escalation</span>
                  </Link>

                  <Link
                    to="/marketing"
                    className={navLinkClass(isActive("/marketing"))}
                  >
                    <NavIcon>
                      <Target size={16} />
                    </NavIcon>
                    <span>Marketing Lead QC</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to={`${moduleBase}/report-download`}
              className={navLinkClass(
                isActive(`${moduleBase}/report-download`) ||
                  isActive("/dashboard/report-download")
              )}
            >
              <NavIcon>
                <Target size={18} />
              </NavIcon>
              {sidebarOpen && <span>Download Report</span>}
            </Link>
          </>
        )}
      </div>

      <div className="mt-auto">
        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-profile w-100 text-start border-0"
            onClick={() => navigate(profilePath)}
            title="View profile"
          >
            <div className="sidebar-profile-avatar">
              <span className="text-capitalize fw-semibold">
                {profile?.name?.charAt(0) || "?"}
              </span>
            </div>
            <div className="min-w-0 flex-grow-1">
              <div className="text-capitalize fw-semibold text-truncate small">
                {profile?.name || "Loading..."}
              </div>
              <div className="text-capitalize text-truncate sidebar-profile-role">
                {profile?.role || "—"}
              </div>
            </div>
          </button>
        )}
      </div>

      <style>{`
        .sidebar-shell {
          background: linear-gradient(180deg, #1c2128 0%, #14181e 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sidebar-brand {
          letter-spacing: 0.02em;
          color: #f1f5f9;
        }
        .sidebar-toggle-btn {
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .sidebar-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .sidebar-section-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.9);
          padding: 0.35rem 0.75rem 0.5rem;
        }
        .sidebar-nav {
          gap: 0.2rem;
        }
        .sidebar-nav-link {
          background: transparent;
          color: rgba(226, 232, 240, 0.82);
          border-radius: 10px;
          padding: 0.55rem 0.7rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .sidebar-nav-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }
        .sidebar-nav-link.active {
          background: linear-gradient(
            90deg,
            rgba(76, 175, 80, 0.16),
            rgba(33, 150, 243, 0.14)
          );
          color: #fff;
          box-shadow: inset 3px 0 0 #42a5f5;
        }
        .sidebar-nav-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
        }
        .sidebar-nav-link.active .sidebar-nav-icon {
          background: rgba(66, 165, 245, 0.15);
        }
        .sidebar-nav-sub {
          margin: 0.15rem 0 0.35rem 0.85rem;
          padding-left: 0.65rem;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .sidebar-nav-sub .sidebar-nav-link {
          font-size: 0.8125rem;
          padding: 0.45rem 0.65rem;
        }
        .sidebar-nav-sub .sidebar-nav-icon {
          width: 24px;
          height: 24px;
        }
        .sidebar-count-badge {
          font-size: 0.7rem;
          font-weight: 700;
          line-height: 1;
          padding: 0.35rem 0.55rem;
          border-radius: 8px;
          background: linear-gradient(
            135deg,
            rgba(76, 175, 80, 0.28),
            rgba(33, 150, 243, 0.28)
          );
          color: #e8f4fc;
          border: 1px solid rgba(129, 212, 250, 0.35);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
          min-width: 2rem;
          text-align: center;
        }
        .sidebar-submitted-link {
          align-items: center;
          gap: 0.5rem;
        }
        .sidebar-submitted-link.active .sidebar-count-badge {
          background: linear-gradient(135deg, #4caf50, #2196f3);
          border-color: transparent;
          color: #fff;
        }
        .sidebar-submitted-label {
          font-size: 0.78rem;
          line-height: 1.3;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .sidebar-chevron {
          color: rgba(148, 163, 184, 0.9);
          display: inline-flex;
        }
        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.75rem 0.5rem 0.25rem;
          margin-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
          background: transparent;
          color: #fff;
          border-radius: 10px;
          transition: background 0.15s ease;
        }
        .sidebar-profile:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .sidebar-profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4caf50, #2196f3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sidebar-profile-role {
          font-size: 0.72rem;
          color: rgba(148, 163, 184, 0.95);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
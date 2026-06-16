import React from "react";
import { Link } from "react-router-dom";
import { UserCircle, Settings, ChevronRight } from "lucide-react";

const navItem = (to, active, icon, label, hint) => (
  <Link
    to={to}
    className={`d-flex align-items-start gap-3 p-3 rounded-3 text-decoration-none ${
      active
        ? "bg-primary text-white shadow-sm"
        : "text-dark hover-bg-light"
    }`}
    style={active ? {} : { backgroundColor: "transparent" }}
  >
    <span className="mt-1">{icon}</span>
    <span className="flex-grow-1 min-w-0">
      <span className="fw-semibold d-block">{label}</span>
      {hint ? (
        <span
          className={`small d-block ${active ? "text-white-50" : "text-muted"}`}
          style={active ? { opacity: 0.9 } : {}}
        >
          {hint}
        </span>
      ) : null}
    </span>
    <ChevronRight
      size={18}
      className={active ? "text-white-50 flex-shrink-0 mt-1" : "text-muted flex-shrink-0 mt-1"}
      style={active ? { opacity: 0.85 } : {}}
    />
  </Link>
);

/**
 * Full-width account area: left rail navigation, right content (not centered card).
 */
const AccountShell = ({ active, title, subtitle, children }) => {
  return (
    <div className="account-area border-bottom bg-white">
      <div
        className="border-bottom bg-white px-4 py-4 px-lg-5"
        style={{ borderColor: "#e9ecef" }}
      >
        <h1 className="h3 mb-1 fw-bold text-dark">{title}</h1>
        {subtitle ? (
          <p className="text-muted mb-0 small text-uppercase fw-semibold letter-spacing-wide">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="row g-0">
        <aside
          className="col-lg-3 border-end bg-white px-3 py-4 px-lg-4 py-lg-5"
          style={{ minHeight: "60vh", borderColor: "#e9ecef" }}
        >
          <div className="text-muted small fw-bold text-uppercase px-3 mb-3">
            Account
          </div>
          <nav className="d-flex flex-column gap-1">
            {navItem(
              "/dashboard/profile",
              active === "profile",
              <UserCircle size={20} />,
              "Profile",
              "Name, email, role"
            )}
            {navItem(
              "/dashboard/settings",
              active === "settings",
              <Settings size={20} />,
              "Settings",
              "Security & preferences"
            )}
          </nav>
        </aside>

        <main className="col-lg-9 bg-light px-4 py-4 px-lg-5 py-lg-5">
          <div style={{ maxWidth: "720px" }}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AccountShell;

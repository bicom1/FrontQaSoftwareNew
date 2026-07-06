import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AcceptInvite from "./pages/AcceptInvite";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./components/Unauthorized";
import AgentRoutes from "./Routes/AgentRoutes";
import EditEscalation from "./components/admin/escalation/EditEscalation";
import EscalationForm from "./components/EscalationForm";
import AgentForm from "./components/AgentForm";
import PpcForm from "./components/PpcForm";
import Layout from "./components/admin/escalation/Layout";
import { normalizeRole, ROLES, getDashboardPath } from "./utils/roles";

import "./index.css";
import "./components/ContentOverview.css";

function RequireAuth({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = normalizeRole(localStorage.getItem("userRole") || "");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const allowed = allowedRoles.map((r) => normalizeRole(r));
    if (!allowed.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

function App() {
  const getAuth = () => Boolean(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(getAuth);
  const role = normalizeRole(localStorage.getItem("userRole") || "");

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token") {
        setIsLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to={getDashboardPath(role)} replace />
          ) : (
            <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          )
        }
      />
      <Route
        path="/"
        element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/accept-invite/:token" element={<AcceptInvite />} />
      <Route path="/invite/:token" element={<AcceptInvite />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route
        path="/signup"
        element={
          isLoggedIn ? (
            <Navigate to={getDashboardPath(role)} replace />
          ) : (
            <Signup />
          )
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Super Admin — full system */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth allowedRoles={[ROLES.SUPER_ADMIN]}>
            <Dashboard onLogout={() => setIsLoggedIn(false)} />
          </RequireAuth>
        }
      />

      {/* QC module — QC roles + Super Admin oversight */}
      <Route
        path="/dashboard/*"
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.QC_ADMIN,
              ROLES.QC_USER,
            ]}
          >
            <Dashboard onLogout={() => setIsLoggedIn(false)} />
          </RequireAuth>
        }
      />

      {/* Agent module — Agent roles only */}
      <Route
        path="/agent/*"
        element={
          <RequireAuth
            allowedRoles={[ROLES.AGENT_USER, ROLES.AGENT_ADMIN]}
          >
            <AgentRoutes setIsLoggedIn={setIsLoggedIn} />
          </RequireAuth>
        }
      />

      {/* Shared forms — role-gated per domain */}
      <Route
        path="/escalation"
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.AGENT_USER,
              ROLES.AGENT_ADMIN,
              ROLES.QC_USER,
              ROLES.QC_ADMIN,
            ]}
          >
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <EscalationForm />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/marketing"
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.AGENT_USER,
              ROLES.AGENT_ADMIN,
              ROLES.QC_USER,
              ROLES.QC_ADMIN,
            ]}
          >
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PpcForm />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/evaluation"
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.AGENT_USER,
              ROLES.AGENT_ADMIN,
              ROLES.QC_USER,
              ROLES.QC_ADMIN,
            ]}
          >
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <AgentForm />
            </Layout>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

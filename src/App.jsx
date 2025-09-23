import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./components/Unauthorized";
import AgentRoutes from "./Routes/AgentRoutes";
import EditEscalation from "./components/admin/escalation/EditEscalation";
import EscalationForm from "./components/EscalationForm";
import AgentForm from "./components/AgentForm";
import PpcForm from "./components/PpcForm";
import Layout from "./components/admin/escalation/Layout";

function RequireAuth({ children, allowedRoles }) {

  
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("userRole") || "").toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const allowed = allowedRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

function App() {
  const getAuth = () => Boolean(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(getAuth);
  const role = (localStorage.getItem("userRole") || "").toLowerCase();

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
            <Navigate
              to={role === "agent" ? "/agent" : "/dashboard"}
              replace
            />
          ) : (
            <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          )
        }
      />

      <Route
        path="/"
        element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
      />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/dashboard/*"
        element={
          <RequireAuth>
            <Dashboard onLogout={() => setIsLoggedIn(false)} />
          </RequireAuth>
        }
      />
     
      
  

      {/* New separate routes with Layout */}
      <Route
        path="/escalation"
        element={
          <RequireAuth>
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <EscalationForm />
            </Layout>
          </RequireAuth>
        }
      />
      
      <Route
        path="/marketing"
        element={
          <RequireAuth>
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PpcForm />
            </Layout>
          </RequireAuth>
        }
      />
      
      <Route
        path="/evaluation"
        element={
          <RequireAuth>
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <AgentForm />
            </Layout>
          </RequireAuth>
        }
      />
     
      <Route
        path="/agent/*"
        element={
          <RequireAuth allowedRoles={["agent"]}>
            <AgentRoutes setIsLoggedIn={setIsLoggedIn} />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
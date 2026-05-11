import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const { role, email } = userData;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedRole = role?.trim().toLowerCase().replace(/\s+/g, "_");

    // ✅ Redirect if user has valid known role
    switch (normalizedRole) {
      case "agent_admin":
      case "agent_user":
        navigate("/agent");
        break;

      case "qc_admin":
        navigate("/dashboard");
        break;

      case "qc_user":
        navigate(`/dashboard/qc/${normalizedEmail}`);
        break;

      case "admin":
        navigate("/dashboard");
        break;

      default:
        // Stay here if unrecognized
        break;
    }
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
      }}
    >
      <p>🚫 Unauthorized Access</p>
      <p style={{ fontSize: "1rem", color: "#555" }}>
        You don’t have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;

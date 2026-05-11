// src/components/ProtectedAgent.js
import React from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import TableAdmin from "./TableAdmin";

const ProtectedAgent = () => {
  const { agentName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    return <Navigate to="/login" replace />;
  }

  // 👇 Email se compare karein
  const currentUserEmail = decoded.email || decoded.userEmail; // Adjust according to your token structure
  const role = (decoded.role || decoded.userRole || "").toString().toLowerCase();
  const isPrivileged =
    role === "admin" || role === "superadmin" || role === "super admin";

  // Determine which email to show:
  // 1) URL param (preferred): /dashboard/qc-team/:agentName where agentName is actually an email
  // 2) Navigation state: navigate(..., { state: { email } })
  // 3) Fallback: current user email
  const stateEmail = location?.state?.email;
  const paramMaybeEmail = (agentName || "").toString();
  const targetEmail =
    (paramMaybeEmail.includes("@") ? paramMaybeEmail : null) ||
    (typeof stateEmail === "string" && stateEmail.includes("@")
      ? stateEmail
      : null) ||
    currentUserEmail;

  // Non-privileged users can only view their own records
  if (!isPrivileged && targetEmail !== currentUserEmail) {
    return <Navigate to={`/dashboard/qc-team/${currentUserEmail}`} replace />;
  }

  return <TableAdmin adminEmail={targetEmail} />;
};

export default ProtectedAgent;

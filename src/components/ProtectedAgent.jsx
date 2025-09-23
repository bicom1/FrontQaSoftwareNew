// src/components/ProtectedAgent.js
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import TableAdmin from "./TableAdmin";

const ProtectedAgent = () => {
  const { agentName } = useParams();
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

  const currentUser = decoded.name; // 👈 adjust if token has email/username instead

  if (agentName !== currentUser) {
    return <Navigate to={`/dashboard/qc-team/${currentUser}`} replace />;
  }

  return <TableAdmin />;
};

export default ProtectedAgent;

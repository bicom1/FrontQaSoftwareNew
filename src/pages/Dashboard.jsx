// pages/Dashboard.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Overview from "../components/Overview";
import QcList from "../components/QcList";
import UserManagement from "../components/UserManagement";
import AddTeamLead from "../components/AddTeamLead";
import Projects from "../components/Projects";
import AgentList from "../components/AgentList";
import ReportDownload from "../components/ReportDownload";
import Layout from "../components/admin/escalation/Layout";
import TableAdmin from "../components/TableAdmin";
import EditEscalation from "../components/admin/escalation/EditEscalation";
import EditEvaluation from "../components/admin/evaluation/EditEvaluation";
import ProtectedAgent from "../components/ProtectedAgent";

const Dashboard = ({ setIsLoggedIn }) => {
  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <Routes>
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="home" element={<Overview />} />
        <Route path="qc-team" element={<QcList />} />
        {/* ✅ Protected route */}
        <Route path="qc-team/:agentName" element={<ProtectedAgent />} />
        {/* <Route path="qc-team/:agentName" element={<TableAdmin/>} /> */}
        <Route path="qc-team/editescalation/:id" element={<EditEscalation />} />
        <Route path="qc-team/editevaluation/:id" element={<EditEvaluation />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="add-teamlead" element={<AddTeamLead />} />
        <Route path="projects" element={<Projects />} />
        <Route path="sales-team" element={<AgentList />} />
        <Route path="report-download" element={<ReportDownload />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;

// pages/Dashboard.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Overview from "../components/Overview";
import QcDashboard from "../components/QcDashboard";
import QcTeamList from "../components/QcTeamList";
import QcSubmittedForms from "../components/QcSubmittedForms";
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
import ProfilePage from "../components/ProfilePage";
import SettingsPage from "../components/SettingsPage";
import QcTeamUsers from "../components/QcTeamUsers";

const Dashboard = ({ onLogout }) => {
  return (
    <Layout setIsLoggedIn={onLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="home" element={<Overview />} />
        {/* /admin/* uses same dashboard; home is admin overview */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="qc-team" element={<QcDashboard />} />
        <Route path="qc-members" element={<QcTeamList />} />
        <Route path="submitted-forms" element={<QcSubmittedForms />} />
        {/* ✅ Protected route */}
        <Route path="qc-team/:agentName" element={<ProtectedAgent />} />
        {/* <Route path="qc-team/:agentName" element={<TableAdmin/>} /> */}
        <Route path="qc-team/editescalation/:id" element={<EditEscalation />} />
        <Route path="qc-team/editevaluation/:id" element={<EditEvaluation />} />
        <Route path="team-users" element={<QcTeamUsers />} />
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

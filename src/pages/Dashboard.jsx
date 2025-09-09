// pages/Dashboard.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from '../components/Overview';
import QcList from '../components/QcList';
import UserManagement from '../components/UserManagement';
import AddTeamLead from '../components/AddTeamLead';
import Projects from '../components/Projects';
import AgentList from '../components/AgentList';
import ReportDownload from '../components/ReportDownload';
import Layout from '../components/admin/escalation/Layout';


const Dashboard = ({ setIsLoggedIn }) => {
  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="analytics" element={<QcList />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="teamlead" element={<AddTeamLead />} />
        <Route path="projects" element={<Projects />} />
        <Route path="agent-list" element={<AgentList />} />
        <Route path="report-download" element={<ReportDownload />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
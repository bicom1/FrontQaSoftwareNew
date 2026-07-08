// src/routes/AgentRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AgentLayout from "../pages/AgentPortal/AgentLayout";
import AgentDashboard from "../components/Agent/AgentDashboard";
import AgentFeedbackBox from "../components/Agent/AgentFeedbackBox";
import AgentSubmissions from "../components/Agent/AgentSubmissions";
import AgentTeamUsers from "../components/Agent/AgentTeamUsers";
import TeamLeadForms from "../components/TeamLeadForms";

const AgentRoutes = ({ setIsLoggedIn }) => (
  <Routes>
    <Route element={<AgentLayout setIsLoggedIn={setIsLoggedIn} />}>
      <Route index element={<AgentDashboard />} />
      <Route path="submissions" element={<AgentSubmissions />} />
      <Route path="team-lead-forms" element={<TeamLeadForms />} />
      <Route path="feedback" element={<AgentFeedbackBox />} />
      <Route path="team-users" element={<AgentTeamUsers />} />
    </Route>
  </Routes>
);

export default AgentRoutes;

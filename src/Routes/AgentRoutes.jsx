// src/routes/AgentRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AgentLayout from "../pages/AgentPortal/AgentLayout";
import AgentDashboard from "../components/Agent/AgentDashboard";
import AgentFeedbackBox from "../components/Agent/AgentFeedbackBox";
import AgentSubmissions from "../components/Agent/AgentSubmissions";

const AgentRoutes = ({ setIsLoggedIn }) => (
  <Routes>
    <Route element={<AgentLayout setIsLoggedIn={setIsLoggedIn} />}>
      {/* Default dashboard page */}
      <Route index element={<AgentDashboard />} />
      <Route path="submissions" element={<AgentSubmissions />} />
      {/* Feedback page */}
      <Route path="feedback" element={<AgentFeedbackBox />} />
    </Route>
  </Routes>
);

export default AgentRoutes;

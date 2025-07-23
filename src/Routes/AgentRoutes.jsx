// src/routes/AgentRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AgentLayout from "../pages/AgentPortal/AgentLayout";
import AgentDashboard from "../components/Agent/AgentDashboard";
import AgentFeedbackBox from "../components/Agent/AgentFeedbackBox";

const AgentRoutes = ({ setIsLoggedIn }) => (
  <Routes>
    <Route element={<AgentLayout setIsLoggedIn={setIsLoggedIn} />}>
    
      <Route index element={<AgentDashboard />} />
    
      <Route path="feedback" element={<AgentFeedbackBox />} />
    </Route>
  </Routes>
);

export default AgentRoutes;

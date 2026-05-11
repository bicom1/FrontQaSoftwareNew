import React, { useState } from "react";
import AgentHeader from "../../components/Agent/AgentHeader";
import AgentSidebar from "../../components/Agent/AgentSidebar";

const AgentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AgentSidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <AgentHeader toggleSidebar={toggleSidebar} />
        <div className="p-6">
          {/* <h1 className="text-3xl font-bold mb-4">Agent Dashboard</h1>
          <p className="text-gray-600">Your dashboard content goes here...</p> */}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

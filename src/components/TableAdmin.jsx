import React, { useState } from "react";

const TableAdmin = () => {
  const [activeTab, setActiveTab] = useState("evaluations");

  const evaluations = [
    {
      email: "aysha.shalab32@gmail.com",
      leadId: "1234",
      agentName: "Aysha",
      teamLeader: "Aysha",
      mode: "Call",
      responseTime: "—",
      greetings: "uses",
      accuracy: "questions",
      rapport: "skills",
      solutions: "appointment",
      closing: "Professionally",
      bonus: "customer",
      summary: "aysha shalabi",
    },
  ];

  const escalations = [
    { id: 1, title: "Escalation Example", status: "Open" },
  ];

  const marketing = [];

  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-5">
        {["evaluations", "escalations", "marketing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
            <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {tab === "evaluations"
                ? evaluations.length
                : tab === "escalations"
                ? escalations.length
                : marketing.length}
            </span>
          </button>
        ))}
      </div>

      {/* Evaluations Tab */}
      {activeTab === "evaluations" && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-700">
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Lead ID</th>
                  <th className="p-3 border">Agent Name</th>
                  <th className="p-3 border">Team Leader</th>
                  <th className="p-3 border">Mode</th>
                  <th className="p-3 border">Response</th>
                  <th className="p-3 border">Greetings</th>
                  <th className="p-3 border">Accuracy</th>
                  <th className="p-3 border">Rapport</th>
                  <th className="p-3 border">Solutions</th>
                  <th className="p-3 border">Closing</th>
                  <th className="p-3 border">Bonus</th>
                  <th className="p-3 border">Summary</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{row.email}</td>
                    <td className="p-3 border">{row.leadId}</td>
                    <td className="p-3 border">{row.agentName}</td>
                    <td className="p-3 border">{row.teamLeader}</td>
                    <td className="p-3 border">{row.mode}</td>
                    <td className="p-3 border">{row.responseTime}</td>
                    <td className="p-3 border">{row.greetings}</td>
                    <td className="p-3 border">{row.accuracy}</td>
                    <td className="p-3 border">{row.rapport}</td>
                    <td className="p-3 border">{row.solutions}</td>
                    <td className="p-3 border">{row.closing}</td>
                    <td className="p-3 border">{row.bonus}</td>
                    <td className="p-3 border">{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
              ‹
            </button>
            <button className="px-3 py-1 border rounded bg-blue-500 text-white">
              1
            </button>
            <button className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
              ›
            </button>
          </div>
        </div>
      )}

      {/* Escalations Tab */}
      {activeTab === "escalations" && (
        <div className="p-3 text-gray-600">
          {escalations.length > 0 ? (
            <ul>
              {escalations.map((esc) => (
                <li
                  key={esc.id}
                  className="p-3 border rounded-lg mb-2 bg-gray-50"
                >
                  {esc.title} — <span className="text-blue-500">{esc.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No escalations found.</p>
          )}
        </div>
      )}

      {/* Marketing Tab */}
      {activeTab === "marketing" && (
        <div className="p-3 text-gray-600">
          {marketing.length > 0 ? (
            <p>Marketing records go here.</p>
          ) : (
            <p>No marketing records available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TableAdmin;

import React, { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  XCircle,
  Crown,
  Mail,
  BarChart3,
} from "lucide-react";
import { getallusersApi } from "../features/userApis";
import { useNavigate } from "react-router-dom";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        const users = res?.data?.data || [];

        const normalizeRole = (role) =>
          (role || "").toString().toLowerCase().replace(/\s+/g, " ").trim();

        // Sales/Agent users (support multiple role spellings)
        setAgents(
          users.filter((u) => {
            const r = normalizeRole(u.role);
            return (
              r === "agent user" ||
              r === "agent" ||
              r === "sales agent" ||
              r.includes("agent") ||
              r.includes("sales")
            );
          })
        );
      } catch (err) {
        console.error("Error fetching users", err);
        setAgents([]);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredAgents = agents.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 py-3 analytics-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold d-flex align-items-center gap-2">
            <BarChart3 size={28} className="text-primary" /> Agent List
          </h1>
          <p className="text-muted mb-0">
            Monitor performance and manage agents efficiently
          </p>
        </div>
        <div className="stat-card mini">
          <div className="stat-value">{agents.length}</div>
          <div className="stat-label">Agents</div>
        </div>
      </div>

      {/* Agent List */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <Crown size={20} className="text-warning" /> Agent Team
          </h5>
          <span 
            style={{
              background: "linear-gradient(90deg, #4CAF50, #2196F3)",
            }}
            className="badge rounded-pill px-3 py-2 text-white"
          >
            {agents.length} Agents
          </span>
        </div>

        <div className="card-body">
          {/* Search */}
          <div className="mb-4">
            <div className="search-box position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                className="form-control ps-5"
                placeholder="Search agents by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loadingAgents ? (
            <div className="text-center py-5">
              <Loader2 size={28} className="spin me-2 text-primary" /> 
              <span>Loading agents...</span>
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="row g-3">
              {filteredAgents.map((agent) => (
                <div key={agent._id} className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body d-flex align-items-center gap-3">
                      <div 
                        className="admin-avatar rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          background: "linear-gradient(90deg, #4CAF50, #2196F3)",
                          width: "50px",
                          height: "50px",
                          fontSize: "1.25rem"
                        }}
                      >
                        {agent.name?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold text-capitalize">
                          {agent.name}
                        </h6>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <Mail size={14} /> {agent.email}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <XCircle size={32} className="mb-2 text-danger opacity-50" />
              <p className="mb-0">No agents found</p>
              {searchTerm && (
                <small>Try adjusting your search terms</small>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .analytics-dashboard {
          font-family: "Inter", "Segoe UI", sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
        .stat-card.mini {
          background: white;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
          min-width: 120px;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
        }
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AgentList;
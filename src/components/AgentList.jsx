import React, { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  XCircle,
  Crown,
  Mail,
  BarChart3,
  User,
  Shield,
  Calendar,
  Eye,
  X,
} from "lucide-react";
import { getallusersApi } from "../features/userApis";
import { isAgentRole } from "../utils/roles";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        const users = res?.data?.data || [];
        setAgents(users.filter((u) => isAgentRole(u.role)));
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
            style={{ background: "linear-gradient(90deg, #4CAF50, #2196F3)" }}
            className="badge rounded-pill px-3 py-2 text-white"
          >
            {agents.length} Agents
          </span>
        </div>

        <div className="card-body">
          {/* Search */}
          <div className="mb-4">
            <div className="search-box position-relative">
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />
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
                  <div className="card border-0 shadow-sm agent-card">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        {/* Avatar */}
                        <div
                          className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{
                            background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                            width: "56px",
                            height: "56px",
                            fontSize: "1.35rem",
                          }}
                        >
                          {agent.name?.charAt(0).toUpperCase() || "A"}
                        </div>

                        {/* Details */}
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="mb-1 fw-bold text-capitalize fs-6">
                            {agent.name || "—"}
                          </h6>
                          <div className="d-flex flex-wrap gap-3">
                            <span className="text-muted small d-flex align-items-center gap-1">
                              <Mail size={13} className="text-primary" />
                              {agent.email || "—"}
                            </span>
                            <span className="text-muted small d-flex align-items-center gap-1">
                              <Shield size={13} className="text-success" />
                              <span className="text-capitalize">{agent.role || "—"}</span>
                            </span>
                            {agent.phone && (
                              <span className="text-muted small d-flex align-items-center gap-1">
                                <User size={13} className="text-warning" />
                                {agent.phone}
                              </span>
                            )}
                            {agent.createdAt && (
                              <span className="text-muted small d-flex align-items-center gap-1">
                                <Calendar size={13} className="text-info" />
                                Joined {formatDate(agent.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Button */}
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          <button
                            className="btn btn-view-details d-flex align-items-center gap-2"
                            onClick={() => setSelectedAgent(agent)}
                          >
                            <Eye size={15} />
                            View Details
                          </button>
                        </div>
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
              {searchTerm && <small>Try adjusting your search terms</small>}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAgent && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-box-header d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <User size={20} className="text-primary" /> Agent Details
              </h5>
              <button
                className="btn btn-sm btn-light rounded-circle p-1"
                onClick={() => setSelectedAgent(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar + Name */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                  width: "80px",
                  height: "80px",
                  fontSize: "2rem",
                }}
              >
                {selectedAgent.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <h5 className="fw-bold text-capitalize mb-1">{selectedAgent.name || "—"}</h5>
            </div>

            {/* Detail Rows */}
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label d-flex align-items-center gap-2">
                  <Mail size={15} className="text-primary" /> Email
                </span>
                <span className="detail-value">{selectedAgent.email || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label d-flex align-items-center gap-2">
                  <Shield size={15} className="text-success" /> Role
                </span>
                <span className="detail-value text-capitalize">{selectedAgent.role || "—"}</span>
              </div>
              {selectedAgent.phone && (
                <div className="detail-row">
                  <span className="detail-label d-flex align-items-center gap-2">
                    <User size={15} className="text-warning" /> Phone
                  </span>
                  <span className="detail-value">{selectedAgent.phone}</span>
                </div>
              )}
              {selectedAgent.createdAt && (
                <div className="detail-row">
                  <span className="detail-label d-flex align-items-center gap-2">
                    <Calendar size={15} className="text-info" /> Joined
                  </span>
                  <span className="detail-value">{formatDate(selectedAgent.createdAt)}</span>
                </div>
              )}
              {selectedAgent.updatedAt && (
                <div className="detail-row">
                  <span className="detail-label d-flex align-items-center gap-2">
                    <Calendar size={15} className="text-secondary" /> Last Updated
                  </span>
                  <span className="detail-value">{formatDate(selectedAgent.updatedAt)}</span>
                </div>
              )}
            </div>

            {/* Close */}
            <div className="text-center mt-4">
              <button
                className="btn btn-light px-4"
                onClick={() => setSelectedAgent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
        .agent-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .agent-card:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
          transform: translateY(-1px);
        }
        .btn-view-details {
          background: linear-gradient(90deg, #4CAF50, #2196F3);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 500;
          transition: opacity 0.2s ease;
        }
        .btn-view-details:hover {
          opacity: 0.88;
          color: white;
        }
        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          animation: fadeIn 0.15s ease;
        }
        .modal-box {
          background: white;
          border-radius: 16px;
          padding: 1.75rem;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.2s ease;
        }
        .modal-box-header {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1rem;
        }
        .detail-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.875rem;
        }
        .detail-label {
          color: #64748b;
          font-weight: 500;
          min-width: 120px;
        }
        .detail-value {
          color: #1e293b;
          font-weight: 600;
          text-align: right;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AgentList;
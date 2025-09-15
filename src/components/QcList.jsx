// src/components/Analytics.jsx
import React, { useEffect, useState } from "react";
import { 
  Activity, 
  Search, 
  Users, 
  Loader2, 
  XCircle, 
  Crown,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  TrendingUp,
  BarChart3
} from "lucide-react";
import BitrixLeadDetails from "./BitrixLeadDetails";
import { getallusersApi } from "../features/userApis";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const QcList = () => {
  const [leadId, setLeadId] = useState("");
  const [inputId, setInputId] = useState("");
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [expandedAdmin, setExpandedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalLeads: 1247,
    conversionRate: "68%",
    avgResponse: "2.4m"
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleSearch = (e) => {
    e.preventDefault();
    setLeadId(inputId.trim());
  };

  // Function to handle admin click
 const handleAdminClick = (agentName) => {
  navigate(`/dashboard/qc-team/${agentName}`);
};

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoadingAgents(true);
        const res = await getallusersApi();
        if (Array.isArray(res?.data?.data)) {
          setAgents(res.data.data.filter((u) => u.role === "admin"));
        } else {
          setAgents([]);
        }
      } catch (err) {
        console.error("Error fetching admins", err);
        setAgents([]);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAdmins();
  }, []);

  // Filter admins based on search term
  const filteredAdmins = agents.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 py-3 analytics-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 header-section">
        <div>
          <h1 className="fw-bold d-flex align-items-center gap-2 mb-1">
            <BarChart3 size={28} className="text-primary" /> QC Team List
          </h1>
          <p className="text-muted mb-0">Monitor performance and manage leads efficiently</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="stat-card mini">
            <div className="stat-value">{agents.length}</div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
      </div>

      
      {/* Admin List */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 admin-section">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <Crown size={20} className="text-warning" /> Admin Team
                </h5>
                
              </div>
              <span className="badge bg-primary rounded-pill px-3 py-2">{agents.length} Admins</span>
            </div>

            <div className="card-body">
              {/* Search Box */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search admins by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {loadingAgents ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <Loader2 size={28} className="me-2 text-primary spin" />
                  <span>Loading admin team...</span>
                </div>
              ) : filteredAdmins.length > 0 ? (
                <div className="row g-3">
                  {filteredAdmins.map((agent) => (
                    <div key={agent._id} className="col-12">
                      <div className={`admin-card d-flex justify-content-between card border-0 shadow-sm rounded-3 ${expandedAdmin === agent._id ? 'expanded' : ''}`}>
                        <div 
                          className="card-body py-3"
                          style={{cursor: 'pointer'}}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div 
                              className="d-flex align-items-center gap-3"
                              onClick={() => handleAdminClick(agent.name)}
                            >
                              <div className="admin-avatar rounded-circle bg-primary-gradient text-white d-flex align-items-center justify-content-center fw-bold">
                                {agent.name?.charAt(0).toUpperCase()}
                                {agent.role === 'superadmin' && <span className="admin-badge"><Crown size={10} /></span>}
                              </div>
                             
                              <div>
                                <h6 className="fw-bold mb-0 d-flex  align-items-center gap-2 admin-name-link">
                                  {agent.name}
                                  {agent.role === 'superadmin' && <span className="badge bg-warning rounded-pill py-1">Owner</span>}
                                </h6>
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <Mail size={14} />
                                  {agent.email}
                                </small>
                              </div>
                               <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleAdminClick(agent._id, agent.name)}
                                >
                                  View Full Details
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
                  <p className="mb-0">No admins found</p>
                  <small>Try adjusting your search terms</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <style jsx>{`
        .analytics-dashboard {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
        
        .header-section {
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .stat-card {
          background: white;
          border: none;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.06);
        }
        
        .stat-card.mini {
          padding: 0.75rem 1rem;
          text-align: center;
          width: 120px;
        }
        
        .stat-card.mini .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .stat-card.mini .stat-label {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #1e293b;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0;
        }
        
        .stat-trend {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .stat-trend.positive {
          color: #10b981;
        }
        
        .stat-trend.negative {
          color: #ef4444;
        }
        
        .admin-section {
          overflow: hidden;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          z-index: 10;
        }
        
        .search-input {
          padding-left: 40px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }
        
        .admin-card {
          transition: all 0.3s ease;
        }
        
        .admin-card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }
        
        .admin-card.expanded {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .admin-avatar {
          width: 50px;
          height: 50px;
          font-size: 1.25rem;
          position: relative;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }
        
        .admin-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #f59e0b;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        
        .admin-details {
          animation: fadeIn 0.3s ease;
        }
        
        .detail-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.75rem;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .detail-label {
          color: #64748b;
          font-weight: 500;
        }
        
        .admin-name-link {
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .admin-name-link:hover {
          color: #3b82f6;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        .bg-primary-gradient {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }
        
        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }
          
          .admin-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QcList;
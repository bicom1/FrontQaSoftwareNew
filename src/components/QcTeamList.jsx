import React, { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  XCircle,
  Crown,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getallusersApi, getProfileApi } from "../features/userApis";
import {
  getModuleBasePath,
  isQcAdmin,
  isQcRole,
  isQcUser,
  isSuperAdmin,
  normalizeRole,
  ROLES,
} from "../utils/roles";
import { normalizeProfileResponse } from "../utils/profileUtils";
import GradientButton from "./common/GradientButton";

const buildSelfMember = (profile, actorId, actorRole) => ({
  _id: profile?._id || profile?.id || actorId,
  name: profile?.name || localStorage.getItem("userName") || "QC User",
  email: profile?.email || localStorage.getItem("userEmail") || "",
  role: normalizeRole(profile?.role || actorRole),
});

const QcTeamList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const actorRole = normalizeRole(localStorage.getItem("userRole") || "");
  const actorId = localStorage.getItem("userId") || "";
  const moduleBase = getModuleBasePath(actorRole);
  const isAdminView = isSuperAdmin(actorRole) || isQcAdmin(actorRole);
  const isSelfOnly = isQcUser(actorRole);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        if (isSelfOnly) {
          try {
            const res = await getProfileApi();
            const me = normalizeProfileResponse(res.data);
            if (me) {
              setMembers([buildSelfMember(me, actorId, actorRole)]);
              return;
            }
          } catch (profileErr) {
            console.error("Error loading QC profile:", profileErr);
          }

          try {
            const stored = localStorage.getItem("user");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed?.name || parsed?.email) {
                setMembers([buildSelfMember(parsed, actorId, actorRole)]);
                return;
              }
            }
          } catch {
            /* ignore parse errors */
          }

          if (actorId || localStorage.getItem("userEmail")) {
            setMembers([buildSelfMember(null, actorId, actorRole)]);
          } else {
            setMembers([]);
          }
          return;
        }

        const res = await getallusersApi();
        const list = res?.data?.data || [];

        let qcMembers = list.filter((u) => isQcRole(u.role));

        if (isQcAdmin(actorRole)) {
          qcMembers = qcMembers.filter(
            (u) => normalizeRole(u.role) === ROLES.QC_USER
          );
        }

        setMembers(qcMembers);
      } catch (err) {
        console.error("Error loading QC team:", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actorId, actorRole, isSelfOnly]);

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForms = (member) => {
    navigate(
      `${moduleBase}/submitted-forms?userId=${member._id}&name=${encodeURIComponent(member.name || "")}`
    );
  };

  return (
    <div className="container-fluid px-4 py-3 analytics-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold d-flex align-items-center gap-2">
            <BarChart3 size={28} className="text-primary" /> QC Team
          </h1>
          <p className="text-muted mb-0">
            {isAdminView
              ? "View QC team members and their submitted forms"
              : "Your QC profile and submitted forms"}
          </p>
        </div>
        <div className="stat-card mini">
          <div className="stat-value">{members.length}</div>
          <div className="stat-label">QC {isAdminView ? "Users" : "Member"}</div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <Crown size={20} className="text-warning" /> QC Team
          </h5>
          <span
            style={{
              background: "linear-gradient(90deg, #4CAF50, #2196F3)",
            }}
            className="badge rounded-pill px-3 py-2 text-white"
          >
            {members.length} Members
          </span>
        </div>

        <div className="card-body">
          <div className="mb-4">
            <div className="search-box position-relative">
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />
              <input
                className="form-control ps-5"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Loader2 size={28} className="spin me-2 text-primary" />
              <span>Loading QC team...</span>
            </div>
          ) : filtered.length > 0 ? (
            <div className="row g-3">
              {filtered.map((member) => (
                <div key={member._id} className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body d-flex align-items-center gap-3 flex-wrap">
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="mb-0 fw-bold text-capitalize">
                          {member.name}
                        </h6>
                        <small className="text-muted">{member.email}</small>
                      </div>
                      <GradientButton
                        size="sm"
                        onClick={() => openForms(member)}
                      >
                        View Submitted Forms
                      </GradientButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <XCircle size={32} className="mb-2 text-danger opacity-50" />
              <p className="mb-0">No QC team members found</p>
              {searchTerm && <small>Try adjusting your search terms</small>}
            </div>
          )}
        </div>
      </div>

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

export default QcTeamList;

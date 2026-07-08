import React, { useEffect, useState } from "react";
import { BarChart2, Activity, Menu, X, FileText, Users } from "lucide-react";
import { getProfileApi } from "../../features/userApis";
import { isAgentAdmin } from "../../utils/roles";

const AgentSidebar = ({ sidebarOpen, setSidebarOpen, activeTab, onNav }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const showTeamUsers = isAgentAdmin(
    profile?.role || localStorage.getItem("userRole")
  );

  const btnCls = (isActive) =>
    `btn text-start mb-2 d-flex align-items-center ${
      isActive ? "btn-primary" : "btn-dark"
    }`;

  return (
    <aside
      className="bg-dark text-white d-flex flex-column position-sticky top-0 vh-100"
      style={{
        width: sidebarOpen ? "250px" : "70px",
        transition: "width 0.3s ease",
        zIndex: 1030,
      }}
    >
      <div className="d-flex align-items-center mb-4 p-3">
        {sidebarOpen && <h4 className="mb-0 flex-grow-1">Bicomm</h4>}
        <button
          className="btn btn-dark p-1"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="nav flex-column nav-pills px-2 flex-grow-1 overflow-auto">
        <button
          className={btnCls(activeTab === "agent")}
          onClick={() => onNav("")}
        >
          <BarChart2 size={20} />
          {sidebarOpen && <span className="ms-2">Dashboard</span>}
        </button>
        <button
          className={btnCls(activeTab === "submissions")}
          onClick={() => onNav("/submissions")}
        >
          <FileText size={20} />
          {sidebarOpen && <span className="ms-2">My Forms</span>}
        </button>
        <button
          className={btnCls(activeTab === "feedback")}
          onClick={() => onNav("/feedback")}
        >
          <Activity size={20} />
          {sidebarOpen && <span className="ms-2">Feedback</span>}
        </button>
        {showTeamUsers && (
          <button
            className={btnCls(activeTab === "team-users")}
            onClick={() => onNav("/team-users")}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ms-2">Team Users</span>}
          </button>
        )}
      </nav>

      <div className="mt-auto w-100 p-3 border-top border-secondary">
        {sidebarOpen ? (
          <div className="d-flex align-items-center">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: "40px", height: "40px" }}
            >
              <span className="text-capitalize fw-bold">
                {profile?.name?.charAt(0) || "L"}
              </span>
            </div>
            <div>
              <div className="text-capitalize fw-bold">
                {profile?.name || "Loading..."}
              </div>
              <div className="text-capitalize small">
                {profile?.role || "Loading..."}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto"
            style={{ width: "40px", height: "40px" }}
            title={profile?.name || "Loading..."}
          >
            <span className="text-capitalize fw-bold">
              {profile?.name?.charAt(0) || "L"}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AgentSidebar;

// components/Sidebar.js
import React, { useEffect, useState } from 'react';
import { BarChart2, Activity, Briefcase, User, Menu, X, ChevronDown, ChevronRight, ArrowUp, Target, SquareUserRound, CircleUser } from 'lucide-react';
import { getProfileApi } from '../features/userApis';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  profile
}) => {
  const location = useLocation();
  const [formsExpanded, setFormsExpanded] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFormsClick = () => {
    setFormsExpanded(!formsExpanded);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`bg-dark text-white ${sidebarOpen ? 'p-3 d-flex' : 'p-3 d-none d-md-flex'}`} 
      style={{ width: sidebarOpen ? '250px' : '70px', flexDirection: 'column', transition: 'width 0.3s ease' }}
    >
      <div className="d-flex align-items-center mb-4">
        {sidebarOpen && (
          <h4 className="mb-0 flex-grow-1">DashPro</h4>
        )}
        <button 
          className="btn btn-dark p-1" 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="nav flex-column nav-pills">
        <Link 
          to="/dashboard/overview"
          className={`btn text-start mb-2 d-flex align-items-center ${isActive('/dashboard/overview') ? 'btn-primary' : 'btn-dark'}`}
        >
          <BarChart2 size={20} />
          {sidebarOpen && <span className="ms-2">Overview</span>}
        </Link>

        <Link 
          to="/dashboard/qc-team"
          className={`btn text-start mb-2 d-flex align-items-center ${isActive('/dashboard/qc-team') ? 'btn-primary' : 'btn-dark'}`}
        >
          <Activity size={20} />
          {sidebarOpen && <span className="ms-2">QC Team</span>}
        </Link>
        
        <Link 
          to="/dashboard/agent-list"
          className={`btn text-start mb-2 d-flex align-items-center ${isActive('/dashboard/agent-list') ? 'btn-primary' : 'btn-dark'}`}
        >
          <SquareUserRound size={20} />
          {sidebarOpen && <span className="ms-2">Agent List</span>}
        </Link>
        
        <Link 
          to="/dashboard/teamlead"
          className={`btn text-start mb-2 d-flex align-items-center ${isActive('/dashboard/teamlead') ? 'btn-primary' : 'btn-dark'}`}
        >
          <CircleUser size={20} />
          {sidebarOpen && <span className="ms-2">Add Team Lead</span>}
        </Link>
        
        {/* External forms links */}
        <div className="mb-2">
          <button 
            className={`btn text-start w-100 d-flex align-items-center ${(isActive('/escalation') || isActive('/marketing') || isActive('/evaluation')) ? 'btn-primary' : 'btn-dark'}`}
            onClick={handleFormsClick}
          >
            <Briefcase size={20} />
            {sidebarOpen && <span className="ms-2">Forms</span>}
            {sidebarOpen && (
              <span className="ms-auto">
                {formsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
          </button>

          {/* Sub-menu items for Forms */}
          {formsExpanded && sidebarOpen && (
            <div className="ms-3 mt-2">
              <Link 
                to="/evaluation"
                className={`btn text-start mb-2 d-flex align-items-center ${isActive('/evaluation') ? 'btn-primary' : 'btn-dark'}`}
              >
                <User size={20} />
                <span className="ms-2">Agent Evaluation</span>
              </Link>
              <Link 
                to="/escalation"
                className={`btn text-start mb-2 d-flex align-items-center ${isActive('/escalation') ? 'btn-primary' : 'btn-dark'}`}
              >
                <ArrowUp size={20} />
                <span className="ms-2">Escalation</span>
              </Link>
              <Link 
                to="/marketing"
                className={`btn text-start mb-2 d-flex align-items-center ${isActive('/marketing') ? 'btn-primary' : 'btn-dark'}`}
              >
                <Target size={20} />
                <span className="ms-2">PPC/Marketing</span>
              </Link>
              <Link 
                to="/dashboard/report-download"
                className={`btn text-start mb-2 d-flex align-items-center ${isActive('/dashboard/report-download') ? 'btn-primary' : 'btn-dark'}`}
              >
                <Target size={20} />
                <span className="ms-2">Report Download</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        {sidebarOpen && (
          <div className="d-flex align-items-center p-2 border-top border-secondary mt-4 pt-2">
            <div 
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
              style={{ width: '40px', height: '40px' }}
            >
              <span className="text-capitalize fw-bold">{profile?.name?.charAt(0) || "L"}</span>
            </div>
            <div>
              <div className="text-capitalize fw-bold">{profile?.name || "Loading..."}</div>
              <div className="text-capitalize small">{profile?.role || "Loading..."}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
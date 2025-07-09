import React from 'react';
import { BarChart2, Activity, Users as UsersIcon, Briefcase, User, Menu, X, ChevronDown, ChevronRight, ArrowUp, Target } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeTab, 
  setActiveTab, 
  formsExpanded, 
  setFormsExpanded 
}) => {
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle Forms button click - only toggle dropdown, don't change content
  const handleFormsClick = () => {
    setFormsExpanded(!formsExpanded);
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
        <button 
          className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'overview' ? 'btn-primary' : 'btn-dark'}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart2 size={20} />
          {sidebarOpen && <span className="ms-2">Overview</span>}
        </button>
        <button 
          className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'analytics' ? 'btn-primary' : 'btn-dark'}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Activity size={20} />
          {sidebarOpen && <span className="ms-2">Analytics</span>}
        </button>
        <button 
          className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'users' ? 'btn-primary' : 'btn-dark'}`}
          onClick={() => setActiveTab('users')}
        >
          <UsersIcon size={20} />
          {sidebarOpen && <span className="ms-2">Users</span>}
        </button>
        <button 
          className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'projects' ? 'btn-primary' : 'btn-dark'}`}
          onClick={() => setActiveTab('projects')}
        >
          <Briefcase size={20} />
          {sidebarOpen && <span className="ms-2">Projects</span>}
        </button>
        
        {/* Forms button with expandable sub-menu */}
        <button 
          className={`btn text-start mb-2 d-flex align-items-center ${['agent', 'escalation', 'ppc'].includes(activeTab) ? 'btn-primary' : 'btn-dark'}`}
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
          <div className="ms-3">
            <button 
              className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'agent' ? 'btn-primary' : 'btn-dark'}`}
              onClick={() => setActiveTab('agent')}
            >
              <User size={20} />
              <span className="ms-2">Agent</span>
            </button>
            <button 
              className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'escalation' ? 'btn-primary' : 'btn-dark'}`}
              onClick={() => setActiveTab('escalation')}
            >
              <ArrowUp size={20} />
              <span className="ms-2">Escalation</span>
            </button>
            <button 
              className={`btn text-start mb-2 d-flex align-items-center ${activeTab === 'ppc' ? 'btn-primary' : 'btn-dark'}`}
              onClick={() => setActiveTab('ppc')}
            >
              <Target size={20} />
              <span className="ms-2">PPC</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto">
        {sidebarOpen && (
          <div className="d-flex align-items-center p-2 border-top border-secondary mt-4 pt-2">
            <div 
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
              style={{ width: '40px', height: '40px' }}
            >
              <span className="fw-bold">JD</span>
            </div>
            <div>
              <div className="fw-bold">John Doe</div>
              <div className="small">Administrator</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
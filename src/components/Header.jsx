import React, { useEffect, useState } from 'react';
import { Bell, Settings, User, Search, Menu, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfileApi, logoutApi } from '../features/userApis';

const Header = ({ 
  sidebarOpen,
  setSidebarOpen,
  notifications,
  setNotifications,
  showNotifications,
  setShowNotifications,
  showUserMenu,
  setShowUserMenu,
 
}) => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch profile once on mount
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

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

 const handleLogout = async () => {
  try {
    // Call backend to invalidate token
    await logoutApi();
  } catch (err) {
    console.error("Logout API failed:", err);
    // You can ignore errors here, still proceed with local logout
  } finally {
    // Remove everything related to login locally
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");


    setShowUserMenu(false);

    // Redirect to login/home
    navigate("/");
  }
};


  return (
    <header className="bg-white border-bottom shadow-sm px-4 py-3 d-flex align-items-center justify-content-between position-sticky top-0"
      style={{ zIndex: 1020, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      
      {/* Mobile Menu Button */}
      <div className="d-md-none">
        <button 
          className="btn btn-outline-light border-0 p-2 rounded-3 shadow-sm hover-lift" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transition: 'all 0.3s ease' }}
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="d-none d-md-block flex-grow-1 me-4" style={{ maxWidth: '400px' }}>
        <div className="position-relative">
          <div className="input-group rounded-pill overflow-hidden shadow-sm border-0" style={{ background: '#f8f9fa' }}>
            <span className="input-group-text bg-transparent border-0 ps-4">
              <Search size={18} className="text-muted" />
            </span>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent shadow-none ps-2 pe-4" 
              placeholder="Search anything..."
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="d-flex align-items-center gap-2">

        {/* Notifications */}
        {/* <div className="dropdown position-relative">
          <button 
            className="btn btn-light border-0 rounded-3 p-2 position-relative hover-lift" 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              background: unreadCount > 0 
                ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' 
                : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              transition: 'all 0.3s ease'
            }}
            title={`${unreadCount} unread notifications`}
          >
            <Bell size={18} className="text-dark" />
            {unreadCount > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill d-flex align-items-center justify-content-center"
                style={{ 
                  fontSize: '10px',
                  background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                  color: 'white',
                  minWidth: '18px',
                  height: '18px',
                  animation: 'pulse 2s infinite'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 999 }}
                onClick={() => setShowNotifications(false)}
              />
              <div className="position-absolute end-0 mt-3 bg-white rounded-4 shadow-lg border-0 overflow-hidden"
                style={{ width: '350px', zIndex: 1000 }}>
                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <h6 className="mb-0 text-white fw-semibold">Notifications</h6>
                  <button 
                    className="btn btn-sm btn-link text-white p-0 hover-underline" 
                    onClick={markAllAsRead}
                    style={{ fontSize: '12px' }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }} className="custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map(note => (
                      <div key={note.id} 
                        className={`px-4 py-3 border-bottom ${!note.read ? 'bg-light' : ''}`}
                        style={{ borderLeft: !note.read ? '3px solid #667eea' : '3px solid transparent' }}
                      >
                        <p className="mb-1 fw-medium" style={{ fontSize: '14px' }}>{note.text}</p>
                        <small className="text-muted">{note.time}</small>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-muted">
                      <Bell size={32} className="mb-2 opacity-50" />
                      <p className="mb-0">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div> */}

        {/* User Menu */}
        <div className="dropdown position-relative">
          <button 
            className="btn btn-light border-0 rounded-3 p-2 d-flex align-items-center gap-2 hover-lift" 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-white" style={{ width: '24px', height: '24px' }}>
              <User size={14} className="text-primary" />
            </div>
            <span className="text-capitalize d-none d-lg-inline text-white fw-medium" style={{ fontSize: '14px' }}>
              {profile?.name || "Guest"}
            </span>
          </button>
          
          {showUserMenu && (
            <>
              <div className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 999 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div className="position-absolute end-0 mt-3 bg-white rounded-4 shadow-lg border-0 overflow-hidden"
                style={{ width: '220px', zIndex: 1000 }}>
                
                <div className="px-4 py-3 border-bottom"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}>
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="fw-semibold text-capitalize" style={{ fontSize: '14px', color:'white' }}>
                        {profile?.name || "Guest"}
                      </div>
                      <div className="fw-semibold text-capitalize" style={{ fontSize: '12px', color : 'white' }}>
                        {profile?.role || "User"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="dropdown-item d-flex align-items-center px-4 py-2 border-0 hover-bg-light">
                    <UserCircle size={16} className="me-3 text-muted" />
                    <span style={{ fontSize: '14px' }}>Profile</span>
                  </button>
                  <button className="dropdown-item d-flex align-items-center px-4 py-2 border-0 hover-bg-light">
                    <Settings size={16} className="me-3 text-muted" />
                    <span style={{ fontSize: '14px' }}>Settings</span>
                  </button>
                  <div className="dropdown-divider mx-3 my-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item d-flex align-items-center px-4 py-2 border-0 text-danger hover-bg-danger-light"
                  >
                    <LogOut size={16} className="me-3" />
                    <span style={{ fontSize: '14px' }}>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .hover-bg-danger-light:hover { background-color: #f8d7da !important; }
        .hover-underline:hover { text-decoration: underline !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 2px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </header>
  );
};

export default Header;

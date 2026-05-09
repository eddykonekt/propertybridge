import { useState } from 'react'; // Added useState
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  ),
  messages: (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 1H2a1 1 0 00-1 1v9a1 1 0 001 1h3l3 3 3-3h3a1 1 0 001-1V2a1 1 0 00-1-1z" />
    </svg>
  ),
  maintenance: (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10.5 1.5a3 3 0 013 3 3 3 0 01-.5 1.6l-7 7A2 2 0 014 14a2 2 0 01-2-2 2 2 0 011.9-2l7-7c.1-.3.6-.5.6-.5z" />
    </svg>
  ),
  new: (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="7" /><path d="M8 5v6M5 8h6" />
    </svg>
  ),
  logout: (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 3H3a1 1 0 00-1 1v8a1 1 0 001 1h7M11 5l3 3-3 3M14 8H6" />
    </svg>
  ),
  collapse: (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M2 8h12M2 12h12" />
    </svg>
  )
};

function roleLabel(role) {
  return role === 'property_manager' ? 'Property Manager' : role === 'landlord' ? 'Landlord' : 'Tenant';
}

function initials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false); // State for toggle

  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {icons.collapse}
        </button>
        {!isCollapsed && <h1>Property<span>bridge</span></h1>}
      </div>

      <div className="sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className={`avatar ${isAdmin ? 'admin' : ''}`}>{initials(user?.fullName)}</div>
          {!isCollapsed && (
            <div className="user-info-text">
              <div className="sidebar-user-name">{user?.fullName}</div>
              <div className="sidebar-user-role">{roleLabel(user?.role)}</div>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {!isCollapsed && <div className="nav-section-label">Overview</div>}
        <NavLink title="Dashboard" to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          {icons.dashboard} <span>{!isCollapsed && 'Dashboard'}</span>
        </NavLink>

        {!isCollapsed && <div className="nav-section-label">Communication</div>}
        <NavLink title="Messages" to="/messages" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          {icons.messages} <span>{!isCollapsed && 'Messages'}</span>
        </NavLink>
        
        {!isAdmin && (
          <NavLink title="New Message" to="/messages/new" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            {icons.new} <span>{!isCollapsed && 'New Message'}</span>
          </NavLink>
        )}

        {!isCollapsed && <div className="nav-section-label">Maintenance</div>}
        <NavLink title="Maintenance" to="/maintenance" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          {icons.maintenance} <span>{!isCollapsed && (isAdmin ? 'All Requests' : 'My Requests')}</span>
        </NavLink>
      </nav>

      <div className="sidebar-logout">
        <button onClick={doLogout} title="Sign Out" className="nav-item logout-btn">
           {icons.logout} <span>{!isCollapsed}</span>
           {isCollapsed ? '➡' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
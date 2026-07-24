import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, PlusCircle, FileText, Image,
  Key, LogOut, ChevronRight, Hammer, Users, Building2
} from 'lucide-react';

export default function Sidebar() {
  const { user, permissions, logout, isJobSeeker, isClient, isContractor } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', always: true },
    { to: '/jobs', icon: Briefcase, label: 'Browse Jobs', always: true },
    { to: '/post-job', icon: PlusCircle, label: 'Post a Job', show: isClient() || isContractor() },
    { to: '/my-applications', icon: FileText, label: 'My Applications', show: isJobSeeker() },
    { to: '/manage-applicants', icon: Users, label: 'Manage Applicants', show: isClient() || isContractor() },
    { to: '/portfolio', icon: Image, label: 'Portfolio', show: isJobSeeker() },
    { to: '/change-password', icon: Key, label: 'Change Password', always: true },
  ];

  const filtered = navItems.filter(item => item.always || item.show);

  const role = isJobSeeker() ? 'Job Seeker' : isContractor() ? 'Contractor' : 'Client';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Hammer size={20} />
          </div>
          <span className="logo-text">WorkForce</span>
        </div>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <p className="user-name">{user.name || 'User'}</p>
            <span className="badge badge-role">{role}</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <p className="nav-section-label">Navigation</p>
        {filtered.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="nav-arrow" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--clr-bg-secondary);
          border-right: 1px solid var(--clr-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow-y: auto;
        }
        .sidebar-header {
          padding: 24px 20px 16px;
          border-bottom: 1px solid var(--clr-border);
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 36px; height: 36px;
          background: var(--gradient-accent);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #0a0e1a;
          flex-shrink: 0;
        }
        .logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--clr-border);
        }
        .user-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--gradient-accent);
          color: #0a0e1a;
          font-weight: 800;
          font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .user-info { overflow: hidden; }
        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--clr-text-primary);
        }
        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--clr-text-muted);
          padding: 8px 8px 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--clr-text-secondary);
          transition: all var(--transition-fast);
          cursor: pointer;
          border: 1px solid transparent;
        }
        .nav-item:hover {
          background: var(--clr-bg-glass);
          color: var(--clr-text-primary);
          border-color: var(--clr-border);
        }
        .nav-item.active {
          background: var(--clr-accent-dim);
          color: var(--clr-accent);
          border-color: rgba(245,158,11,0.25);
          font-weight: 600;
        }
        .nav-arrow { margin-left: auto; }
        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid var(--clr-border);
        }
        .logout-btn {
          width: 100%;
          background: none;
          border: none;
          font-family: inherit;
          color: var(--clr-text-secondary);
        }
        .logout-btn:hover {
          background: var(--clr-danger-dim);
          color: var(--clr-danger);
          border-color: rgba(239,68,68,0.25);
        }
      `}</style>
    </aside>
  );
}

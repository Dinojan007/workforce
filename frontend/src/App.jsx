import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterJobSeeker from './pages/RegisterJobSeeker';
import RegisterClient from './pages/RegisterClient';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import ManageApplicants from './pages/ManageApplicants';
import Portfolio from './pages/Portfolio';
import ChangePassword from './pages/ChangePassword';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-bg-primary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, border: '3px solid var(--clr-border)',
            borderTopColor: 'var(--clr-accent)', borderRadius: '50%',
            animation: 'spin 0.7s linear infinite'
          }} />
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>Loading…</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register-job-seeker" element={<PublicRoute><RegisterJobSeeker /></PublicRoute>} />
      <Route path="/register-client" element={<PublicRoute><RegisterClient /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
      <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
      <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
      <Route path="/manage-applicants" element={<ProtectedRoute><ManageApplicants /></ProtectedRoute>} />
      <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

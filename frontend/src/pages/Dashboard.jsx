import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, FileText, Users, TrendingUp, ArrowRight,
  User, Mail, Phone, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Sidebar from '../components/Sidebar';
import { SkeletonStatCard } from '../components/SkeletonLoader';

export default function Dashboard() {
  const { user, permissions, isJobSeeker, isClient, isContractor } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard().then(res => {
      if (res.success) setDashData(res.details);
    }).finally(() => setLoading(false));
  }, []);

  const u = dashData?.user_details || user || {};
  const p = dashData?.permission_details || permissions || {};

  const role = p.is_job_seeker ? 'Job Seeker' : p.is_contractor ? 'Contractor' : 'Client';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickLinks = isJobSeeker()
    ? [
        { to: '/jobs', icon: Briefcase, label: 'Browse Jobs', desc: 'Find your next opportunity', color: 'amber' },
        { to: '/my-applications', icon: FileText, label: 'My Applications', desc: 'Track application status', color: 'indigo' },
        { to: '/portfolio', icon: TrendingUp, label: 'Upload Portfolio', desc: 'Showcase your work', color: 'success' },
      ]
    : [
        { to: '/post-job', icon: Briefcase, label: 'Post a Job', desc: 'Create a new job listing', color: 'amber' },
        { to: '/jobs', icon: FileText, label: 'All Jobs', desc: 'View all job listings', color: 'indigo' },
        { to: '/manage-applicants', icon: Users, label: 'Manage Applicants', desc: 'Review and hire workers', color: 'success' },
      ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="page-content">
          {/* Welcome Banner */}
          <div className="welcome-banner animate-fade-in">
            <div className="hero-mesh" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="orb" style={{ width: 300, height: 300, background: 'radial-gradient(circle, #f59e0b, transparent)', top: -80, right: -60, opacity: 0.2 }} />
              <div className="orb" style={{ width: 200, height: 200, background: 'radial-gradient(circle, #6366f1, transparent)', bottom: -60, left: -40, opacity: 0.15 }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem', marginBottom: 6 }}>{greeting()},</p>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, marginBottom: 8 }}>
                {u.name || 'Welcome'} <span className="gradient-text">👋</span>
              </h1>
              <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>
                Here's what's happening with your WorkForce account today.
              </p>
              <span className="badge badge-role" style={{ marginTop: 12 }}>{role}</span>
            </div>
          </div>

          {/* User Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, margin: '28px 0' }}>
            {loading ? (
              [0, 1, 2, 3].map(i => <SkeletonStatCard key={i} />)
            ) : (
              <>
                <InfoCard icon={User} label="Full Name" value={u.name || '—'} color="amber" />
                <InfoCard icon={Mail} label="Email" value={u.email || '—'} color="indigo" />
                <InfoCard icon={Phone} label="Mobile" value={u.mobile_number || '—'} color="success" />
                <InfoCard icon={Shield} label="Status" value={u.is_active ? 'Active' : 'Inactive'} color={u.is_active ? 'success' : 'danger'} />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Quick Actions</h2>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8rem' }}>Jump right into what you need</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {quickLinks.map(({ to, icon: Icon, label, desc, color }) => (
              <Link key={to} to={to} className={`quick-card card card-hover`}>
                <div className={`stat-icon ${color}`} style={{ marginBottom: 14 }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{label}</h3>
                <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8rem' }}>{desc}</p>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--clr-accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                  Go <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>

          {/* Permissions Panel */}
          {!loading && (
            <div className="card animate-slide-up" style={{ marginTop: 28, padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Account Permissions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { key: 'is_admin', label: 'Admin' },
                  { key: 'is_client', label: 'Client' },
                  { key: 'is_contractor', label: 'Contractor' },
                  { key: 'is_job_seeker', label: 'Job Seeker' },
                  { key: 'is_guest', label: 'Guest' },
                ].map(({ key, label }) => (
                  <span
                    key={key}
                    style={{
                      padding: '5px 14px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                      background: p[key] ? 'var(--clr-success-dim)' : 'rgba(255,255,255,0.04)',
                      color: p[key] ? 'var(--clr-success)' : 'var(--clr-text-muted)',
                      border: `1px solid ${p[key] ? 'rgba(16,185,129,0.3)' : 'var(--clr-border)'}`,
                    }}
                  >
                    {p[key] ? '✓ ' : '✗ '}{label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .welcome-banner {
          position: relative; overflow: hidden;
          background: var(--clr-bg-glass);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: var(--radius-xl);
          padding: 32px;
        }
        .quick-card { padding: 24px; display: flex; flex-direction: column; }
      `}</style>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card" style={{ padding: 20 }}>
      <div className={`stat-icon ${color}`} style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 12 }}>
        <Icon size={16} />
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: 4, wordBreak: 'break-all' }}>{value}</p>
    </div>
  );
}

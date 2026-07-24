import { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import { api } from '../api/client';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { SkeletonCard } from '../components/SkeletonLoader';

export default function MyApplications() {
  const [jobId, setJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!jobId.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await api.getApplicationStatus({ job_id: jobId.trim() });
      if (res.success) setApplications(res.details || []);
      else { setError(res.message || 'No applications found.'); setApplications([]); }
    } catch {
      setError('Network error. Please try again.');
      setApplications([]);
    } finally { setLoading(false); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">My <span className="gradient-text">Applications</span></h1>
            <p className="page-subtitle">Track the status of your job applications</p>
          </div>

          {/* Search */}
          <div className="card animate-fade-in" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.95rem' }}>Look Up by Job ID</h3>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
              <div className="input-icon-wrap" style={{ flex: 1 }}>
                <FileText className="icon" size={15} />
                <input
                  type="text" className="form-input"
                  placeholder="Enter Job UUID…"
                  value={jobId} onChange={e => setJobId(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Search size={16} /> Search</>}
              </button>
            </form>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><span>⚠️</span> {error}</div>}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[0,1,2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : searched && applications.length === 0 && !error ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FileText size={32} /></div>
              <h3 style={{ fontWeight: 700 }}>No applications found</h3>
              <p className="text-secondary text-sm">No status records for this job ID.</p>
            </div>
          ) : applications.length > 0 ? (
            <>
              <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8rem', marginBottom: 16 }}>
                {applications.length} application record{applications.length !== 1 ? 's' : ''} found
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {applications.map((app, i) => (
                  <div key={app.id || i} className="app-row card animate-fade-in" style={{ padding: 20, animationDelay: `${i * 0.08}s` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <StatusBadge status={app.status} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                          <MetaItem label="Application ID" value={app.id?.slice(0, 8) + '…' || '—'} />
                          <MetaItem label="Job ID" value={app.job?.toString().slice(0, 8) + '…' || '—'} />
                          <MetaItem label="Applied On" value={formatDate(app.created_at)} />
                          <MetaItem label="Updated" value={formatDate(app.updated_at)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : !searched ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: '3rem' }}>📋</div>
              <h3 style={{ fontWeight: 700 }}>Enter a Job ID to get started</h3>
              <p className="text-secondary text-sm">Search for a job by its unique ID to see your application status.</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-secondary)', marginTop: 2, fontFamily: 'monospace' }}>{value}</p>
    </div>
  );
}

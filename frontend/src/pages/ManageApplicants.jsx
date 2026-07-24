import { useState } from 'react';
import { Users, Search, CheckCircle, X } from 'lucide-react';
import { api } from '../api/client';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { SkeletonCard } from '../components/SkeletonLoader';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ManageApplicants() {
  const [jobId, setJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [updateForm, setUpdateForm] = useState({ provider_id: '', job_applicant_id: '', status: 'accepted' });
  const [updateMsg, setUpdateMsg] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!jobId.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await api.getJobApplicant({ job_id: jobId.trim() });
      if (res.success) setApplicants(res.details || []);
      else { setError(res.message || 'No applicants found.'); setApplicants([]); }
    } catch {
      setError('Network error.');
      setApplicants([]);
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg(null);
    setUpdating('loading');
    try {
      const res = await api.addApplicationStatus({
        provider_id: updateForm.provider_id,
        job_id: jobId,
        job_applicant_id: updateForm.job_applicant_id,
        status: updateForm.status,
      });
      setUpdateMsg(res.success
        ? { type: 'success', text: 'Status updated successfully!' }
        : { type: 'error', text: res.message || 'Update failed.' });
      if (res.success) {
        setUpdating(null);
        handleSearch({ preventDefault: () => {} });
      }
    } catch {
      setUpdateMsg({ type: 'error', text: 'Network error.' });
    } finally {
      if (updating === 'loading') setUpdating(null);
    }
  };

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Manage <span className="gradient-text">Applicants</span></h1>
            <p className="page-subtitle">Review applicants and update their hiring status</p>
          </div>

          {/* Search */}
          <div className="card animate-fade-in" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.95rem' }}>Search Applicants by Job ID</h3>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
              <input
                type="text" className="form-input" style={{ flex: 1 }}
                placeholder="Enter Job UUID to see applicants…"
                value={jobId} onChange={e => setJobId(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Search size={16} /> Search</>}
              </button>
            </form>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><span>⚠️</span> {error}</div>}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[0,1,2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : applicants.length > 0 ? (
            <>
              <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8rem', marginBottom: 16 }}>
                {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} found
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {applicants.map((app, i) => (
                  <div key={app.id || i} className="card animate-fade-in" style={{ padding: 20, animationDelay: `${i * 0.07}s` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 40, height: 40, background: 'var(--clr-indigo-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-indigo)', fontWeight: 800 }}>
                          {i + 1}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Applicant: {app.user_applicant_details?.user || app.applicant_details}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>Applied: {formatDate(app.created_at)}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setUpdating(app.id);
                            setUpdateForm(p => ({ ...p, job_applicant_id: app.id || '' }));
                            setUpdateMsg(null);
                          }}
                        >
                          Update Status
                        </button>
                      </div>
                    </div>

                    {/* Inline Update Form */}
                    {updating === app.id && (
                      <div className="update-form animate-slide-up">
                        <div className="divider" style={{ margin: '16px 0 14px' }} />
                        {updateMsg && (
                          <div className={`alert ${updateMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 14 }}>
                            {updateMsg.text}
                          </div>
                        )}
                        <form onSubmit={handleStatusUpdate}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                            <div className="form-group">
                              <label className="form-label">Provider ID</label>
                              <input type="text" className="form-input" placeholder="EmployeeCompanyInfo ID" value={updateForm.provider_id} onChange={e => setUpdateForm(p => ({ ...p, provider_id: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Applicant ID</label>
                              <input type="text" className="form-input" placeholder="JobApplication ID" value={updateForm.job_applicant_id} onChange={e => setUpdateForm(p => ({ ...p, job_applicant_id: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">New Status</label>
                              <select className="form-select" value={updateForm.status} onChange={e => setUpdateForm(p => ({ ...p, status: e.target.value }))}>
                                {STATUS_OPTIONS.map(s => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setUpdating(null)}>
                              <X size={14} /> Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={updating === 'loading'}>
                              <CheckCircle size={14} /> Update Status
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : !searched ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Users size={32} /></div>
              <h3 style={{ fontWeight: 700 }}>Search for applicants</h3>
              <p className="text-secondary text-sm">Enter a job UUID above to view all applicants for that job.</p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Users size={32} /></div>
              <h3 style={{ fontWeight: 700 }}>No applicants yet</h3>
              <p className="text-secondary text-sm">This job hasn't received any applications yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

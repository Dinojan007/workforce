import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, X, Loader } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import { SkeletonCard } from '../components/SkeletonLoader';

export default function JobList() {
  const { user, permissions, isJobSeeker } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', city: '', district: '', experience: '', recent_days: '' });
  const [applyModal, setApplyModal] = useState(null);
  const [applyForm, setApplyForm] = useState({ applicant_details_id: '', expected_rate: '' });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMsg, setApplyMsg] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {};
      if (filters.search) payload.search = filters.search;
      if (filters.city) payload.city = filters.city;
      if (filters.district) payload.district = filters.district;
      if (filters.experience) payload.experience = Number(filters.experience);
      if (filters.recent_days) payload.recent_days = Number(filters.recent_days);
      const res = await api.getJobList(payload);
      if (res.success) setJobs(res.details || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilterChange = e => setFilters(p => ({ ...p, [e.target.name]: e.target.value }));
  const clearFilters = () => setFilters({ search: '', city: '', district: '', experience: '', recent_days: '' });

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyMsg('');
    try {
      const res = await api.applyJob({
        job_id: applyModal.id,
        applicant_details_id: applyForm.applicant_details_id,
        expected_rate: applyForm.expected_rate,
      });
      setApplyMsg(res.success ? { type: 'success', text: 'Applied successfully!' } : { type: 'error', text: res.message || 'Failed to apply.' });
      if (res.success) setTimeout(() => setApplyModal(null), 1500);
    } catch {
      setApplyMsg({ type: 'error', text: 'Network error.' });
    } finally { setApplyLoading(false); }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="page-content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Browse <span className="gradient-text">Jobs</span></h1>
            <p className="page-subtitle">Find the perfect opportunity — {loading ? '…' : `${jobs.length} jobs available`}</p>
          </div>

          {/* Search Bar */}
          <div className="search-row animate-fade-in">
            <div className="input-icon-wrap" style={{ flex: 1 }}>
              <Search className="icon" size={16} />
              <input
                type="text" name="search"
                className="form-input"
                placeholder="Search by position or description…"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <button className={`btn btn-ghost ${showFilters ? 'active-filter' : ''}`} onClick={() => setShowFilters(p => !p)}>
              <Filter size={16} />
              Filters
              {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
            </button>
            {activeFiltersCount > 0 && (
              <button className="btn btn-ghost" onClick={clearFilters} title="Clear all filters">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel card animate-slide-up">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <div className="input-icon-wrap">
                    <MapPin className="icon" size={14} />
                    <input type="text" name="city" className="form-input" placeholder="e.g. Chennai" value={filters.city} onChange={handleFilterChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input type="text" name="district" className="form-input" placeholder="e.g. Coimbatore" value={filters.district} onChange={handleFilterChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (yrs)</label>
                  <input type="number" name="experience" className="form-input" placeholder="0" min={0} value={filters.experience} onChange={handleFilterChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Posted within (days)</label>
                  <select name="recent_days" className="form-select" value={filters.recent_days} onChange={handleFilterChange}>
                    <option value="">Any time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="3">Last 3 days</option>
                    <option value="7">Last week</option>
                    <option value="30">Last month</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Grid */}
          <div className="jobs-grid">
            {loading ? (
              [0,1,2,3,4,5].map(i => <SkeletonCard key={i} />)
            ) : jobs.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state-icon">🔍</div>
                <h3 style={{ fontWeight: 700 }}>No jobs found</h3>
                <p className="text-secondary text-sm">Try adjusting your filters or search term.</p>
                <button className="btn btn-ghost" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isJobSeeker={isJobSeeker()}
                  onApply={() => { setApplyModal(job); setApplyMsg(''); setApplyForm({ applicant_details_id: '', expected_rate: '' }); }}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {applyModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setApplyModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Apply for Job</h2>
              <button onClick={() => setApplyModal(null)} className="btn btn-ghost btn-sm" style={{ padding: '6px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--clr-accent-dim)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p style={{ fontWeight: 700, color: 'var(--clr-accent)' }}>{applyModal.position}</p>
              {applyModal.reference_name && <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-secondary)', marginTop: 4 }}>{applyModal.reference_name}</p>}
            </div>

            {applyMsg && (
              <div className={`alert ${applyMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 16 }}>
                {applyMsg.text}
              </div>
            )}

            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Your Employee/Applicant ID</label>
                <input
                  type="text" className="form-input"
                  placeholder="Your EmployeeCompanyInfo ID"
                  value={applyForm.applicant_details_id}
                  onChange={e => setApplyForm(p => ({ ...p, applicant_details_id: e.target.value }))}
                  required
                />
                <span className="form-error" style={{ color: 'var(--clr-text-muted)', fontSize: '0.7rem' }}>
                  Found in your profile / dashboard data
                </span>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Rate</label>
                <input
                  type="text" className="form-input"
                  placeholder="e.g. ₹500/day"
                  value={applyForm.expected_rate}
                  onChange={e => setApplyForm(p => ({ ...p, expected_rate: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setApplyModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full" disabled={applyLoading}>
                  {applyLoading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Applying…</> : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .search-row { display: flex; gap: 12; align-items: center; margin-bottom: 16px; }
        .active-filter { color: var(--clr-accent); border-color: var(--clr-accent); }
        .filter-count {
          width: 18px; height: 18px; background: var(--clr-accent); color: #0a0e1a;
          border-radius: 50%; font-size: 0.65rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center; margin-left: 2px;
        }
        .filter-panel { padding: 20px; margin-bottom: 20px; }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
      `}</style>
    </div>
  );
}

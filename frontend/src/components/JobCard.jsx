import { MapPin, Clock, DollarSign, Users, ArrowRight, Briefcase } from 'lucide-react';

export default function JobCard({ job, onApply, isJobSeeker }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = getDaysLeft(job.expiry_date);
  const isUrgent = daysLeft !== null && daysLeft <= 2;

  const paymentTypes = Array.isArray(job.payment_type)
    ? job.payment_type
    : (job.payment_type || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="job-card card card-hover animate-fade-in">
      {isUrgent && (
        <div className="urgent-badge">
          <span className="animate-pulse" style={{ color: '#ef4444', fontSize: '8px' }}>●</span>
          Urgent
        </div>
      )}

      <div className="job-card-header">
        <div className="job-icon">
          <Briefcase size={22} />
        </div>
        <div className="job-info">
          <h3 className="job-title">{job.position || 'Position Unavailable'}</h3>
          {job.reference_name && (
            <p className="job-company">{job.reference_name}</p>
          )}
        </div>
      </div>

      {job.description && (
        <p className="job-description">
          {job.description.length > 120 ? job.description.slice(0, 120) + '…' : job.description}
        </p>
      )}

      <div className="job-meta">
        {job.location && (
          <div className="meta-item">
            <MapPin size={13} />
            <span>{[job.location.city, job.location.district, job.location.state].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {job.budget && (
          <div className="meta-item">
            <DollarSign size={13} />
            <span>₹{job.budget}</span>
          </div>
        )}
        {job.experience !== undefined && (
          <div className="meta-item">
            <Clock size={13} />
            <span>{job.experience} yrs exp</span>
          </div>
        )}
        {job.vacancies && (
          <div className="meta-item">
            <Users size={13} />
            <span>{job.vacancies} vacancies</span>
          </div>
        )}
      </div>

      {paymentTypes.length > 0 && (
        <div className="payment-types">
          {paymentTypes.map(type => (
            <span key={type} className="tag">{type}</span>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <span className={`expiry-label ${isUrgent ? 'urgent' : ''}`}>
          {daysLeft !== null
            ? daysLeft <= 0 ? 'Expired' : `Expires in ${daysLeft}d`
            : formatDate(job.expiry_date)}
        </span>
        {isJobSeeker && onApply && (
          <button className="btn btn-primary btn-sm" onClick={() => onApply(job)}>
            Apply Now <ArrowRight size={14} />
          </button>
        )}
      </div>

      <style>{`
        .job-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }
        .urgent-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .job-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .job-icon {
          width: 46px; height: 46px;
          background: var(--clr-accent-dim);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--clr-accent);
          flex-shrink: 0;
        }
        .job-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--clr-text-primary);
          line-height: 1.3;
        }
        .job-company {
          font-size: 0.8rem;
          color: var(--clr-text-secondary);
          margin-top: 3px;
        }
        .job-description {
          font-size: 0.8rem;
          color: var(--clr-text-secondary);
          line-height: 1.6;
        }
        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: var(--clr-text-secondary);
          background: rgba(255,255,255,0.04);
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid var(--clr-border);
        }
        .payment-types {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .job-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid var(--clr-border);
          margin-top: auto;
        }
        .expiry-label {
          font-size: 0.75rem;
          color: var(--clr-text-muted);
        }
        .expiry-label.urgent {
          color: var(--clr-danger);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

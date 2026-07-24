import { useState } from 'react';
import { MapPin, DollarSign, Calendar, Phone, FileText, CheckCircle, Briefcase } from 'lucide-react';
import { api } from '../api/client';
import Sidebar from '../components/Sidebar';

const PAYMENT_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'contractor', label: 'Contractor' },
];

const SECTIONS = [
  { id: 'job', label: 'Job Details', icon: Briefcase },
  { id: 'location', label: 'Location', icon: MapPin },
];

export default function PostJob() {
  const [form, setForm] = useState({
    provider_info_id: '',
    position: '',
    description: '',
    experience: 0,
    reference_name: '',
    reference_no: '',
    vacancies: '',
    budget: '',
    payment_type: [],
    expiry_date: '',
    mobile_number_01: '',
    address_line_01: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const togglePayment = v =>
    setForm(p => ({
      ...p,
      payment_type: p.payment_type.includes(v)
        ? p.payment_type.filter(x => x !== v)
        : [...p.payment_type, v],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        payment_type: form.payment_type.join(','),
        experience: Number(form.experience),
      };
      const res = await api.createJob(payload);
      setMsg(res.success
        ? { type: 'success', text: 'Job posted successfully! Workers will start applying soon.' }
        : { type: 'error', text: res.message || 'Failed to post job.' });
      if (res.success) {
        setForm({
          provider_info_id: form.provider_info_id,
          position: '', description: '', experience: 0,
          reference_name: '', reference_no: '', vacancies: '', budget: '',
          payment_type: [], expiry_date: '',
          mobile_number_01: '', address_line_01: '',
          city: '', district: '', state: '', pincode: '', country: 'India',
        });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Post a <span className="gradient-text">Job</span></h1>
            <p className="page-subtitle">Create a new job listing for skilled daily wage workers</p>
          </div>

          {msg && (
            <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 24 }}>
              {msg.type === 'success' ? <CheckCircle size={16} /> : <span>⚠️</span>}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Provider */}
              <div className="card" style={{ padding: 24 }}>
                <h3 className="section-heading">Provider Information</h3>
                <div className="form-group">
                  <label className="form-label">Your Provider / Employee Company Info ID *</label>
                  <input
                    type="text" name="provider_info_id" className="form-input"
                    placeholder="UUID from your account"
                    value={form.provider_info_id} onChange={handleChange} required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>This is your EmployeeCompanyInfo ID from the dashboard</span>
                </div>
              </div>

              {/* Job Details */}
              <div className="card" style={{ padding: 24 }}>
                <h3 className="section-heading"><Briefcase size={16} /> Job Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Position / Role *</label>
                      <input type="text" name="position" className="form-input" placeholder="e.g. Plumber" value={form.position} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reference Name</label>
                      <input type="text" name="reference_name" className="form-input" placeholder="Contact person name" value={form.reference_name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reference No</label>
                      <input type="text" name="reference_no" className="form-input" placeholder="Short ref code" value={form.reference_no} onChange={handleChange} maxLength={8} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vacancies</label>
                      <input type="number" name="vacancies" className="form-input" placeholder="No. of openings" value={form.vacancies} onChange={handleChange} min={1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Budget (₹)</label>
                      <input type="text" name="budget" className="form-input" placeholder="e.g. 500" value={form.budget} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience Required (years)</label>
                      <input type="number" name="experience" className="form-input" placeholder="0" value={form.experience} onChange={handleChange} min={0} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Description *</label>
                    <textarea name="description" className="form-textarea" placeholder="Describe the work, expectations, and other details…" value={form.description} onChange={handleChange} required rows={4} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Type</label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {PAYMENT_TYPES.map(({ value, label }) => (
                        <button
                          key={value} type="button"
                          className={`tag ${form.payment_type.includes(value) ? 'active' : ''}`}
                          onClick={() => togglePayment(value)}
                          style={{ cursor: 'pointer', padding: '7px 16px' }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ maxWidth: 280 }}>
                    <label className="form-label"><Calendar size={13} style={{ display: 'inline', marginRight: 5 }} />Expiry Date *</label>
                    <input type="datetime-local" name="expiry_date" className="form-input" value={form.expiry_date} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="card" style={{ padding: 24 }}>
                <h3 className="section-heading"><MapPin size={16} /> Job Location</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line *</label>
                    <input type="text" name="address_line_01" className="form-input" placeholder="Street / Area" value={form.address_line_01} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Mobile *</label>
                    <input type="tel" name="mobile_number_01" className="form-input" placeholder="Mobile" value={form.mobile_number_01} onChange={handleChange} required />
                  </div>
                  {[
                    { name: 'city', label: 'City' },
                    { name: 'district', label: 'District' },
                    { name: 'state', label: 'State' },
                    { name: 'pincode', label: 'Pincode' },
                    { name: 'country', label: 'Country' },
                  ].map(f => (
                    <div key={f.name} className="form-group">
                      <label className="form-label">{f.label} *</label>
                      <input type="text" name={f.name} className="form-input" placeholder={f.label} value={form[f.name]} onChange={handleChange} required />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ alignSelf: 'flex-start', minWidth: 200 }}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Posting Job…</> : <><Briefcase size={18} /> Post Job Now</>}
              </button>
            </div>
          </form>
        </div>
      </main>

      <style>{`
        .section-heading {
          font-size: 0.95rem; font-weight: 700;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
          color: var(--clr-text-primary);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--clr-border);
        }
      `}</style>
    </div>
  );
}

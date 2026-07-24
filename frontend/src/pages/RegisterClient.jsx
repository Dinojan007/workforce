import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Hammer, ArrowRight, Building2, MapPin, CheckCircle } from 'lucide-react';
import { api } from '../api/client';

const STEPS = ['Personal Details', 'Company Details', 'Address & Contact'];

export default function RegisterClient() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', mobile_number: '',
    gender: '', dob: '', password: '',
    brand_name: '', display_name: '', is_client: true, is_contractor: false, type_is_provider: true,
    address_id: '', mobile_number_01: '', communication_address: '',
    city: '', district: '', state: '', pincode: '', country: 'India',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await api.registerClient(payload);
      if (res.success) {
        setSuccess(true);
        const token = res.details?.token;
        if (token) {
          localStorage.setItem('workforce_token', token);
          setTimeout(() => navigate('/login'), 1800);
        }
      } else {
        setError(res.errors || res.error_message || res.message || 'Registration failed.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-bg-primary)' }}>
        <div className="card animate-fade-in" style={{ padding: 48, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--clr-success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--clr-success)' }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 10 }}>Registered Successfully!</h2>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>Redirecting you to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 600 }} className="animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" style={{ marginBottom: 28, justifyContent: 'center' }}>
          <div className="logo-icon"><Hammer size={18} /></div>
          <span className="logo-text">WorkForce</span>
        </Link>

        <div className="card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Register as Employer</h1>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            {STEPS.map((s, i) => (
              <div key={s} className={`step-dot-wrap ${i <= step ? 'done' : ''}`}>
                <div className={`step-dot ${i < step ? 'completed' : i === step ? 'active' : ''}`}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className="step-dot-label">{s}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={step < 2 ? (e) => { e.preventDefault(); setStep(s => s + 1); } : handleSubmit}>
            {/* Step 0: Personal */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input type="text" name="first_name" className="form-input" placeholder="John" value={form.first_name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="last_name" className="form-input" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="tel" name="mobile_number" className="form-input" placeholder="10-digit number" value={form.mobile_number} onChange={handleChange} required maxLength={10} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-select" value={form.gender} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-input" value={form.dob} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} name="password" className="form-input" placeholder="Create a password" value={form.password} onChange={handleChange} required style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Company */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Brand / Company Name</label>
                  <input type="text" name="brand_name" className="form-input" placeholder="e.g. Sharma Constructions" value={form.brand_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input type="text" name="display_name" className="form-input" placeholder="Displayed to workers" value={form.display_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[{ name: 'is_client', label: 'Client (Employer)' }, { name: 'is_contractor', label: 'Contractor' }].map(r => (
                      <label key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>
                        <input type="checkbox" name={r.name} checked={form[r.name]} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--clr-accent)' }} />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Communication Address</label>
                  <textarea name="communication_address" className="form-textarea" placeholder="Full address" value={form.communication_address} onChange={handleChange} required rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address ID</label>
                  <input type="text" name="address_id" className="form-input" placeholder="e.g. HO-001" value={form.address_id} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Mobile</label>
                  <input type="tel" name="mobile_number_01" className="form-input" placeholder="Office mobile" value={form.mobile_number_01} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { name: 'city', placeholder: 'City' },
                    { name: 'district', placeholder: 'District' },
                    { name: 'state', placeholder: 'State' },
                    { name: 'pincode', placeholder: 'Pincode' },
                  ].map(f => (
                    <div key={f.name} className="form-group">
                      <label className="form-label" style={{ textTransform: 'capitalize' }}>{f.name}</label>
                      <input type="text" name={f.name} className="form-input" placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} required />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {step > 0 && (
                <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>
                  Back
                </button>
              )}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Registering…</> :
                  step < 2 ? <>Next <ArrowRight size={16} /></> : <>Complete Registration <CheckCircle size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .logo-icon { width: 32px; height: 32px; background: var(--gradient-accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #0a0e1a; }
        .logo-text { font-size: 1rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .step-indicator {
          display: flex; align-items: flex-start; gap: 0; margin-bottom: 28px;
        }
        .step-dot-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1;
        }
        .step-dot-wrap:not(:last-child)::after {
          content: ''; display: none;
        }
        .step-dot {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700;
          background: rgba(255,255,255,0.06); color: var(--clr-text-muted);
          border: 2px solid var(--clr-border);
          transition: all 0.3s ease;
        }
        .step-dot.active { background: var(--clr-accent-dim); color: var(--clr-accent); border-color: var(--clr-accent); }
        .step-dot.completed { background: var(--clr-accent); color: #0a0e1a; border-color: var(--clr-accent); }
        .step-dot-label { font-size: 0.65rem; font-weight: 600; color: var(--clr-text-muted); text-align: center; white-space: nowrap; }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Hammer, ArrowRight, CheckCircle } from 'lucide-react';
import { api } from '../api/client';

export default function RegisterJobSeeker() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    mobile_number: '', gender: '', password: '', confirm_password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = form;
      const res = await api.registerJobSeeker(payload);
      if (res.success) {
        setSuccess(true);
        const token = res.details?.token;
        if (token) {
          localStorage.setItem('workforce_token', token);
          setTimeout(() => navigate('/login'), 1800);
        }
      } else {
        setError(res.errors || res.error_message || res.message || 'Registration failed. Please try again.');
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
    <div className="auth-layout">
      <div className="auth-left">
        <div className="hero-mesh">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 48 }}>
            <div className="logo-icon"><Hammer size={22} /></div>
            <span className="logo-text" style={{ fontSize: '1.3rem' }}>WorkForce</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
            Start Your Journey<br />as a Worker 🔨
          </h2>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 340 }}>
            Join thousands of skilled daily-wage workers finding fair employment across rural India.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Free registration — no hidden charges', 'Showcase your skills via portfolio', 'Get hired for emergency & daily work'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>
                <CheckCircle size={15} style={{ color: 'var(--clr-success)', flexShrink: 0 }} /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container animate-fade-in">
          <Link to="/" className="flex items-center gap-2" style={{ marginBottom: 28 }}>
            <div className="logo-icon-sm"><Hammer size={15} /></div>
            <span className="logo-text-sm">WorkForce</span>
          </Link>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Register as Worker</h1>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>Sign in</Link>
              {' '}·{' '}
              <Link to="/register-client" style={{ color: 'var(--clr-indigo)', fontWeight: 600 }}>Register as Employer</Link>
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-icon-wrap">
                  <User className="icon" size={15} />
                  <input type="text" name="first_name" className="form-input" placeholder="John" value={form.first_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" name="last_name" className="form-input" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail className="icon" size={15} />
                <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="input-icon-wrap">
                <Phone className="icon" size={15} />
                <input type="tel" name="mobile_number" className="form-input" placeholder="10-digit number" value={form.mobile_number} onChange={handleChange} required maxLength={10} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" value={form.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Lock className="icon" size={15} />
                <input type={showPass ? 'text' : 'password'} name="password" className="form-input" placeholder="Create a password" value={form.password} onChange={handleChange} required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <Lock className="icon" size={15} />
                <input type="password" name="confirm_password" className="form-input" placeholder="Repeat password" value={form.confirm_password} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Creating account…</> : <>Create Worker Account <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .auth-form-container { width: 100%; max-width: 420px; margin: 0 auto; }
        .logo-icon { width: 36px; height: 36px; background: var(--gradient-accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #0a0e1a; }
        .logo-text { font-size: 1.1rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .logo-icon-sm { width: 28px; height: 28px; background: var(--gradient-accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #0a0e1a; }
        .logo-text-sm { font-size: 0.9rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; }
      `}</style>
    </div>
  );
}

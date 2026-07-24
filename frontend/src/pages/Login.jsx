import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, Eye, EyeOff, Hammer, ArrowRight, Loader } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', mobile_number: '', password: '' });
  const [useEmail, setUseEmail] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { password: form.password };
      if (useEmail) payload.email = form.email;
      else payload.mobile_number = form.mobile_number;

      const res = await api.login(payload);
      if (res.success) {
        const token = res.details?.token;
        localStorage.setItem('workforce_token', token);

        // fetch dashboard
        const dash = await api.dashboard();
        if (dash.success) {
          login(token, dash.details.user_details, dash.details.permission_details);
          navigate('/dashboard');
        } else {
          login(token, {}, {});
          navigate('/dashboard');
        }
      } else {
        setError(res.errors || res.error_message || res.message || res.details || 'Login failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="hero-mesh">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 48 }}>
            <div className="logo-icon"><Hammer size={22} /></div>
            <span className="logo-text" style={{ fontSize: '1.3rem' }}>WorkForce</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
            Welcome<br />Back 👋
          </h2>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 360 }}>
            Sign in to access jobs, manage applications, and connect with workers across rural India.
          </p>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🔒', text: 'Token-based secure authentication' },
              { icon: '⚡', text: 'Real-time job alerts' },
              { icon: '📱', text: 'OTP verification support' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-container animate-fade-in">
          <div style={{ marginBottom: 32 }}>
            <Link to="/" className="flex items-center gap-3" style={{ marginBottom: 32 }}>
              <div className="logo-icon-sm"><Hammer size={16} /></div>
              <span className="logo-text-sm">WorkForce</span>
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Sign in to your account</h1>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register-job-seeker" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>
                Register here
              </Link>
            </p>
          </div>

          {/* Toggle */}
          <div className="toggle-tabs">
            <button
              className={`toggle-tab ${useEmail ? 'active' : ''}`}
              onClick={() => { setUseEmail(true); setError(''); }}
            >
              <Mail size={15} /> Email
            </button>
            <button
              className={`toggle-tab ${!useEmail ? 'active' : ''}`}
              onClick={() => { setUseEmail(false); setError(''); }}
            >
              <Phone size={15} /> Mobile
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {useEmail ? (
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <Mail className="icon" size={16} />
                  <input
                    type="email" name="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="input-icon-wrap">
                  <Phone className="icon" size={16} />
                  <input
                    type="tel" name="mobile_number"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={form.mobile_number}
                    onChange={handleChange}
                    required
                    maxLength={10}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="form-label">Password</label>
                <Link to="/change-password" style={{ fontSize: '0.78rem', color: 'var(--clr-accent)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-icon-wrap" style={{ position: 'relative' }}>
                <Lock className="icon" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing in…</> : <><span>Sign In</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="divider-text">or register as</div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/register-job-seeker" className="btn btn-ghost btn-full">
              Worker
            </Link>
            <Link to="/register-client" className="btn btn-ghost btn-full">
              Employer
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-form-container { width: 100%; max-width: 400px; margin: 0 auto; }
        .logo-icon { width: 36px; height: 36px; background: var(--gradient-accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #0a0e1a; }
        .logo-text { font-size: 1.1rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .logo-icon-sm { width: 28px; height: 28px; background: var(--gradient-accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #0a0e1a; }
        .logo-text-sm { font-size: 0.9rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .toggle-tabs {
          display: flex; background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border);
          border-radius: var(--radius-md); padding: 4px; gap: 4px; margin-bottom: 20px;
        }
        .toggle-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
          color: var(--clr-text-secondary); transition: all 0.2s ease; background: none; border: none; cursor: pointer;
        }
        .toggle-tab.active { background: var(--clr-accent-dim); color: var(--clr-accent); border: 1px solid rgba(245,158,11,0.3); }
      `}</style>
    </div>
  );
}

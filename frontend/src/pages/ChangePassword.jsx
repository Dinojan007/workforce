import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Key, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import Sidebar from '../components/Sidebar';

const STEPS = ['Send OTP', 'Reset Password'];

export default function ChangePassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await api.sendOtp({ email, password });
      if (res.success) {
        setMsg({ type: 'success', text: 'OTP sent to your email! Check your inbox.' });
        setStep(1);
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed to send OTP.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (newPassword !== confirmNew) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.changePassword({ email, otp, new_password: newPassword });
      if (res.success) {
        setSuccess(true);
      } else {
        setMsg({ type: 'error', text: res.message || 'Password reset failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-content">
          <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="card animate-fade-in" style={{ padding: 48, textAlign: 'center', maxWidth: 360 }}>
              <div style={{ width: 72, height: 72, background: 'var(--clr-success-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--clr-success)' }}>
                <ShieldCheck size={36} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 10 }}>Password Updated!</h2>
              <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
                Your password has been changed successfully. You can now log in with your new credentials.
              </p>
              <button className="btn btn-primary btn-full" onClick={() => { setSuccess(false); setStep(0); setEmail(''); setPassword(''); setOtp(''); setNewPassword(''); setConfirmNew(''); }}>
                Reset Another
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Change <span className="gradient-text">Password</span></h1>
            <p className="page-subtitle">Secure your account with a new password using OTP verification</p>
          </div>

          <div style={{ maxWidth: 480 }}>
            {/* Step indicator */}
            <div className="step-row animate-fade-in">
              {STEPS.map((s, i) => (
                <div key={s} className={`step-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                  <div className="step-circle">
                    {i < step ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <span>{s}</span>
                  {i < STEPS.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>

            {msg && (
              <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
                {msg.type === 'success' ? <CheckCircle size={16} /> : <span>⚠️</span>}
                {msg.text}
              </div>
            )}

            {/* Step 0: Send OTP */}
            {step === 0 && (
              <div className="card animate-fade-in" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--clr-accent-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-accent)' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Verify Your Identity</h3>
                    <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8rem' }}>We'll send an OTP to your email</p>
                  </div>
                </div>
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-icon-wrap">
                      <Mail className="icon" size={15} />
                      <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="input-icon-wrap">
                      <Lock className="icon" size={15} />
                      <input type="password" className="form-input" placeholder="Your current password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Sending OTP…</> : <><Key size={16} /> Send OTP</>}
                  </button>
                </form>
              </div>
            )}

            {/* Step 1: Enter OTP & New Password */}
            {step === 1 && (
              <div className="card animate-fade-in" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--clr-indigo-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-indigo)' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Set New Password</h3>
                    <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.8rem' }}>Enter the OTP from your email</p>
                  </div>
                </div>

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">OTP Code</label>
                    <input
                      type="text" className="form-input"
                      placeholder="4-digit OTP"
                      value={otp} onChange={e => setOtp(e.target.value)}
                      required maxLength={8}
                      style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNew ? 'text' : 'password'} className="form-input"
                        placeholder="New password" value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required style={{ paddingRight: 44 }}
                      />
                      <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}>
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="Repeat password" value={confirmNew} onChange={e => setConfirmNew(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => { setStep(0); setMsg(null); }}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Updating…</> : <><ShieldCheck size={16} /> Update Password</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .step-row {
          display: flex; align-items: center; gap: 0;
          margin-bottom: 28px;
        }
        .step-item {
          display: flex; align-items: center; gap: 10; font-size: 0.8rem;
          font-weight: 600; color: var(--clr-text-muted);
          flex: 1;
        }
        .step-item.active { color: var(--clr-accent); }
        .step-item.done { color: var(--clr-success); }
        .step-circle {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.06); border: 2px solid var(--clr-border);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .step-item.active .step-circle {
          background: var(--clr-accent-dim); border-color: var(--clr-accent); color: var(--clr-accent);
        }
        .step-item.done .step-circle {
          background: var(--clr-success-dim); border-color: var(--clr-success); color: var(--clr-success);
        }
        .step-line { flex: 1; height: 1px; background: var(--clr-border); margin: 0 8px; }
      `}</style>
    </div>
  );
}

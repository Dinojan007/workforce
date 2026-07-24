import { Link } from 'react-router-dom';
import { Hammer, ArrowRight, Shield, Zap, Star, Users, Briefcase, MapPin, CheckCircle } from 'lucide-react';

const WORKER_CATEGORIES = [
  { emoji: '🔨', label: 'Carpenters' },
  { emoji: '🎨', label: 'Painters' },
  { emoji: '🔧', label: 'Plumbers' },
  { emoji: '⚡', label: 'Electricians' },
  { emoji: '🧱', label: 'Masons' },
  { emoji: '🌿', label: 'Gardeners' },
  { emoji: '🏠', label: 'Cleaners' },
  { emoji: '🔩', label: 'Welders' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Emergency Hiring',
    desc: 'Post urgent daily-wage jobs and get workers hired within hours, not days.',
    color: 'amber',
  },
  {
    icon: Shield,
    title: 'Verified Workers',
    desc: 'Every worker is verified with OTP authentication and portfolio showcase.',
    color: 'indigo',
  },
  {
    icon: Star,
    title: 'Fair Wages',
    desc: 'Transparent daily, hourly, and monthly wage structures for all workers.',
    color: 'success',
  },
];

const STATS = [
  { value: '10K+', label: 'Workers Registered' },
  { value: '500+', label: 'Jobs Posted' },
  { value: '50+', label: 'Cities Covered' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <header className="landing-nav">
        <div className="container flex items-center justify-between" style={{ height: '70px' }}>
          <div className="flex items-center gap-3">
            <div className="logo-icon"><Hammer size={20} /></div>
            <span className="logo-text">WorkForce</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register-job-seeker" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-mesh">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <span>🌟</span>
            <span>India's #1 Rural Workforce Platform</span>
          </div>
          <h1 className="hero-title animate-fade-in animate-delay-1">
            Connecting <span className="gradient-text">Skilled Workers</span>
            <br />with Opportunity
          </h1>
          <p className="hero-subtitle animate-fade-in animate-delay-2">
            Bridge the gap between employers and daily wage workers — painters, carpenters,
            plumbers, and more — for emergency and daily employment in rural India.
          </p>
          <div className="hero-actions animate-fade-in animate-delay-3">
            <Link to="/register-job-seeker" className="btn btn-primary btn-lg">
              I'm a Worker <ArrowRight size={18} />
            </Link>
            <Link to="/register-client" className="btn btn-ghost btn-lg">
              I'm Hiring <Briefcase size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fade-in animate-delay-4">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worker Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tag">Categories</p>
            <h2 className="section-title">Find the Right Worker for Every Job</h2>
            <p className="section-subtitle">From skilled tradespeople to daily wage workers — we've got you covered.</p>
          </div>
          <div className="categories-grid">
            {WORKER_CATEGORIES.map((cat) => (
              <div key={cat.label} className="category-card card card-hover">
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tag">Why WorkForce</p>
            <h2 className="section-title">Built for Rural Communities</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="feature-card card card-hover">
                  <div className={`stat-icon ${f.color}`} style={{ marginBottom: 16 }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tag">How It Works</p>
            <h2 className="section-title">Start in 3 Simple Steps</h2>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', title: 'Register', desc: 'Create your account as a worker or employer in under 2 minutes.' },
              { num: '02', title: 'Connect', desc: 'Browse jobs or post requirements — find the perfect match instantly.' },
              { num: '03', title: 'Work & Earn', desc: 'Apply, get hired, and receive fair wages for your skilled work.' },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-num gradient-text">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card">
            <div className="hero-mesh" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="orb orb-1" style={{ opacity: 0.2 }} />
              <div className="orb orb-2" style={{ opacity: 0.15 }} />
            </div>
            <div className="cta-content">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-subtitle">Join thousands of workers and employers building a better livelihood together.</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/register-job-seeker" className="btn btn-primary btn-lg">Join as Worker</Link>
                <Link to="/register-client" className="btn btn-ghost btn-lg">Post a Job</Link>
              </div>
              <div className="cta-checks">
                {['Free to register', 'Verified profiles', 'Instant job alerts'].map(text => (
                  <div key={text} className="flex items-center gap-2" style={{ color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>
                    <CheckCircle size={14} style={{ color: 'var(--clr-success)' }} /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="logo-icon"><Hammer size={16} /></div>
            <span style={{ fontWeight: 700, color: 'var(--clr-text-secondary)', fontSize: '0.875rem' }}>WorkForce</span>
          </div>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>
            Designed to support the backbone of our communities: the daily wage earners.
          </p>
        </div>
      </footer>

      <style>{`
        .landing { min-height: 100vh; }

        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0;
          background: rgba(10,14,26,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--clr-border);
          z-index: 200;
        }
        .logo-icon {
          width: 36px; height: 36px;
          background: var(--gradient-accent);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #0a0e1a;
        }
        .logo-text {
          font-size: 1.1rem; font-weight: 800;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 120px 0 80px;
          overflow: hidden;
        }
        .hero-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 24px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 20px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 999px;
          font-size: 0.8rem; font-weight: 600;
          color: var(--clr-accent);
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900; line-height: 1.1;
          max-width: 800px;
        }
        .hero-subtitle {
          font-size: 1.1rem; color: var(--clr-text-secondary);
          max-width: 600px; line-height: 1.7;
        }
        .hero-actions {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          justify-content: center;
        }
        .hero-stats {
          display: flex; gap: 48px; flex-wrap: wrap; justify-content: center;
          padding-top: 24px;
          border-top: 1px solid var(--clr-border);
          margin-top: 8px;
        }
        .hero-stat { text-align: center; }
        .hero-stat-value {
          display: block; font-size: 2rem; font-weight: 900;
          background: var(--gradient-accent);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-stat-label { font-size: 0.8rem; color: var(--clr-text-muted); }

        section { padding: 80px 0; }
        .section-header { margin-bottom: 48px; }
        .section-tag {
          display: inline-block; font-size: 0.7rem;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--clr-accent); margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800; color: var(--clr-text-primary);
        }
        .section-subtitle { font-size: 1rem; color: var(--clr-text-secondary); margin-top: 12px; }

        .categories-section { background: rgba(255,255,255,0.01); }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }
        .category-card {
          padding: 24px 16px;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          text-align: center; cursor: pointer;
        }
        .cat-emoji { font-size: 2.5rem; }
        .cat-label { font-size: 0.875rem; font-weight: 600; color: var(--clr-text-primary); }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .feature-card { padding: 28px; }
        .feature-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
        .feature-desc { font-size: 0.875rem; color: var(--clr-text-secondary); line-height: 1.6; }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 32px;
        }
        .step-card { text-align: center; padding: 16px; }
        .step-num { font-size: 3.5rem; font-weight: 900; line-height: 1; margin-bottom: 16px; }
        .step-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
        .step-desc { font-size: 0.875rem; color: var(--clr-text-secondary); line-height: 1.6; }

        .cta-section { padding: 60px 0 80px; }
        .cta-card {
          position: relative; overflow: hidden;
          padding: 64px 32px;
          border-color: rgba(245,158,11,0.2);
        }
        .cta-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 20px; text-align: center;
        }
        .cta-title { font-size: 2.5rem; font-weight: 900; }
        .cta-subtitle { font-size: 1rem; color: var(--clr-text-secondary); max-width: 500px; }
        .cta-checks {
          display: flex; gap: 24px; flex-wrap: wrap; justify-content: center;
        }

        .landing-footer {
          padding: 24px 0;
          border-top: 1px solid var(--clr-border);
          background: var(--clr-bg-secondary);
        }
      `}</style>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Upload, Image, CheckCircle, AlertCircle, X, Camera } from 'lucide-react';
import { api } from '../api/client';
import Sidebar from '../components/Sidebar';

export default function Portfolio() {
  const [userInfoId, setUserInfoId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMsg(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFileChange(f);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !userInfoId.trim()) return;
    setMsg(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_info_id', userInfoId.trim());
      formData.append('portfolio_photo', file);
      const res = await api.addPortfolio(formData);
      if (res.success) {
        setMsg({ type: 'success', text: 'Portfolio photo uploaded successfully!' });
        removeFile();
      } else {
        setMsg({ type: 'error', text: res.message || 'Upload failed. Check your daily limit (max 2/day).' });
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
            <h1 className="page-title">My <span className="gradient-text">Portfolio</span></h1>
            <p className="page-subtitle">Upload photos of your past work to attract better opportunities</p>
          </div>

          {/* Limit notice */}
          <div className="alert alert-warning animate-fade-in" style={{ marginBottom: 24 }}>
            <AlertCircle size={16} />
            <span>You can upload a maximum of <strong>2 portfolio photos per day</strong>.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {/* Upload Form */}
            <div className="card animate-fade-in" style={{ padding: 28 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.95rem' }}>Upload a New Photo</h3>

              {msg && (
                <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 18 }}>
                  {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{msg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label">Your EmployeeCompanyInfo ID</label>
                  <input
                    type="text" className="form-input"
                    placeholder="UUID from dashboard"
                    value={userInfoId}
                    onChange={e => setUserInfoId(e.target.value)}
                    required
                  />
                </div>

                {/* Dropzone */}
                <div
                  className={`dropzone ${dragOver ? 'dragover' : ''} ${preview ? 'has-file' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !preview && fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange(e.target.files[0])}
                  />

                  {preview ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12 }}
                      />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removeFile(); }}
                        style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.7)', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'white',
                        }}
                      >
                        <X size={14} />
                      </button>
                      <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--clr-text-secondary)', textAlign: 'center' }}>
                        {file.name} ({(file.size / 1024).toFixed(0)} KB)
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-content">
                      <div className="dropzone-icon">
                        <Camera size={28} />
                      </div>
                      <p className="dropzone-label">Drag & drop a photo here</p>
                      <p className="dropzone-sub">or click to browse</p>
                      <p className="dropzone-formats">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading || !file || !userInfoId}
                >
                  {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Uploading…</> : <><Upload size={16} /> Upload Photo</>}
                </button>
              </form>
            </div>

            {/* Tips Card */}
            <div className="card animate-fade-in animate-delay-1" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'start' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>📸 Portfolio Tips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: '🔆', title: 'Good Lighting', desc: 'Take photos in natural light to showcase your work clearly.' },
                  { icon: '📐', title: 'Show Details', desc: 'Include before/after shots to highlight the quality of your work.' },
                  { icon: '🎨', title: 'Diverse Work', desc: 'Upload photos from different projects to show your range of skills.' },
                  { icon: '⭐', title: 'Best Work First', desc: 'Use your daily 2 uploads for your finest recent projects.' },
                ].map(tip => (
                  <div key={tip.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 3 }}>{tip.title}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', lineHeight: 1.5 }}>{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .dropzone {
          border: 2px dashed var(--clr-border);
          border-radius: var(--radius-lg);
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-base);
          background: rgba(255,255,255,0.02);
        }
        .dropzone:hover, .dropzone.dragover {
          border-color: var(--clr-accent);
          background: var(--clr-accent-dim);
        }
        .dropzone.has-file {
          border-style: solid;
          border-color: var(--clr-success);
          background: var(--clr-success-dim);
          cursor: default;
          padding: 16px;
        }
        .dropzone-icon {
          width: 56px; height: 56px;
          margin: 0 auto 14px;
          background: var(--clr-bg-glass);
          border: 1px solid var(--clr-border);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: var(--clr-text-muted);
        }
        .dropzone-label { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
        .dropzone-sub { font-size: 0.8rem; color: var(--clr-text-secondary); }
        .dropzone-formats { font-size: 0.7rem; color: var(--clr-text-muted); margin-top: 8px; }
      `}</style>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="skeleton" style={{ height: 20, width: '60%' }} />
      <div className="skeleton" style={{ height: 14, width: '40%' }} />
      <div className="skeleton" style={{ height: 14, width: '90%' }} />
      <div className="skeleton" style={{ height: 14, width: '75%' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />
        <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = '100%', height = 16 }) {
  return <div className="skeleton" style={{ height, width, borderRadius: 6 }} />;
}

export function SkeletonStatCard() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="skeleton" style={{ height: 48, width: 48, borderRadius: 12, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 36, width: '50%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '70%' }} />
    </div>
  );
}

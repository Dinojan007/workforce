import { Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_MAP = {
  pending: { label: 'Pending', icon: Clock, cls: 'badge-pending' },
  accepted: { label: 'Accepted', icon: CheckCircle, cls: 'badge-accepted' },
  rejected: { label: 'Rejected', icon: XCircle, cls: 'badge-rejected' },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending;
  const Icon = s.icon;
  return (
    <span className={`badge ${s.cls}`}>
      <Icon size={11} />
      {s.label}
    </span>
  );
}

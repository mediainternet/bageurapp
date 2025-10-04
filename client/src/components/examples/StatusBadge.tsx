import { StatusBadge } from "../status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <StatusBadge status="pending" />
      <StatusBadge status="in_progress" />
      <StatusBadge status="done" />
    </div>
  );
}

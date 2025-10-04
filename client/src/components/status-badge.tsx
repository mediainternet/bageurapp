import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "in_progress" | "done";

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  pending: { label: "Menunggu", color: "bg-status-pending text-white" },
  in_progress: { label: "Diproses", color: "bg-status-in-progress text-white" },
  done: { label: "Selesai", color: "bg-status-done text-white" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={`${config.color} rounded-full px-3 py-1`} data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}

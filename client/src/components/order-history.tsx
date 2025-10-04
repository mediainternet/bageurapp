import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Eye } from "lucide-react";

type OrderStatus = "pending" | "in_progress" | "done";

interface Order {
  id: string;
  queueNumber: number;
  customerName?: string;
  toppings: string[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

interface OrderHistoryProps {
  orders: Order[];
  onViewReceipt: (orderId: string) => void;
}

export function OrderHistory({ orders, onViewReceipt }: OrderHistoryProps) {
  const getStatusBadge = (status: OrderStatus) => {
    const colors = {
      pending: "bg-status-pending text-white",
      in_progress: "bg-status-in-progress text-white",
      done: "bg-status-done text-white",
    };
    const labels = {
      pending: "Menunggu",
      in_progress: "Diproses",
      done: "Selesai",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold font-mono">#{order.queueNumber}</span>
                {getStatusBadge(order.status)}
                {order.customerName && (
                  <span className="text-sm text-muted-foreground">
                    {order.customerName}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {order.toppings.join(", ")}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold font-mono">
                  Rp {order.total.toLocaleString("id-ID")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {order.createdAt.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewReceipt(order.id)}
              data-testid={`button-view-receipt-${order.id}`}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

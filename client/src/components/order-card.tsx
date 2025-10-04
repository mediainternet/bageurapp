import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { QueueNumber } from "./queue-number";
import { Pencil } from "lucide-react";

type OrderStatus = "pending" | "in_progress" | "done";

interface OrderCardProps {
  queueNumber: number;
  customerName?: string;
  toppings: string[];
  total: number;
  status: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
  onEdit?: () => void;
}

export function OrderCard({
  queueNumber,
  customerName,
  toppings,
  total,
  status,
  onStatusChange,
  onEdit,
}: OrderCardProps) {
  const getBorderColor = () => {
    switch (status) {
      case "pending": return "border-l-status-pending";
      case "in_progress": return "border-l-status-in-progress";
      case "done": return "border-l-status-done";
    }
  };

  return (
    <Card className={`p-4 border-l-4 ${getBorderColor()}`} data-testid={`order-card-${queueNumber}`}>
      <div className="flex items-start gap-4">
        <QueueNumber number={queueNumber} size="sm" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              {customerName && (
                <p className="font-semibold text-base" data-testid="text-customer-name">
                  {customerName}
                </p>
              )}
              <StatusBadge status={status} />
            </div>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                data-testid="button-edit-order"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Topping:</p>
            <p className="text-sm">{toppings.join(", ")}</p>
          </div>
          <p className="text-lg font-semibold font-mono" data-testid="text-total">
            Rp {total.toLocaleString("id-ID")}
          </p>
          {onStatusChange && status !== "done" && (
            <div className="flex gap-2 pt-2">
              {status === "pending" && (
                <Button
                  onClick={() => onStatusChange("in_progress")}
                  className="flex-1"
                  data-testid="button-start-order"
                >
                  Mulai Masak
                </Button>
              )}
              {status === "in_progress" && (
                <Button
                  onClick={() => onStatusChange("done")}
                  className="flex-1 bg-status-done hover:bg-status-done/90"
                  data-testid="button-finish-order"
                >
                  Selesai
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

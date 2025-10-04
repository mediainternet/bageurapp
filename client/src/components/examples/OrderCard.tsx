import { useState } from "react";
import { OrderCard } from "../order-card";

export default function OrderCardExample() {
  const [status, setStatus] = useState<"pending" | "in_progress" | "done">("pending");

  return (
    <div className="p-8 space-y-4">
      <OrderCard
        queueNumber={1}
        customerName="Budi"
        toppings={["Ceker", "Siomay", "Mie"]}
        total={15000}
        status={status}
        onStatusChange={setStatus}
        onEdit={() => console.log("Edit order")}
      />
    </div>
  );
}

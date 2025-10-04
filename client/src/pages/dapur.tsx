import { useState } from "react";
import { OrderCard } from "@/components/order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "pending" | "in_progress" | "done";

interface Order {
  id: string;
  queueNumber: number;
  customerName?: string;
  toppings: string[];
  total: number;
  status: OrderStatus;
}

// TODO: Remove mock data - replace with API calls and real-time updates
const mockOrders: Order[] = [
  {
    id: "1",
    queueNumber: 1,
    customerName: "Budi",
    toppings: ["Ceker", "Siomay", "Mie"],
    total: 10000,
    status: "pending",
  },
  {
    id: "2",
    queueNumber: 2,
    customerName: "Siti",
    toppings: ["Bakso", "Telur", "Makaroni"],
    total: 9000,
    status: "pending",
  },
  {
    id: "3",
    queueNumber: 3,
    toppings: ["Ceker", "Batagor"],
    total: 8000,
    status: "in_progress",
  },
  {
    id: "4",
    queueNumber: 4,
    customerName: "Ahmad",
    toppings: ["Siomay", "Mie", "Sosis"],
    total: 9000,
    status: "done",
  },
];

export default function DapurPage() {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    // TODO: Replace with actual API call to update order status
    console.log(`Order ${id} status changed to ${newStatus}`);
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const inProgressOrders = orders.filter((o) => o.status === "in_progress");
  const doneOrders = orders.filter((o) => o.status === "done");

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Dapur</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-orders">
            Semua ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Menunggu ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" data-testid="tab-in-progress">
            Diproses ({inProgressOrders.length})
          </TabsTrigger>
          <TabsTrigger value="done" data-testid="tab-done">
            Selesai ({doneOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                queueNumber={order.queueNumber}
                customerName={order.customerName}
                toppings={order.toppings}
                total={order.total}
                status={order.status}
                onStatusChange={(status) => handleStatusChange(order.id, status)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                queueNumber={order.queueNumber}
                customerName={order.customerName}
                toppings={order.toppings}
                total={order.total}
                status={order.status}
                onStatusChange={(status) => handleStatusChange(order.id, status)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressOrders.map((order) => (
              <OrderCard
                key={order.id}
                queueNumber={order.queueNumber}
                customerName={order.customerName}
                toppings={order.toppings}
                total={order.total}
                status={order.status}
                onStatusChange={(status) => handleStatusChange(order.id, status)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="done" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doneOrders.map((order) => (
              <OrderCard
                key={order.id}
                queueNumber={order.queueNumber}
                customerName={order.customerName}
                toppings={order.toppings}
                total={order.total}
                status={order.status}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

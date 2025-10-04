import { useState } from "react";
import { OrderCard } from "@/components/order-card";
import { EditOrderDialog } from "@/components/edit-order-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "pending" | "in_progress" | "done";

interface Order {
  id: string;
  queueNumber: number;
  customerName?: string;
  toppings: string[];
  toppingIds: string[];
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
    toppingIds: ["1", "2", "5"],
    total: 10000,
    status: "pending",
  },
  {
    id: "2",
    queueNumber: 2,
    customerName: "Siti",
    toppings: ["Bakso", "Telur", "Makaroni"],
    toppingIds: ["4", "7", "6"],
    total: 9000,
    status: "pending",
  },
  {
    id: "3",
    queueNumber: 3,
    toppings: ["Ceker", "Batagor"],
    toppingIds: ["1", "3"],
    total: 8000,
    status: "in_progress",
  },
  {
    id: "4",
    queueNumber: 4,
    customerName: "Ahmad",
    toppings: ["Siomay", "Mie", "Sosis"],
    toppingIds: ["2", "5", "8"],
    total: 9000,
    status: "done",
  },
];

const mockToppings = [
  { id: "1", name: "Ceker", price: 5000 },
  { id: "2", name: "Siomay", price: 3000 },
  { id: "3", name: "Batagor", price: 3000 },
  { id: "4", name: "Bakso", price: 4000 },
  { id: "5", name: "Mie", price: 2000 },
  { id: "6", name: "Makaroni", price: 2000 },
  { id: "7", name: "Telur", price: 3000 },
  { id: "8", name: "Sosis", price: 4000 },
];

export default function DapurPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    // TODO: Replace with actual API call to update order status
    console.log(`Order ${id} status changed to ${newStatus}`);
  };

  const handleEditOrder = (orderId: string, data: { customerName?: string; toppingIds: string[] }) => {
    const toppingNames = data.toppingIds.map(id => mockToppings.find(t => t.id === id)?.name || "");
    const total = data.toppingIds.reduce((sum, id) => {
      const topping = mockToppings.find(t => t.id === id);
      return sum + (topping?.price || 0);
    }, 0);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, customerName: data.customerName, toppingIds: data.toppingIds, toppings: toppingNames, total }
          : order
      )
    );
    // TODO: Replace with actual API call to update order
    console.log(`Order ${orderId} updated:`, data);
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const inProgressOrders = orders.filter((o) => o.status === "in_progress");
  const doneOrders = orders.filter((o) => o.status === "done");

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Dapur</h1>

      <EditOrderDialog
        open={!!editingOrder}
        onOpenChange={(open) => !open && setEditingOrder(null)}
        order={editingOrder}
        toppings={mockToppings}
        onSave={handleEditOrder}
      />

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
                onEdit={() => setEditingOrder(order)}
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
                onEdit={() => setEditingOrder(order)}
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
                onEdit={() => setEditingOrder(order)}
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
                onEdit={() => setEditingOrder(order)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

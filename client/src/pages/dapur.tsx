import { useState, useEffect } from "react";
import { OrderCard } from "@/components/order-card";
import { EditOrderDialog } from "@/components/edit-order-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order, Topping, OrderItem } from "@shared/schema";
import { Loader2 } from "lucide-react";

type OrderStatus = "pending" | "in_progress" | "done";

interface OrderWithToppings extends Order {
  toppings: string[];
  toppingIds: string[];
}

export default function DapurPage() {
  const [editingOrder, setEditingOrder] = useState<OrderWithToppings | null>(null);

  const { data: toppings = [], isLoading: isLoadingToppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const { data: orders = [], isLoading: isLoadingOrders, refetch } = useQuery<Order[]>({
    queryKey: ["/api/orders", new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/orders?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    refetchInterval: 5000,
  });

  const [ordersWithItems, setOrdersWithItems] = useState<Map<string, OrderItem[]>>(new Map());

  useEffect(() => {
    const fetchOrderItems = async () => {
      const itemsMap = new Map<string, OrderItem[]>();
      for (const order of orders) {
        try {
          const response = await fetch(`/api/orders/${order.id}`);
          if (response.ok) {
            const data = await response.json();
            itemsMap.set(order.id, data.items);
          }
        } catch (error) {
          console.error(`Failed to fetch items for order ${order.id}`);
        }
      }
      setOrdersWithItems(itemsMap);
    };

    if (orders.length > 0) {
      fetchOrderItems();
    }
  }, [orders]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/api/orders/${id}/status`, "PATCH", { status }),
    onSuccess: () => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ["/api/orders", today] });
    },
  });

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/orders/${id}`, "PUT", data),
    onSuccess: () => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ["/api/orders", today] });
      setEditingOrder(null);
    },
  });

  const handleEditOrder = (orderId: string, data: { customerName?: string; toppingIds: string[] }) => {
    const items = data.toppingIds.map(toppingId => {
      const topping = toppings.find(t => t.id === toppingId);
      return {
        toppingId,
        qty: 1,
        price: topping?.price || 0,
      };
    });

    const total = items.reduce((sum, item) => sum + item.price, 0);

    updateOrderMutation.mutate({
      id: orderId,
      data: {
        customerName: data.customerName || null,
        total,
        items,
      },
    });
  };

  const getOrderToppings = (orderId: string): string[] => {
    const items = ordersWithItems.get(orderId) || [];
    return items.map(item => {
      const topping = toppings.find(t => t.id === item.toppingId);
      return topping?.name || "Unknown";
    });
  };

  const getOrderToppingIds = (orderId: string): string[] => {
    const items = ordersWithItems.get(orderId) || [];
    return items.map(item => item.toppingId);
  };

  const ordersWithToppingData: OrderWithToppings[] = orders.map(order => ({
    ...order,
    toppings: getOrderToppings(order.id),
    toppingIds: getOrderToppingIds(order.id),
  }));

  const pendingOrders = ordersWithToppingData.filter((o) => o.status === "pending");
  const inProgressOrders = ordersWithToppingData.filter((o) => o.status === "in_progress");
  const doneOrders = ordersWithToppingData.filter((o) => o.status === "done");

  if (isLoadingOrders || isLoadingToppings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Dapur</h1>

      <EditOrderDialog
        open={!!editingOrder}
        onOpenChange={(open) => !open && setEditingOrder(null)}
        order={editingOrder}
        toppings={toppings as any}
        onSave={handleEditOrder}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-orders">
            Semua ({ordersWithToppingData.length})
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
            {ordersWithToppingData.map((order) => (
              <OrderCard
                key={order.id}
                queueNumber={order.queueNumber}
                customerName={order.customerName || undefined}
                toppings={order.toppings}
                total={order.total}
                status={order.status as any}
                onStatusChange={(status) => handleStatusChange(order.id, status as OrderStatus)}
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
                customerName={order.customerName || undefined}
                toppings={order.toppings}
                total={order.total}
                status={order.status as any}
                onStatusChange={(status) => handleStatusChange(order.id, status as OrderStatus)}
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
                customerName={order.customerName || undefined}
                toppings={order.toppings}
                total={order.total}
                status={order.status as any}
                onStatusChange={(status) => handleStatusChange(order.id, status as OrderStatus)}
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
                customerName={order.customerName || undefined}
                toppings={order.toppings}
                total={order.total}
                status={order.status as any}
                onEdit={() => setEditingOrder(order)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

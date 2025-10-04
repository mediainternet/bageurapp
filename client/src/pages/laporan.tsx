import { useState, useEffect } from "react";
import { StatsCard } from "@/components/stats-card";
import { Card } from "@/components/ui/card";
import { ShoppingBag, DollarSign, TrendingUp, Package, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Order, Topping, OrderItem } from "@shared/schema";

export default function LaporanPage() {
  const [toppingSales, setToppingSales] = useState<Map<string, { count: number; revenue: number }>>(new Map());

  const { data: toppings = [], isLoading: isLoadingToppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders", new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/orders?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
  });

  useEffect(() => {
    const calculateToppingSales = async () => {
      const salesMap = new Map<string, { count: number; revenue: number }>();
      
      for (const order of orders) {
        if (order.status === "done") {
          try {
            const response = await fetch(`/api/orders/${order.id}`);
            if (response.ok) {
              const data = await response.json();
              const items: OrderItem[] = data.items;
              
              items.forEach(item => {
                const existing = salesMap.get(item.toppingId) || { count: 0, revenue: 0 };
                salesMap.set(item.toppingId, {
                  count: existing.count + item.qty,
                  revenue: existing.revenue + (item.price * item.qty),
                });
              });
            }
          } catch (error) {
            console.error(`Failed to fetch items for order ${order.id}`);
          }
        }
      }
      
      setToppingSales(salesMap);
    };

    if (orders.length > 0) {
      calculateToppingSales();
    }
  }, [orders]);

  const doneOrders = orders.filter(o => o.status === "done");
  const totalRevenue = doneOrders.reduce((sum, order) => sum + order.total, 0);
  
  const toppingsSalesArray = Array.from(toppingSales.entries()).map(([toppingId, data]) => {
    const topping = toppings.find(t => t.id === toppingId);
    return {
      id: toppingId,
      name: topping?.name || "Unknown",
      count: data.count,
      revenue: data.revenue,
    };
  }).sort((a, b) => b.count - a.count);

  const topTopping = toppingsSalesArray[0]?.name || "-";

  if (isLoadingOrders || isLoadingToppings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Laporan Harian</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Order"
          value={doneOrders.length}
          icon={ShoppingBag}
          description="Hari ini"
        />
        <StatsCard
          title="Pendapatan"
          value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
          icon={DollarSign}
          description="Hari ini"
        />
        <StatsCard
          title="Topping Favorit"
          value={topTopping}
          icon={TrendingUp}
          description="Paling laris"
        />
        <StatsCard
          title="Jumlah Topping"
          value={toppings.length}
          icon={Package}
          description="Tersedia"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Penjualan per Topping</h2>
        <div className="space-y-4">
          {toppingsSalesArray.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada penjualan hari ini</p>
          ) : (
            toppingsSalesArray.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.count} porsi terjual
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold font-mono">
                    Rp {item.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

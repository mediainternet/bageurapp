import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToppingSelector } from "@/components/topping-selector";
import { OrderHistory } from "@/components/order-history";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Topping, Order } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function KasirPage() {
  const [customerName, setCustomerName] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: toppings = [], isLoading: isLoadingToppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const { data: queueData } = useQuery<{ queueNumber: number }>({
    queryKey: ["/api/queue-number"],
  });

  const todayOrders = useQuery<Order[]>({
    queryKey: ["/api/orders", new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/orders?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => apiRequest("/api/orders", "POST", orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/queue-number"] });
      toast({
        title: "Order berhasil dibuat",
        description: `Order untuk ${customerName || "Tanpa nama"} telah ditambahkan ke antrian`,
      });
      setCustomerName("");
      setSelectedToppings([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal membuat order",
        variant: "destructive",
      });
    },
  });

  const handleToggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return selectedToppings.reduce((sum, id) => {
      const topping = toppings.find((t) => t.id === id);
      return sum + (topping?.price || 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (selectedToppings.length === 0) {
      toast({
        title: "Pilih topping",
        description: "Silakan pilih minimal 1 topping",
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    const queueNumber = queueData?.queueNumber || 1;
    
    const orderData = {
      queueNumber,
      customerName: customerName || null,
      status: "pending",
      total,
      items: selectedToppings.map(toppingId => {
        const topping = toppings.find(t => t.id === toppingId);
        return {
          toppingId,
          qty: 1,
          price: topping?.price || 0,
        };
      }),
    };

    createOrderMutation.mutate(orderData);
  };

  const handleViewReceipt = (orderId: string) => {
    setLocation(`/print/${orderId}`);
  };

  if (isLoadingToppings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const orderHistory = todayOrders.data?.filter(o => o.status === "done") || [];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Kasir</h1>

      <Tabs defaultValue="order" className="space-y-6">
        <TabsList>
          <TabsTrigger value="order" data-testid="tab-new-order">Order Baru</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-order-history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="order">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Nama Pelanggan (Opsional)</Label>
                <Input
                  id="customerName"
                  placeholder="Masukkan nama pelanggan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  data-testid="input-customer-name"
                />
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Pilih Topping</h2>
            <ToppingSelector
              toppings={toppings}
              selectedIds={selectedToppings}
              onToggle={handleToggleTopping}
            />
          </div>
            </div>

            <div className="lg:sticky lg:top-4 h-fit">
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Ringkasan Order</h3>
            
            {selectedToppings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada topping dipilih</p>
            ) : (
              <div className="space-y-2">
                {selectedToppings.map((id) => {
                  const topping = toppings.find((t) => t.id === id);
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span>{topping?.name}</span>
                      <span className="font-mono">
                        Rp {topping?.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold font-mono" data-testid="text-order-total">
                  Rp {calculateTotal().toLocaleString("id-ID")}
                </span>
              </div>
              
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={selectedToppings.length === 0 || createOrderMutation.isPending}
                data-testid="button-create-order"
              >
                {createOrderMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Proses Order
              </Button>
            </div>
          </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          {todayOrders.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <OrderHistory orders={orderHistory as any} onViewReceipt={handleViewReceipt} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

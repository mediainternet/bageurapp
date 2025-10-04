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
import type { Topping, Order, Package } from "@shared/schema";
import { Loader as Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function KasirPage() {
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<"custom" | "package">("custom");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: toppings = [], isLoading: isLoadingToppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const { data: packages = [], isLoading: isLoadingPackages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
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
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ["/api/orders", today] });
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
    if (orderType === "package" && selectedPackage) {
      const pkg = packages.find(p => p.id === selectedPackage);
      return pkg?.price || 0;
    }
    return selectedToppings.reduce((sum, id) => {
      const topping = toppings.find((t) => t.id === id);
      return sum + (topping?.price || 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (orderType === "custom" && selectedToppings.length === 0) {
      toast({
        title: "Pilih topping",
        description: "Silakan pilih minimal 1 topping",
        variant: "destructive",
      });
      return;
    }

    if (orderType === "package" && !selectedPackage) {
      toast({
        title: "Pilih paket",
        description: "Silakan pilih paket seblak",
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    const queueNumber = queueData?.queueNumber || 1;

    let orderData: any = {
      queueNumber,
      customerName: customerName || null,
      status: "pending",
      total,
      type: orderType,
    };

    if (orderType === "package") {
      orderData.packageId = selectedPackage;
      orderData.items = [];
    } else {
      orderData.items = selectedToppings.map(toppingId => {
        const topping = toppings.find(t => t.id === toppingId);
        return {
          toppingId,
          qty: 1,
          price: topping?.price || 0,
        };
      });
    }

    createOrderMutation.mutate(orderData);
  };

  const handleViewReceipt = (orderId: string) => {
    setLocation(`/print/${orderId}`);
  };

  if (isLoadingToppings || isLoadingPackages) {
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

                  <div>
                    <Label>Jenis Order</Label>
                    <RadioGroup value={orderType} onValueChange={(value) => {
                      setOrderType(value as "custom" | "package");
                      setSelectedToppings([]);
                      setSelectedPackage("");
                    }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="font-normal cursor-pointer">Custom Topping</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="package" id="package" />
                        <Label htmlFor="package" className="font-normal cursor-pointer">Paket Seblak</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              {orderType === "package" ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pilih Paket</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedPackage === pkg.id
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{pkg.name}</h3>
                          </div>
                          <span className="text-lg font-bold font-mono">
                            Rp {pkg.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {packages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Belum ada paket tersedia
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pilih Topping</h2>
                  <ToppingSelector
                    toppings={toppings}
                    selectedIds={selectedToppings}
                    onToggle={handleToggleTopping}
                  />
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-4 h-fit">
              <Card className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">Ringkasan Order</h3>

                {orderType === "package" ? (
                  selectedPackage ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{packages.find(p => p.id === selectedPackage)?.name}</span>
                        <span className="font-mono">
                          Rp {packages.find(p => p.id === selectedPackage)?.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada paket dipilih</p>
                  )
                ) : (
                  selectedToppings.length === 0 ? (
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
                  )
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
                    disabled={
                      (orderType === "custom" && selectedToppings.length === 0) ||
                      (orderType === "package" && !selectedPackage) ||
                      createOrderMutation.isPending
                    }
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

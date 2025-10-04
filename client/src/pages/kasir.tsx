import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToppingSelector } from "@/components/topping-selector";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data - replace with API calls
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

export default function KasirPage() {
  const [customerName, setCustomerName] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const { toast } = useToast();

  const handleToggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return selectedToppings.reduce((sum, id) => {
      const topping = mockToppings.find((t) => t.id === id);
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

    // TODO: Replace with actual API call to create order
    console.log("Creating order:", { customerName, selectedToppings });
    
    toast({
      title: "Order berhasil dibuat",
      description: `Order untuk ${customerName || "Tanpa nama"} telah ditambahkan ke antrian`,
    });

    setCustomerName("");
    setSelectedToppings([]);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Kasir</h1>
      
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
              toppings={mockToppings}
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
                  const topping = mockToppings.find((t) => t.id === id);
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
                disabled={selectedToppings.length === 0}
                data-testid="button-create-order"
              >
                Proses Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

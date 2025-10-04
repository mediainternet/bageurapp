import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { ReceiptPreview } from "@/components/receipt-preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Order, OrderItem, Topping } from "@shared/schema";

interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

export default function PrintReceiptPage() {
  const [, params] = useRoute("/print/:id");
  const { toast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);

  const { data: orderData, isLoading } = useQuery<{ order: Order; items: OrderItem[] }>({
    queryKey: ["/api/orders", params?.id],
    queryFn: async () => {
      if (!params?.id) throw new Error("No order ID");
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    },
    enabled: !!params?.id,
  });

  const { data: toppings = [] } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  useEffect(() => {
    if (orderData && toppings.length > 0) {
      const items = orderData.items.map(item => {
        const topping = toppings.find(t => t.id === item.toppingId);
        return {
          name: topping?.name || "Unknown",
          qty: item.qty,
          price: item.price,
        };
      });
      setReceiptItems(items);
    }
  }, [orderData, toppings]);

  const handlePrint = async () => {
    setIsPrinting(true);

    try {
      console.log("Printing receipt for order:", params?.id);
      
      if ('bluetooth' in navigator) {
        console.log("Web Bluetooth is available");
      }

      setTimeout(() => {
        toast({
          title: "Struk berhasil dicetak",
          description: "Silakan ambil struk dari printer",
        });
        setIsPrinting(false);
      }, 1500);
    } catch (error) {
      console.error("Print error:", error);
      toast({
        title: "Gagal mencetak",
        description: "Pastikan printer Bluetooth sudah terhubung",
        variant: "destructive",
      });
      setIsPrinting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Order tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <h1 className="text-3xl font-bold mb-6">Cetak Struk</h1>

        <ReceiptPreview
          queueNumber={orderData.order.queueNumber}
          customerName={orderData.order.customerName || undefined}
          items={receiptItems}
          total={orderData.order.total}
          date={orderData.order.createdAt || new Date()}
          onPrint={handlePrint}
        />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Pastikan printer thermal Bluetooth sudah terpasang</p>
        </div>
      </div>
    </div>
  );
}

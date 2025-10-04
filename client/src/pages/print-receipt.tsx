import { useState } from "react";
import { useRoute } from "wouter";
import { ReceiptPreview } from "@/components/receipt-preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data - fetch from API based on order ID
const mockOrder = {
  id: "1",
  queueNumber: 12,
  customerName: "Ibu Siti",
  items: [
    { name: "Ceker", qty: 2, price: 5000 },
    { name: "Siomay", qty: 1, price: 3000 },
    { name: "Mie", qty: 1, price: 2000 },
  ],
  total: 15000,
  createdAt: new Date(),
};

export default function PrintReceiptPage() {
  const [, params] = useRoute("/print/:id");
  const { toast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);

    // TODO: Implement Web Bluetooth API for thermal printer
    try {
      // Simulate printing
      console.log("Printing receipt for order:", params?.id);
      
      // Check if Web Bluetooth is available
      if ('bluetooth' in navigator) {
        // This would be the actual Bluetooth implementation
        console.log("Web Bluetooth is available");
        // const device = await navigator.bluetooth.requestDevice({
        //   filters: [{ services: ['battery_service'] }]
        // });
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
          queueNumber={mockOrder.queueNumber}
          customerName={mockOrder.customerName}
          items={mockOrder.items}
          total={mockOrder.total}
          date={mockOrder.createdAt}
          onPrint={handlePrint}
        />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Pastikan printer thermal Bluetooth sudah terpasang</p>
        </div>
      </div>
    </div>
  );
}

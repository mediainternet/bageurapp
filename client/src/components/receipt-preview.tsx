import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth } from "lucide-react";

interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

interface ReceiptPreviewProps {
  queueNumber: number;
  customerName?: string;
  items: ReceiptItem[];
  total: number;
  date: Date;
  onPrint?: () => void;
}

export function ReceiptPreview({
  queueNumber,
  customerName,
  items,
  total,
  date,
  onPrint,
}: ReceiptPreviewProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6 max-w-sm mx-auto bg-card font-mono text-sm">
        <div className="text-center space-y-1 border-b border-border pb-4 mb-4">
          <h2 className="text-xl font-bold">SEBLAK BAGEUR</h2>
          <p className="text-xs">Desa Metesih, Kec. Jiwan</p>
          <p className="text-xs">Kab. Madiun</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>No. Antrian:</span>
            <span className="font-bold">#{queueNumber}</span>
          </div>
          {customerName && (
            <div className="flex justify-between">
              <span>Nama:</span>
              <span>{customerName}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span>Tanggal:</span>
            <span>{date.toLocaleDateString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Waktu:</span>
            <span>{date.toLocaleTimeString("id-ID")}</span>
          </div>
        </div>

        <div className="border-t border-b border-border py-3 mb-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-2">
              <div className="flex-1">
                <div>{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                </div>
              </div>
              <div>Rp {(item.qty * item.price).toLocaleString("id-ID")}</div>
            </div>
          ))}
        </div>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between font-bold text-base">
            <span>TOTAL:</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="text-center text-xs border-t border-border pt-4">
          <p>Terima kasih atas kunjungan Anda</p>
          <p>Selamat menikmati!</p>
        </div>
      </Card>

      {onPrint && (
        <Button
          onClick={onPrint}
          className="w-full max-w-sm mx-auto flex items-center gap-2"
          data-testid="button-print-bluetooth"
        >
          <Bluetooth className="h-5 w-5" />
          Print via Bluetooth
        </Button>
      )}
    </div>
  );
}

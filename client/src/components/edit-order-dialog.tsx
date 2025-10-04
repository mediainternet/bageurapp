import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToppingSelector } from "./topping-selector";

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    queueNumber: number;
    customerName?: string;
    toppingIds: string[];
  } | null;
  toppings: Topping[];
  onSave: (orderId: string, data: { customerName?: string; toppingIds: string[] }) => void;
}

export function EditOrderDialog({
  open,
  onOpenChange,
  order,
  toppings,
  onSave,
}: EditOrderDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName || "");
      setSelectedToppings(order.toppingIds);
    }
  }, [order]);

  const handleToggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (order) {
      onSave(order.id, { customerName, toppingIds: selectedToppings });
      onOpenChange(false);
    }
  };

  const calculateTotal = () => {
    return selectedToppings.reduce((sum, id) => {
      const topping = toppings.find((t) => t.id === id);
      return sum + (topping?.price || 0);
    }, 0);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order #{order.queueNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="editCustomerName">Nama Pelanggan</Label>
            <Input
              id="editCustomerName"
              placeholder="Nama pelanggan (opsional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              data-testid="input-edit-customer-name"
            />
          </div>

          <div>
            <Label>Topping</Label>
            <div className="mt-2">
              <ToppingSelector
                toppings={toppings}
                selectedIds={selectedToppings}
                onToggle={handleToggleTopping}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold font-mono">
                Rp {calculateTotal().toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              onClick={handleSave}
              className="w-full"
              disabled={selectedToppings.length === 0}
              data-testid="button-save-edit-order"
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

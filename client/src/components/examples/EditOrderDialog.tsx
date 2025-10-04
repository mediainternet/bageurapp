import { useState } from "react";
import { EditOrderDialog } from "../edit-order-dialog";
import { Button } from "@/components/ui/button";

const mockToppings = [
  { id: "1", name: "Ceker", price: 5000 },
  { id: "2", name: "Siomay", price: 3000 },
  { id: "3", name: "Bakso", price: 4000 },
];

export default function EditOrderDialogExample() {
  const [open, setOpen] = useState(false);
  const mockOrder = {
    id: "1",
    queueNumber: 5,
    customerName: "Ahmad",
    toppingIds: ["1", "2"],
  };

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Edit Dialog</Button>
      <EditOrderDialog
        open={open}
        onOpenChange={setOpen}
        order={mockOrder}
        toppings={mockToppings}
        onSave={(id, data) => console.log("Saving:", id, data)}
      />
    </div>
  );
}

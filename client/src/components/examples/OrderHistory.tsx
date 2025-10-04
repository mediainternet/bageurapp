import { OrderHistory } from "../order-history";

const mockOrders = [
  {
    id: "1",
    queueNumber: 15,
    customerName: "Budi",
    toppings: ["Ceker", "Siomay"],
    total: 8000,
    status: "done" as const,
    createdAt: new Date(),
  },
  {
    id: "2",
    queueNumber: 14,
    toppings: ["Bakso", "Mie", "Telur"],
    total: 9000,
    status: "done" as const,
    createdAt: new Date(Date.now() - 300000),
  },
];

export default function OrderHistoryExample() {
  return (
    <div className="p-8">
      <OrderHistory
        orders={mockOrders}
        onViewReceipt={(id) => console.log("View receipt:", id)}
      />
    </div>
  );
}

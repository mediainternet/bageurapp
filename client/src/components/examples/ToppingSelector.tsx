import { useState } from "react";
import { ToppingSelector } from "../topping-selector";

const mockToppings = [
  { id: "1", name: "Ceker", price: 5000 },
  { id: "2", name: "Siomay", price: 3000 },
  { id: "3", name: "Batagor", price: 3000 },
  { id: "4", name: "Bakso", price: 4000 },
  { id: "5", name: "Mie", price: 2000 },
  { id: "6", name: "Makaroni", price: 2000 },
];

export default function ToppingSelectorExample() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8">
      <ToppingSelector
        toppings={mockToppings}
        selectedIds={selected}
        onToggle={handleToggle}
      />
    </div>
  );
}

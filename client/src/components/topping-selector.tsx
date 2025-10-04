import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface ToppingSelectorProps {
  toppings: Topping[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function ToppingSelector({ toppings, selectedIds, onToggle }: ToppingSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {toppings.map((topping) => {
        const isSelected = selectedIds.includes(topping.id);
        return (
          <Card
            key={topping.id}
            className={`p-4 cursor-pointer transition-colors ${
              isSelected ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onToggle(topping.id)}
            data-testid={`topping-card-${topping.id}`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(topping.id)}
                data-testid={`checkbox-topping-${topping.id}`}
              />
              <div className="flex-1">
                <Label className="cursor-pointer font-medium">{topping.name}</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  Rp {topping.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

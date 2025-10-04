import { StatsCard } from "../stats-card";
import { ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard title="Total Order" value="45" icon={ShoppingBag} />
      <StatsCard title="Pendapatan" value="Rp 675.000" icon={DollarSign} />
      <StatsCard title="Topping Favorit" value="Ceker" icon={TrendingUp} />
    </div>
  );
}

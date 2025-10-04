import { StatsCard } from "@/components/stats-card";
import { Card } from "@/components/ui/card";
import { ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react";

// TODO: Remove mock data - replace with API calls
const mockStats = {
  totalOrders: 45,
  totalRevenue: 675000,
  topTopping: "Ceker",
  totalToppings: 8,
};

const mockToppingSales = [
  { name: "Ceker", count: 25, revenue: 125000 },
  { name: "Siomay", count: 20, revenue: 60000 },
  { name: "Bakso", count: 18, revenue: 72000 },
  { name: "Mie", count: 30, revenue: 60000 },
  { name: "Telur", count: 15, revenue: 45000 },
];

export default function LaporanPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Laporan Harian</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Order"
          value={mockStats.totalOrders}
          icon={ShoppingBag}
          description="Hari ini"
        />
        <StatsCard
          title="Pendapatan"
          value={`Rp ${mockStats.totalRevenue.toLocaleString("id-ID")}`}
          icon={DollarSign}
          description="Hari ini"
        />
        <StatsCard
          title="Topping Favorit"
          value={mockStats.topTopping}
          icon={TrendingUp}
          description="Paling laris"
        />
        <StatsCard
          title="Jumlah Topping"
          value={mockStats.totalToppings}
          icon={Package}
          description="Tersedia"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Penjualan per Topping</h2>
        <div className="space-y-4">
          {mockToppingSales.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.count} porsi terjual
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold font-mono">
                  Rp {item.revenue.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import { ShoppingBag, Flame, BarChart3, Settings } from "lucide-react";
import { useLocation } from "wouter";

const menuItems = [
  { title: "Kasir", url: "/", icon: ShoppingBag },
  { title: "Dapur", url: "/dapur", icon: Flame },
  { title: "Laporan", url: "/laporan", icon: BarChart3 },
  { title: "Topping", url: "/topping", icon: Settings },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <nav className="flex items-center justify-around h-16">
        {menuItems.map((item) => {
          const isActive = location === item.url;
          return (
            <button
              key={item.title}
              onClick={() => setLocation(item.url)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`nav-${item.title.toLowerCase()}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

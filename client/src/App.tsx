import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import LoginPage from "@/pages/login";
import KasirPage from "@/pages/kasir";
import DapurPage from "@/pages/dapur";
import LaporanPage from "@/pages/laporan";
import ToppingManagementPage from "@/pages/topping-management";
import PrintReceiptPage from "@/pages/print-receipt";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={KasirPage} />
      <Route path="/dapur" component={DapurPage} />
      <Route path="/laporan" component={LaporanPage} />
      <Route path="/topping" component={ToppingManagementPage} />
      <Route path="/print/:id" component={PrintReceiptPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground lg:bg-background lg:text-foreground">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger
                      className="hidden lg:flex"
                      data-testid="button-sidebar-toggle"
                    />
                    <div className="lg:hidden">
                      <h1 className="text-lg font-bold">Seblak Bageur</h1>
                      <p className="text-xs opacity-90">Desa Metesih, Jiwan</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
            <BottomNav />
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

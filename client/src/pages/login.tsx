import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with actual Supabase Auth
    setTimeout(() => {
      console.log("Login attempt:", { email, password });
      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!",
      });
      setLocation("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-primary/5">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Seblak Bageur</h1>
          <p className="text-sm text-muted-foreground">
            Desa Metesih, Kecamatan Jiwan, Kabupaten Madiun
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="kasir@seblakbageur.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
            />
          </div>
          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? "Memproses..." : "Login"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

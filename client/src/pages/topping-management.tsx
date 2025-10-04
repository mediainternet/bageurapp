import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Topping } from "@shared/schema";

export default function ToppingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const { toast } = useToast();

  const { data: toppings = [], isLoading } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; price: number }) =>
      apiRequest("/api/toppings", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toppings"] });
      toast({ title: "Topping berhasil ditambahkan" });
      setIsDialogOpen(false);
      setFormData({ name: "", price: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan topping",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; price: number } }) =>
      apiRequest(`/api/toppings/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toppings"] });
      toast({ title: "Topping berhasil diupdate" });
      setIsDialogOpen(false);
      setEditingTopping(null);
      setFormData({ name: "", price: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal mengupdate topping",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/toppings/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toppings"] });
      toast({ title: "Topping berhasil dihapus" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus topping",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Nama dan harga harus diisi",
        variant: "destructive",
      });
      return;
    }

    const data = {
      name: formData.name,
      price: parseInt(formData.price),
    };

    if (editingTopping) {
      updateMutation.mutate({ id: editingTopping.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (topping: Topping) => {
    setEditingTopping(topping);
    setFormData({ name: topping.name, price: topping.price.toString() });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenDialog = () => {
    setEditingTopping(null);
    setFormData({ name: "", price: "" });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manajemen Topping</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} data-testid="button-add-topping">
              <Plus className="h-5 w-5 mr-2" />
              Tambah Topping
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTopping ? "Edit Topping" : "Tambah Topping Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Topping</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Ceker"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  data-testid="input-topping-name"
                />
              </div>
              <div>
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  data-testid="input-topping-price"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full"
                data-testid="button-save-topping"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingTopping ? "Update" : "Simpan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {toppings.map((topping) => (
          <Card key={topping.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{topping.name}</h3>
                <p className="text-muted-foreground font-mono">
                  Rp {topping.price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(topping)}
                  data-testid={`button-edit-${topping.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(topping.id)}
                  data-testid={`button-delete-${topping.id}`}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

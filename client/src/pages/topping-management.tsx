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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Topping {
  id: string;
  name: string;
  price: number;
}

// TODO: Remove mock data - replace with API calls
const mockToppings: Topping[] = [
  { id: "1", name: "Ceker", price: 5000 },
  { id: "2", name: "Siomay", price: 3000 },
  { id: "3", name: "Batagor", price: 3000 },
  { id: "4", name: "Bakso", price: 4000 },
  { id: "5", name: "Mie", price: 2000 },
  { id: "6", name: "Makaroni", price: 2000 },
  { id: "7", name: "Telur", price: 3000 },
  { id: "8", name: "Sosis", price: 4000 },
];

export default function ToppingManagementPage() {
  const [toppings, setToppings] = useState(mockToppings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Nama dan harga harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (editingTopping) {
      // TODO: Replace with actual API call to update topping
      setToppings((prev) =>
        prev.map((t) =>
          t.id === editingTopping.id
            ? { ...t, name: formData.name, price: parseInt(formData.price) }
            : t
        )
      );
      console.log("Updating topping:", editingTopping.id, formData);
      toast({ title: "Topping berhasil diupdate" });
    } else {
      // TODO: Replace with actual API call to create topping
      const newTopping = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseInt(formData.price),
      };
      setToppings((prev) => [...prev, newTopping]);
      console.log("Creating topping:", formData);
      toast({ title: "Topping berhasil ditambahkan" });
    }

    setIsDialogOpen(false);
    setEditingTopping(null);
    setFormData({ name: "", price: "" });
  };

  const handleEdit = (topping: Topping) => {
    setEditingTopping(topping);
    setFormData({ name: topping.name, price: topping.price.toString() });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Replace with actual API call to delete topping
    setToppings((prev) => prev.filter((t) => t.id !== id));
    console.log("Deleting topping:", id);
    toast({ title: "Topping berhasil dihapus" });
  };

  const handleOpenDialog = () => {
    setEditingTopping(null);
    setFormData({ name: "", price: "" });
    setIsDialogOpen(true);
  };

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
              >
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
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

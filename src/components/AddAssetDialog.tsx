import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Asset, AssetCategory } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddAssetDialogProps {
  onAdd: (asset: Omit<Asset, 'id'>) => void;
  categoryLabels: Record<AssetCategory, string>;
}

export function AddAssetDialog({ onAdd, categoryLabels }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('acoes');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [targetAllocation, setTargetAllocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker || !name || !quantity || !price || !targetAllocation) return;

    onAdd({
      ticker: ticker.toUpperCase(),
      name,
      category,
      quantity: parseFloat(quantity),
      price: parseFloat(price.replace(',', '.')),
      targetAllocation: parseFloat(targetAllocation),
    });

    // Reset form
    setTicker('');
    setName('');
    setCategory('acoes');
    setQuantity('');
    setPrice('');
    setTargetAllocation('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Ativo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ativo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker</Label>
              <Input
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="PETR4"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as AssetCategory)}>
                <SelectTrigger className="input-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Ativo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Petrobras PN"
              className="input-dark"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="35,50"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Alvo (%)</Label>
              <Input
                id="target"
                type="number"
                value={targetAllocation}
                onChange={(e) => setTargetAllocation(e.target.value)}
                placeholder="20"
                className="input-dark"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Adicionar Ativo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

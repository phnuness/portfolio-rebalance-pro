import { Trash2, Edit2 } from 'lucide-react';
import { Asset, AssetCategory } from '@/types/portfolio';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AssetTableProps {
  assets: Asset[];
  category: AssetCategory;
  categoryLabel: string;
  usdRate?: number;
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
}

export function AssetTable({ assets, category, categoryLabel, usdRate = 1, onEdit, onDelete }: AssetTableProps) {
  const filteredAssets = assets.filter(a => a.category === category);
  const isInternational = category === 'stocks' || category === 'reits';

  if (filteredAssets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum ativo cadastrado em {categoryLabel}</p>
      </div>
    );
  }

  const totalValue = filteredAssets.reduce((sum, asset) => {
    const value = isInternational 
      ? asset.quantity * asset.price * usdRate 
      : asset.quantity * asset.price;
    return sum + value;
  }, 0);

  const formatCurrency = (value: number, isUsd = false) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: isUsd ? 'USD' : 'BRL',
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticker</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Qtd</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Preço</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Aloc. Atual</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Alvo</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Dif.</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => {
            const value = isInternational 
              ? asset.quantity * asset.price * usdRate 
              : asset.quantity * asset.price;
            const currentAllocation = (value / totalValue) * 100;
            const difference = currentAllocation - asset.targetAllocation;

            return (
              <tr key={asset.id} className="table-row-hover border-b border-border/30 last:border-0">
                <td className="py-3 px-4">
                  <div>
                    <span className="font-mono font-medium">{asset.ticker}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{asset.name}</p>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-mono">{asset.quantity}</td>
                <td className="text-right py-3 px-4 font-mono text-sm">
                  {formatCurrency(asset.price, isInternational)}
                </td>
                <td className="text-right py-3 px-4 font-mono font-medium">
                  {formatCurrency(value)}
                </td>
                <td className="text-right py-3 px-4 font-mono text-sm">
                  {currentAllocation.toFixed(1)}%
                </td>
                <td className="text-right py-3 px-4 font-mono text-sm text-muted-foreground">
                  {asset.targetAllocation}%
                </td>
                <td className="text-right py-3 px-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    difference > 2 && "badge-positive",
                    difference < -2 && "badge-negative",
                    Math.abs(difference) <= 2 && "badge-neutral"
                  )}>
                    {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit?.(asset)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete?.(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={3} className="py-3 px-4 font-medium">Total {categoryLabel}</td>
            <td className="text-right py-3 px-4 font-mono font-semibold text-primary">
              {formatCurrency(totalValue)}
            </td>
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

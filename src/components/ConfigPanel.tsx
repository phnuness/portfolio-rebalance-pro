import { Settings, DollarSign, PiggyBank, TrendingUp } from 'lucide-react';
import { PortfolioConfig, AssetCategory } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ConfigPanelProps {
  config: PortfolioConfig;
  onUpdateConfig: (updates: Partial<PortfolioConfig>) => void;
  onUpdateCategoryAllocation: (category: AssetCategory, value: number) => void;
  categoryLabels: Record<AssetCategory, string>;
}

export function ConfigPanel({ config, onUpdateConfig, onUpdateCategoryAllocation, categoryLabels }: ConfigPanelProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Configurações Gerais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Aporte Mensal
            </Label>
            <Input
              type="number"
              value={config.monthlyIncome}
              onChange={(e) => onUpdateConfig({ monthlyIncome: parseFloat(e.target.value) || 0 })}
              className="input-dark font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
              Renda Fixa (R$)
            </Label>
            <Input
              type="number"
              value={config.fixedIncomeValue}
              onChange={(e) => onUpdateConfig({ fixedIncomeValue: parseFloat(e.target.value) || 0 })}
              className="input-dark font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              USD/BRL
            </Label>
            <Input
              type="number"
              step="0.01"
              value={config.usdBrlRate}
              onChange={(e) => onUpdateConfig({ usdBrlRate: parseFloat(e.target.value) || 0 })}
              className="input-dark font-mono"
            />
          </div>
        </div>
      </div>

      {/* Macro Allocation */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="font-semibold mb-4">Alocação Macro</h3>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Renda Fixa</Label>
              <span className="font-mono text-sm">{config.fixedIncomeTarget}%</span>
            </div>
            <Slider
              value={[config.fixedIncomeTarget]}
              onValueChange={([value]) => {
                onUpdateConfig({ 
                  fixedIncomeTarget: value,
                  variableIncomeTarget: 100 - value,
                });
              }}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Renda Variável</Label>
              <span className="font-mono text-sm">{config.variableIncomeTarget}%</span>
            </div>
            <Slider
              value={[config.variableIncomeTarget]}
              onValueChange={([value]) => {
                onUpdateConfig({ 
                  variableIncomeTarget: value,
                  fixedIncomeTarget: 100 - value,
                });
              }}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 flex justify-between text-sm">
          <span className="text-muted-foreground">Distribuição do Aporte:</span>
          <div className="font-mono space-x-4">
            <span>RF: {formatCurrency(config.monthlyIncome * config.fixedIncomeTarget / 100)}</span>
            <span>RV: {formatCurrency(config.monthlyIncome * config.variableIncomeTarget / 100)}</span>
          </div>
        </div>
      </div>

      {/* Category Allocation */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="font-semibold mb-4">Alocação Renda Variável</h3>
        
        <div className="space-y-6">
          {(Object.keys(categoryLabels) as AssetCategory[]).map((category) => (
            <div key={category} className="space-y-3">
              <div className="flex justify-between">
                <Label>{categoryLabels[category]}</Label>
                <span className="font-mono text-sm">{config.categoryAllocations[category]}%</span>
              </div>
              <Slider
                value={[config.categoryAllocations[category]]}
                onValueChange={([value]) => onUpdateCategoryAllocation(category, value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className={`font-mono font-medium ${
              Object.values(config.categoryAllocations).reduce((a, b) => a + b, 0) === 100 
                ? 'text-primary' 
                : 'text-destructive'
            }`}>
              {Object.values(config.categoryAllocations).reduce((a, b) => a + b, 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

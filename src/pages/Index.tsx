import { useState } from 'react';
import { Wallet, Settings, TrendingUp, PieChart, BarChart3, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { StatCard } from '@/components/StatCard';
import { AllocationBar } from '@/components/AllocationBar';
import { AssetTable } from '@/components/AssetTable';
import { AddAssetDialog } from '@/components/AddAssetDialog';
import { ConfigPanel } from '@/components/ConfigPanel';
import { RecommendationCard } from '@/components/RecommendationCard';
import { PortfolioPieChart } from '@/components/PortfolioPieChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetCategory } from '@/types/portfolio';

const Index = () => {
  const {
    config,
    assets,
    categoryAllocations,
    fixedIncomeAllocation,
    variableIncomeAllocation,
    recommendations,
    bestAssetToBuy,
    getTotalPortfolio,
    getTotalVariableIncome,
    addAsset,
    updateAsset,
    removeAsset,
    updateConfig,
    updateCategoryAllocation,
    categoryLabels,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('dashboard');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 glow-primary">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Rebalanceador</h1>
                <p className="text-sm text-muted-foreground">Buy & Hold Strategy</p>
              </div>
            </div>
            <AddAssetDialog onAdd={addAsset} categoryLabels={categoryLabels} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary/10">
              <PieChart className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-2 data-[state=active]:bg-primary/10">
              <BarChart3 className="h-4 w-4" />
              Ativos
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2 data-[state=active]:bg-primary/10">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Patrimônio Total"
                value={formatCurrency(getTotalPortfolio())}
                icon={<Wallet className="h-5 w-5" />}
                delay={0}
              />
              <StatCard
                title="Renda Fixa"
                value={formatCurrency(config.fixedIncomeValue)}
                subtitle={`${fixedIncomeAllocation.currentPercentage.toFixed(1)}% da carteira`}
                icon={<TrendingUp className="h-5 w-5" />}
                delay={100}
              />
              <StatCard
                title="Renda Variável"
                value={formatCurrency(getTotalVariableIncome())}
                subtitle={`${variableIncomeAllocation.currentPercentage.toFixed(1)}% da carteira`}
                icon={<BarChart3 className="h-5 w-5" />}
                delay={200}
              />
              <StatCard
                title="Aporte Mensal"
                value={formatCurrency(config.monthlyIncome)}
                subtitle="Para rebalanceamento"
                icon={<RefreshCw className="h-5 w-5" />}
                delay={300}
              />
            </div>

            {/* Charts & Recommendation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PortfolioPieChart
                  fixedIncome={{
                    value: config.fixedIncomeValue,
                    percentage: fixedIncomeAllocation.currentPercentage,
                  }}
                  variableIncome={{
                    value: getTotalVariableIncome(),
                    percentage: variableIncomeAllocation.currentPercentage,
                  }}
                  categoryAllocations={categoryAllocations}
                />
              </div>
              <div>
                <RecommendationCard
                  recommendation={bestAssetToBuy}
                  categoryLabels={categoryLabels}
                />
              </div>
            </div>

            {/* Allocation Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Macro Allocation */}
              <div className="glass-card p-5 space-y-5">
                <h3 className="font-semibold">Alocação Macro</h3>
                <AllocationBar
                  label="Renda Fixa"
                  current={fixedIncomeAllocation.currentPercentage}
                  target={config.fixedIncomeTarget}
                  value={formatCurrency(config.fixedIncomeValue)}
                />
                <AllocationBar
                  label="Renda Variável"
                  current={variableIncomeAllocation.currentPercentage}
                  target={config.variableIncomeTarget}
                  value={formatCurrency(getTotalVariableIncome())}
                />
              </div>

              {/* Category Allocation */}
              <div className="glass-card p-5 space-y-5">
                <h3 className="font-semibold">Alocação por Categoria</h3>
                {categoryAllocations.map((cat) => (
                  <AllocationBar
                    key={cat.category}
                    label={cat.label}
                    current={cat.currentPercentage}
                    target={cat.targetPercentage}
                    value={formatCurrency(cat.currentValue)}
                  />
                ))}
              </div>
            </div>

            {/* Rebalance Table */}
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4">Ranking de Rebalanceamento</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticker</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Categoria</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Atual</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Objetivo</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Diferença</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Prioridade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.slice(0, 10).map((rec) => (
                      <tr key={rec.ticker} className="table-row-hover border-b border-border/30 last:border-0">
                        <td className="py-3 px-4 font-mono font-medium">{rec.ticker}</td>
                        <td className="py-3 px-4 text-muted-foreground">{categoryLabels[rec.category]}</td>
                        <td className="text-right py-3 px-4 font-mono text-sm">{formatCurrency(rec.currentValue)}</td>
                        <td className="text-right py-3 px-4 font-mono text-sm">{formatCurrency(rec.targetValue)}</td>
                        <td className="text-right py-3 px-4">
                          <span className={rec.difference > 0 ? 'text-primary' : 'text-destructive'}>
                            {rec.difference > 0 ? '+' : ''}{formatCurrency(rec.difference)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            rec.priority === 'high' ? 'badge-positive' :
                            rec.priority === 'medium' ? 'bg-warning/15 text-warning border border-warning/20' :
                            'badge-neutral'
                          }`}>
                            {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            {(['acoes', 'fiis', 'stocks', 'reits'] as AssetCategory[]).map((category) => (
              <div key={category} className="glass-card p-5">
                <h3 className="font-semibold mb-4">{categoryLabels[category]}</h3>
                <AssetTable
                  assets={assets}
                  category={category}
                  categoryLabel={categoryLabels[category]}
                  usdRate={config.usdBrlRate}
                  onDelete={removeAsset}
                />
              </div>
            ))}
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config">
            <ConfigPanel
              config={config}
              onUpdateConfig={updateConfig}
              onUpdateCategoryAllocation={updateCategoryAllocation}
              categoryLabels={categoryLabels}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

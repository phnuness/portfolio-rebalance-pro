import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { RebalanceRecommendation, AssetCategory } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  recommendation: RebalanceRecommendation | null;
  categoryLabels: Record<AssetCategory, string>;
}

export function RecommendationCard({ recommendation, categoryLabels }: RecommendationCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!recommendation) {
    return (
      <div className="stat-card border-primary/20 glow-primary animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Próximo Aporte</h3>
            <p className="text-sm text-muted-foreground">Carteira balanceada!</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Todos os seus ativos estão dentro da alocação objetivo.
        </p>
      </div>
    );
  }

  return (
    <div className="stat-card border-primary/20 glow-primary animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Próximo Aporte</h3>
            <p className="text-sm text-muted-foreground">Recomendação de compra</p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          recommendation.priority === 'high' && "bg-primary/20 text-primary",
          recommendation.priority === 'medium' && "bg-warning/20 text-warning",
          recommendation.priority === 'low' && "bg-muted text-muted-foreground"
        )}>
          {recommendation.priority === 'high' && 'Alta prioridade'}
          {recommendation.priority === 'medium' && 'Média prioridade'}
          {recommendation.priority === 'low' && 'Baixa prioridade'}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-3xl font-bold gradient-text">
              {recommendation.ticker}
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              {categoryLabels[recommendation.category]}
            </p>
          </div>
          <ArrowUpRight className="h-8 w-8 text-primary animate-pulse-glow" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Valor Atual</p>
            <p className="font-mono font-medium">{formatCurrency(recommendation.currentValue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor Objetivo</p>
            <p className="font-mono font-medium">{formatCurrency(recommendation.targetValue)}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex justify-between items-center">
            <span className="text-sm">Diferença para o alvo</span>
            <span className="font-mono font-semibold text-primary">
              +{formatCurrency(recommendation.difference)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

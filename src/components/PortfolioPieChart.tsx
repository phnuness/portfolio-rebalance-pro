import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryAllocation } from '@/types/portfolio';

interface PortfolioPieChartProps {
  fixedIncome: { value: number; percentage: number };
  variableIncome: { value: number; percentage: number };
  categoryAllocations: CategoryAllocation[];
}

export function PortfolioPieChart({ fixedIncome, variableIncome, categoryAllocations }: PortfolioPieChartProps) {
  const COLORS = {
    fixed: 'hsl(199, 89%, 48%)',
    acoes: 'hsl(142, 70%, 45%)',
    fiis: 'hsl(38, 92%, 50%)',
    stocks: 'hsl(280, 70%, 50%)',
    reits: 'hsl(320, 70%, 50%)',
  };

  const macroData = [
    { name: 'Renda Fixa', value: fixedIncome.value, color: COLORS.fixed },
    { name: 'Renda Variável', value: variableIncome.value, color: COLORS.acoes },
  ];

  const categoryData = categoryAllocations
    .filter(c => c.currentValue > 0)
    .map(c => ({
      name: c.label,
      value: c.currentValue,
      color: COLORS[c.category as keyof typeof COLORS] || COLORS.acoes,
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground font-mono">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Macro Allocation */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 text-center">Alocação Macro</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Allocation */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 text-center">Renda Variável</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

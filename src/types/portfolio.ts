export type AssetCategory = 'acoes' | 'fiis' | 'stocks' | 'reits';

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  quantity: number;
  price: number;
  targetAllocation: number; // percentage within category
}

export interface CategoryAllocation {
  category: AssetCategory;
  label: string;
  targetPercentage: number; // within variable income
  currentValue: number;
  currentPercentage: number;
  difference: number;
}

export interface PortfolioConfig {
  monthlyIncome: number;
  fixedIncomeValue: number;
  fixedIncomeTarget: number; // percentage
  variableIncomeTarget: number; // percentage
  usdBrlRate: number;
  categoryAllocations: {
    acoes: number;
    fiis: number;
    stocks: number;
    reits: number;
  };
}

export interface RebalanceRecommendation {
  ticker: string;
  category: AssetCategory;
  currentValue: number;
  targetValue: number;
  difference: number;
  priority: 'high' | 'medium' | 'low';
}

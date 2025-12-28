import { useState, useCallback, useMemo } from 'react';
import { Asset, AssetCategory, PortfolioConfig, CategoryAllocation, RebalanceRecommendation } from '@/types/portfolio';

const defaultConfig: PortfolioConfig = {
  monthlyIncome: 2000,
  fixedIncomeValue: 8000,
  fixedIncomeTarget: 25,
  variableIncomeTarget: 75,
  usdBrlRate: 4.93,
  categoryAllocations: {
    acoes: 60,
    fiis: 40,
    stocks: 0,
    reits: 0,
  },
};

const defaultAssets: Asset[] = [
  { id: '1', ticker: 'AESB3', name: 'Aes Brasil', category: 'acoes', quantity: 450, price: 14.11, targetAllocation: 33 },
  { id: '2', ticker: 'BBAS3', name: 'Banco do Brasil', category: 'acoes', quantity: 128, price: 32.90, targetAllocation: 33 },
  { id: '3', ticker: 'BBSE3', name: 'BB Seguridade', category: 'acoes', quantity: 150, price: 23.92, targetAllocation: 34 },
  { id: '4', ticker: 'MXRF11', name: 'Maxi Renda FII', category: 'fiis', quantity: 100, price: 10.06, targetAllocation: 100 },
];

export function usePortfolio() {
  const [config, setConfig] = useState<PortfolioConfig>(defaultConfig);
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);

  const categoryLabels: Record<AssetCategory, string> = {
    acoes: 'Ações',
    fiis: 'FIIs',
    stocks: 'Stocks',
    reits: 'REITs',
  };

  const getTotalVariableIncome = useCallback(() => {
    return assets.reduce((total, asset) => {
      const value = asset.category === 'stocks' || asset.category === 'reits'
        ? asset.quantity * asset.price * config.usdBrlRate
        : asset.quantity * asset.price;
      return total + value;
    }, 0);
  }, [assets, config.usdBrlRate]);

  const getTotalPortfolio = useCallback(() => {
    return config.fixedIncomeValue + getTotalVariableIncome();
  }, [config.fixedIncomeValue, getTotalVariableIncome]);

  const getCategoryValue = useCallback((category: AssetCategory) => {
    return assets
      .filter(a => a.category === category)
      .reduce((total, asset) => {
        const value = asset.category === 'stocks' || asset.category === 'reits'
          ? asset.quantity * asset.price * config.usdBrlRate
          : asset.quantity * asset.price;
        return total + value;
      }, 0);
  }, [assets, config.usdBrlRate]);

  const categoryAllocations = useMemo((): CategoryAllocation[] => {
    const totalVariable = getTotalVariableIncome();
    const categories: AssetCategory[] = ['acoes', 'fiis', 'stocks', 'reits'];

    return categories.map(category => {
      const currentValue = getCategoryValue(category);
      const currentPercentage = totalVariable > 0 ? (currentValue / totalVariable) * 100 : 0;
      const targetPercentage = config.categoryAllocations[category];

      return {
        category,
        label: categoryLabels[category],
        targetPercentage,
        currentValue,
        currentPercentage,
        difference: currentPercentage - targetPercentage,
      };
    });
  }, [config, getCategoryValue, getTotalVariableIncome]);

  const fixedIncomeAllocation = useMemo(() => {
    const total = getTotalPortfolio();
    const currentPercentage = total > 0 ? (config.fixedIncomeValue / total) * 100 : 0;
    return {
      value: config.fixedIncomeValue,
      currentPercentage,
      targetPercentage: config.fixedIncomeTarget,
      difference: currentPercentage - config.fixedIncomeTarget,
    };
  }, [config, getTotalPortfolio]);

  const variableIncomeAllocation = useMemo(() => {
    const total = getTotalPortfolio();
    const variableValue = getTotalVariableIncome();
    const currentPercentage = total > 0 ? (variableValue / total) * 100 : 0;
    return {
      value: variableValue,
      currentPercentage,
      targetPercentage: config.variableIncomeTarget,
      difference: currentPercentage - config.variableIncomeTarget,
    };
  }, [config, getTotalPortfolio, getTotalVariableIncome]);

  const recommendations = useMemo((): RebalanceRecommendation[] => {
    const totalVariable = getTotalVariableIncome();
    const total = getTotalPortfolio();

    return assets.map(asset => {
      const assetValue = asset.category === 'stocks' || asset.category === 'reits'
        ? asset.quantity * asset.price * config.usdBrlRate
        : asset.quantity * asset.price;

      // Get category assets for calculating within-category allocation
      const categoryAssets = assets.filter(a => a.category === asset.category);
      const categoryValue = getCategoryValue(asset.category);
      
      // Calculate target value based on nested allocation:
      // Asset target % of category × Category target % of variable × Variable target % of total
      const categoryTargetOfVariable = config.categoryAllocations[asset.category] / 100;
      const variableTargetOfTotal = config.variableIncomeTarget / 100;
      const assetTargetOfCategory = asset.targetAllocation / 100;

      const targetValue = total * variableTargetOfTotal * categoryTargetOfVariable * assetTargetOfCategory;
      const difference = targetValue - assetValue;

      let priority: 'high' | 'medium' | 'low' = 'low';
      const diffPercentage = Math.abs(difference) / (targetValue || 1);
      if (diffPercentage > 0.2) priority = 'high';
      else if (diffPercentage > 0.1) priority = 'medium';

      return {
        ticker: asset.ticker,
        category: asset.category,
        currentValue: assetValue,
        targetValue,
        difference,
        priority,
      };
    }).sort((a, b) => b.difference - a.difference);
  }, [assets, config, getTotalVariableIncome, getTotalPortfolio, getCategoryValue]);

  const bestAssetToBuy = useMemo(() => {
    const positive = recommendations.filter(r => r.difference > 0);
    return positive.length > 0 ? positive[0] : null;
  }, [recommendations]);

  const addAsset = useCallback((asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
    };
    setAssets(prev => [...prev, newAsset]);
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const removeAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const updateConfig = useCallback((updates: Partial<PortfolioConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCategoryAllocation = useCallback((category: AssetCategory, value: number) => {
    setConfig(prev => ({
      ...prev,
      categoryAllocations: {
        ...prev.categoryAllocations,
        [category]: value,
      },
    }));
  }, []);

  return {
    config,
    assets,
    categoryAllocations,
    fixedIncomeAllocation,
    variableIncomeAllocation,
    recommendations,
    bestAssetToBuy,
    getTotalPortfolio,
    getTotalVariableIncome,
    getCategoryValue,
    addAsset,
    updateAsset,
    removeAsset,
    updateConfig,
    updateCategoryAllocation,
    categoryLabels,
  };
}

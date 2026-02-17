import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical, History, Loader2 } from 'lucide-react';
import BacktestForm from '@/components/backtest/BacktestForm';
import BacktestResults from '@/components/backtest/BacktestResults';
import MarketTicker from '@/components/dashboard/MarketTicker';
import { AppAPI } from '@/components/api/appDataService';

// Simulate backtest results
const runBacktestSimulation = (config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trades = [];
      let balance = config.initial_balance;
      const numTrades = Math.floor(Math.random() * 30) + 20;
      
      for (let i = 0; i < numTrades; i++) {
        const isWin = Math.random() > 0.45;
        const profit = isWin 
          ? (balance * config.risk_per_trade / 100) * (config.take_profit / config.stop_loss)
          : -(balance * config.risk_per_trade / 100);
        
        const basePrice = config.currency_pair === 'XAUUSD' ? 2000 : config.currency_pair === 'BTCUSD' ? 40000 : 1.08;
        const entry = basePrice * (1 + (Math.random() - 0.5) * 0.02);
        const exit = entry * (1 + (isWin ? 0.01 : -0.005));
        
        trades.push({
          date: new Date(new Date(config.start_date).getTime() + i * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          entry_price: parseFloat(entry.toFixed(5)),
          exit_price: parseFloat(exit.toFixed(5)),
          profit: parseFloat(profit.toFixed(2)),
        });
        
        balance += profit;
      }
      
      const winningTrades = trades.filter(t => t.profit > 0).length;
      const losingTrades = trades.filter(t => t.profit <= 0).length;
      const totalProfit = trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0);
      const totalLoss = Math.abs(trades.filter(t => t.profit <= 0).reduce((sum, t) => sum + t.profit, 0));
      
      resolve({
        strategy_name: strategyNames[config.strategy],
        currency_pair: config.currency_pair,
        start_date: config.start_date,
        end_date: config.end_date,
        initial_balance: config.initial_balance,
        final_balance: parseFloat(balance.toFixed(2)),
        total_trades: numTrades,
        winning_trades: winningTrades,
        losing_trades: losingTrades,
        win_rate: (winningTrades / numTrades) * 100,
        profit_factor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit,
        max_drawdown: Math.random() * 15 + 5,
        trades,
      });
    }, 2000);
  });
};

export default function Backtest() {
  const [currentResult, setCurrentResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  const { data: pageConfig } = useQuery({
    queryKey: ['backtest-config'],
    queryFn: () => AppAPI.backtest.getConfig(),
  });

  const { data: strategyNames = {} } = useQuery({
    queryKey: ['backtest-strategies'],
    queryFn: () => AppAPI.backtest.getStrategies(),
  });

  const config = pageConfig || {};

  const { data: pastResults = [] } = useQuery({
    queryKey: ['backtest-results'],
    queryFn: () => base44.entities.BacktestResult.list('-created_date', 10),
  });

  const saveMutation = useMutation({
    mutationFn: (result) => base44.entities.BacktestResult.create(result),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backtest-results'] }),
  });

  const handleRunBacktest = async (config) => {
    setIsRunning(true);
    const result = await runBacktestSimulation(config);
    setCurrentResult(result);
    saveMutation.mutate(result);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketTicker />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{config.pageTitle}</h1>
            <p className="text-slate-400">{config.pageSubtitle}</p>
          </div>
        </motion.div>

        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="new" className="data-[state=active]:bg-purple-600">
              <FlaskConical className="w-4 h-4 ml-2" />
              {config.newTestTab}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
              <History className="w-4 h-4 ml-2" />
              {config.historyTab} ({pastResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <BacktestForm onRunBacktest={handleRunBacktest} isLoading={isRunning} />
              </div>
              
              <div className="lg:col-span-2">
                {isRunning ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center rounded-2xl bg-slate-800/50 border border-slate-700/50 p-12"
                  >
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{config.runningTitle}</h3>
                    <p className="text-slate-400">{config.runningSubtitle}</p>
                  </motion.div>
                ) : currentResult ? (
                  <BacktestResults result={currentResult} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center rounded-2xl bg-slate-800/50 border border-slate-700/50 p-12">
                    <FlaskConical className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{config.emptyTitle}</h3>
                    <p className="text-slate-400 text-center">{config.emptySubtitle}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            {pastResults.length === 0 ? (
              <div className="text-center py-20">
                <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{config.emptyHistoryTitle}</h3>
                <p className="text-slate-400">{config.emptyHistorySubtitle}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastResults.map((result, i) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setCurrentResult(result)}
                    className="cursor-pointer rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{result.strategy_name}</h4>
                        <p className="text-sm text-slate-400">
                          {result.currency_pair} | {result.start_date} - {result.end_date}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className={`text-lg font-bold ${
                          result.final_balance > result.initial_balance ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {((result.final_balance - result.initial_balance) / result.initial_balance * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-slate-500">{result.total_trades} {config.tradesLabel}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
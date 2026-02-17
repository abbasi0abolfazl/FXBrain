import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, History, LineChart, RefreshCw } from 'lucide-react';
import MarketTicker from '@/components/dashboard/MarketTicker';
import TradeForm from '@/components/paper-trading/TradeForm';
import PortfolioStats from '@/components/paper-trading/PortfolioStats';
import OpenPositions from '@/components/paper-trading/OpenPositions';
import TradingViewChart from '@/components/charts/TradingViewChart';
import { AppAPI } from '@/components/api/appDataService';

export default function PaperTrading() {
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const queryClient = useQueryClient();

  const { data: pageConfig } = useQuery({
    queryKey: ['paper-trading-config'],
    queryFn: () => AppAPI.paperTrading.getConfig(),
  });

  const config = pageConfig || {};

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: portfolios = [] } = useQuery({
    queryKey: ['paper-portfolio'],
    queryFn: async () => {
      const results = await base44.entities.PaperPortfolio.filter({ created_by: user?.email });
      return results;
    },
    enabled: !!user,
  });

  const portfolio = portfolios[0];

  const { data: trades = [] } = useQuery({
    queryKey: ['paper-trades'],
    queryFn: () => base44.entities.PaperTrade.filter({ created_by: user?.email }, '-created_date', 100),
    enabled: !!user,
  });

  // Create portfolio if not exists
  const createPortfolioMutation = useMutation({
    mutationFn: () => base44.entities.PaperPortfolio.create({
      balance: 10000,
      initial_balance: 10000,
      total_trades: 0,
      winning_trades: 0,
      total_profit: 0,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paper-portfolio'] }),
  });

  useEffect(() => {
    if (user && portfolios.length === 0) {
      createPortfolioMutation.mutate();
    }
  }, [user, portfolios]);

  const createTradeMutation = useMutation({
    mutationFn: (data) => base44.entities.PaperTrade.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paper-trades'] }),
  });

  const closeTradeMutation = useMutation({
    mutationFn: async ({ trade, exitPrice, pnl }) => {
      await base44.entities.PaperTrade.update(trade.id, {
        status: 'closed',
        exit_price: exitPrice,
        profit_loss: pnl,
        closed_at: new Date().toISOString(),
      });
      
      if (portfolio) {
        await base44.entities.PaperPortfolio.update(portfolio.id, {
          balance: portfolio.balance + pnl,
          total_profit: portfolio.total_profit + pnl,
          total_trades: portfolio.total_trades + 1,
          winning_trades: pnl > 0 ? portfolio.winning_trades + 1 : portfolio.winning_trades,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paper-trades'] });
      queryClient.invalidateQueries({ queryKey: ['paper-portfolio'] });
    },
  });

  const resetPortfolioMutation = useMutation({
    mutationFn: async () => {
      if (portfolio) {
        await base44.entities.PaperPortfolio.update(portfolio.id, {
          balance: 10000,
          total_trades: 0,
          winning_trades: 0,
          total_profit: 0,
        });
      }
      // Close all open trades
      const openTrades = trades.filter(t => t.status === 'open');
      for (const trade of openTrades) {
        await base44.entities.PaperTrade.update(trade.id, { status: 'cancelled' });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paper-trades'] });
      queryClient.invalidateQueries({ queryKey: ['paper-portfolio'] });
    },
  });

  const closedTrades = trades.filter(t => t.status === 'closed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketTicker />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{config.pageTitle}</h1>
              <p className="text-slate-400">{config.pageSubtitle}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => resetPortfolioMutation.mutate()}
            className="border-slate-700 text-slate-400 hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            {config.resetButton}
          </Button>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <PortfolioStats portfolio={portfolio} trades={trades} />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart & Positions */}
          <div className="lg:col-span-2 space-y-6">
            {/* TradingView Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">{config.chartLabel} {selectedPair}</h3>
              </div>
              <TradingViewChart symbol={selectedPair} height={400} />
            </motion.div>

            {/* Tabs for Positions & History */}
            <Tabs defaultValue="positions">
              <TabsList className="bg-slate-800/50 border border-slate-700/50">
                <TabsTrigger value="positions" className="data-[state=active]:bg-cyan-600">
                  <Wallet className="w-4 h-4 ml-2" />
                  {config.positionsTab}
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-cyan-600">
                  <History className="w-4 h-4 ml-2" />
                  {config.historyTab} ({closedTrades.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="positions" className="mt-4">
                <OpenPositions 
                  trades={trades} 
                  onCloseTrade={(trade, exitPrice, pnl) => closeTradeMutation.mutate({ trade, exitPrice, pnl })} 
                />
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {closedTrades.length === 0 ? (
                  <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8 text-center">
                    <p className="text-slate-500">{config.noHistoryMessage}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto max-h-80">
                      <table className="w-full">
                        <thead className="bg-slate-800/50 sticky top-0">
                          <tr>
                            <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">{config.tableHeaders?.pair}</th>
                            <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">{config.tableHeaders?.type}</th>
                            <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">{config.tableHeaders?.entry}</th>
                            <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">{config.tableHeaders?.exit}</th>
                            <th className="py-3 px-4 text-right text-sm font-medium text-slate-400">{config.tableHeaders?.pnl}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {closedTrades.slice(0, 20).map((trade, i) => (
                            <tr key={trade.id} className="border-b border-slate-700/50">
                              <td className="py-3 px-4 text-white">{trade.currency_pair}</td>
                              <td className="py-3 px-4">
                                <span className={trade.trade_type === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                                  {trade.trade_type === 'buy' ? config.tradeTypes?.buy : config.tradeTypes?.sell}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-white font-mono">{trade.entry_price}</td>
                              <td className="py-3 px-4 text-white font-mono">{trade.exit_price}</td>
                              <td className={`py-3 px-4 font-mono font-semibold ${trade.profit_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {trade.profit_loss >= 0 ? '+' : ''}{trade.profit_loss?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Trade Form */}
          <div>
            <TradeForm 
              portfolio={portfolio}
              onSubmit={createTradeMutation.mutateAsync}
              isLoading={createTradeMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
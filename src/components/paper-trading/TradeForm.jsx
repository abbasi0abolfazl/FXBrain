import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';

const currencyPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];

const mockPrices = {
  EURUSD: 1.0852,
  GBPUSD: 1.2648,
  USDJPY: 149.85,
  XAUUSD: 2045.50,
  BTCUSD: 43250,
};

export default function TradeForm({ portfolio, onSubmit, isLoading }) {
  const [tradeType, setTradeType] = useState('buy');
  const [form, setForm] = useState({
    currency_pair: 'EURUSD',
    quantity: 0.1,
    take_profit: '',
    stop_loss: '',
  });

  const currentPrice = mockPrices[form.currency_pair] || 1.0;
  const estimatedValue = form.quantity * currentPrice * 100000; // Standard lot

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      trade_type: tradeType,
      entry_price: currentPrice,
      take_profit: form.take_profit ? parseFloat(form.take_profit) : null,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
      status: 'open',
    });
    setForm({ ...form, take_profit: '', stop_loss: '' });
  };

  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5">
      <h3 className="text-lg font-bold text-white mb-4">ثبت معامله جدید</h3>
      
      <Tabs value={tradeType} onValueChange={setTradeType} className="mb-4">
        <TabsList className="grid grid-cols-2 bg-slate-900/50">
          <TabsTrigger value="buy" className="data-[state=active]:bg-emerald-600">
            <TrendingUp className="w-4 h-4 ml-2" />
            خرید
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">
            <TrendingDown className="w-4 h-4 ml-2" />
            فروش
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-400">جفت ارز</Label>
          <Select value={form.currency_pair} onValueChange={(v) => setForm(p => ({ ...p, currency_pair: v }))}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {currencyPairs.map(p => (
                <SelectItem key={p} value={p} className="text-white hover:bg-slate-700">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 text-center">
          <p className="text-xs text-slate-500 mb-1">قیمت فعلی</p>
          <p className="text-2xl font-mono font-bold text-white">{currentPrice}</p>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">حجم (لات)</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={form.quantity}
            onChange={(e) => setForm(p => ({ ...p, quantity: parseFloat(e.target.value) }))}
            className="bg-slate-900 border-slate-700 text-white"
          />
          <p className="text-xs text-slate-500">ارزش تقریبی: ${estimatedValue.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-emerald-400">حد سود (TP)</Label>
            <Input
              type="number"
              step="any"
              value={form.take_profit}
              onChange={(e) => setForm(p => ({ ...p, take_profit: e.target.value }))}
              placeholder={tradeType === 'buy' ? (currentPrice * 1.01).toFixed(5) : (currentPrice * 0.99).toFixed(5)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-red-400">حد ضرر (SL)</Label>
            <Input
              type="number"
              step="any"
              value={form.stop_loss}
              onChange={(e) => setForm(p => ({ ...p, stop_loss: e.target.value }))}
              placeholder={tradeType === 'buy' ? (currentPrice * 0.99).toFixed(5) : (currentPrice * 1.01).toFixed(5)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">موجودی:</span>
            <span className="text-white font-mono">${portfolio?.balance?.toLocaleString() || '10,000'}</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !portfolio || estimatedValue > (portfolio?.balance || 0) * 10}
          className={`w-full py-6 ${tradeType === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
        >
          {tradeType === 'buy' ? 'ثبت خرید' : 'ثبت فروش'}
        </Button>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Settings } from 'lucide-react';

const strategies = [
  { value: 'ma_crossover', label: 'تقاطع میانگین متحرک' },
  { value: 'rsi_oversold', label: 'RSI اشباع فروش' },
  { value: 'breakout', label: 'شکست سطوح' },
  { value: 'mean_reversion', label: 'بازگشت به میانگین' },
];

const currencyPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];

export default function BacktestForm({ onRunBacktest, isLoading }) {
  const [config, setConfig] = useState({
    strategy: 'ma_crossover',
    currency_pair: 'EURUSD',
    start_date: '2025-01-01',
    end_date: '2026-01-31',
    initial_balance: 10000,
    risk_per_trade: 2,
    take_profit: 50,
    stop_loss: 25,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunBacktest(config);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
          <Settings className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">تنظیمات بک‌تست</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-slate-400">استراتژی</Label>
          <Select value={config.strategy} onValueChange={(v) => setConfig(p => ({ ...p, strategy: v }))}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {strategies.map(s => (
                <SelectItem key={s.value} value={s.value} className="text-white hover:bg-slate-700">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">جفت ارز</Label>
          <Select value={config.currency_pair} onValueChange={(v) => setConfig(p => ({ ...p, currency_pair: v }))}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {currencyPairs.map(p => (
                <SelectItem key={p} value={p} className="text-white hover:bg-slate-700">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">تاریخ شروع</Label>
          <Input
            type="date"
            value={config.start_date}
            onChange={(e) => setConfig(p => ({ ...p, start_date: e.target.value }))}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">تاریخ پایان</Label>
          <Input
            type="date"
            value={config.end_date}
            onChange={(e) => setConfig(p => ({ ...p, end_date: e.target.value }))}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">سرمایه اولیه ($)</Label>
          <Input
            type="number"
            value={config.initial_balance}
            onChange={(e) => setConfig(p => ({ ...p, initial_balance: parseFloat(e.target.value) }))}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">ریسک هر معامله: {config.risk_per_trade}%</Label>
          <Slider
            value={[config.risk_per_trade]}
            onValueChange={(v) => setConfig(p => ({ ...p, risk_per_trade: v[0] }))}
            min={0.5}
            max={10}
            step={0.5}
            className="py-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">حد سود (پیپ)</Label>
          <Input
            type="number"
            value={config.take_profit}
            onChange={(e) => setConfig(p => ({ ...p, take_profit: parseFloat(e.target.value) }))}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">حد ضرر (پیپ)</Label>
          <Input
            type="number"
            value={config.stop_loss}
            onChange={(e) => setConfig(p => ({ ...p, stop_loss: parseFloat(e.target.value) }))}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6"
      >
        <Play className="w-5 h-5 ml-2" />
        {isLoading ? 'در حال اجرا...' : 'اجرای بک‌تست'}
      </Button>
    </form>
  );
}
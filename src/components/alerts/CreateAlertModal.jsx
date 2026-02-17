import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Globe, MessageCircle, Mail, Loader2 } from 'lucide-react';

const channelConfig = [
  { id: 'web', icon: Globe, label: 'وب', color: 'blue' },
  { id: 'telegram', icon: MessageCircle, label: 'تلگرام', color: 'sky' },
  { id: 'email', icon: Mail, label: 'ایمیل', color: 'amber' },
];

// جفت ارزهای پیش‌فرض در صورت نبودن conditions
const defaultCurrencyPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'USD/CHF', 'AUD/USD', 'BTC/USD'];

// شرایط پیش‌فرض
const defaultConditionTypes = [
  { value: 'price_above', label: 'قیمت بالاتر از', has_value: true },
  { value: 'price_below', label: 'قیمت پایین‌تر از', has_value: true },
  { value: 'rsi_above', label: 'RSI بالاتر از', has_value: true },
  { value: 'rsi_below', label: 'RSI پایین‌تر از', has_value: true },
  { value: 'news_high_impact', label: 'خبر با تأثیر بالا', has_value: false }
];

export default function CreateAlertModal({ open, onClose, onSubmit, conditions }) {
  const [form, setForm] = useState({
    name: '',
    currency_pair: '',
    condition_type: '',
    condition_value: '',
    notification_channels: ['web'],
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setForm({
        name: '',
        currency_pair: '',
        condition_type: '',
        condition_value: '',
        notification_channels: ['web'],
      });
    }
  }, [open]);

  const handleChannelToggle = (channel) => {
    setForm(prev => ({
      ...prev,
      notification_channels: prev.notification_channels.includes(channel)
        ? prev.notification_channels.filter(c => c !== channel)
        : [...prev.notification_channels, channel]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = {
      ...form,
      condition_value: form.condition_value ? parseFloat(form.condition_value) : null,
      is_active: true,
    };
    
    // اگر شرط news_high_impact باشد، مقدار را حذف می‌کنیم
    if (form.condition_type === 'news_high_impact') {
      delete submitData.condition_value;
    }
    
    try {
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  // بررسی اینکه آیا شرط انتخاب شده نیاز به مقدار دارد
  const conditionTypes = conditions?.condition_types || defaultConditionTypes;
  const currencyPairs = conditions?.currency_pairs || defaultCurrencyPairs;
  const selectedCondition = conditionTypes.find(c => c.value === form.condition_type);
  const needsValue = selectedCondition?.has_value !== false;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-slate-900 to-slate-950 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/30">
              <Bell className="w-5 h-5" />
            </div>
            ایجاد هشدار جدید
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Alert Name */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-sm">نام هشدار</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: شکست مقاومت یورو"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500/50 transition-colors"
              required
            />
          </div>

          {/* Currency Pair */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-sm">جفت ارز</Label>
            <Select
              value={form.currency_pair}
              onValueChange={(v) => setForm(prev => ({ ...prev, currency_pair: v }))}
              required
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="انتخاب جفت ارز" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                {currencyPairs.map(pair => (
                  <SelectItem 
                    key={pair} 
                    value={pair} 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* نمایش تعداد جفت ارزها برای دیباگ */}
            {currencyPairs.length === 0 && (
              <p className="text-xs text-red-400 mt-1">هیچ جفت ارزی یافت نشد</p>
            )}
          </div>

          {/* Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">شرط</Label>
              <Select
                value={form.condition_type}
                onValueChange={(v) => {
                  setForm(prev => ({ 
                    ...prev, 
                    condition_type: v,
                    condition_value: '' // Reset value when condition changes
                  }));
                }}
                required
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="انتخاب شرط" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {conditionTypes.map(c => (
                    <SelectItem 
                      key={c.value} 
                      value={c.value} 
                      className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Value (if needed) */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm">مقدار</Label>
              <Input
                type="number"
                step="any"
                value={form.condition_value}
                onChange={(e) => setForm(prev => ({ ...prev, condition_value: e.target.value }))}
                placeholder={form.condition_type === 'rsi_above' ? '70' : form.condition_type === 'price_above' ? '1.0850' : ''}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                disabled={!needsValue}
                required={needsValue && form.condition_type !== ''}
              />
              {!needsValue && form.condition_type === 'news_high_impact' && (
                <p className="text-xs text-slate-500 mt-1">برای اخبار مهم نیاز به مقدار نیست</p>
              )}
            </div>
          </div>

          {/* Notification Channels */}
          <div className="space-y-3">
            <Label className="text-slate-400 text-sm">کانال‌های اعلان</Label>
            <div className="flex flex-wrap gap-3">
              {channelConfig.map(channel => {
                const isSelected = form.notification_channels.includes(channel.id);
                const Icon = channel.icon;
                
                return (
                  <label
                    key={channel.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? `bg-${channel.color}-500/20 border-${channel.color}-500/50 text-${channel.color}-400`
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleChannelToggle(channel.id)}
                      className="hidden"
                    />
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{channel.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                'ایجاد هشدار'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
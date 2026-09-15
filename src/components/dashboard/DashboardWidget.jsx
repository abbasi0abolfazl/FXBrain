import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardWidget({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onRemove, 
  dragHandleProps,
  isEditing,
  minHeight = 300
}) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.1 }}
      className={`h-full rounded-lg bg-slate-900 border overflow-hidden ${
        isEditing 
          ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
          : 'border-slate-800'
      }`}
      style={{ minHeight }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {isEditing && dragHandleProps && (
            <div 
              {...dragHandleProps} 
              className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-slate-500" />
            </div>
          )}
          
          {Icon && (
            <div className="text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
        
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(id)}
            className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Widget Content */}
      <div className="p-4 h-[calc(100%-57px)] overflow-auto custom-scrollbar">
        {children}
      </div>
    </motion.div>
  );
}

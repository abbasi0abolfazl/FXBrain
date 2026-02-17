import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`h-full rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border overflow-hidden ${
        isEditing 
          ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
          : 'border-slate-700/50 hover:border-slate-600/50'
      } transition-all duration-300`}
      style={{ minHeight }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/30">
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
            <div className={`p-1.5 rounded-lg ${
              isEditing 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-slate-700/50 text-slate-400'
            }`}>
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
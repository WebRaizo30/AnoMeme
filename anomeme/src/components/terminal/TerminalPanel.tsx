"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TerminalPanelProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  status?: 'active' | 'warning' | 'error' | 'idle';
  isLive?: boolean;
}

export function TerminalPanel({ 
  title, 
  icon, 
  className, 
  children, 
  status = 'idle',
  isLive = false 
}: TerminalPanelProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 glow-green';
      case 'warning': return 'text-orange-400 glow-orange';
      case 'error': return 'text-red-400 glow-red';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card className={cn(
      "terminal-panel h-full flex flex-col relative scan-lines",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn("w-4 h-4", getStatusColor(status))}>
              {icon}
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-300 terminal-text">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs text-red-400 font-bold">LIVE</span>
            </div>
          )}
          <Badge 
            variant="outline" 
            className={cn("text-xs font-mono", getStatusBadge(status))}
          >
            {status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-hidden">
        <div className="h-full overflow-auto custom-scrollbar">
          {children}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1 border-t border-gray-700/50 bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-mono">
            {currentTime || '--:--:--'}
          </span>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", {
              'bg-green-500 pulse-glow': status === 'active',
              'bg-orange-500 pulse-glow': status === 'warning',
              'bg-red-500 pulse-glow': status === 'error',
              'bg-gray-500': status === 'idle'
            })}></div>
            <span className="font-mono">{status}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

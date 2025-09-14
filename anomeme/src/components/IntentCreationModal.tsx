"use client";

import React, { useState } from 'react';
// import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { 
  X, 
  // Zap, 
  Target, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Clock,
  MessageSquare,
  Users
  // Sparkles,
  // ArrowRight,
  // ChevronLeft,
  // ChevronRight
} from 'lucide-react';
import { TriggerCondition, TradingAction, RiskParameters } from '@/services/anomaService';

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface IntentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIntent: (intentData: {
    trigger_conditions: TriggerCondition;
    trading_action: TradingAction;
    risk_parameters: RiskParameters;
  }) => Promise<void>;
  isCreating: boolean;
}

export function IntentCreationModal({ 
  isOpen, 
  onClose, 
  onCreateIntent, 
  isCreating 
}: IntentCreationModalProps) {
  const [step, setStep] = useState(1);
  const [triggerConditions, setTriggerConditions] = useState<TriggerCondition>({
    type: 'social_signal',
    platform: 'x',
    keyword: '',
    sentiment: 'positive',
    confidence_threshold: 0.8
  });
  
  const [tradingAction, setTradingAction] = useState<TradingAction>({
    type: 'buy',
    token: 'ANOMA',
    amount: '100',
    from_token: 'ETH',
    slippage: '1%'
  });
  
  const [riskParameters, setRiskParameters] = useState<RiskParameters>({
    stop_loss: '10%',
    take_profit: '25%',
    max_gas: '0.01 ETH',
    mev_protection: true,
    max_slippage: '2%'
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleNext = () => {
    setErrors([]);
    
    if (step === 1) {
      // Validate trigger conditions
      const stepErrors: string[] = [];
      if (!triggerConditions.keyword?.trim()) {
        stepErrors.push('Keyword is required');
      }
      if (triggerConditions.type === 'social_signal' && !triggerConditions.user?.trim()) {
        stepErrors.push('Social user/source is required');
      }
      
      if (stepErrors.length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    
    if (step === 2) {
      // Validate trading action
      const stepErrors: string[] = [];
      if (!tradingAction.token?.trim()) {
        stepErrors.push('Target token is required');
      }
      if (!tradingAction.amount || parseFloat(tradingAction.amount) <= 0) {
        stepErrors.push('Valid amount is required');
      }
      
      if (stepErrors.length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrors([]);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setErrors([]);
    
    try {
      await onCreateIntent({
        trigger_conditions: triggerConditions,
        trading_action: tradingAction,
        risk_parameters: riskParameters
      });
      
      // Reset form and close
      setStep(1);
      setTriggerConditions({
        type: 'social_signal',
        platform: 'x',
        keyword: '',
        sentiment: 'positive',
        confidence_threshold: 0.8
      });
      onClose();
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to create intent']);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Compact Section Header */}
      <div className="border-l-4 border-red-500 pl-3 bg-gradient-to-r from-red-500/10 to-transparent py-2">
        <h3 className="text-lg font-bold text-white font-mono tracking-wide flex items-center gap-2">
          <span className="text-red-500">01.</span> TRIGGER CONDITIONS
        </h3>
        <p className="text-xs text-gray-400 font-mono mt-1">Define when your intent activates</p>
      </div>

      {/* Modern Trigger Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
          <label className="text-sm font-bold text-white font-mono uppercase tracking-wider">SELECT TRIGGER TYPE</label>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { 
              type: 'social_signal', 
              label: 'Social Signal', 
              icon: XIcon,
              description: 'React to influencer posts',
              popular: true
            },
            { 
              type: 'price_movement', 
              label: 'Price Alert', 
              icon: TrendingUp,
              description: 'Trigger on price levels'
            },
            { 
              type: 'time_based', 
              label: 'Time Based', 
              icon: Clock,
              description: 'Execute at specific times'
            }
          ].map(({ type, label, icon: Icon, description, popular }) => (
            <button
              key={type}
              onClick={() => setTriggerConditions(prev => ({ ...prev, type: type as 'social_signal' | 'price_movement' }))}
              className={`relative p-4 border-2 transition-all duration-300 group ${
                triggerConditions.type === type
                  ? 'border-red-500 bg-gradient-to-br from-red-500/20 to-red-900/10 shadow-lg shadow-red-500/25'
                  : 'border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-red-500/50 hover:shadow-md hover:shadow-red-500/10'
              }`}
            >
              {popular && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-1 py-0.5 font-bold font-mono">
                  ★
                </div>
              )}
              
              {/* Icon Container */}
              <div className={`w-10 h-10 mx-auto mb-2 border-2 flex items-center justify-center transition-all ${
                triggerConditions.type === type
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-600 bg-gray-800/50 group-hover:border-red-500/50'
              }`}>
                <Icon className={`w-5 h-5 transition-all ${
                  triggerConditions.type === type ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400/70'
                }`} />
              </div>
              
              {/* Label */}
              <div className="text-center">
                <div className={`font-bold text-sm font-mono tracking-wide transition-all ${
                  triggerConditions.type === type ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {label}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{description}</div>
              </div>

              {/* Selection Indicator */}
              {triggerConditions.type === type && (
                <div className="absolute bottom-1 right-1">
                  <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Social Signal Configuration */}
      {triggerConditions.type === 'social_signal' && (
        <div className="space-y-3 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-black/50 p-4">
          <div className="flex items-center gap-3 border-b-2 border-blue-500/30 pb-2">
            <div className="w-6 h-6 border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center">
              <XIcon className="w-3 h-3 text-blue-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-mono tracking-wider">SOCIAL CONFIGURATION</h4>
              <p className="text-xs text-blue-400/70 font-mono">Configure social signal monitoring</p>
            </div>
          </div>

          {/* Modern Platform Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 animate-pulse"></div>
              <label className="text-sm font-bold text-white font-mono uppercase tracking-wider">PLATFORM</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { platform: 'x', label: 'X', icon: XIcon },
                { platform: 'telegram', label: 'Telegram', icon: MessageSquare },
                { platform: 'discord', label: 'Discord', icon: Users }
              ].map(({ platform, label, icon: Icon }) => (
                <button
                  key={platform}
                  onClick={() => setTriggerConditions(prev => ({ ...prev, platform: platform as 'x' | 'telegram' | 'discord' }))}
                  className={`p-3 border-2 transition-all text-center group ${
                    triggerConditions.platform === platform
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                      : 'border-gray-600 bg-gray-800/50 hover:border-blue-500/50 hover:bg-blue-500/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 transition-all ${
                    triggerConditions.platform === platform ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400/70'
                  }`} />
                  <div className={`text-sm font-bold font-mono ${
                    triggerConditions.platform === platform ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {label}
                  </div>
                  {triggerConditions.platform === platform && (
                    <div className="w-2 h-2 bg-blue-500 mx-auto mt-1 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Modern Input Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 animate-pulse"></div>
              <label className="text-sm font-bold text-white font-mono uppercase tracking-wider">PARAMETERS</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-400 font-mono uppercase tracking-wider">INFLUENCER</label>
                <div className="relative">
                  <input
                    type="text"
                    value={triggerConditions.user || ''}
                    onChange={(e) => setTriggerConditions(prev => ({ ...prev, user: e.target.value }))}
                    placeholder="@elonmusk"
                    className="w-full p-3 bg-black border-2 border-gray-600 text-white text-sm font-mono focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-500/25 placeholder:text-gray-500 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-mono">
                    @username
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-400 font-mono uppercase tracking-wider">KEYWORD</label>
                <div className="relative">
                  <input
                    type="text"
                    value={triggerConditions.keyword || ''}
                    onChange={(e) => setTriggerConditions(prev => ({ ...prev, keyword: e.target.value }))}
                    placeholder="ANOMA"
                    className="w-full p-3 bg-black border-2 border-gray-600 text-white text-sm font-mono focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-500/25 placeholder:text-gray-500 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                    <div className="w-2 h-2 bg-blue-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-400 font-mono uppercase tracking-wider">SENTIMENT</label>
                <select
                  value={triggerConditions.sentiment}
                  onChange={(e) => setTriggerConditions(prev => ({ ...prev, sentiment: e.target.value as 'positive' | 'negative' | 'neutral' }))}
                  className="w-full p-3 bg-black border-2 border-gray-600 text-white text-sm font-mono focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-500/25 transition-all"
                >
                  <option value="positive" className="bg-black">🚀 POSITIVE (BULLISH)</option>
                  <option value="negative" className="bg-black">📉 NEGATIVE (BEARISH)</option>
                  <option value="neutral" className="bg-black">⚪ ANY SENTIMENT</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-400 font-mono uppercase tracking-wider">AI CONFIDENCE</label>
                <select
                  value={triggerConditions.confidence_threshold}
                  onChange={(e) => setTriggerConditions(prev => ({ ...prev, confidence_threshold: parseFloat(e.target.value) }))}
                  className="w-full p-3 bg-black border-2 border-gray-600 text-white text-sm font-mono focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-500/25 transition-all"
                >
                  <option value={0.6} className="bg-black">⚡ 60% - FAST & FLEXIBLE</option>
                  <option value={0.8} className="bg-black">🎯 80% - BALANCED</option>
                  <option value={0.9} className="bg-black">💎 90% - ULTRA PRECISE</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Movement Fields */}
      {triggerConditions.type === 'price_movement' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Token Address</label>
            <input
              type="text"
              value={triggerConditions.token_address || ''}
              onChange={(e) => setTriggerConditions(prev => ({ ...prev, token_address: e.target.value }))}
              placeholder="0x..."
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Price Threshold</label>
            <input
              type="number"
              value={triggerConditions.price_threshold || ''}
              onChange={(e) => setTriggerConditions(prev => ({ ...prev, price_threshold: parseFloat(e.target.value) }))}
              placeholder="1.50"
              step="0.01"
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Terminal Header */}
      <div className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-black p-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500/30 border border-blue-500 flex items-center justify-center">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-400 font-mono">&gt; TRADING_ACTION.configure()</h3>
            <p className="text-xs text-gray-400 font-mono">Define execution parameters</p>
          </div>
        </div>
      </div>

      {/* Action Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-blue-400">[1]</span> SELECT OPERATION TYPE
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'buy', label: 'BUY_ORDER', icon: '↗', color: 'green' },
            { type: 'sell', label: 'SELL_ORDER', icon: '↙', color: 'red' }
          ].map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => setTradingAction(prev => ({ ...prev, type: type as 'buy' | 'sell' }))}
              className={`relative p-3 border-2 transition-all font-mono text-sm group ${
                tradingAction.type === type
                  ? `border-${color}-500 bg-${color}-500/20 text-${color}-400 shadow-lg shadow-${color}-500/25`
                  : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{label}</span>
                <span className="text-lg">{icon}</span>
              </div>
              {tradingAction.type === type && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-black animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Token Configuration */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-blue-400">[2]</span> TOKEN CONFIGURATION
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">TARGET_TOKEN:</label>
            <input
              type="text"
              value={tradingAction.token}
              onChange={(e) => setTradingAction(prev => ({ ...prev, token: e.target.value }))}
              placeholder="ANOMA"
              className="w-full p-2 bg-black border-2 border-gray-600 text-green-400 text-sm font-mono focus:border-blue-500 focus:outline-none tracking-wider"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">FROM_TOKEN:</label>
            <select
              value={tradingAction.from_token}
              onChange={(e) => setTradingAction(prev => ({ ...prev, from_token: e.target.value }))}
              className="w-full p-2 bg-black border-2 border-gray-600 text-green-400 text-sm font-mono focus:border-blue-500 focus:outline-none"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="WBTC">WBTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Amount and Slippage */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-blue-400">[3]</span> EXECUTION PARAMETERS
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">AMOUNT ({tradingAction.from_token}):</label>
            <div className="relative">
              <input
                type="number"
                value={tradingAction.amount}
                onChange={(e) => setTradingAction(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.1"
                step="0.001"
                className="w-full p-2 bg-black border-2 border-gray-600 text-green-400 text-sm font-mono focus:border-blue-500 focus:outline-none tracking-wider pr-8"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                {tradingAction.from_token}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">MAX_SLIPPAGE:</label>
            <select
              value={tradingAction.slippage}
              onChange={(e) => setTradingAction(prev => ({ ...prev, slippage: e.target.value }))}
              className="w-full p-2 bg-black border-2 border-gray-600 text-green-400 text-sm font-mono focus:border-blue-500 focus:outline-none"
            >
              <option value="0.5%">0.5% • STRICT</option>
              <option value="1%">1.0% • NORMAL</option>
              <option value="2%">2.0% • FLEXIBLE</option>
              <option value="5%">5.0% • HIGH_RISK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trading Summary Terminal Display */}
      <div className="border-2 border-gray-600 bg-black p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-gray-400">&gt; TRADE_PREVIEW:</span>
        </div>
        <div className="space-y-1 text-xs font-mono">
          <div className="text-gray-400">
            OPERATION: <span className={`${tradingAction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              {tradingAction.type?.toUpperCase() || 'NOT_SET'}
            </span>
          </div>
          <div className="text-gray-400">
            TRADE_PAIR: <span className="text-blue-400">{tradingAction.from_token || 'ETH'}</span> 
            <span className="text-white"> → </span>
            <span className="text-green-400">{tradingAction.token || 'TARGET'}</span>
          </div>
          <div className="text-gray-400">
            AMOUNT: <span className="text-yellow-400">{tradingAction.amount || '0.0'} {tradingAction.from_token || 'ETH'}</span>
          </div>
          <div className="text-gray-400">
            SLIPPAGE: <span className="text-orange-400">{tradingAction.slippage || 'NOT_SET'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {/* Terminal Header */}
      <div className="border-2 border-red-500/30 bg-gradient-to-r from-red-900/20 to-black p-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-red-500/30 border border-red-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-400 font-mono">&gt; RISK_MANAGEMENT.configure()</h3>
            <p className="text-xs text-gray-400 font-mono">Define protection protocols</p>
          </div>
        </div>
      </div>

      {/* Stop Loss & Take Profit */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-red-400">[1]</span> PROFIT/LOSS BOUNDARIES
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">STOP_LOSS_THRESHOLD:</label>
            <select
              value={riskParameters.stop_loss}
              onChange={(e) => setRiskParameters(prev => ({ ...prev, stop_loss: e.target.value }))}
              className="w-full p-2 bg-black border-2 border-gray-600 text-red-400 text-sm font-mono focus:border-red-500 focus:outline-none"
            >
              <option value="5%">-5% • CONSERVATIVE</option>
              <option value="10%">-10% • MODERATE</option>
              <option value="15%">-15% • AGGRESSIVE</option>
              <option value="20%">-20% • HIGH_RISK</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">TAKE_PROFIT_TARGET:</label>
            <select
              value={riskParameters.take_profit}
              onChange={(e) => setRiskParameters(prev => ({ ...prev, take_profit: e.target.value }))}
              className="w-full p-2 bg-black border-2 border-gray-600 text-green-400 text-sm font-mono focus:border-green-500 focus:outline-none"
            >
              <option value="15%">+15% • CONSERVATIVE</option>
              <option value="25%">+25% • MODERATE</option>
              <option value="50%">+50% • AGGRESSIVE</option>
              <option value="100%">+100% • MOONSHOT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gas and Slippage Limits */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-red-400">[2]</span> EXECUTION LIMITS
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">MAX_GAS_FEE:</label>
            <select
              value={riskParameters.max_gas}
              onChange={(e) => setRiskParameters(prev => ({ ...prev, max_gas: e.target.value }))}
              className="w-full p-2 bg-black border-2 border-gray-600 text-orange-400 text-sm font-mono focus:border-orange-500 focus:outline-none"
            >
              <option value="0.005 ETH">0.005 ETH • LOW</option>
              <option value="0.01 ETH">0.01 ETH • NORMAL</option>
              <option value="0.02 ETH">0.02 ETH • HIGH</option>
              <option value="0.05 ETH">0.05 ETH • PREMIUM</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400">MAX_SLIPPAGE:</label>
            <select
              value={riskParameters.max_slippage}
              onChange={(e) => setRiskParameters(prev => ({ ...prev, max_slippage: e.target.value }))}
              className="w-full p-2 bg-black border-2 border-gray-600 text-yellow-400 text-sm font-mono focus:border-yellow-500 focus:outline-none"
            >
              <option value="1%">1% • STRICT</option>
              <option value="2%">2% • NORMAL</option>
              <option value="5%">5% • FLEXIBLE</option>
            </select>
          </div>
        </div>
      </div>

      {/* MEV Protection Toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-red-400">[3]</span> PROTECTION PROTOCOLS
        </div>
        <div className="border-2 border-gray-600 bg-black p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-sm font-mono text-blue-400">MEV_PROTECTION</span>
                <p className="text-xs text-gray-500 font-mono">Anti-sandwich protection via Anoma solvers</p>
              </div>
            </div>
            <button
              onClick={() => setRiskParameters(prev => ({ ...prev, mev_protection: !prev.mev_protection }))}
              className={`relative w-14 h-6 border-2 transition-all ${
                riskParameters.mev_protection 
                  ? 'bg-blue-500/20 border-blue-500' 
                  : 'bg-gray-800 border-gray-600'
              }`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${
                riskParameters.mev_protection ? 'left-8' : 'left-0.5'
              }`} />
              <span className={`absolute right-1 top-0.5 text-xs font-mono ${
                riskParameters.mev_protection ? 'text-green-400' : 'text-red-400'
              }`}>
                {riskParameters.mev_protection ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Intent Summary Terminal Display */}
      <div className="border-2 border-green-600 bg-black p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-green-400">&gt; INTENT_SUMMARY:</span>
        </div>
        <div className="space-y-1 text-xs font-mono">
          <div className="text-gray-400">
            TRIGGER: <span className="text-blue-400">{triggerConditions.user || '@USER'}</span> mentions 
            <span className="text-green-400"> &quot;{triggerConditions.keyword || 'KEYWORD'}&quot;</span> on 
            <span className="text-purple-400"> {triggerConditions.platform || 'PLATFORM'}</span>
          </div>
          <div className="text-gray-400">
            ACTION: <span className={`${tradingAction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              {tradingAction.type?.toUpperCase() || 'NOT_SET'}
            </span> <span className="text-yellow-400">{tradingAction.amount || '0.0'} {tradingAction.from_token || 'ETH'}</span> → 
            <span className="text-green-400"> {tradingAction.token || 'TARGET'}</span>
          </div>
          <div className="text-gray-400">
            RISK: <span className="text-red-400">{riskParameters.stop_loss || 'N/A'} STOP</span> | 
            <span className="text-green-400"> {riskParameters.take_profit || 'N/A'} PROFIT</span> | 
            <span className="text-blue-400"> MEV_{riskParameters.mev_protection ? 'ON' : 'OFF'}</span>
          </div>
          <div className="text-gray-400">
            LIMITS: <span className="text-orange-400">GAS≤{riskParameters.max_gas || 'N/A'}</span> | 
            <span className="text-yellow-400"> SLIP≤{riskParameters.max_slippage || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black border-2 border-red-500 shadow-2xl shadow-red-500/20 relative overflow-hidden">
        {/* Terminal-style scanlines effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}></div>
        {/* Compact Terminal Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-black p-3 border-b-2 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Terminal Window Controls */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 opacity-60"></div>
                <div className="w-3 h-3 bg-yellow-500 opacity-60"></div>
                <div className="w-3 h-3 bg-green-500 opacity-60"></div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(stepNum => (
                    <div key={stepNum} className={`w-8 h-1 transition-all ${
                      step >= stepNum 
                        ? 'bg-red-500 glow-red' 
                        : 'bg-gray-700'
                    }`}></div>
                  ))}
                </div>
                <div className="border-l border-gray-600 pl-3">
                  <h2 className="text-base font-bold text-white font-mono tracking-wider">
                    <span className="text-red-500">&gt;</span> CREATE INTENT
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">STEP {step} OF 3 • ANOMEME TERMINAL</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10 p-2"
              disabled={isCreating}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Please fix the following errors:</span>
              </div>
              <ul className="text-xs text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Compact Terminal Footer */}
        <div className="relative bg-gradient-to-r from-black to-gray-900 p-3 border-t-2 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isCreating}
                  className="bg-gray-800 border-2 border-gray-600 text-gray-300 hover:border-red-500 hover:text-white font-bold font-mono px-4 py-2 text-sm transition-all hover:shadow-lg hover:shadow-red-500/25"
                >
&larr; BACK
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                  <div className="w-2 h-2 bg-gray-600 animate-pulse"></div>
                  STEP {step} OF 3
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 font-mono">
                ANOMEME TERMINAL v1.0
              </div>
              
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-2 border-blue-500 text-white font-bold font-mono px-6 py-2 text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
CONTINUE &rarr;
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-2 border-green-500 text-white font-bold font-mono px-6 py-2 text-sm transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin"></div>
                      CREATING...
                    </div>
                  ) : (
                    '✓ CREATE INTENT'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

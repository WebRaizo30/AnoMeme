"use client";

import React, { useState } from 'react';
// import { TerminalPanel } from '@/components/terminal/TerminalPanel';
import { IntentDashboard } from '@/components/IntentDashboard';
import { useWallet } from '@/hooks/useWallet';
import { SettingsModal } from '@/components/SettingsModal';
import { Tooltip } from '@/components/ui/tooltip';
import { DepositModal } from '@/components/DepositModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { useApiTest } from '@/hooks/useApiTest';
import { 
  Activity, 
  // TrendingUp, 
  Wallet, 
  Settings, 
  LogOut,
  Signal,
  // DollarSign,
  Shield
  // Users,
  // Brain,
  // Zap
} from 'lucide-react';

export function TerminalInterface() {
  console.log('🚀 TerminalInterface component rendered!');
  
  const { user, disconnectWallet, getShortAddress } = useWallet();
  const { isConnected: apiConnected } = useApiTest();
  // const [activeTab, setActiveTab] = useState('intents');
  const [showSettings, setShowSettings] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Deposit handler
  const handleDeposit = async (amount: number, token: string) => {
    setIsDepositing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Depositing ${amount} ${token}`);
      // Here you would call your actual deposit API
    } catch (error) {
      console.error('Deposit failed:', error);
      throw error;
    } finally {
      setIsDepositing(false);
    }
  };

  // Withdraw handler
  const handleWithdraw = async (amount: number, token: string) => {
    setIsWithdrawing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Withdrawing ${amount} ${token}`);
      // Here you would call your actual withdraw API
    } catch (error) {
      console.error('Withdraw failed:', error);
      throw error;
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Mock data for demonstration
  const [socialSignals] = useState([
    {
      id: '1',
      platform: 'X',
      user: '@cryptowhale',
      content: 'ANOMA looking bullish! 🚀 Time to load up',
      sentiment: 'positive' as const,
      confidence: 0.89,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    },
    {
      id: '2', 
      platform: 'Telegram',
      user: 'MemeTrader',
      content: 'ANOMA breaking resistance, next stop moon',
      sentiment: 'positive' as const,
      confidence: 0.76,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      platform: 'Discord',
      user: 'AnomaHolder',
      content: 'Might be time to take some profits on ANOMA',
      sentiment: 'negative' as const,
      confidence: 0.65,
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    }
  ]);

  const [portfolio] = useState({
    totalValue: '$1,247.83',
    anoma: {
      balance: '1,500 ANOMA',
      value: '$847.50',
      change24h: '+12.5%'
    },
    eth: {
      balance: '0.15 ETH',
      value: '$400.33',
      change24h: '-2.3%'
    },
    usdc: {
      balance: '0.00 USDC',
      value: '$0.00',
      change24h: '0.0%'
    }
  });

  // const [activeIntents] = useState([
  //   {
  //     id: '1',
  //     type: 'Buy Order',
  //     token: 'ANOMA',
  //     trigger: 'Social sentiment > 0.8',
  //     amount: '100 USDC',
  //     status: 'monitoring'
  //   },
  //   {
  //     id: '2',
  //     type: 'Sell Order', 
  //     token: 'ANOMA',
  //     trigger: 'Price > $0.75',
  //     amount: '500 ANOMA',
  //     status: 'active'
  //   }
  // ]);

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getSentimentColor = (sentiment: string, confidence: number) => {
    const alpha = confidence;
    switch (sentiment) {
      case 'positive': return `rgba(34, 197, 94, ${alpha})`;
      case 'negative': return `rgba(239, 68, 68, ${alpha})`;
      default: return `rgba(156, 163, 175, ${alpha})`;
    }
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* Terminal Scanlines Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
      }}></div>
      
      {/* Terminal Header */}
      <div 
        data-tutorial="monitor-execution"
        className="relative h-16 bg-gradient-to-r from-gray-900 to-black border-b-2 border-red-500 flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-6">
          {/* Terminal Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 opacity-60"></div>
            <div className="w-3 h-3 bg-yellow-500 opacity-60"></div>
            <div className="w-3 h-3 bg-green-500 opacity-60"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-mono tracking-wider">
                <span className="text-red-500">&gt;</span> ANOMEME_TERMINAL
              </h1>
              <p className="text-xs text-gray-400 font-mono">SOCIAL_TRADING_INTERFACE v1.0</p>
            </div>
          </div>
          
          {/* Terminal Status Indicators */}
          <div className="flex items-center gap-4 border-l border-gray-600 pl-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${apiConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-400 font-mono">
                API_{apiConnected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-400 font-mono">MEV_SHIELD_ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Terminal User Info & Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right border-r border-gray-600 pr-4">
            <div className="text-sm font-bold text-white font-mono">{user?.wallet_address ? getShortAddress() : 'UNKNOWN_USER'}</div>
            <div className="text-xs text-gray-400 font-mono">WALLET_CONNECTED</div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content="Configure terminal settings and preferences" position="bottom">
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-gray-600 hover:border-white/40 font-mono text-xs"
              >
                <Settings className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Disconnect wallet and exit terminal" position="bottom">
              <button 
                onClick={disconnectWallet}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-red-500/20 hover:border-red-500/40 font-mono text-xs"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div 
        data-tutorial="welcome"
        className="h-[calc(100vh-64px)] flex"
      >
        {/* Left Sidebar - Social Signals Terminal */}
        <div 
          data-tutorial="social-signals"
          className="w-80 border-r-2 border-red-500/30 p-4"
        >
          <div className="h-full bg-black border-2 border-red-500/30 relative overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-red-900/20 to-black p-3 border-b-2 border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500/30 border border-red-500 flex items-center justify-center">
                    <Signal className="w-4 h-4 text-red-400" />
                  </div>
                  <Tooltip content="Real-time social signals from X, Telegram, and Discord for sentiment analysis" position="right">
                    <div>
                      <h3 className="text-sm font-bold text-red-400 font-mono">&gt; SOCIAL_SIGNALS</h3>
                      <p className="text-xs text-gray-400 font-mono">REAL_TIME_MONITORING</p>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
                  <span className="text-xs text-red-400 font-mono">LIVE</span>
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-3 space-y-3 h-[calc(100%-60px)] overflow-y-auto anoma-sidebar-scroll">
              {socialSignals.map((signal) => (
                <div key={signal.id} className="border-2 border-gray-600 bg-black p-3 hover:border-red-500/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400 font-mono">{signal.platform.toUpperCase()}</span>
                      <span className="text-xs text-gray-400 font-mono">@{signal.user}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{formatTimeAgo(signal.timestamp)}</span>
                  </div>
                  <p className="text-xs text-white/80 mb-2 font-mono leading-relaxed">{signal.content}</p>
                  <div className="flex items-center justify-between">
                    <div 
                      className="px-2 py-1 text-xs font-bold border-2 font-mono"
                      style={{ 
                        backgroundColor: getSentimentColor(signal.sentiment, 0.1),
                        borderColor: getSentimentColor(signal.sentiment, 0.5),
                        color: getSentimentColor(signal.sentiment, 1)
                      }}
                    >
                      {signal.sentiment.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      CONF: {(signal.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black to-gray-900 p-2 border-t-2 border-red-500/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">ANOMEME</span>
                  <div className="w-1 h-1 bg-gray-500"></div>
                  <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                  <span className="text-green-400">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Intent Dashboard */}
        <div 
          data-tutorial="intent-dashboard"
          className="flex-1 p-4"
        >
          <div className="h-full">
            <IntentDashboard />
          </div>
        </div>

        {/* Right Sidebar - Portfolio Terminal */}
        <div 
          data-tutorial="portfolio-panel"
          className="w-80 border-l-2 border-red-500/30 p-4"
        >
          <div className="h-full bg-black border-2 border-red-500/30 relative overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-green-900/20 to-black p-3 border-b-2 border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500/30 border border-green-500 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-green-400" />
                  </div>
                  <Tooltip content="Portfolio management and asset tracking with real-time valuations" position="left">
                    <div>
                      <h3 className="text-sm font-bold text-green-400 font-mono">&gt; PORTFOLIO</h3>
                      <p className="text-xs text-gray-400 font-mono">ASSET_MANAGEMENT</p>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-3 space-y-3 h-[calc(100%-60px)] overflow-y-auto anoma-sidebar-scroll">
              {/* Total Value Terminal Display */}
              <Tooltip content="Click to deposit funds using ETH, USDC, or other supported tokens for trading" position="left">
                <div 
                  data-tutorial="deposit-funds"
                  onClick={() => setShowDeposit(true)}
                  className="border-2 border-green-600 bg-black p-3 cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-green-400">&gt; TOTAL_VALUE:</span>
                  </div>
                  <div className="text-lg font-bold text-green-400 font-mono">{portfolio.totalValue}</div>
                </div>
              </Tooltip>

              {/* Holdings Terminal Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Tooltip content="Current asset holdings and their individual values" position="left">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                      <span className="text-green-400">[1]</span> HOLDINGS
                    </div>
                  </Tooltip>
                  <Tooltip content="Withdraw funds from your portfolio" position="left">
                    <button
                      onClick={() => setShowWithdraw(true)}
                      className="px-3 py-1 text-xs font-mono text-red-400 border border-red-500/40 hover:bg-red-500/20 transition-all rounded"
                    >
                      WITHDRAW
                    </button>
                  </Tooltip>
                </div>
                
                <div className="border-2 border-gray-600 bg-black p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-mono">ANOMA</span>
                    <span className="text-sm text-green-400 font-mono">{portfolio.anoma.change24h}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono space-y-1">
                    <div>BALANCE: {portfolio.anoma.balance}</div>
                    <div>VALUE: {portfolio.anoma.value}</div>
                  </div>
                </div>

                <div className="border-2 border-gray-600 bg-black p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-mono">ETH</span>
                    <span className="text-sm text-red-400 font-mono">{portfolio.eth.change24h}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono space-y-1">
                    <div>BALANCE: {portfolio.eth.balance}</div>
                    <div>VALUE: {portfolio.eth.value}</div>
                  </div>
                </div>
              </div>

              {/* Risk Monitor Terminal Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <span className="text-blue-400">[2]</span> RISK_MONITOR
                </div>
                <div className="border-2 border-blue-600 bg-black p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono text-blue-400">PROTECTION_STATUS</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono space-y-1">
                    <div>RISK_LEVEL: <span className="text-yellow-400">MODERATE</span></div>
                    <div>MAX_POSITION: <span className="text-orange-400">25%</span></div>
                    <div>STOP_LOSS: <span className="text-red-400">10%</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black to-gray-900 p-2 border-t-2 border-red-500/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">ANOMEME</span>
                  <div className="w-1 h-1 bg-gray-500"></div>
                  <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                  <span className="text-green-400">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
        onDeposit={handleDeposit}
        isDepositing={isDepositing}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onWithdraw={handleWithdraw}
        isWithdrawing={isWithdrawing}
        portfolio={portfolio}
      />
    </div>
  );
}

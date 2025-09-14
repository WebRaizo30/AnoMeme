"use client";

import React, { useState } from 'react';
import { Zap, Shield, Activity } from 'lucide-react';
import { useApiTest } from '@/hooks/useApiTest';
import { WalletModal } from '@/components/WalletModal';
import { useWallet } from '@/hooks/useWallet';

export function LandingPage() {
  const { isConnected, isLoading, error } = useApiTest();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { connectWallet, isConnecting, isConnected: walletConnected } = useWallet();

  const handleConnectClick = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (walletId: string) => {
    console.log('🔗 Selected wallet:', walletId);
    console.log('🔄 Before connectWallet - walletConnected:', walletConnected);
    
    await connectWallet();
    
    console.log('✅ After connectWallet - walletConnected:', walletConnected);
    setShowWalletModal(false);
  };

  // Wallet connection is handled by useWallet hook
  // The Home component will automatically re-render when isConnected changes

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-px h-40 bg-red-500/20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-40 h-px bg-red-500/20 animate-pulse animation-delay-500"></div>
        <div className="absolute bottom-32 left-1/3 w-px h-32 bg-white/10 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-32 h-px bg-white/10 animate-pulse animation-delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-12 animate-fade-in-up">
        
        {/* Logo Section */}
        <div className="space-y-6">
          <div className="text-6xl font-black anoma-text tracking-wider animate-subtle-glow">
            ANOMEME
          </div>
          <div className="text-lg text-white/70 font-mono font-light tracking-wide animate-stagger-1">
            SOCIAL INTENT TERMINAL
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="flex items-center justify-center gap-12 text-white/60 animate-stagger-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            <span className="text-sm font-mono">Live Signals</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-mono">MEV Shield</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-mono">Intent Engine</span>
          </div>
        </div>

        {/* Connect Button */}
        <div className="space-y-4 animate-stagger-3">
          <button
            onClick={handleConnectClick}
            disabled={isConnecting}
            className="group relative px-12 py-4 bg-red-500/20 border-2 border-red-500/40 text-white font-bold text-lg tracking-wide transition-all duration-300 hover:bg-red-500/30 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-500/20 animate-bg-pulse disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse animation-delay-500"></div>
            </div>
            
            {/* Hover Effect Lines */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-border-scan"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-border-scan animation-delay-500"></div>
            </div>
          </button>
          
          <p className="text-white/40 text-sm font-mono animate-data-flicker text-center">
            Experience the future of memecoin trading
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center gap-8 animate-stagger-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-status-blink' : isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs text-white/50 font-mono">
              {isLoading ? 'Connecting...' : isConnected ? 'API Connected' : 'API Disconnected'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-status-blink animation-delay-200"></div>
            <span className="text-xs text-white/50 font-mono">MEV Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-status-blink animation-delay-400"></div>
            <span className="text-xs text-white/50 font-mono">Intent Engine</span>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/20 p-4 rounded">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <div className="w-8 h-px bg-red-500/30"></div>
        <div className="w-px h-8 bg-red-500/30"></div>
      </div>
      <div className="absolute top-8 right-8 flex flex-col gap-2">
        <div className="w-8 h-px bg-red-500/30 ml-auto"></div>
        <div className="w-px h-8 bg-red-500/30 ml-auto"></div>
      </div>
      <div className="absolute bottom-8 left-8 flex flex-col gap-2">
        <div className="w-px h-8 bg-white/20"></div>
        <div className="w-8 h-px bg-white/20"></div>
      </div>
      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <div className="w-px h-8 bg-white/20 ml-auto"></div>
        <div className="w-8 h-px bg-white/20"></div>
      </div>

      {/* Powered by Anoma */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
          <span>Powered by</span>
          <span className="text-red-500 font-semibold animate-subtle-glow">ANOMA</span>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletSelect={handleWalletSelect}
        isConnecting={isConnecting}
      />
    </div>
  );
}

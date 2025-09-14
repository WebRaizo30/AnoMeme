"use client";

import React from 'react';
import { X, Wallet, ExternalLink, Shield, Zap } from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
  isRecommended?: boolean;
  comingSoon?: boolean;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (walletId: string) => void;
  isConnecting: boolean;
}

const walletOptions: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Most popular Ethereum wallet',
    icon: '🦊',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Secure DeFi wallet for Ethereum',
    icon: '🔵',
    isAvailable: true
  },
  {
    id: 'trust-wallet',
    name: 'Trust Wallet',
    description: 'Multi-chain EVM compatible wallet',
    icon: '🛡️',
    isAvailable: true
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    description: 'Ethereum wallet for DeFi',
    icon: '🌈',
    isAvailable: true
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect to 300+ EVM wallets',
    icon: '🔗',
    isAvailable: true
  },
  {
    id: 'brave-wallet',
    name: 'Brave Wallet',
    description: 'Built-in browser wallet',
    icon: '🦁',
    isAvailable: false,
    comingSoon: true
  }
];

export function WalletModal({ isOpen, onClose, onWalletSelect, isConnecting }: WalletModalProps) {
  if (!isOpen) return null;

  const handleWalletClick = (walletId: string, isAvailable: boolean) => {
    if (!isAvailable || isConnecting) return;
    onWalletSelect(walletId);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md bg-black border border-white/20 terminal-panel animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-full flex items-center justify-center border border-red-500/40">
              <Wallet className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold anoma-text">Connect Wallet</h2>
              <p className="text-xs text-white/50 font-mono">Choose your preferred wallet</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            disabled={isConnecting}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/20 hover:border-white/40 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto anoma-modal-scroll">
          {walletOptions.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id, wallet.isAvailable)}
              className={`
                relative p-4 border transition-all duration-200 cursor-pointer group
                ${wallet.isAvailable 
                  ? 'border-white/20 hover:border-red-500/40 hover:bg-red-500/5' 
                  : 'border-white/10 bg-black/30 cursor-not-allowed'
                }
                ${isConnecting ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              {/* Recommended Badge */}
              {wallet.isRecommended && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold border border-red-400">
                  RECOMMENDED
                </div>
              )}

              {/* Coming Soon Badge */}
              {wallet.comingSoon && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-600 text-white text-xs font-bold border border-yellow-500">
                  COMING SOON
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Wallet Icon */}
                <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center text-2xl">
                  {wallet.icon}
                </div>

                {/* Wallet Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold ${wallet.isAvailable ? 'text-white' : 'text-white/40'}`}>
                      {wallet.name}
                    </h3>
                    {wallet.isAvailable && (
                      <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-red-400 transition-colors" />
                    )}
                  </div>
                  <p className={`text-sm font-mono ${wallet.isAvailable ? 'text-white/60' : 'text-white/30'}`}>
                    {wallet.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-center gap-1">
                  {wallet.isAvailable ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-mono">Ready</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-yellow-400 font-mono">Soon</span>
                    </>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              {wallet.isAvailable && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-4">
          {/* Token Notice */}
          <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20">
            <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-mono text-blue-300">
              <div className="font-bold mb-1">About ANOMA</div>
              <div className="text-blue-400/80">
                ANOMA is an Ethereum-based token. Connect any EVM-compatible wallet to trade ANOMA and other memecoins securely.
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-white/50">
              <Zap className="w-3 h-3 text-green-400" />
              <span className="font-mono">EVM Compatible</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="font-mono">MEV Protection</span>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="text-center pt-2 border-t border-white/5">
            <p className="text-white/40 text-xs font-mono text-center">
              Demo mode: Simulated wallet connection for testing
            </p>
          </div>
        </div>

        {/* Loading Overlay */}
        {isConnecting && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-white font-mono text-sm">Connecting to wallet...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

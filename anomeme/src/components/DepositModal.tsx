"use client";

import React, { useState } from 'react';
import { X, ArrowDown, CheckCircle } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, token: string) => Promise<void>;
  isDepositing: boolean;
}

const SUPPORTED_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', balance: '2.45', price: '$2,650.00' },
  { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00', price: '$1.00' },
  { symbol: 'USDT', name: 'Tether', balance: '850.50', price: '$1.00' },
  { symbol: 'ANOMA', name: 'Anoma', balance: '5,000.00', price: '$0.565' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.00', price: '$67,500.00' },
  { symbol: 'SOL', name: 'Solana', balance: '0.00', price: '$195.50' },
  { symbol: 'MATIC', name: 'Polygon', balance: '0.00', price: '$0.85' },
  { symbol: 'AVAX', name: 'Avalanche', balance: '0.00', price: '$35.20' }
];

export function DepositModal({ isOpen, onClose, onDeposit, isDepositing }: DepositModalProps) {
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setStep('confirm');
    try {
      await onDeposit(parseFloat(amount), selectedToken);
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('select');
        setAmount('');
      }, 2000);
    } catch (error) {
      console.error('Deposit failed:', error);
      setStep('select');
    }
  };

  if (!isOpen) return null;

  const selectedTokenData = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-green-500/30 rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/20 to-black p-4 border-b-2 border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white font-mono">DEPOSIT_FUNDS</h2>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse animation-delay-500"></div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-gray-600 hover:border-white/40 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-6">
              {/* Token Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-mono">SELECT_TOKEN</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {SUPPORTED_TOKENS.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => setSelectedToken(token.symbol)}
                      className={`w-full p-3 border-2 rounded transition-all ${
                        selectedToken === token.symbol
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-gray-600 bg-black text-gray-400 hover:border-gray-500 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="text-sm font-bold font-mono">{token.symbol}</div>
                          <div className="text-xs text-gray-500 font-mono">{token.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono">{token.price}</div>
                          <div className="text-xs text-gray-500 font-mono">Balance: {token.balance}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-mono">AMOUNT</h3>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 bg-black border-2 border-gray-600 text-white rounded font-mono text-lg focus:border-green-500 focus:outline-none"
                    step="0.000001"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono text-sm">
                    {selectedToken}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Balance: {selectedTokenData?.balance} {selectedToken}
                </div>
              </div>

              {/* Deposit Button */}
              <button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0 || isDepositing}
                className="w-full py-3 bg-green-500/20 border-2 border-green-500 text-green-400 font-mono font-bold rounded hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDepositing ? 'PROCESSING...' : 'DEPOSIT_FUNDS'}
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
                <ArrowDown className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">CONFIRMING_DEPOSIT</h3>
                <p className="text-sm text-gray-400 font-mono mt-2">
                  Processing {amount} {selectedToken} deposit...
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">DEPOSIT_SUCCESSFUL</h3>
                <p className="text-sm text-gray-400 font-mono mt-2">
                  {amount} {selectedToken} has been deposited to your portfolio
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-black to-green-900/20 p-4 border-t-2 border-green-500/30">
          <div className="text-xs text-gray-400 font-mono text-center">
            Funds are deposited to your Anoma wallet for trading
          </div>
        </div>
      </div>
    </div>
  );
}

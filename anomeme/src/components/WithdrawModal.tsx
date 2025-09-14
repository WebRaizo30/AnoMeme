"use client";

import React, { useState } from 'react';
import { X, ArrowUp, CheckCircle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, token: string) => Promise<void>;
  isWithdrawing: boolean;
  portfolio: {
    totalValue: string;
    anoma: { balance: string; value: string; change24h: string };
    eth: { balance: string; value: string; change24h: string };
    usdc: { balance: string; value: string; change24h: string };
  };
}

const SUPPORTED_TOKENS = [
  { symbol: 'ANOMA', name: 'Anoma', price: '$0.565' },
  { symbol: 'ETH', name: 'Ethereum', price: '$2,650.00' },
  { symbol: 'USDC', name: 'USD Coin', price: '$1.00' }
];

export function WithdrawModal({ isOpen, onClose, onWithdraw, isWithdrawing, portfolio }: WithdrawModalProps) {
  const [selectedToken, setSelectedToken] = useState('ANOMA');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setStep('confirm');
    try {
      await onWithdraw(parseFloat(amount), selectedToken);
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('select');
        setAmount('');
      }, 2000);
    } catch (error) {
      console.error('Withdraw failed:', error);
      setStep('select');
    }
  };

  if (!isOpen) return null;

  const getTokenBalance = (token: string) => {
    switch (token) {
      case 'ANOMA': return portfolio.anoma.balance;
      case 'ETH': return portfolio.eth.balance;
      case 'USDC': return portfolio.usdc.balance;
      default: return '0.00';
    }
  };

  // const selectedTokenData = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken);
  const maxAmount = parseFloat(getTokenBalance(selectedToken));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-red-500/30 rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/20 to-black p-4 border-b-2 border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white font-mono">WITHDRAW_FUNDS</h2>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse animation-delay-500"></div>
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
                <div className="space-y-2">
                  {SUPPORTED_TOKENS.map((token) => {
                    const balance = getTokenBalance(token.symbol);
                    const hasBalance = parseFloat(balance) > 0;
                    
                    return (
                      <button
                        key={token.symbol}
                        onClick={() => setSelectedToken(token.symbol)}
                        disabled={!hasBalance}
                        className={`w-full p-3 border-2 rounded transition-all ${
                          selectedToken === token.symbol
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : hasBalance
                            ? 'border-gray-600 bg-black text-gray-400 hover:border-gray-500 hover:text-white'
                            : 'border-gray-700 bg-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="text-sm font-bold font-mono">{token.symbol}</div>
                            <div className="text-xs text-gray-500 font-mono">{token.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono">{token.price}</div>
                            <div className="text-sm font-mono">{balance}</div>
                            <div className="text-xs text-gray-500 font-mono">Available</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
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
                    className="w-full p-3 bg-black border-2 border-gray-600 text-white rounded font-mono text-lg focus:border-red-500 focus:outline-none"
                    step="0.000001"
                    min="0"
                    max={maxAmount}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono text-sm">
                    {selectedToken}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Balance: {getTokenBalance(selectedToken)} {selectedToken}</span>
                  <button
                    onClick={() => setAmount(getTokenBalance(selectedToken))}
                    className="text-red-400 hover:text-red-300 underline"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount || isWithdrawing}
                className="w-full py-3 bg-red-500/20 border-2 border-red-500 text-red-400 font-mono font-bold rounded hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWithdrawing ? 'PROCESSING...' : 'WITHDRAW_FUNDS'}
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto">
                <ArrowUp className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">CONFIRMING_WITHDRAWAL</h3>
                <p className="text-sm text-gray-400 font-mono mt-2">
                  Processing {amount} {selectedToken} withdrawal...
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">WITHDRAWAL_SUCCESSFUL</h3>
                <p className="text-sm text-gray-400 font-mono mt-2">
                  {amount} {selectedToken} has been withdrawn to your wallet
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-black to-red-900/20 p-4 border-t-2 border-red-500/30">
          <div className="text-xs text-gray-400 font-mono text-center">
            Funds are withdrawn to your connected wallet
          </div>
        </div>
      </div>
    </div>
  );
}

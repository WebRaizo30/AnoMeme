"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Play, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
  buttonText?: string;
  buttonAction?: () => void;
}

interface TutorialOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Anomeme Revolution!',
    description: 'Welcome to the future of intent-centric trading! Let\'s explore how to use this revolutionary platform step by step.',
    target: '[data-tutorial="welcome"]',
    position: 'top',
    action: 'none'
  },
  {
    id: 'social-signals',
    title: '1. Social Signals Panel',
    description: 'This left panel shows real-time social signals from X, Telegram, and Discord. Monitor sentiment analysis and token mentions to identify trading opportunities.',
    target: '[data-tutorial="social-signals"]',
    position: 'right',
    action: 'none'
  },
  {
    id: 'portfolio-panel',
    title: '2. Portfolio Panel',
    description: 'This right panel displays your total portfolio value and holdings. Monitor your asset balances, performance, and risk levels in real-time.',
    target: '[data-tutorial="portfolio-panel"]',
    position: 'left',
    action: 'none'
  },
  {
    id: 'deposit-funds',
    title: '3. Deposit Funds',
    description: 'Click on the total value section to deposit funds using ETH, USDC, or other supported tokens for trading. This is where you fund your trading activities.',
    target: '[data-tutorial="deposit-funds"]',
    position: 'left',
    action: 'click',
    buttonText: 'Deposit Funds'
  },
  {
    id: 'create-intent',
    title: '4. Create Intent',
    description: 'This button allows you to create automated trading intents based on social signals. Define your trading conditions and let Anoma execute them with MEV protection.',
    target: '[data-tutorial="create-intent"]',
    position: 'bottom',
    action: 'click',
    buttonText: 'Create Intent'
  },
  {
    id: 'intent-dashboard',
    title: '5. Intent Dashboard',
    description: 'This center panel shows all your active intents, their status, and execution history. Monitor your automated trading strategies and their performance.',
    target: '[data-tutorial="intent-dashboard"]',
    position: 'top',
    action: 'none'
  },
  {
    id: 'monitor-execution',
    title: '6. Anoma Integration',
    description: 'Your intents are submitted to the Anoma protocol and executed with MEV protection. The terminal interface provides real-time monitoring of all activities.',
    target: '[data-tutorial="monitor-execution"]',
    position: 'top',
    action: 'none'
  }
];

export function TutorialOverlay({ 
  isActive, 
  onComplete, 
  onSkip, 
  currentStep, 
  onStepChange 
}: TutorialOverlayProps) {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

  const currentTutorialStep = TUTORIAL_STEPS[currentStep];

  useEffect(() => {
    if (!isActive || !currentTutorialStep) return;

    const element = document.querySelector(currentTutorialStep.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      updateHighlightStyle(element);
    }

    // Scroll element into view
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  }, [isActive, currentStep, currentTutorialStep]);

  const updateHighlightStyle = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    setHighlightStyle({
      position: 'absolute',
      left: rect.left + scrollX - 8,
      top: rect.top + scrollY - 8,
      width: rect.width + 16,
      height: rect.height + 16,
      zIndex: 1000,
      pointerEvents: 'none'
    });
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleSkipTutorial = () => {
    onSkip();
  };

  if (!isActive || !currentTutorialStep) return null;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/80 z-[999] pointer-events-auto" />
      
      {/* Highlighted element */}
      {highlightedElement && (
        <div
          className="absolute border-4 border-red-500 rounded-lg animate-pulse"
          style={highlightStyle}
        >
          <div className="absolute inset-0 bg-red-500/20 rounded-lg" />
        </div>
      )}

      {/* Tutorial content */}
      <div className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center">
        <div className="pointer-events-auto max-w-md mx-4">
          <div className="bg-black/95 border-2 border-red-500/40 backdrop-blur-xl rounded-lg p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 border border-red-500 flex items-center justify-center rounded">
                  <Play className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">
                    {currentTutorialStep.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Step {currentStep + 1} / {TUTORIAL_STEPS.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              {currentTutorialStep.description}
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Action button */}
            {currentTutorialStep.buttonText && currentTutorialStep.buttonAction && (
              <div className="mb-6">
                <button
                  onClick={currentTutorialStep.buttonAction}
                  className="w-full bg-red-500/20 border-2 border-red-500/40 text-white font-bold py-3 px-4 rounded transition-all hover:bg-red-500/30 hover:border-red-500/60"
                >
                  {currentTutorialStep.buttonText}
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-mono">Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 text-white hover:bg-red-500/30 transition-colors rounded"
              >
                <span className="text-sm font-mono">
                  {currentStep === TUTORIAL_STEPS.length - 1 ? 'Complete' : 'Next'}
                </span>
                {currentStep === TUTORIAL_STEPS.length - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Skip Tutorial Button */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={handleSkipTutorial}
                className="w-full text-center text-gray-400 hover:text-white text-sm font-mono transition-colors"
              >
                Skip Tutorial and Use Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

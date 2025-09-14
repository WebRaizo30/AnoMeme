"use client";

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { TerminalInterface } from '@/components/TerminalInterface';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { useWallet } from '@/hooks/useWallet';
import { useTutorial } from '@/hooks/useTutorial';

export default function Home() {
  const { isConnected, walletAddress } = useWallet();
  const { 
    isActive: tutorialActive, 
    currentStep, 
    isCompleted: tutorialCompleted,
    startTutorial, 
    completeTutorial, 
    skipTutorial, 
    goToStep 
  } = useTutorial();
  const [mounted, setMounted] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for wallet connection events
  useEffect(() => {
    const handleWalletConnected = (event: CustomEvent) => {
      console.log('🎉 Received wallet-connected event:', event.detail)
      setForceRender(prev => prev + 1); // Force re-render
      
      // Start tutorial automatically after wallet connection
      if (!tutorialCompleted) {
        setTimeout(() => {
          startTutorial();
        }, 1000); // 1 second delay to let UI settle
      }
    }

    window.addEventListener('wallet-connected', handleWalletConnected as EventListener);
    
    return () => {
      window.removeEventListener('wallet-connected', handleWalletConnected as EventListener);
    }
  }, [tutorialCompleted, startTutorial]);

  // Force re-render every 500ms when not connected but wallet in storage (fallback)
  useEffect(() => {
    if (!isConnected && mounted) {
      const storedWallet = localStorage.getItem('anomeme_wallet_address');
      if (storedWallet) {
        console.log('🔄 Wallet in storage but not connected - forcing re-render')
        const interval = setInterval(() => {
          setForceRender(prev => prev + 1);
        }, 500);
        
        const timeout = setTimeout(() => {
          clearInterval(interval);
        }, 2000); // Reduce to 2 seconds since we have event listener
        
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    }
  }, [isConnected, mounted, forceRender]);
  
  // Double check with localStorage as fallback
  const storedWallet = mounted ? localStorage.getItem('anomeme_wallet_address') : null;
  const shouldShowTerminal = isConnected || !!storedWallet;

  console.log('🔍 Home component render:', { 
    isConnected, 
    walletAddress, 
    storedWallet: !!storedWallet,
    shouldShowTerminal,
    mounted,
    forceRender
  });

  // Wait for client-side hydration
  if (!mounted) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="text-white font-mono">Loading...</div>
    </div>;
  }

  // Show terminal interface if connected OR wallet in storage
  if (shouldShowTerminal) {
    console.log('✅ Rendering TerminalInterface - wallet connected!');
    return (
      <>
        <TerminalInterface />
        <TutorialOverlay
          isActive={tutorialActive}
          onComplete={completeTutorial}
          onSkip={skipTutorial}
          currentStep={currentStep}
          onStepChange={goToStep}
        />
      </>
    );
  }

  // Show landing page if wallet not connected
  console.log('❌ Rendering LandingPage - wallet not connected');
  return (
    <>
      <LandingPage />
      <TutorialOverlay
        isActive={tutorialActive}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
        currentStep={currentStep}
        onStepChange={goToStep}
      />
    </>
  );
}
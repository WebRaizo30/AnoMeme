import { useState, useEffect } from 'react';

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  isCompleted: boolean;
  isSkipped: boolean;
}

export function useTutorial() {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isActive: false,
    currentStep: 0,
    isCompleted: false,
    isSkipped: false
  });

  // Check if user has completed tutorial before
  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem('anomeme_tutorial_completed');
    if (hasCompletedTutorial) {
      setTutorialState(prev => ({
        ...prev,
        isCompleted: true
      }));
    }
  }, []);

  const startTutorial = () => {
    setTutorialState({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      isSkipped: false
    });
  };

  const completeTutorial = () => {
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: true,
      isSkipped: false
    });
    
    // Mark as completed in localStorage
    localStorage.setItem('anomeme_tutorial_completed', 'true');
  };

  const skipTutorial = () => {
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      isSkipped: true
    });
  };

  const goToStep = (step: number) => {
    setTutorialState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const resetTutorial = () => {
    setTutorialState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      isSkipped: false
    });
    
    // Remove from localStorage
    localStorage.removeItem('anomeme_tutorial_completed');
  };

  return {
    ...tutorialState,
    startTutorial,
    completeTutorial,
    skipTutorial,
    goToStep,
    resetTutorial
  };
}

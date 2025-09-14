import { useState, useEffect, useCallback } from 'react';
import { anomaService, Intent, IntentRequest, IntentStatus } from '@/services/anomaService';
import { useWallet } from './useWallet';

export function useIntents() {
  const { walletAddress, isConnected } = useWallet();
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadUserIntents = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const response = await anomaService.getUserIntents(walletAddress);
      setIntents(response.intents);
      console.log('📊 Loaded user intents:', response.intents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load intents';
      setError(errorMessage);
      console.error('❌ Failed to load intents:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserIntents();
    } else {
      setIntents([]);
    }
  }, [isConnected, walletAddress, loadUserIntents]);

  const createIntent = async (intentRequest: Omit<IntentRequest, 'user_address'>): Promise<Intent | null> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }

    setCreating(true);
    setError(null);

    try {
      const fullRequest: IntentRequest = {
        ...intentRequest,
        user_address: walletAddress
      };

      const validation = anomaService.validateIntent(fullRequest);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      console.log('�� Creating new intent:', fullRequest);

      const response = await anomaService.createIntent(fullRequest);
      
      if (response.success && response.intent) {
        setIntents(prev => [response.intent!, ...prev]);
        console.log('✅ Intent created and added to list');
        return response.intent;
      } else {
        throw new Error(response.error || 'Failed to create intent');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create intent';
      setError(errorMessage);
      console.error('❌ Intent creation failed:', errorMessage);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const getIntentStatus = async (intentId: string): Promise<IntentStatus | null> => {
    try {
      const status = await anomaService.getIntentStatus(intentId);
      
      setIntents(prev => prev.map(intent => 
        intent.id === intentId 
          ? { ...intent, status: status.anoma_status.status as Intent['status'] }
          : intent
      ));

      return status;
    } catch (err) {
      console.error('❌ Failed to get intent status:', err);
      return null;
    }
  };

  const cancelIntent = async (intentId: string): Promise<boolean> => {
    try {
      const response = await anomaService.cancelIntent(intentId);
      
      if (response.success) {
        setIntents(prev => prev.map(intent => 
          intent.id === intentId 
            ? { ...intent, status: 'cancelled' }
            : intent
        ));
        console.log('🚫 Intent cancelled successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Failed to cancel intent:', err);
      return false;
    }
  };

  const refreshIntents = () => {
    if (walletAddress) {
      loadUserIntents();
    }
  };

  const getActiveIntents = () => intents.filter(intent => intent.status === 'active');
  const getCompletedIntents = () => intents.filter(intent => intent.status === 'completed');
  const getFailedIntents = () => intents.filter(intent => intent.status === 'failed');

  const getIntentStats = () => ({
    total: intents.length,
    active: getActiveIntents().length,
    completed: getCompletedIntents().length,
    failed: getFailedIntents().length
  });

  return {
    intents,
    loading,
    creating,
    error,
    createIntent,
    getIntentStatus,
    cancelIntent,
    refreshIntents,
    activeIntents: getActiveIntents(),
    completedIntents: getCompletedIntents(),
    failedIntents: getFailedIntents(),
    intentStats: getIntentStats(),
    formatIntent: (intent: Intent) => anomaService.formatIntentForDisplay(intent)
  };
}
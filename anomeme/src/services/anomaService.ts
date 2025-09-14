/**
 * Anoma blockchain integration service
 * Handles intent creation, monitoring, and management
 */

// import { apiService } from './apiService';

export interface TriggerCondition {
  type: 'social_signal' | 'price_movement' | 'time_based';
  platform?: 'x' | 'telegram' | 'discord';
  user?: string;
  keyword?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence_threshold?: number;
  price_threshold?: number;
  token_address?: string;
}

export interface TradingAction {
  type: 'buy' | 'sell';
  token: string;
  token_address?: string;
  amount: string;
  from_token?: string;
  slippage?: string;
}

export interface RiskParameters {
  stop_loss: string;
  take_profit: string;
  max_gas: string;
  mev_protection?: boolean;
  max_slippage?: string;
}

export interface IntentRequest {
  user_address: string;
  trigger_conditions: TriggerCondition;
  trading_action: TradingAction;
  risk_parameters: RiskParameters;
}

export interface Intent {
  id: string;
  anoma_intent_id: string;
  user_address: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  trigger_conditions: TriggerCondition;
  trading_action: TradingAction;
  risk_parameters: RiskParameters;
  executions: IntentExecution[];
  created_at: string;
  anoma_metadata?: Record<string, unknown>;
}

export interface IntentExecution {
  block_number: number;
  transaction_hash: string;
  gas_used: string;
  execution_price: string;
  timestamp: string;
}

export interface IntentStatus {
  intent_id: string;
  anoma_status: {
    status: string;
    executions: IntentExecution[];
    solver_bids: number;
    best_execution_path: {
      route: string[];
      estimated_gas: string;
      price_impact: string;
    };
  };
  last_checked: string;
}

class AnomaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://157.180.46.198';
  }

  /**
   * Create a new intent on Anoma blockchain
   */
  async createIntent(intentRequest: IntentRequest): Promise<{
    success: boolean;
    intent?: Intent;
    anoma_response?: Record<string, unknown>;
    error?: string;
  }> {
    try {
      console.log('🎯 Creating Anoma intent:', intentRequest);

      const response = await fetch(`${this.baseUrl}/api/anoma/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(intentRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create intent');
      }

      console.log('✅ Intent created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Intent creation failed:', error);
      throw error;
    }
  }

  /**
   * Get status of a specific intent
   */
  async getIntentStatus(intentId: string): Promise<IntentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/anoma/intents/${intentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch intent status');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get intent status:', error);
      throw error;
    }
  }

  /**
   * Get all intents for a user
   */
  async getUserIntents(userAddress: string): Promise<{ intents: Intent[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/anoma/intents/user/${userAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user intents');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get user intents:', error);
      throw error;
    }
  }

  /**
   * Cancel an active intent
   */
  async cancelIntent(intentId: string): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: Implement cancel endpoint
      console.log('🚫 Cancelling intent:', intentId);
      
      // Mock response for now
      return {
        success: true,
        message: 'Intent cancelled successfully'
      };
    } catch (error) {
      console.error('❌ Failed to cancel intent:', error);
      throw error;
    }
  }

  /**
   * Validate intent parameters before submission
   */
  validateIntent(intentRequest: IntentRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate user address
    if (!intentRequest.user_address || intentRequest.user_address.length < 10) {
      errors.push('Valid user address is required');
    }

    // Validate trigger conditions
    if (!intentRequest.trigger_conditions.type) {
      errors.push('Trigger condition type is required');
    }

    if (intentRequest.trigger_conditions.type === 'social_signal') {
      if (!intentRequest.trigger_conditions.platform) {
        errors.push('Platform is required for social signals');
      }
      if (!intentRequest.trigger_conditions.keyword) {
        errors.push('Keyword is required for social signals');
      }
    }

    // Validate trading action
    if (!intentRequest.trading_action.type || !['buy', 'sell'].includes(intentRequest.trading_action.type)) {
      errors.push('Valid trading action type (buy/sell) is required');
    }

    if (!intentRequest.trading_action.token) {
      errors.push('Target token is required');
    }

    if (!intentRequest.trading_action.amount) {
      errors.push('Trading amount is required');
    }

    // Validate risk parameters
    if (!intentRequest.risk_parameters.stop_loss) {
      errors.push('Stop loss is required');
    }

    if (!intentRequest.risk_parameters.take_profit) {
      errors.push('Take profit is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Format intent for display
   */
  formatIntentForDisplay(intent: Intent): {
    title: string;
    description: string;
    status: string;
    risk: 'low' | 'medium' | 'high';
  } {
    const { trigger_conditions, trading_action } = intent;
    
    const title = `${trading_action.type.toUpperCase()} ${trading_action.token}`;
    
    let description = '';
    if (trigger_conditions.type === 'social_signal') {
      description = `When ${trigger_conditions.user || 'influencer'} mentions "${trigger_conditions.keyword}" positively on ${trigger_conditions.platform}`;
    }

    // Determine risk level
    const stopLossNum = parseFloat(intent.risk_parameters.stop_loss.replace('%', ''));
    let risk: 'low' | 'medium' | 'high' = 'medium';
    if (stopLossNum <= 5) risk = 'low';
    else if (stopLossNum >= 15) risk = 'high';

    return {
      title,
      description,
      status: intent.status,
      risk
    };
  }
}

export const anomaService = new AnomaService();

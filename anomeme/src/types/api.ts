// API Response Types
export interface HealthResponse {
  status: string
  message: string
  timestamp: string
  version: string
  services: {
    database: string
    phoenix: string
    elixir: string
  }
}

export interface SocialSignal {
  id: string
  user: string
  content: string
  timestamp: string
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  tokens_mentioned: string[]
}

export interface SocialSignalsResponse {
  signals: SocialSignal[]
}

export interface SocialSource {
  id: string
  type: string
  handle: string
  active: boolean
  followers?: string
  weight?: number
}

export interface SocialSourcesResponse {
  sources: SocialSource[]
}

export interface Intent {
  id: string
  user_address: string
  trigger_conditions: {
    type: 'social_signal' | 'price_movement'
    source?: string
    keyword?: string
    parameters?: Record<string, unknown>
  }
  trading_action: {
    type: 'buy' | 'sell'
    token: string
    amount: string
  }
  risk_parameters?: {
    stop_loss?: string
    take_profit?: string
    max_slippage?: number
  }
  status: 'active' | 'paused' | 'executed' | 'expired'
  anoma_intent_id?: string
  execution_count: number
  created_at: string
}

export interface IntentsResponse {
  intents: Intent[]
}

export interface CreateIntentRequest {
  user_address: string
  trigger_conditions: {
    type: 'social_signal' | 'price_movement'
    parameters: Record<string, unknown>
  }
  trading_action: {
    type: 'buy' | 'sell'
    token: string
    amount: string
    max_slippage: number
  }
  risk_parameters: {
    stop_loss_percentage: number
    take_profit_percentage: number
    max_investment: string
  }
}

export interface CreateIntentResponse {
  message: string
  intent: Intent
}

export interface RiskAssessment {
  token_address: string
  chain: string
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  risk_factors: {
    contract_verified: boolean
    liquidity_locked: boolean
    holder_distribution: number
    honeypot_detected: boolean
    rug_probability: number
  }
  recommendations: string[]
  assessment_timestamp: string
}

export interface AssessRiskRequest {
  token_address: string
  chain?: string
}

// Authentication Types
export interface ConnectWalletRequest {
  address: string
  signature: string
  message: string
  chain?: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token?: string
  message: string
}

export interface User {
  id: string
  wallet_address: string
  email?: string
  created_at: string
  last_active: string
  risk_profile?: {
    level: 'conservative' | 'moderate' | 'aggressive'
    max_investment_percentage: number
    stop_loss_default: number
  }
  settings?: {
    notifications: boolean
    auto_execute: boolean
    preferred_chains: string[]
  }
}

export interface VerifySignatureRequest {
  address: string
  signature: string
  message: string
}

// API Error Response
export interface ApiError {
  error: string
  message?: string
  details?: Record<string, unknown>
}

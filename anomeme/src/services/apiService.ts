import {
  HealthResponse,
  SocialSignalsResponse,
  SocialSourcesResponse,
  IntentsResponse,
  CreateIntentRequest,
  CreateIntentResponse,
  RiskAssessment,
  AssessRiskRequest,
  ApiError,
  Intent,
  ConnectWalletRequest,
  AuthResponse,
  VerifySignatureRequest,
  User
} from '@/types/api'

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://157.180.46.198/api'
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      ...options
    }

    try {
      console.log('🔍 Making request to:', url, 'with config:', config)
      const response = await fetch(url, config)
      
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}`,
          message: response.statusText
        }))
        throw new Error(errorData.message || errorData.error)
      }

      const data = await response.json()
      console.log('✅ Response data:', data)
      return data
    } catch (error) {
      console.error('❌ Request failed:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown API error occurred')
    }
  }

  // Authentication
  async connectWallet(walletData: ConnectWalletRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/connect-wallet', {
      method: 'POST',
      body: JSON.stringify(walletData)
    })
  }

  async verifySignature(signatureData: VerifySignatureRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/verify-signature', {
      method: 'POST',
      body: JSON.stringify(signatureData)
    })
  }

  async getUserProfile(userAddress: string): Promise<User> {
    return this.request<User>(`/auth/user/${userAddress}`)
  }

  // Health Check
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health')
  }

  // Social Signals
  async getSocialSignals(): Promise<SocialSignalsResponse> {
    return this.request<SocialSignalsResponse>('/social/signals')
  }

  async getSocialSources(): Promise<SocialSourcesResponse> {
    return this.request<SocialSourcesResponse>('/social/sources')
  }

  // Intents Management
  async getIntents(userAddress?: string): Promise<IntentsResponse> {
    const query = userAddress ? `?user_address=${userAddress}` : ''
    return this.request<IntentsResponse>(`/intents${query}`)
  }

  async getIntent(id: string): Promise<Intent> {
    return this.request<Intent>(`/intents/${id}`)
  }

  async createIntent(intentData: CreateIntentRequest): Promise<CreateIntentResponse> {
    return this.request<CreateIntentResponse>('/intents', {
      method: 'POST',
      body: JSON.stringify(intentData)
    })
  }

  // Risk Assessment
  async assessRisk(riskData: AssessRiskRequest): Promise<RiskAssessment> {
    return this.request<RiskAssessment>('/risk/assess', {
      method: 'POST',
      body: JSON.stringify(riskData)
    })
  }

  // Utility Methods
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.getHealth()
      console.log('✅ API Health Check:', health)
      return true
    } catch (error) {
      console.error('❌ API Connection failed:', error)
      return false
    }
  }

  getBaseUrl(): string {
    return this.baseUrl
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url
  }
}

// Singleton instance
export const apiService = new ApiService()

// Export the class for testing
export default ApiService

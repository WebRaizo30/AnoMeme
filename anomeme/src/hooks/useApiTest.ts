import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/services/apiService'

export function useApiTest() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const testConnection = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const connected = await apiService.testConnection()
      setIsConnected(connected)
      
      if (connected) {
        console.log('✅ API Connection successful')
        // Test a few endpoints
        try {
          const health = await apiService.getHealth()
          console.log('✅ Health check:', health)
          
          const signals = await apiService.getSocialSignals()
          console.log('✅ Social signals:', signals.signals.length, 'signals')
          
          const intents = await apiService.getIntents()
          console.log('✅ Intents:', intents.intents.length, 'intents')
        } catch (endpointError) {
          console.warn('⚠️ Some endpoints failed:', endpointError)
          // Still consider connected if health check worked
        }
      } else {
        setError('Backend server not running (localhost:4000)')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage.includes('fetch')) {
        setError('Cannot reach backend server - check localhost:4000')
      } else {
        setError(`API Error: ${errorMessage}`)
      }
      console.error('❌ API Connection failed:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    testConnection()
  }, [testConnection])

  return {
    isConnected,
    isLoading,
    error,
    testConnection
  }
}

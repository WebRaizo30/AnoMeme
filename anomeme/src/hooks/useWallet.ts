import { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'
import { User } from '@/types/api'

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected on mount (only once)
  useEffect(() => {
    let mounted = true;
    
    const initializeWallet = async () => {
      if (!mounted) return;
      
      const storedAddress = localStorage.getItem('anomeme_wallet_address');
      console.log('🔍 Initial wallet check:', storedAddress);
      
      if (storedAddress) {
        setWalletAddress(storedAddress);
        setIsConnected(true);
        console.log('✅ Wallet restored from storage');
      }
    };
    
    initializeWallet();
    
    return () => {
      mounted = false;
    };
  }, [])


  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // For demo purposes, we'll simulate wallet connection
      // In a real app, you'd integrate with actual wallet providers like MetaMask, Keplr, etc.
      
      // Generate a demo wallet address for Anoma
      const demoAddress = `anoma1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      const demoMessage = `ANOMEME Login Request\nAddress: ${demoAddress}\nTimestamp: ${Date.now()}`
      const demoSignature = `0x${Math.random().toString(16).substring(2, 130)}` // 128 chars hex

      console.log('🔗 Connecting to Anoma wallet...')
      console.log('📝 Message to sign:', demoMessage)

      // Call backend to connect wallet
      const authResponse = await apiService.connectWallet({
        address: demoAddress,
        signature: demoSignature,
        message: demoMessage,
        chain: 'anoma'
      })

      if (authResponse.success) {
        console.log('🔄 Setting wallet connection state...')
        
        // Store connection first
        localStorage.setItem('anomeme_wallet_address', demoAddress)
        localStorage.setItem('anomeme_user', JSON.stringify(authResponse.user))
        
        // Update state immediately + trigger custom event
        setWalletAddress(demoAddress)
        setUser(authResponse.user)
        setIsConnected(true)
        
        console.log('✅ Wallet connected successfully!')
        console.log('👤 User:', authResponse.user)
        
        // Trigger custom event to force Home component re-render
        setTimeout(() => {
          console.log('🚀 Dispatching wallet-connected event')
          window.dispatchEvent(new CustomEvent('wallet-connected', {
            detail: { address: demoAddress, user: authResponse.user }
          }))
        }, 100)
      } else {
        throw new Error('Wallet connection failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wallet connection failed'
      setError(errorMessage)
      console.error('❌ Wallet connection failed:', errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress(null)
    setUser(null)
    setError(null)
    
    // Clear stored data
    localStorage.removeItem('anomeme_wallet_address')
    localStorage.removeItem('anomeme_user')
    
    console.log('🔌 Wallet disconnected')
  }

  const getShortAddress = (address: string | null): string => {
    if (!address) return ''
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
  }

  // Debug state changes
  useEffect(() => {
    console.log('🔍 useWallet state changed:', { 
      isConnected, 
      walletAddress,
      hasWallet: !!walletAddress 
    });
  }, [isConnected, walletAddress]);

  return {
    isConnected,
    isConnecting,
    user,
    walletAddress,
    error,
    connectWallet,
    disconnectWallet,
    getShortAddress: () => getShortAddress(walletAddress)
  }
}

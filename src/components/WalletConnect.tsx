import { useState } from 'react'
import * as freighterApi from '@stellar/freighter-api'
import type { StellarWallet } from '../types'

interface WalletConnectProps {
  wallet: StellarWallet | null
  onConnect: (wallet: StellarWallet) => void
  onDisconnect: () => void
}

export default function WalletConnect({
  wallet,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleConnect = async () => {
    setLoading(true)
    setError('')

    try {
      // Check if Freighter is installed and connected
      const isConnected = await freighterApi.isConnected()
      if (!isConnected.isConnected) {
        setError(
          'Freighter wallet not found. Please install the Freighter extension: https://www.freighter.app/'
        )
        setLoading(false)
        return
      }

      // Request access to the wallet - this shows a popup the user must approve
      const result = await freighterApi.requestAccess()
      
      // Check if access was granted - result has 'address' field (not publicKey)
      if (result.error) {
        setError(`Access denied: ${result.error}`)
        console.error('Freighter error:', result.error)
      } else if (result.address) {
        onConnect({
          publicKey: result.address,
          name: 'Freighter',
        })
      } else {
        setError('Failed to get wallet address. Please try again.')
        console.error('No address in response:', result)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect wallet'
      )
      console.error('Connection error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
    setError('')
  }

  if (wallet) {
    return (
      <div className="wallet-info">
        <div className="wallet-details">
          <p className="wallet-label">Connected Wallet: {wallet.name}</p>
          <p className="wallet-address">
            Address: {wallet.publicKey.substring(0, 8)}...
            {wallet.publicKey.substring(wallet.publicKey.length - 8)}
          </p>
        </div>
        <button onClick={handleDisconnect} className="disconnect-btn">
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="connect-btn"
      >
        {loading ? ' Connecting...' : ' Connect Freighter Wallet'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

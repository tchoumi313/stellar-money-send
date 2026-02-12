import { useState } from 'react'
import './App.css'
import WalletConnect from './components/WalletConnect'
import BalanceDisplay from './components/BalanceDisplay'
import SendTransaction from './components/SendTransaction'
import type { StellarWallet } from './types'

function App() {
  const [wallet, setWallet] = useState<StellarWallet | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)

  const handleWalletConnect = (connectedWallet: StellarWallet) => {
    setWallet(connectedWallet)
    fetchBalance(connectedWallet.publicKey)
  }

  const handleWalletDisconnect = () => {
    setWallet(null)
    setBalance('0')
  }

  const fetchBalance = async (publicKey: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}`
      )
      const data = await response.json()
      const xlmBalance = data.balances.find(
        (b: any) => b.asset_type === 'native'
      )?.balance || '0'
      setBalance(xlmBalance)
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance('0')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionSuccess = () => {
    if (wallet) {
      fetchBalance(wallet.publicKey)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>💫 Stellar Money Send</h1>
        <p>Send XLM on the Stellar Testnet</p>
      </header>

      <main className="app-main">
        <div className="card">
          <h2>Wallet Connection</h2>
          <WalletConnect
            wallet={wallet}
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
        </div>

        {wallet && (
          <>
            <div className="card">
              <h2>Your Balance</h2>
              <BalanceDisplay balance={balance} loading={loading} />
              <button
                onClick={() => fetchBalance(wallet.publicKey)}
                className="refresh-btn"
              >
                🔄 Refresh Balance
              </button>
            </div>

            <div className="card">
              <h2>Send XLM</h2>
              <SendTransaction
                senderPublicKey={wallet.publicKey}
                onTransactionSuccess={handleTransactionSuccess}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App

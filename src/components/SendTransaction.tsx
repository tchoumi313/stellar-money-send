import { useState } from 'react'
import * as freighterApi from '@stellar/freighter-api'
import {
  TransactionBuilder,
  BASE_FEE,
  Asset,
  Operation,
  Account,
} from '@stellar/stellar-sdk'
import type { TransactionResult } from '../types'

interface SendTransactionProps {
  senderPublicKey: string
  onTransactionSuccess: () => void
}

export default function SendTransaction({
  senderPublicKey,
  onTransactionSuccess,
}: SendTransactionProps) {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TransactionResult | null>(null)

  const validateInputs = (): string | null => {
    if (!recipientAddress.trim()) {
      return 'Recipient address is required'
    }
    if (!amount || parseFloat(amount) <= 0) {
      return 'Amount must be greater than 0'
    }
    if (recipientAddress === senderPublicKey) {
      return 'Cannot send to the same address'
    }
    return null
  }

  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)

    const validationError = validateInputs()
    if (validationError) {
      setResult({ success: false, error: validationError })
      return
    }

    setLoading(true)

    try {
      // Use the public RPC endpoint for Stellar
      const fetch_response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${senderPublicKey}`
      )
      const accountData = await fetch_response.json()

      // Create an Account object from the Horizon response
      const account = new Account(senderPublicKey, accountData.sequence)

      // Check if destination account exists
      const destFetch = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${recipientAddress}`
      )
      const destExists = destFetch.ok

      const transactionBuilder = new TransactionBuilder(account, {
        fee: BASE_FEE.toString(),
        networkPassphrase: 'Test SDF Network ; September 2015',
      })

      if (destExists) {
        transactionBuilder.addOperation(
          Operation.payment({
            destination: recipientAddress,
            amount: amount.toString(),
            asset: Asset.native(),
          })
        )
      } else {
        transactionBuilder.addOperation(
          Operation.createAccount({
            destination: recipientAddress,
            startingBalance: amount.toString(),
          })
        )
      }

      transactionBuilder.setTimeout(30)
      const transaction = transactionBuilder.build()
      const transactionXDR = transaction.toEnvelope().toXDR('base64')

      const signedTransaction = await freighterApi.signTransaction(
        transactionXDR,
        {
          networkPassphrase: 'Test SDF Network ; September 2015',
          address: senderPublicKey,
        }
      )

      if (signedTransaction.error) {
        const errorMessage = typeof signedTransaction.error === 'string' 
          ? signedTransaction.error 
          : JSON.stringify(signedTransaction.error)
        setResult({ 
          success: false, 
          error: `Signing failed: ${errorMessage}` 
        })
        setLoading(false)
        return
      }
      const submitResponse = await fetch(
        'https://horizon-testnet.stellar.org/transactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `tx=${encodeURIComponent(signedTransaction.signedTxXdr)}`,
        }
      )

      const responseData = await submitResponse.json()

      if (responseData.hash) {
        setResult({
          success: true,
          hash: responseData.hash,
        })
        setRecipientAddress('')
        setAmount('')
        onTransactionSuccess()
      } else {
        let errorMessage = 'Transaction failed'
        
        if (responseData.extras?.result_codes) {
          const codes = responseData.extras.result_codes
          errorMessage = codes.transaction || codes.operations?.[0] || errorMessage
        } else if (responseData.detail) {
          errorMessage = responseData.detail
        } else if (responseData.title) {
          errorMessage = responseData.title
        }

        setResult({
          success: false,
          error: errorMessage,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Transaction failed. Please try again.'
      setResult({
        success: false,
        error: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="send-transaction">
      <form onSubmit={handleSendTransaction}>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address:</label>
          <input
            type="text"
            id="recipient"
            placeholder="G... (Stellar public key)"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (XLM):</label>
          <input
            type="number"
            id="amount"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="send-btn"
        >
          {loading ? 'Sending...' : 'Send XLM'}
        </button>
      </form>

      {result && (
        <div className={`transaction-result ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <div>
              <p className="result-title">Transaction Successful!</p>
              <p className="result-hash">Hash: {result.hash?.substring(0, 16)}...</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-link"
              >
                View on Stellar Expert
              </a>
            </div>
          ) : (
            <div>
              <p className="result-title">Transaction Failed</p>
              <p className="result-error">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

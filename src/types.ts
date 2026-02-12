export interface StellarWallet {
  publicKey: string
  name: string
}

export interface TransactionResult {
  success: boolean
  hash?: string
  error?: string
}

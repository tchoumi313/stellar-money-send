interface BalanceDisplayProps {
  balance: string
  loading: boolean
}

export default function BalanceDisplay({ balance, loading }: BalanceDisplayProps) {
  return (
    <div className="balance-display">
      {loading ? (
        <p className="loading">Fetching balance...</p>
      ) : (
        <div className="balance-content">
          <p className="balance-label">XLM Balance</p>
          <p className="balance-amount">{parseFloat(balance).toFixed(7)} XLM</p>
        </div>
      )}
    </div>
  )
}

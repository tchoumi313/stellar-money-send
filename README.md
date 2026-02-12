# 💫 Stellar Money Send - White Belt Level

A web-based application for sending XLM (Stellar's native asset) on the Stellar testnet. This is a Level 1 - White Belt submission that demonstrates core Stellar dApp functionality.

## Features

✅ **Wallet Connection** - Connect via Freighter wallet extension  
✅ **Balance Display** - Real-time XLM balance from Horizon API  
✅ **Send XLM** - Transfer XLM to any Stellar address on testnet  
✅ **Transaction Feedback** - View transaction hash and explorer link  
✅ **Error Handling** - Comprehensive validation and error messages  

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Stellar SDK**: @stellar/stellar-sdk
- **Wallet**: Freighter API
- **Styling**: Custom CSS with responsive design
- **Network**: Stellar Testnet (Horizon API)

## Prerequisites

1. **Freighter Wallet** - Install the [Freighter browser extension](https://www.freighter.app/)
2. **Testnet Account** - Create one in Freighter and fund it via [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet)
3. **Node.js** - v16+ with npm

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stellar-money-send.git
cd stellar-money-send

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:5173`

## Usage

### 1. Connect Your Wallet
- Click **"🔗 Connect Freighter Wallet"**
- Approve access in the Freighter popup
- Your public key appears in the UI

### 2. Check Your Balance
- Once connected, your XLM balance is automatically fetched
- Click **"🔄 Refresh Balance"** anytime to update

### 3. Send XLM
- Enter recipient's Stellar address (starts with 'G')
- Enter amount to send (in XLM)
- Click **"✉️ Send XLM"**
- Approve the transaction in Freighter

### 4. View Results
- Success shows transaction hash with Stellar Expert link
- Errors display clear messages for troubleshooting

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── App.css                 # Styling
├── types.ts               # TypeScript interfaces
├── main.tsx               # Entry point
├── index.css              # Global styles
└── components/
    ├── WalletConnect.tsx  # Wallet connection logic
    ├── BalanceDisplay.tsx # Balance display component
    └── SendTransaction.tsx # Transaction sending logic
```

## Key Components

### WalletConnect
Handles Freighter wallet connection/disconnection using the Freighter API.

### BalanceDisplay
Fetches and displays the connected wallet's XLM balance from Horizon API.

### SendTransaction
Builds, signs (via Freighter), and submits XLM payment transactions to Stellar testnet.

## Level 1 Requirements Checklist

- [x] Wallet Setup (Freighter on Stellar Testnet)
- [x] Wallet Connection (connect/disconnect)
- [x] Balance Handling (fetch & display)
- [x] Transaction Flow (send XLM on testnet)
- [x] Transaction Feedback (hash & confirmation)
- [x] Error Handling & Validation
- [x] Public GitHub Repository
- [x] README with setup instructions
- [x] Screenshots (see below)

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Testnet Funding

If your account runs out of XLM, use the [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet) to fund your testnet account with 10,000 XLM.

## Error Handling

The app includes validation for:
- Missing Freighter wallet installation
- Invalid recipient addresses
- Invalid amounts (zero or negative)
- Network errors
- Insufficient balance
- Transaction rejections

## API Integration

- **Horizon API** (https://horizon-testnet.stellar.org) - Account data & transaction submission
- **Stellar Expert** - Transaction explorer links
- **Freighter API** - Wallet interaction & transaction signing

## Security Notes

- Private keys never leave the Freighter wallet
- All transaction signing happens in Freighter
- No sensitive data stored locally
- Uses Stellar testnet only (not mainnet)

## Deployment

This can be deployed to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Deploy the 'dist' folder
```

## Support

For issues:
1. Check Freighter is installed and unlocked
2. Ensure you're on Stellar Testnet in Freighter
3. Verify account has been funded via Friendbot
4. Check browser console for detailed error messages

---

**Built for Level 1 - White Belt Submission**  
Stellar Development Challenge

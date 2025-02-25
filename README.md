# Wallet DApp (ETHER APP)

This is a decentralized application (DApp) that allows users to connect their MetaMask wallet, check their balance, and perform ERC20 token transactions on the blockchain.

## Features

- Connect and disconnect MetaMask wallet
- Display wallet address and balance
- Fetch and display ERC20 token balance
- Send transactions with real-time validation
- Check transaction status

## Tech Stack

- **React**
- **TypeScript**
- **ethers.js** (for blockchain interactions)
- **Tailwind CSS** (for styling)

## Installation

1. **Clone the repository:**

2. **Install dependencies:**

   ```sh
   npm install

   ```

3. **Update configuration:**  
   The .env file is already included in the project. You only need to update the token address:

  ```sh
  VITE_TEST_TOKEN_ADDRESS=your_token_address_here
  ```

4. **Run the application:**

   ```sh
   npm run dev

   ```

## Troubleshooting

- **MetaMask not installed:** Install MetaMask from [metamask.io](https://metamask.io/).
- **Insufficient balance error:** Ensure your wallet has enough ETH for gas fees.
- **Transaction failed:** Verify the recipient address and token balance.

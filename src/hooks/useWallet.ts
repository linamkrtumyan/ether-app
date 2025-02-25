import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const tokenAddress = import.meta.env.VITE_TEST_TOKEN_ADDRESS;
const tokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
];

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);

  // Fetch balance for the given account
  const fetchBalance = useCallback(
    async (walletAddress: string) => {
      if (!window.ethereum) {
        alert("MetaMask не установлен.");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        const bnbBalance = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(bnbBalance));

        // Fetch ERC20 token balance
        const tokenContract = new ethers.Contract(
          tokenAddress,
          tokenABI,
          provider
        );
        const tokenBal = await tokenContract.balanceOf(walletAddress);
        setTokenBalance(ethers.formatUnits(tokenBal, 18)); // Assuming 18 decimals for the token
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Error fetching balance");
      }
    },
    [tokenAddress, tokenABI]
  );

  // Connect wallet and fetch balance
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert(
        "MetaMask is not installed. Please install MetaMask to connect your wallet"
      );
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request accounts from MetaMask
      const accounts = await provider.send("eth_requestAccounts", []);
      const currentAccount = accounts[0];
      setAccount(currentAccount);

      // Save wallet address to localStorage
      localStorage.setItem("walletAddress", currentAccount);

      // Fetch balances for the connected account
      fetchBalance(currentAccount);
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError("Failed to connect wallet. Please try again.");
    }
  }, [fetchBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance("0");
    setTokenBalance("0");
    localStorage.removeItem("walletAddress");
  }, []);

  // Check localStorage for saved wallet on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAddress");
    if (savedAccount) {
      setAccount(savedAccount);
      fetchBalance(savedAccount);
    }
  }, [fetchBalance]);

  return {
    account,
    balance,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    error,
  };
};

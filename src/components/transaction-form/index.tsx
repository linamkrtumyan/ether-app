import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ethers } from "ethers";
import { Button } from "../../ui";

const tokenAddress = import.meta.env.VITE_TEST_TOKEN_ADDRESS;

interface TransactionFormProps {
  address: string | null;
  tokenBalance: string;
  connectWallet: () => void;
}

interface FormData {
  recipient: string;
  amount: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  address,
  tokenBalance,
  connectWallet,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      recipient: "",
      amount: "",
    },
  });

  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [recipientBalance, setRecipientBalance] = useState<string | null>(null);

  const recipient = watch("recipient");
  const amount = watch("amount");

  // Utility function to check if an address is valid
  const isValidAddress = (address: string): boolean => {
    return ethers.isAddress(address);
  };

  const checkBalance = async (amount: string) => {
    if (!address || !amount) return;
    try {
      if (parseFloat(amount) > parseFloat(tokenBalance)) {
        setError("amount", {
          type: "manual",
          message: "Insufficient balance.",
        });
      } else {
        setError("amount", {});
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("amount", {
        type: "manual",
        message: "Unable to fetch balance.",
      });
    }
  };

  console.log(errors, "errors");

  const onSubmit = async (data: FormData) => {
    if (!window.ethereum) {
      setTransactionStatus("MetaMask is not installed.");
      setTimeout(() => setTransactionStatus(null), 2000);
      return;
    }

    if (!address || !data.recipient || !data.amount) {
      setTransactionStatus("Please enter all required fields.");
      setTimeout(() => setTransactionStatus(null), 2000);
      return;
    }

    try {
      setTransactionStatus("Pending...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const erc20Contract = new ethers.Contract(
        tokenAddress,
        [
          "function transfer(address recipient, uint256 amount) public returns (bool)",
        ],
        signer
      );

      // Convert amount to wei (18 decimal places)
      const parsedAmount = ethers.parseUnits(data.amount, 18);

      // Initiate the transaction
      const transaction = await erc20Contract.transfer(
        data.recipient,
        parsedAmount
      );
      setTransactionHash(transaction.hash);
      setTransactionStatus("Transaction sent! Awaiting confirmation...");

      // Wait for the transaction to be confirmed
      await transaction.wait();
      setTransactionStatus("Transaction confirmed!");

      // After transaction is confirmed, reset form and refresh wallet state
      reset();
      connectWallet();

      setTimeout(() => setTransactionStatus(null), 2000);
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTransactionStatus("Transaction failed!");
      setTimeout(() => setTransactionStatus(null), 2000);
    }
  };

  useEffect(() => {
    if (isValidAddress(recipient)) {
      setRecipientBalance(null);
      checkBalance(amount);
    } else if (recipient.length > 0) {
      setRecipientBalance("Invalid recipient address.");
    }
  }, [recipient, amount]);

  if (!address) return null;

  return (
    <div className="transaction-form">
      <h3 className="text-2xl font-semibold text-white mb-2">Send Tokens</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Controller
            name="recipient"
            control={control}
            rules={{
              required: "Recipient address is required",
              validate: (value) => isValidAddress(value) || "Invalid address",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Recipient Address"
                className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.recipient && (
            <p className="text-red-500">{errors.recipient.message}</p>
          )}
          {recipientBalance && (
            <p className="text-red-500">{recipientBalance}</p>
          )}
        </div>
        <div className="mb-4">
          <Controller
            name="amount"
            control={control}
            rules={{
              required: "Amount is required",
              validate: (value) =>
                parseFloat(value) > 0 || "Amount must be greater than zero",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="Amount"
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.amount && (
            <p className="text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <Button
          label="Send"
          type="primary"
          disabled={!!errors.recipient?.message || !!errors.amount?.message}
        />
      </form>
      <div className="mt-4">
        {transactionStatus && (
          <p className="text-lg font-medium">{transactionStatus}</p>
        )}

        {transactionHash && (
          <p className="mt-2 text-blue-500">
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View on Etherscan
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

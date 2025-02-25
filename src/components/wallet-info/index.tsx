import { FC } from "react";
import { TransactionForm } from "../transaction-form";
import { useWallet } from "../../hooks";
import { Button } from "../../ui";

export const WalletInfo: FC = () => {
  const {
    account,
    balance,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-4xl p-8 bg-transparent backdrop-blur-3xl shadow-2xl rounded-xl border border-violet-500">
      {/* Wallet not connected */}
      {!account ? (
        <div className="text-center">
          <p className="text-lg mb-4 text-gray-200">
            Connect your Metamask wallet to make transactions
          </p>
          <Button
            label="Connect Wallet"
            onClick={connectWallet}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          />
        </div>
      ) : (
        <div>
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <p className="text-2xl font-bold text-white">
              <span className="text-gray-300">{shortenAddress(account)}</span>
            </p>
            <p className="text-lg text-white mt-2">
              Balance: <span className="font-semibold ">{balance}</span>
            </p>
            <p className="text-lg text-white mb-4 mt-2">
              ERC20 Token Balance:{" "}
              <span className="font-semibold ">{tokenBalance}</span>
            </p>
          </div>

          <Button
            label="Disconnect Wallet"
            onClick={disconnectWallet}
            type="secondary"
            className="w-full py-3 border-2 border-violet-500 text-violet-500 font-semibold rounded-lg hover:bg-violet-500 hover:text-white transition-all mb-6"
          />
        </div>
      )}

      <TransactionForm
        address={account ?? ""}
        tokenBalance={tokenBalance}
        connectWallet={() => fetchBalance(account ?? "")}
      />
    </div>
  );
};

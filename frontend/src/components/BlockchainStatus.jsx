import { ExternalLink } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function BlockchainStatus() {
  const {
  walletAddress,
  connected,
  provider,
  networkName,
  explorerUrl,
} = useWallet();

const [latestBlock, setLatestBlock] = useState("--");
const [gasPrice, setGasPrice] = useState("--");
const [rpcLatency, setRpcLatency] = useState("--");

async function loadBlockchainData() {
  if (!provider) return;

  try {
    // Latest Block
    const block = await provider.getBlockNumber();
    setLatestBlock(block);

    // Gas Price
    const feeData = await provider.getFeeData();

    if (feeData.gasPrice) {
      setGasPrice(
        Number(
          ethers.formatUnits(
            feeData.gasPrice,
            "gwei"
          )
        ).toFixed(2) + " Gwei"
      );
    }

    // RPC Latency
    const start = performance.now();

    await provider.getBlockNumber();

    const end = performance.now();

    setRpcLatency(
      Math.round(end - start) + " ms"
    );

  } catch (err) {
    console.error(err);
  }
}

useEffect(() => {
  if (!connected || !provider) return;

  // Initial load
  loadBlockchainData();

  // Refresh every 5 seconds
  const interval = setInterval(() => {
    loadBlockchainData();
  }, 5000);

  return () => clearInterval(interval);
}, [provider, connected]);

  return (
    <div className="blockchain-status">

      {/* Wallet */}

      <div className="wallet-card">

        <div className="wallet-address">
          {walletAddress
            ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`
            : "No Wallet"}
        </div>

        <div
          className={
            connected
              ? "wallet-connected"
              : "wallet-disconnected"
          }
        >
          <span className="status-dot"></span>

          <span>{connected ? "Connected" : "Disconnected"}</span>

        </div>

      </div>

      {/* Network */}

      <div className="network-card">

        <h4>Network</h4>

        <div className="network-name">

          <span className="status-dot"></span>

          <span>{networkName}</span>

        </div>

        <div className="network-row">
          <span>Latest Block</span>
          <strong>{latestBlock}</strong>
        </div>

        <div className="network-row">
          <span>Gas Price</span>
          <strong>{gasPrice}</strong>
        </div>

        <div className="network-row">
          <span>RPC Latency</span>
          <strong>{rpcLatency}</strong>
        </div>

        <div className="network-health">
            <span className="status-dot"></span>
          <span>{connected ? "Healthy" : "Offline"}</span>
        </div>

      </div>

      {/* Explorer */}

      <button
        className="explorer-btn"
        disabled={!walletAddress || !explorerUrl}
        onClick={() =>
          explorerUrl &&
          window.open(
            `${explorerUrl}${walletAddress}`,
            "_blank"
          )
        }
      >
        View on Etherscan

        <ExternalLink size={16} />
      </button>

    </div>
  );
}

export default BlockchainStatus;

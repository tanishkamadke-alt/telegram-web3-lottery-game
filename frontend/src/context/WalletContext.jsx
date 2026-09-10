import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";

import { ethers } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  console.log("WalletProvider mounted");
  
  const { open } = useAppKit();

  const {
    isConnected,
    address,
  } = useAppKitAccount();

  console.log("================================");
  console.log("APPKIT HOOK");
  console.log("address =", address);
  console.log("connected =", isConnected);
  console.log("================================");

  const {
    walletProvider,
  } = useAppKitProvider("eip155");
  console.log("walletProvider:", walletProvider);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState(null);

  async function loadWallet() {
    console.log("loadWallet() called");
    if (!walletProvider) {
      setProvider(null);
      setSigner(null);
      setWalletAddress("");
      setChainId(null);
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(
        walletProvider
      );

      const walletSigner = address
        ? await browserProvider.getSigner(address)
        : await browserProvider.getSigner();

      const signerAddress =
        await walletSigner.getAddress();

      const network =
        await browserProvider.getNetwork();

      const balance =
        await browserProvider.getBalance(
          signerAddress
        );

      const blockNumber =
        await browserProvider.getBlockNumber();

      console.log("========== WALLET ==========");
      console.log("AppKit Address:", address);
      console.log("Signer Address:", signerAddress);
      console.log("Chain:", Number(network.chainId));
      console.log(
        "Balance:",
        ethers.formatEther(balance),
        "ETH"
      );
      console.log("Block:", blockNumber);
      console.log("============================");

      setProvider(browserProvider);
      setSigner(walletSigner);
      setWalletAddress(signerAddress);
      setChainId(Number(network.chainId));

    } catch (error) {

      console.error("Wallet initialization failed:");
      console.error(error);

      setProvider(null);
      setSigner(null);
      setWalletAddress("");
      setChainId(null);
    }
  }

  useEffect(() => {
    console.log("APPKIT ADDRESS:", address);
    console.log("CONNECTED:", isConnected);
  }, [address, isConnected]);

  useEffect(() => {
  if (isConnected && walletProvider) {
    loadWallet();
  }

  if (!isConnected) {
    setProvider(null);
    setSigner(null);
    setWalletAddress("");
    setChainId(null);
  }
}, [isConnected, walletProvider, address]);

  // Poll every 2 seconds to see if WalletConnect updates the account
  useEffect(() => {
    console.log("Polling effect started");
    if (!walletProvider) {
    console.log("walletProvider is null");
    return;
  }

    const interval = setInterval(async () => {
      try {
        const accounts = await walletProvider.request({
          method: "eth_accounts",
        });

        console.log("POLL:", accounts);
        console.log("walletProvider =", walletProvider);
        console.log(
          "selectedAddress =",
          walletProvider.selectedAddress 
        );
        console.log(
          "accounts property =",
          walletProvider.accounts
        );
        console.log(
          "session =",
          walletProvider.session
        );
      } catch (e) {
        console.log(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [walletProvider]);

  const networkName = useMemo(() => {
    switch (chainId) {
      case 31337:
        return "Hardhat Local";

      case 11155111:
        return "Sepolia";

      case 1:
        return "Ethereum";

      case 8453:
        return "Base";

      default:
        return "Unknown";
    }
  }, [chainId]);

  async function connectWallet() {
    await open({
      view: "Connect",
    });
  }

  const explorerUrl =
  chainId === 11155111
    ? "https://sepolia.etherscan.io/address/"
    : chainId === 1
    ? "https://etherscan.io/address/"
    : chainId === 8453
    ? "https://basescan.org/address/"
    : "";

  const value = {
    connected: isConnected,
    walletAddress,
    networkName,
    chainId,
    explorerUrl,
    provider,
    signer,
    connectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}

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

  const { open } = useAppKit();

  const {
    isConnected,
    address,
  } = useAppKitAccount();

  const {
    walletProvider,
  } = useAppKitProvider("eip155");

  const [provider, setProvider] =
    useState(null);

  const [signer, setSigner] =
    useState(null);

  const [chainId, setChainId] =
    useState(null);

  async function loadWallet() {

    if (!walletProvider) {

      setProvider(null);
      setSigner(null);
      setChainId(null);

      return;

    }

    try {

      const browserProvider =
        new ethers.BrowserProvider(
          walletProvider
        );

      const walletSigner =
        await browserProvider.getSigner();

      const network =
        await browserProvider.getNetwork();

      const signerAddress =
        await walletSigner.getAddress();

      const balance =
        await browserProvider.getBalance(
          signerAddress
        );

      const blockNumber =
        await browserProvider.getBlockNumber();

      if (import.meta.env.DEV) {

        console.log("========== WALLET ==========");

        console.log(
          "Signer:",
          signerAddress
        );

        console.log(
          "Chain:",
          Number(network.chainId)
        );

        console.log(
          "Balance:",
          ethers.formatEther(balance),
          "ETH"
        );

        console.log(
          "Block:",
          blockNumber
        );

        console.log("============================");

      }

      setProvider(browserProvider);

      setSigner(walletSigner);

      setChainId(
        Number(network.chainId)
      );

    }

    catch (error) {

      console.error(
        "Wallet initialization failed:",
        error
      );

      setProvider(null);

      setSigner(null);

      setChainId(null);

    }

  }

  useEffect(() => {

    loadWallet();

  }, [walletProvider]);

  useEffect(() => {

    if (!walletProvider?.on)
      return;

    const reload = async () => {

      console.log(
        "Wallet account/network changed"
      );

      await loadWallet();

    };

    walletProvider.on(
      "accountsChanged",
      reload
    );

    walletProvider.on(
      "chainChanged",
      reload
    );

    walletProvider.on(
      "connect",
      reload
    );

    walletProvider.on(
      "disconnect",
      reload
    );

        return () => {

      walletProvider.removeListener(
        "accountsChanged",
        reload
      );

      walletProvider.removeListener(
        "chainChanged",
        reload
      );

      walletProvider.removeListener(
        "connect",
        reload
      );

      walletProvider.removeListener(
        "disconnect",
        reload
      );

    };

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

  const value = {

    connected: isConnected,

    walletAddress: address ?? "",

    networkName,

    chainId,

    provider,

    signer,

    connectWallet,

  };

  return (

    <WalletContext.Provider
      value={value}
    >

      {children}

    </WalletContext.Provider>

  );

}

export function useWallet() {

  return useContext(
    WalletContext
  );

}


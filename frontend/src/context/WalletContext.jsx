// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useAppKit,
//   useAppKitAccount,
//   useAppKitProvider,
// } from "@reown/appkit/react";

// import { ethers } from "ethers";

// const WalletContext = createContext(null);

// export function WalletProvider({ children }) {
//   const { open } = useAppKit();

//   const {
//     isConnected,
//     address,
//   } = useAppKitAccount();

//   const {
//     walletProvider,
//   } = useAppKitProvider("eip155");

//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [chainId, setChainId] = useState(null);

//   async function loadWallet() {
//     if (!walletProvider) {
//       setProvider(null);
//       setSigner(null);
//       setWalletAddress("");
//       setChainId(null);
//       return;
//     }

//     try {
//       const browserProvider = new ethers.BrowserProvider(
//         walletProvider
//       );

//       // Force ethers to use the current AppKit address
//       const walletSigner = address
//         ? await browserProvider.getSigner(address)
//         : await browserProvider.getSigner();

//       const signerAddress =
//         await walletSigner.getAddress();

//       const network =
//         await browserProvider.getNetwork();

//       const balance =
//         await browserProvider.getBalance(
//           signerAddress
//         );

//       const blockNumber =
//         await browserProvider.getBlockNumber();

//       console.log("========== WALLET ==========");
//       console.log("accountsChanged fired");
//       console.log("AppKit Address:", address);
//       console.log("Signer Address:", signerAddress);
//       console.log("Chain:", Number(network.chainId));
//       console.log(
//         "Balance:",
//         ethers.formatEther(balance),
//         "ETH"
//       );
//       console.log("Block:", blockNumber);
//       console.log("============================");

//       setProvider(browserProvider);
//       setSigner(walletSigner);
//       setWalletAddress(signerAddress);
//       setChainId(Number(network.chainId));
//     } catch (error) {
//       console.error("Wallet initialization failed:");
//       console.error(error);

//       setProvider(null);
//       setSigner(null);
//       setWalletAddress("");
//       setChainId(null);
//     }
//   }

//   // useEffect(() => {
//   //   loadWallet();
//   // }, [walletProvider, address, isConnected]);

//   // useEffect(() => {
//   //   if (!walletProvider?.on) return;

//   //   const reload = async () => {
//   //     console.log("Wallet account/network changed");

//   //     try {
//   //       const accounts = await walletProvider.request({
//   //         method: "eth_accounts",
//   //       });

//   //       console.log("Accounts:", accounts);
//   //     } catch (err) {
//   //       console.log(err);
//   //     }

//   //     await loadWallet();
//   //   };
//     useEffect(() => {
//   if (!walletProvider) return;

//   const interval = setInterval(async () => {
//     try {
//       const accounts = await walletProvider.request({
//         method: "eth_accounts",
//       });

//       console.log("POLL:", accounts);
//     } catch (e) {
//       console.log(e);
//     }
//   }, 2000);

//   return () => clearInterval(interval);
// }, [walletProvider]);

//     walletProvider.on("accountsChanged", reload);
//     walletProvider.on("chainChanged", reload);
//     walletProvider.on("connect", reload);
//     walletProvider.on("disconnect", reload);

//     return () => {
//       walletProvider.removeListener(
//         "accountsChanged",
//         reload
//       );

//       walletProvider.removeListener(
//         "chainChanged",
//         reload
//       );

//       walletProvider.removeListener(
//         "connect",
//         reload
//       );

//       walletProvider.removeListener(
//         "disconnect",
//         reload
//       );
//     };
//   }, [walletProvider, address]);

//   const networkName = useMemo(() => {
//     switch (chainId) {
//       case 31337:
//         return "Hardhat Local";

//       case 11155111:
//         return "Sepolia";

//       case 1:
//         return "Ethereum";

//       case 8453:
//         return "Base";

//       default:
//         return "Unknown";
//     }
//   }, [chainId]);

//   async function connectWallet() {
//     await open({
//       view: "Connect",
//     });
//   }

//   const value = {
//     connected: isConnected,
//     walletAddress,
//     networkName,
//     chainId,
//     provider,
//     signer,
//     connectWallet,
//   };

//   return (
//     <WalletContext.Provider value={value}>
//       {children}
//     </WalletContext.Provider>
//   );
// }

// export function useWallet() {
//   return useContext(WalletContext);
// }



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

  const {
    walletProvider,
  } = useAppKitProvider("eip155");
  console.log("walletProvider:", walletProvider);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState(null);

  async function loadWallet() {
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

  // Initial wallet load
  // useEffect(() => {
  //   loadWallet();
  // }, [walletProvider, address, isConnected]);
  useEffect(() => {
    console.log("APPKIT ADDRESS:", address);
    console.log("CONNECTED:", isConnected);
  }, [address, isConnected]);
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

  const value = {
    connected: isConnected,
    walletAddress,
    networkName,
    chainId,
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

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: "CipherDraw",
  description: "Telegram Web3 Lottery Mini App",
  url: window.location.origin,
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Hardhat Local Network
const hardhat = {
  id: 31337,
  name: "Hardhat Local",
  network: "hardhat",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
};

export const appKit = createAppKit({
  adapters: [new EthersAdapter()],

  networks: [sepolia],

  defaultNetwork: sepolia,

  projectId,
  metadata,

  features: {
    analytics: false,
  },
});

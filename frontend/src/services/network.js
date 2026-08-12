import { BrowserProvider } from "ethers";

export async function getCurrentNetwork() {
  try {
    if (!window.ethereum) {
      return {
        name: "No Wallet",
        chainId: null,
        color: "red",
      };
    }

    const provider = new BrowserProvider(window.ethereum);

    const network = await provider.getNetwork();

    const chainId = Number(network.chainId);

    switch (chainId) {
      case 31337:
        return {
          name: "Hardhat Local",
          chainId,
          color: "green",
        };

      case 11155111:
        return {
          name: "Sepolia Testnet",
          chainId,
          color: "orange",
        };

      case 1:
        return {
          name: "Ethereum Mainnet",
          chainId,
          color: "blue",
        };

      default:
        return {
          name: `Unknown (${chainId})`,
          chainId,
          color: "red",
        };
    }

  } catch (error) {
    console.error(error);

    return {
      name: "Unknown",
      chainId: null,
      color: "red",
    };
  }
}

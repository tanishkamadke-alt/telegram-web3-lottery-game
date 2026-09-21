import { useWallet } from "../../context/WalletContext";

function Navbar() {
  const {
    walletAddress,
    connected,
    networkName,
    connectWallet,
  } = useWallet();

  return (
    <header className="navbar">

      <div className="navbar-left">

        <h1 className="navbar-title">
          CipherDraw
        </h1>

        <p className="navbar-subtitle">
          Secure • Transparent • On-chain
        </p>

      </div>

      <div className="navbar-right">

        <span className="network-badge">
          🟢 {networkName || "Unknown"}
        </span>

        {!connected ? (
          <button
            className="wallet-button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <button className="wallet-button">
            {walletAddress.slice(0, 6)}
            ...
            {walletAddress.slice(-4)}
          </button>
        )}

      </div>

    </header>
  );
}

export default Navbar;
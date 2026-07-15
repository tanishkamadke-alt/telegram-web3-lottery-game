function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-left">
        <h1 className="navbar-title">CipherDraw</h1>

        <p className="navbar-subtitle">
          Secure • Transparent • On-chain
        </p>
      </div>

      <div className="navbar-right">

        <span className="network-badge">
          🟢 Sepolia
        </span>

        <button className="wallet-button">
          Connect Wallet
        </button>

      </div>

    </header>
  );
}

export default Navbar;
import {
    LayoutDashboard,
    Ticket,
    History,
    Crown,
    Settings,
  } from "lucide-react";

function Sidebar() {
  return (
  <aside className="sidebar">

    <div className="sidebar-top">

      <div className="logo-section">
        <h2 className="sidebar-logo">CipherDraw</h2>

        <p className="logo-subtitle">
          Secure • Transparent
        </p>
      </div>

      <nav className="sidebar-nav">

        <div className="sidebar-item active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>

        <div className="sidebar-item">
          <Ticket size={18} />
          <span>Buy Ticket</span>
        </div>

        <div className="sidebar-item">
          <History size={18} />
          <span>History</span>
        </div>

        <div className="sidebar-item">
          <Crown size={18} />
          <span>Manager</span>
        </div>

        <div className="sidebar-item">
          <Settings size={18} />
          <span>Settings</span>
        </div>

      </nav>

    </div>

    <div className="sidebar-footer">

      <div className="status-dot"></div>

      <div>
        <p className="network-title">
          Connected
        </p>

        <p className="network-name">
          Sepolia Testnet
        </p>

        <p className="version">
          CipherDraw v1.0.0
        </p>
      </div>

    </div>

  </aside>
);

}
export default Sidebar;
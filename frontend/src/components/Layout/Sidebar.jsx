import {
  LayoutDashboard,
  Activity,
  Settings,
} from "lucide-react";

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">

      <div className="sidebar-top">

        <div className="logo-section">

          <h2 className="sidebar-logo">
            CipherDraw
          </h2>

          <p className="logo-subtitle">
            Secure • Transparent
          </p>

        </div>

        <nav className="sidebar-nav">

          {/* Dashboard */}

          <div
            className={`sidebar-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => setPage("dashboard")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>

          {/* Activity Centre */}

          <div
            className={`sidebar-item ${
              page === "activity" ? "active" : ""
            }`}
            onClick={() => setPage("activity")}
          >
            <Activity size={18} />
            <span>Activity Centre</span>
          </div>

          {/* Settings */}

          <div
            className={`sidebar-item ${
              page === "settings" ? "active" : ""
            }`}
            onClick={() => setPage("settings")}
          >
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
            Hardhat Local
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
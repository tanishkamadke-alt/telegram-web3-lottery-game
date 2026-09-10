import {
  LayoutDashboard,
  Activity,
  Settings,
  BarChart3,
  LineChart,
  Trophy,
} from "lucide-react";
import BlockchainStatus from "../BlockchainStatus";
import "../blockchainstatus.css";

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">

      <div className="sidebar-top">

        <div className="logo-section">

          <h2 className="sidebar-logo">
            CipherDraw
          </h2>

          <p className="logo-subtitle">
            Secure • Transparent • On-Chain
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

          {/* Statistics */}
          <div
            className={`sidebar-item ${
              page === "statistics" ? "active" : ""
            }`}
            onClick={() => setPage("statistics")}
          >
          
            <BarChart3 size={18} />
            <span>Statistics</span>
          </div>

          {/* Analytics */}

        <div
          className={`sidebar-item ${
            page === "analytics" ? "active" : ""
          }`}
          onClick={() => setPage("analytics")}
        >
          <LineChart size={18} />
          <span>Analytics</span>
        </div>

        {/* Leaderboard */}
        <div
          className={`sidebar-item ${
            page === "leaderboard" ? "active" : ""
          }`}
          onClick={() => setPage("leaderboard")}
        >
          <Trophy size={18} />
          <span>Leaderboard</span>
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
        <BlockchainStatus />
      </div>

    </aside>
  );
}

export default Sidebar;
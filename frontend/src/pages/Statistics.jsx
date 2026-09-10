import "../styles/statistics.css";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  CheckCircle2,
  CalendarDays,
  Ticket,
  Rocket,
  Trophy,
  Wallet2,
  Target,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useRecentActivity } from "../hooks/useRecentActivity";

import {
  getCurrentRound,
  getTotalPlayers,
  getPrizePool,
  getLatestWinner,
  getLotteryHistoryCount,
  getLotteryRound,
  getNetworkStatus,
} from "../services/contract";

import "react-circular-progressbar/dist/styles.css";

console.log("******** STATISTICS COMPONENT LOADED ********");

function Statistics() {
  const [stats, setStats] = useState(null);
  const { signer, connected, walletAddress } = useWallet();
  const { recentActivities } = useRecentActivity();
  console.log("Statistics:", recentActivities);
  console.log("Statistics recentActivities:", recentActivities);
  console.log("Statistics:", { connected, signer });

  const [networkStatus, setNetworkStatus] = useState({
    blockNumber:0,
    gasPrice: "0",
    latency:0,
    connected: false,
});

  const totalTickets = stats?.totalPlayers ?? 0;
  
  function formatActivityTime(timestamp) {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const winningChance =
    stats?.totalPlayers > 0
      ? (100 / stats.totalPlayers).toFixed(1)
      : 0;
  

  console.log(
    "Players:",
    stats?.totalPlayers,
    "Winning Chance:",
    winningChance
  );
  
  useEffect(() => {

    console.log("Statistics useEffect fired");
    console.log("connected:", connected);
    console.log("signer:", signer);

  async function loadStatistics() {
    console.log("loadStatistics() called");
    console.log("LOAD STATISTICS START");

    if (!connected || !signer) {
      console.log("Statistics waiting...");
      console.log("connected =", connected);
      console.log("signer =", signer);
      console.log("Returning because:", {
        connected,
        signer,
      });
      return;
    }

try {

  // ===== Load core blockchain data =====

  const currentRound = await getCurrentRound(signer);
  const totalPlayers = await getTotalPlayers(signer);
  const prizePool = await getPrizePool(signer);
  const latestWinner = await getLatestWinner(signer);
  const historyCount = await getLotteryHistoryCount(signer);

  console.log("Core data loaded.");

  const network = await getNetworkStatus(signer);

  console.log("Network loaded.");

  console.log("=== Core Blockchain Data ===");
  console.log("Current Round:", currentRound);
  console.log("Players:", totalPlayers);
  console.log("Prize Pool:", prizePool);
  console.log("History Count:", historyCount);

  // ===== Prize History =====

  let totalWins=0;
  let ticketsBought=0;
  let prizeHistory = [];

  for (let i = 0; i < Number(historyCount); i++) {

    const round = await getLotteryRound(signer, i);
    ticketsBought += Number(round.totalPlayers);

    prizeHistory.push({
      round: `R${Number(round.roundId)}`,
      prize: Number(round.prizeAmount) / 1e18,
    });
    //Count wins
    if(
      walletAddress &&
      round.winner.toLowerCase() === walletAddress.toLowerCase()
    ){
      totalWins++;
    }
  }

  let latestRound = null;

  if (Number(historyCount) > 0) {
    latestRound = await getLotteryRound(
      signer,
      Number(historyCount) - 1
    );
  }

  // ===== Save Statistics =====

  setStats({
    currentRound: Number(currentRound),
    totalPlayers: Number(totalPlayers),
    prizePool: Number(prizePool),
    latestWinner,
    historyCount: Number(historyCount),
    prizeHistory,
    latestPrize: latestRound
      ? Number(latestRound.prizeAmount) / 1e18
      : 0,
    latestWinningRound: latestRound
      ? Number(latestRound.roundId)
      : 0,
    wins: totalWins,
    ticketsBought,  
  });

  console.log("Statistics saved successfully.");

  setNetworkStatus(network);

} catch (err) {

  console.error("Failed to load statistics:", err);
    }
  }
  
loadStatistics();

const statisticsInterval = setInterval(() => {
  loadStatistics();
}, 10000);

return () => {
  clearInterval(statisticsInterval);
};

}, [connected, signer, walletAddress]);

  const networkData = [
    { value: 22 },
    { value: 28 },
    { value: 25 },
    { value: 36 },
    { value: 33 },
    { value: 47 },
    { value: 40 },
    { value: 45 },
    { value: 42 },
    { value: 54 },
    { value: 50 },
    { value: 58 },
  ];

  return (
    <div className="statistics-page">

      {/* Header */}
      <div className="statistics-header">
        <h1>Statistics</h1>
        <p>
          Analytics and insights for the CipherDraw blockchain lottery.
        </p>
      </div>

      <div className="statistics-grid">

        {/* Winning Chance */}
        <div className="statistics-card chance-card">

          <div className="card-title">
            Winning Chance{" "}
            <span className="subtitle">(Your Chance)</span>
          </div>

          <div className="chance-content">

            <div className="top-section">

              <div className="donut-wrapper">
                <CircularProgressbar
                  value={winningChance}
                  text={`${winningChance}%`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "#8b5cf6",
                    trailColor: "#2b3652",
                    strokeLinecap: "round",
                  })}
                />
              </div>

              <div className="chance-details">

                <div className="detail-box">
                  <span>Current Players</span>
                  <h2>{stats?.totalPlayers ?? "--"}</h2>
                </div>

                <div className="detail-box">
                  <span>Total Tickets</span>
                  <h2>{totalTickets}</h2>
                </div>

              </div>

            </div>

            <div className="chance-tip">
              <strong>🎯 Better odds with fewer players!</strong>
              <small>Share CipherDraw with friends.</small>
            </div>

          </div>

        </div>

        {/* Network Status */}
        <div className="statistics-card network-card">

          <div className="card-header">
            <h3>Network Status</h3>
            <span className={
              networkStatus.connected
                ? "network-badge healthy"
                : "network-badge offline"
            }>
              <span className="status-dot"></span>
              {networkStatus.connected
                ? "Healthy"
                : "Offline"
              }
            </span>
          </div>

          <div className="network-chart">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={networkData}>

                <defs>

                  <linearGradient
                    id="networkGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#20d9ff"
                      stopOpacity={0.45}
                    />

                    <stop
                      offset="95%"
                      stopColor="#20d9ff"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#20d9ff"
                  strokeWidth={3}
                  fill="url(#networkGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#20d9ff",
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

          <div className="network-grid">

            <div className="mini-box">
              <p>Latest Block</p>
              <strong>{networkStatus.blockNumber.toLocaleString()}</strong>
            </div>

            <div className="mini-box">
              <p>Gas Price</p>
              <strong>{networkStatus.gasPrice} Gwei</strong>
            </div>

            <div className="mini-box">
              <p>Latency</p>
              <strong>{networkStatus.latency} ms</strong>
            </div>

            <div className="mini-box">
              <p>Status</p>
              <strong>{networkStatus.connected ? "Connected" : "Disconnected"} </strong>
            </div>

          </div>

        </div>

{/* Recent Activity */}
<div className="statistics-card activity-card">

  <div className="card-header">
    <h3>Recent Activity</h3>

    <button
      className="activity-count"
      onClick={() => {
      alert("Activity History coming soon 🚀");
      }}
    >
      {recentActivities.length} Event
      {recentActivities.length !== 1 ? "s" : ""}
    </button>
  </div>

  <div className="activity-list">

    {recentActivities.length === 0 ? (

      <p style={{ color: "#9CA9C7" }}>
        No blockchain activity yet.
      </p>

    ) : (

      recentActivities.map((activity, index) => (

        <div
          className={`activity-item ${activity.type}`}
          key={index}
        >

          <div className="activity-left">

            <div className={`activity-icon ${activity.type}`}>
              {activity.type === "ticket" && <Ticket size={18} />}
              {activity.type === "winner" && <Trophy size={18} />}
              {activity.type === "start" && <Rocket size={18} />}
            </div>

            <div className="activity-text">
              <div className="activity-top">
              <div className="activity-title">
                {activity.wallet === "SYSTEM"
                   ? "SYSTEM" : `${activity.wallet.slice(0, 6)}...${activity.wallet.slice(-4)}`}
              </div>

              <div className="activity-time">
                {formatActivityTime(activity.timestamp)}
              </div>

              </div>  

              <div className="activity-description">
                {activity.type === "ticket" &&
                  `Bought 1 Ticket • Round #${activity.roundId}`}

                {activity.type === "winner" &&
                  `Won ${activity.prizeAmount} ETH • Round #${activity.roundId}`}

                {activity.type === "start" &&
                  `Round #${activity.roundId} Started`}
              </div>
            </div>

          </div>
        </div>

      ))

    )}

  </div>

</div>

        {/* Prize Pool History */}
        <div className="statistics-card history-card">

          <div className="card-header">
            <h3>Prize Pool History</h3>

            <button className="history-btn">
              {stats?.historyCount ?? "--"} Rounds
            </button>
          </div>

          <div className="history-chart">

            <div className="history-axis-title">
              ETH
            </div>

            <ResponsiveContainer key={JSON.stringify(stats?.prizeHistory)}>

              <LineChart
                data={stats?.prizeHistory || []}
                margin={{
                  top: 40,
                  right: 10,
                  left: 34,
                  bottom: 14,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#2f3a5d"
                />

                <XAxis
                  dataKey="round"
                  tick={{
                    fill: "#b8c0d9",
                    fontSize: 16,
                  }}
                  tickMargin={4}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  width={52}
                  tick={{
                    fill: "#d7def2",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                  tickMargin={8}
                  tickLine={false}
                  axisLine={false}
                >
                </YAxis>

                <Tooltip
                  contentStyle={{
                    background: "#1b2440",
                    border: "1px solid #36456f",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={28}
                  wrapperStyle={{
                    paddingTop: "0px",
                    fontSize: "15px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="prize"
                  name="Prize Pool (ETH)"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#8b5cf6",
                    stroke: "#8b5cf6",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#8b5cf6",
                  }}
                  fillOpacity={1}
                  isAnimationActive
                  animationBegin={200}
                  animationDuration={2200}
                  animationEasing="ease-in-out"
                  connectNulls
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Bottom Statistics */}

      <div className="user-statistics">

        <h3>Your Statistics</h3>

        <div className="user-grid">

          <div className="stats-box">
            <div className={`stats-icon ${stats?.wins > 0 ? "green" : "gray"}`}>
              <CheckCircle2 size={22} />
            </div>

            <div className="stats-info">
              <p>Win Status</p>
              <h2>{stats?.wins > 0 ? "Winner" : "No Wins Yet"}</h2>
            </div>
          </div>

          <div className="stats-box">
            <div className="stats-icon green">
              <CalendarDays size={22} />
            </div>

            <div className="stats-info">
              <p>Current Round</p>
              <h2>{stats?.currentRound ?? "--"}</h2>
            </div>
          </div>

          <div className="stats-box">
            <div className="stats-icon yellow">
              <Trophy size={22} />
            </div>

            <div className="stats-info">
              <p>Wins</p>
              <h2>{stats?.wins ?? 0}</h2>
            </div>
          </div>

          <div className="stats-box">
            <div className="stats-icon purple">
              <Wallet2 size={22} />
            </div>

            <div className="stats-info">
              <p>Prize Pool</p>
              <h2>{stats?.prizePool?.toFixed(2) ?? "--"} ETH</h2>
            </div>
          </div>

          <div className="stats-box">
            <div className="stats-icon red">
              <Target size={22} />
            </div>

            <div className="stats-info">
              <p>Current Chance</p>
              <h2>{winningChance}%</h2>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Statistics;
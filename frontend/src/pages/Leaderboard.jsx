import { useEffect, useState } from "react";
import {
  Users,
  Trophy,
  Coins,
  Ticket,
} from "lucide-react";

import { useWallet } from "../context/WalletContext";

import {
  getLotteryHistoryCount,
  getLotteryRound,
} from "../services/contract";

import { fetchActivities } from "../services/activityService";

import "./leaderboard.css";

function Leaderboard() {
  console.log("===== LEADERBOARD COMPONENT RENDERED =====");
  
  const { signer, connected } = useWallet();

  const [leaderboard, setLeaderboard] = useState([]);

  const [leaderboardStats, setLeaderboardStats] = useState({
    totalPlayers: 0,
    totalWinners: 0,
    totalEthDistributed: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    async function loadLeaderboardStats() {
      console.log("Leaderboard loading...");
      if (!connected || !signer) {
        console.log("Wallet not connected");
        return;
      }

      console.log("Wallet connected");

      try {
        console.log("Reading lottery history...")
        const historyCount = Number(
          await getLotteryHistoryCount(signer)
        );

        const playerSet = new Set();
        const winnerSet = new Set();

        let totalPrize = 0;

        // -------------------------
        // Read blockchain rounds
        // -------------------------

        for (let i = 0; i < historyCount; i++) {
          const round = await getLotteryRound(signer, i);

          const prize =
            Number(round.prizeAmount) / 1e18;

          totalPrize += prize;

          if (round.winner) {
            winnerSet.add(round.winner);
          }
        }

        // -------------------------
        // Read activities
        // -------------------------

        console.log("Reading activity events...");
        const activities = await fetchActivities();
        console.log("Activities from blockchain:", activities);

        let totalTickets = 0;

        activities.forEach((activity) => {
          if (activity.wallet) {
            playerSet.add(activity.wallet);
          }

          if (activity.type === "ticket") {
            totalTickets++;
          }
        });

        setLeaderboardStats({
          totalPlayers: playerSet.size,
          totalWinners: winnerSet.size,
          totalEthDistributed: totalPrize,
          totalTickets,
        });

        // -------------------------
        // Build leaderboard
        // -------------------------

        const playerMap = {};

        activities.forEach((activity) => {
          const wallet = activity.wallet;

          if (!wallet || wallet === "SYSTEM") return;

          if (!playerMap[wallet]) {
            playerMap[wallet] = {
              wallet,
              tickets: 0,
              wins: 0,
              prize: 0,
            };
          }

          if (activity.type === "ticket") {
            playerMap[wallet].tickets += 1;
          }

          if (activity.type === "winner") {
            playerMap[wallet].wins += 1;
            playerMap[wallet].prize += Number(
              activity.prizeAmount || 0
            );
          }
        });

        const players = Object.values(playerMap)
          .map((player) => ({
            ...player,
            winRate:
              player.tickets > 0
                ? (player.wins / player.tickets) * 100
                : 0,
          }))
          .sort((a, b) => b.prize - a.prize);

        setLeaderboard(players);
      } catch (err) {
        console.error(err );
      }
    }

    loadLeaderboardStats();
  }, [connected, signer]);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
        <p>
          Discover the top-performing players across all
          lottery rounds.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="leaderboard-grid">
        <div className="leaderboard-card">
          <Users size={28} />
          <h2>{leaderboardStats.totalPlayers}</h2>
          <p>Total Players</p>
        </div>

        <div className="leaderboard-card">
          <Trophy size={28} />
          <h2>{leaderboardStats.totalWinners}</h2>
          <p>Total Winners</p>
        </div>

        <div className="leaderboard-card">
          <Coins size={28} />
          <h2>
            {leaderboardStats.totalEthDistributed.toFixed(
              2
            )}
            <small> ETH</small>
          </h2>
          <p>Total Revenue</p>
        </div>

        <div className="leaderboard-card">
          <Ticket size={28} />
          <h2>{leaderboardStats.totalTickets}</h2>
          <p>Tickets Sold</p>
        </div>
      </div>

      {/* Leaderboard Table */}

      <div className="leaderboard-table-card">
        <h2>🏆 Top Players</h2>
        <p className="leaderboard-count">
            {leaderboard.length} Players Ranked
        </p>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Wallet</th>
              <th>Tickets</th>
              <th>Wins</th>
              <th>Prize Won</th>
              <th>Win Rate</th>
            </tr>
          </thead>

          <tbody>
  {leaderboard.length === 0 ? (
    <tr>
      <td colSpan="6" className="empty-row">
        No players found.
      </td>
    </tr>
  ) : (
    leaderboard.map((player, index) => (
      <tr
        key={player.wallet}
        className={player.wins > 0 ? "winner-row" : ""}
      >
        <td>
          {index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : index === 2
            ? "🥉"
            : `#${index + 1}`}
        </td>

        <td>
          <a
            href={`https://sepolia.etherscan.io/address/${player.wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wallet-link"
          >
            {player.wallet.slice(0, 6)}...
            {player.wallet.slice(-4)}
          </a>
        </td>

        <td>{player.tickets}</td>
        <td>{player.wins}</td>
        <td>{player.prize.toFixed(2)} ETH</td>
        <td>{player.winRate.toFixed(1)}%</td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
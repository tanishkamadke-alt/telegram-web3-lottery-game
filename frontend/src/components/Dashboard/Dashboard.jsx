import { useCallback, useEffect, useState } from "react";
import "./dashboard.css";

import { useWallet } from "../../context/WalletContext";

import Card from "../Common/Card";
import BuyTicket from "../Lottery/BuyTicket";
import LatestWinner from "../Lottery/LatestWinner";

import dashboardData from "../../data/dashboardData";

import {
  getCurrentRound,
  getTotalPlayers,
  getPrizePool,
  getLotteryStatus,
  getManager,
} from "../../services/contract";

import {
  Trophy,
  Users,
  Coins,
  Ticket,
  Crown,
  Clock3,
} from "lucide-react";

function Dashboard({
  refreshKey,
  setPage,
}) {
  const {
    signer,
    walletAddress,
  } = useWallet();

  const [currentRound, setCurrentRound] = useState(0);
  const [players, setPlayers] = useState(0);
  const [prizePool, setPrizePool] = useState("0");
  const [isManager, setIsManager] = useState(false);

  // 60 minute countdown
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {

  if (!signer) return;

  let interval;

  async function startCountdown() {

    const status = await getLotteryStatus(signer);

    const isOpen = status[0];
    const endTime = Number(status[2]);

    if (!isOpen) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(endTime - now, 0);
      setTimeLeft(remaining);
    };

    updateTimer();

    interval = setInterval(updateTimer, 1000);
  }

  startCountdown();

  return () => {
    if (interval) clearInterval(interval);
  };

}, [signer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const loadDashboardData = useCallback(async () => {
    if (!signer) return;

    try {
      const [
        round,
        totalPlayers,
        prize,
        manager,
      ] = await Promise.all([
        getCurrentRound(signer),
        getTotalPlayers(signer),
        getPrizePool(signer),
        getManager(signer),
      ]);

      setCurrentRound(Number(round));
      setPlayers(Number(totalPlayers));
      setPrizePool(prize);

      setIsManager(
        walletAddress?.toLowerCase() ===
          manager?.toLowerCase()
      );

      if (import.meta.env.DEV) {
        console.log("Current Round:", Number(round));
        console.log("Players:", Number(totalPlayers));
        console.log("Prize Pool:", prize);
        console.log("Manager:", manager);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setCurrentRound(0);
      setPlayers(0);
      setPrizePool("0");
      setIsManager(false);
    }
  }, [signer, walletAddress]);

useEffect(() => {
  const fetchData = async () => {
    await loadDashboardData();
  };

  fetchData();
}, [loadDashboardData, refreshKey]);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Real-time overview of the CipherDraw lottery and blockchain activity.
          </p>
        </div>

        {isManager && (
          <button
            className="admin-panel-btn"
            onClick={() => setPage("manager")}
          >
            <Crown size={18} />
            Open Admin Panel
          </button>
        )}
      </div>
        
      {/* Statistics */}
      <div className="stats-grid">

        <Card
          icon={<Trophy size={28} />}
          title="Current Round"
          value={currentRound}
          status={
            currentRound > 0
              ? "🟢 Active Lottery"
              : "No Active Round"
          }
        />

        <Card
          icon={<Users size={28} />}
          title="Players"
          value={players}
          status={
            players === 0
              ? "No Players Joined"
              : `${players} Participant${players > 1 ? "s" : ""}`
          }
        />

        <Card
          icon={<Coins size={28} />}
          title="Prize Pool"
          value={`${prizePool} ETH`}
          status={
            Number(prizePool) > 0
              ? "Prize Growing"
              : "Waiting for First Ticket"
          }
        />

        <Card
          icon={<Ticket size={28} />}
          title="Ticket Price"
          value={dashboardData.ticketPrice}
          status="Fixed Smart Contract Price"
        />

        <Card
          icon={<Clock3 size={28} />}
          title="Time Left"
          value={formattedTime}
          status={
            timeLeft > 0
              ? "Until Round Ends"
              : "Round Ended"
          }
        />

      </div>

      {/* Main Cards */}
      <div className="dashboard-row">

        <BuyTicket
          ticketPrice={dashboardData.ticketPrice}
          currentRound={currentRound}
          participants={players}
          prizePool={prizePool}
          onTicketPurchased={loadDashboardData}
        />

        <LatestWinner
          refreshKey={refreshKey}
        />

      </div>

    </div>
  );
}

export default Dashboard;
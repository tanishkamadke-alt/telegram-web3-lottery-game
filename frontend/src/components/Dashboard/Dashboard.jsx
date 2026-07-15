import Card from "../Common/Card";
import "./dashboard.css";
import BuyTicket from "../Lottery/BuyTicket";
import LatestWinner from "../Lottery/LatestWinner";
import dashboardData from "../../data/dashboardData";
import { getCurrentRound } from "../../services/contract";
import { useEffect, useState } from "react";

import {
  Trophy,
  Users,
  Coins,
  Ticket,
} from "lucide-react";

function Dashboard() {

    const [currentRound, setCurrentRound] = useState(0);

    useEffect(() => {
  async function loadCurrentRound() {
    try {
      const round = await getCurrentRound();

console.log("Current Round from blockchain:", round);
console.log("Converted:", Number(round));

setCurrentRound(Number(round));
    } catch (error) {
      console.error("Failed to load current round:", error);
    }
  }

  loadCurrentRound();
}, []);

    return (
    <div className="dashboard">

      <h1 className="dashboard-title">
        Dashboard
      </h1>

    <div className="stats-grid">
        <Card
            icon={<Trophy size={28} />}
            title="Current Round"
            value={currentRound}
            status={dashboardData.roundStatus}
        />

<Card
  icon={<Users size={28} />}
  title="Players"
  value={dashboardData.players}
  status={dashboardData.playerStatus}
/>

<Card
  icon={<Coins size={28} />}
  title="Prize Pool"
  value={dashboardData.prizePool}
  status={dashboardData.prizeStatus}
/>

<Card
  icon={<Ticket size={28} />}
  title="Ticket Price"
  value={dashboardData.ticketPrice}
  status={dashboardData.ticketStatus}
/>
    </div>

    <div className="dashboard-row">
        
        <BuyTicket
            ticketPrice={dashboardData.ticketPrice}
            currentRound={dashboardData.currentRound}
        />
        <LatestWinner />

    </div>

      <div className="history-section">
      </div>

    </div>
  );
}
export default Dashboard;
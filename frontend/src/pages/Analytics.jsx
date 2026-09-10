import { useEffect, useState } from "react";
import {
  Activity,
  Coins,
  Users,
  Trophy,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import {
  getLotteryHistoryCount,
  getLotteryRound,
} from "../services/contract";
import { fetchActivities } from "../services/activityService";

import { useWallet } from "../context/WalletContext";

import "./analytics.css";

function Analytics() {
  const { signer, connected } = useWallet();

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    totalRounds: 0,
    averagePrize: 0,
  });

    const [ticketTrend, setTicketTrend] = useState([]);
    const [prizeTrend, setPrizeTrend] = useState([]);
    const [activities, setRecentTransactions] = useState([]);

    const [biggestWinner, setBiggestWinner] = useState({
        address: "--",
        prize: 0,
        round: "--",
    });

    const [roundInsights, setRoundInsights] = useState({
        highestPrize: 0,
        lowestPrize: 0,
        averagePlayers: 0,
        largestRound: 0,
    });

    const [mostActivePlayer, setMostActivePlayer] = useState({
        address: "--",
        tickets: 0,
    });

  useEffect(() => {
    async function loadAnalytics() {
      if (!connected || !signer) return;

      try {
        const historyCount = Number(
          await getLotteryHistoryCount(signer)
        );

        let totalRevenue = 0;
        let totalTickets = 0;
        let totalPrize = 0;

        const ticketHistory = [];
        const prizeHistory = [];

        let highestPrize = 0;
        let lowestPrize = Infinity;
        let largestRound = 0;

        let biggestWinnerData = {
            address: "--",
            prize: 0,
            round: "--",
        };

        for (let i = 0; i < historyCount; i++) {
          const round = await getLotteryRound(signer, i);

          const players = Number(round.totalPlayers);
          const prize = Number(round.prizeAmount) / 1e18;

            if (prize > highestPrize) {
                highestPrize = prize;

                biggestWinnerData = {
                address: round.winner,
                prize,
                round: Number(round.roundId),
                };
            }

            if (prize < lowestPrize) {
                lowestPrize = prize;
            }

            if (players > largestRound) {
                largestRound = players;
            }

          totalTickets += players;
          totalRevenue += players * 0.01;
          totalPrize += prize;

          ticketHistory.push({
            round: `R${Number(round.roundId)}`,
            tickets: players,
          });

          prizeHistory.push({
            round: `R${Number(round.roundId)}`,
            prize,
          });
        }

        // ============================
        // Most Active Player
        // ============================

        const activities = await fetchActivities();

        //latest 05 blockchain txns
        setRecentTransactions(activities.slice(0,5));

        console.log("Activities:", JSON.stringify(activities, null, 2));

        const ticketMap = {};

        activities.forEach((activity) => {

            if (activity.type !== "ticket") return;

            ticketMap[activity.wallet] =
                (ticketMap[activity.wallet] || 0) + 1;

        });

        let activePlayer = "--";
        let maxTickets = 0;

        Object.entries(ticketMap).forEach(([address, tickets]) => {

            if (tickets > maxTickets) {

                activePlayer = address;

                maxTickets = tickets;

            }

        });

        setMostActivePlayer({
            address: activePlayer,
            tickets: maxTickets,
        });

        console.log("Most Active Player");
        console.log(activePlayer);
        console.log(maxTickets);

        setAnalytics({
          totalRevenue,
          totalTickets,
          totalRounds: historyCount,
          averagePrize:
            historyCount > 0
              ? totalPrize / historyCount
              : 0,
        });

        setBiggestWinner(biggestWinnerData);

        setRoundInsights({
            highestPrize,
            lowestPrize:
                lowestPrize === Infinity ? 0 : lowestPrize,
            averagePlayers:
                historyCount > 0
                ? totalTickets / historyCount
                : 0,
            largestRound,
        });

        setTicketTrend(ticketHistory);
        setPrizeTrend(prizeHistory);

      } catch (err) {
        console.error(err);
      }
    }

    loadAnalytics();
  }, [connected, signer]);

  return (
    <div className="analytics-page">

      {/* Header */}

      <div className="analytics-header">
        <h1>Blockchain Analytics</h1>

        <p>
          Real-time insights into lottery performance, revenue,
          ticket sales and on-chain activity.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="analytics-grid">

        <div className="analytics-card">
          <Activity />
          
          <h2>
            {analytics.totalRevenue.toFixed(2)}
            <small> ETH</small>
          </h2>

          <p>Total Revenue</p>
        </div>

        <div className="analytics-card">
          <Users />
          <h2>{analytics.totalTickets}</h2>
          <p>Tickets Sold</p>
        </div>

        <div className="analytics-card">
          <Coins />
          <h2>{analytics.totalRounds}</h2>
          <p>Total Rounds</p>
        </div>

        <div className="analytics-card">
          <Trophy />
          
          <h2> 
            {analytics.averagePrize.toFixed(2)}
            <small> ETH</small>
          </h2>
          
          <p>Average Prize</p>
        </div>

      </div>

            {/* Charts */}

      <div className="analytics-charts">

        {/* Ticket Sales */}

        <div className="analytics-chart-card">

          <div className="card-header">
            <h3>Ticket Sales Trend</h3>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={ticketTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3655" />
              <XAxis dataKey="round" stroke="#9CA9C7" />
              <YAxis stroke="#9CA9C7" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="tickets"
                stroke="#20D9FF"
                fill="#20D9FF33"
              />
            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* Prize Pool */}

        <div className="analytics-chart-card">

          <div className="card-header">
            <h3>Prize Pool Growth</h3>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={prizeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3655" />
              <XAxis dataKey="round" stroke="#9CA9C7" />
              <YAxis stroke="#9CA9C7" />
              <Tooltip />
              <Bar
                dataKey="prize"
                fill="#8B5CF6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div> {/* End analytics-charts */}

      {/* Bottom Cards */}

      <div className="analytics-bottom">

        {/* Biggest Winner */}
        <div className="analytics-card analytics-widget">
            <Trophy size={30} />

            <h3>Biggest Winner</h3>

            <p className="wallet-address">
            {biggestWinner.address &&
            biggestWinner.address !== "--"
             ? `${biggestWinner.address.slice(0, 6)}...${biggestWinner.address.slice(-4)}`
             : "--"}
            </p>

            <h2>
            {biggestWinner.prize.toFixed(2)}
            <small> ETH</small>
            </h2>

            <span>Round #{biggestWinner.round}</span>
            </div>

            {/* Most Active Player */}
            <div className="analytics-card analytics-widget">
            <Users size={30} />

            <h3>Most Active Player</h3>

            <p className="wallet-address">
            {mostActivePlayer.address &&
            mostActivePlayer.address !== "--"
                ? `${mostActivePlayer.address.slice(0, 6)}...${mostActivePlayer.address.slice(-4)}`
                : "--"}
            </p>

            <h2>{mostActivePlayer.tickets}</h2>

            <span>Tickets Purchased</span>
        </div>

        {/* Round Insights */}
        <div className="analytics-card analytics-widget">
            <Activity size={30} />

            <h3>Round Insights</h3>

            <div className="insight-row">
            <span>Highest Prize</span>
            <strong>{roundInsights.highestPrize.toFixed(2)} ETH</strong>
        </div>

        <div className="insight-row">
            <span>Lowest Prize</span>
            <strong>{roundInsights.lowestPrize.toFixed(2)} ETH</strong>
            </div>

        <div className="insight-row">
            <span>Avg Players</span>
            <strong>{roundInsights.averagePlayers.toFixed(1)}</strong>
        </div>

        <div className="insight-row">
            <span>Largest Round</span>
            <strong>{roundInsights.largestRound}</strong>
        </div>
    
    </div> {/* End Round Insights */}

    <div className="analytics-transactions">
        <h3>Recent On-Chain Transactions</h3>
        <div className="transaction-list">
            {activities.slice(0, 5).map((activity, index) => (
                <a
                    key={index}
                    href={`https://sepolia.etherscan.io/tx/${activity.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transaction-item"
                >

                    <div className="transaction-left">
                        <span className={`tx-type ${activity.type}`}>
                             {activity.type.toUpperCase()}
                        </span>

                        <div className="tx-details">
                            <small>
                                 Round #{activity.roundId}    
                            </small>  
                            <span>
                                {activity.wallet.slice(0,8)}...
                                {activity.wallet.slice(-8)}
                            </span>
                        </div> 
                    </div>

                    <strong>
                        {activity.amount} ETH
                    </strong>
                </a>
            ))}                               
        </div>
    </div>

    </div> {/* End analytics-bottom */}

    </div> 

);

}

export default Analytics;
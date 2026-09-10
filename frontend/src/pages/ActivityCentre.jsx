import "./activitycentre.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import {
  Trophy,
  Clock,
  Copy,
  CheckCircle2,
  Activity,
} from "lucide-react";

import { useWallet } from "../context/WalletContext";

import {
  getLotteryHistoryCount,
  getLotteryRound,
} from "../services/contract";

function ActivityCentre({ refreshKey }) {

  const { signer, walletAddress } = useWallet();

  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState([]);
  const [showAll, setShowAll] = useState(false)
  const [totalRoundsCount, setTotalRoundsCount] = useState(0);

  const loadHistory = useCallback(async () => {

    if (!signer) {

      setRounds([]);

      setLoading(false);

      return;

    }

    try {

      setLoading(true);

      const totalRounds = Number(
        await getLotteryHistoryCount(signer)
      );
      setTotalRoundsCount(totalRounds);

      if (totalRounds === 0) {

        setRounds([]);

        return;

      }

      const promises = [];

const startIndex = showAll
  ? 0
  : Math.max(totalRounds - 10, 0);

for (
  let i = totalRounds - 1;
  i >= startIndex;
  i--
) {
  promises.push(
    getLotteryRound(
      signer,
      i
    )
  );
}

      const history =
        await Promise.all(promises);

      const formattedHistory =
        history.map((round) => ({

          roundId: Number(
            round.roundId
          ),

          winner:
            round.winner,

          prize:
            ethers.formatEther(
              round.prizeAmount
            ),

          players:
            Number(
              round.totalPlayers
            ),

          ticketPrice:
            ethers.formatEther(
              round.ticketPrice
            ),

          lotteryHash:
            round.lotteryHash,

          timestamp:
            new Date(
              Number(round.timestamp) * 1000
            ).toLocaleString(),

          isWinner:

            walletAddress &&
            round.winner.toLowerCase() ===
            walletAddress.toLowerCase(),

        }));

      setRounds(
        formattedHistory
      );

    }

    catch (error) {

      console.error(
        "Failed to load activity:",
        error
      );

      setRounds([]);

    }

    finally {

      setLoading(false);

    }

  }, [signer, walletAddress, showAll]);

  useEffect(() => {
    const fetchHistory=async () => {
      await loadHistory();
    }

    fetchHistory();

  }, [loadHistory, refreshKey]);

  const stats = useMemo(() => {

    const wins =
      rounds.filter(
        round => round.isWinner
      ).length;

    const totalWon =
      rounds
        .filter(
          round => round.isWinner
        )
        .reduce(
          (sum, round) =>
            sum + Number(round.prize),
          0
        )
        .toFixed(2);

    return {

      totalRounds:
        rounds.length,

      wins,

      totalWon,

      latestRound:
        rounds.length > 0
          ? rounds[0].roundId
          : 0,

    };

  }, [rounds]);

  if (loading) {

    return (

      <div className="dashboard">

        <h1 className="dashboard-title">

          Activity Centre

        </h1>

        <div className="panel-card">

          Loading blockchain history...

        </div>

      </div>

    );

  }

  return (

    <div className="dashboard">

      <div className="history-header">

        <h1 className="dashboard-title">

          Activity Centre

        </h1>

        <p className="history-subtitle">

          Complete history of all completed lottery rounds stored on-chain.

        </p>

      </div>

      <div className="history-stats">

        <div className="history-stat-card">

          <span className="history-stat-label">

            📜 Completed Rounds

          </span>

          <h2>

            {totalRoundsCount}

          </h2>

          <p>

            Stored On Blockchain

          </p>

        </div>

        <div className="history-stat-card">

          <span className="history-stat-label">

            🏆 Your Wins

          </span>

          <h2>

            {stats.wins}

          </h2>

          <p>

            Winning Lotteries

          </p>

        </div>

        <div className="history-stat-card">

          <span className="history-stat-label">

            💰 Total Won

          </span>

          <h2>

            {stats.totalWon} ETH

          </h2>

          <p>

            Lifetime Earnings

          </p>

        </div>

        <div className="history-stat-card">

          <span className="history-stat-label">

            🎯 Latest Round

          </span>

          <h2>

            #{stats.latestRound}

          </h2>

          <p>

            Current History

          </p>

        </div>

      </div>

            {rounds.length === 0 ? (

        <div className="panel-card empty-activity">

          <Activity size={48} />

          <h3>

            No Lottery History

          </h3>

          <p>

            Complete a lottery round to see blockchain history here.

          </p>

        </div>

      ) : (
  <>
    {!showAll && stats.totalRounds > 10 && (
      <div className="activity-view-all">
        <button
          className="view-all-btn"
          onClick={() => {
            setShowAll(true);
            loadHistory();
          }}
        >
          View All Activity
        </button>
      </div>
    )}

        <div className="activity-timeline">

          {rounds.map((round) => (

            <div
              className="activity-card"
              key={round.roundId}
            >

              {/* Card Header */}

              <div className="activity-card-header">

                <div className="activity-header-left">

                  <div className="activity-icon">

                    <Trophy size={22} />

                  </div>

                  <div>

                    <h3>

                      {round.isWinner
                        ? "Lottery Won"
                        : "Lottery Completed"}

                    </h3>

                    <p className="activity-subtitle">

                      Round #{round.roundId}

                    </p>

                  </div>

                </div>

                <div
                  className={
                    round.isWinner
                      ? "winner-badge"
                      : "activity-status"
                  }
                >

                  <CheckCircle2 size={16} />

                  {round.isWinner
                    ? "YOU WON"
                    : "Completed"}

                </div>

              </div>

              <div className="activity-divider"></div>

              {/* Details */}

              <div className="activity-grid">

                <div className="activity-item">

                  <span>Winner</span>

                  <strong>

                    {round.winner.substring(0, 8)}
                    ...
                    {round.winner.substring(
                      round.winner.length - 6
                    )}

                  </strong>

                </div>

                <div className="activity-item">

                  <span>

                    Prize

                  </span>

                  <strong>

                    {round.prize} ETH

                  </strong>

                </div>

                <div className="activity-item">

                  <span>

                    Players

                  </span>

                  <strong>

                    {round.players}

                  </strong>

                </div>

                <div className="activity-item">

                  <span>

                    Ticket Price

                  </span>

                  <strong>

                    {round.ticketPrice} ETH

                  </strong>

                </div>

                <div className="activity-item">

                  <span>

                    Lottery Hash

                  </span>

                  <strong>

                    {round.lotteryHash.substring(0, 10)}
                    ...

                  </strong>

                </div>

              </div>

              <div className="activity-divider"></div>

              {/* Footer */}

              <div className="activity-footer">

                <div className="activity-time">

                  <Clock size={15} />

                  {round.timestamp}

                </div>

                <div className="activity-actions">

                  <button
                    className="copy-btn"
                    onClick={() => {

                      navigator.clipboard.writeText(
                        round.winner
                      );

                      alert(
                        "Winner address copied!"
                      );

                    }}
                  >

                    <Copy size={16} />

                    Winner

                  </button>

                  <button
                    className="copy-btn"
                    onClick={() => {

                      navigator.clipboard.writeText(
                        round.lotteryHash
                      );

                      alert(
                        "Lottery hash copied!"
                      );

                    }}
                  >

                    <Copy size={16} />

                    Hash

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      </>  

      )}

    </div>

  );

}

export default ActivityCentre;

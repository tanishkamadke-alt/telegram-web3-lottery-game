import useAutoRefresh from "../hooks/useAutoRefresh";
import "./manager.css";
import toast from "react-hot-toast";

import { Crown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWallet } from "../context/WalletContext";
import { showWinnerPopup } from "../utils/showWinnerPopup";

import {
  drawWinner,
  getManager,
  getCurrentRound,
  getTotalPlayers,
  getPrizePool,
  getLatestWinnerDetails,
} from "../services/contract";

function Manager({ refreshBlockchainData }) {

  const { signer } = useWallet();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [isManager, setIsManager] = useState(false);

  const [managerAddress, setManagerAddress] = useState("");
  const [currentRound, setCurrentRound] = useState(0);
  const [players, setPlayers] = useState(0);
  const [prizePool, setPrizePool] = useState("0");

  /*Live Status */

  const walletConnected = !!signer;

  const lotteryOpen = players > 0;

  const hasPrizePool =
    Number(prizePool) > 0;

  const canDrawWinner =
    walletConnected &&
    isManager &&
    lotteryOpen &&
    hasPrizePool;

  /* Load Manager Data */

  const loadManagerData = useCallback(async () => {

    if (!signer) {

      setIsManager(false);
      setManagerAddress("");
      setCurrentRound(0);
      setPlayers(0);
      setPrizePool("0");

      setPageLoading(false);

      return;
    }

    try {

      setPageLoading(true);

      const wallet =
        await signer.getAddress();

      const [
        manager,
        round,
        totalPlayers,
        prize,
      ] = await Promise.all([

        getManager(signer),
        getCurrentRound(signer),
        getTotalPlayers(signer),
        getPrizePool(signer),

      ]);

      setManagerAddress(manager);

      setIsManager(
        wallet.toLowerCase() ===
        manager?.toLowerCase()
      );

      setCurrentRound(Number(round));
      setPlayers(Number(totalPlayers));
      setPrizePool(prize);

    } catch (error) {

      console.error(error);

      setIsManager(false);
      setManagerAddress("");
      setCurrentRound(0);
      setPlayers(0);
      setPrizePool("0");

    } finally {

      setPageLoading(false);

    }

  }, [signer]);

  useEffect(() => {

    loadManagerData();

  }, [loadManagerData]);
  useAutoRefresh(loadManagerData, 10000);

  /*Draw Winner */

  async function handleDrawWinner() {

    if (!signer) {

      toast.error(
        "Please connect your wallet."
      );

      return;
    }

    let loadingToast;

    try {

      setLoading(true);

      loadingToast =
        toast.loading(
          "Waiting for manager confirmation..."
        );

      await drawWinner(signer);

      toast.dismiss(loadingToast);

      toast.success(
        "Winner selected successfully!"
      );

      const winnerData =
        await getLatestWinnerDetails(signer);

      if (winnerData) {

        showWinnerPopup({

          winner:
            winnerData.winner,

          prizeAmount:
            ethers.formatEther(
              winnerData.prizeAmount
            ),

          roundId:
            Number(
              winnerData.roundId
            ),

          totalPlayers:
            Number(
              winnerData.totalPlayers
            ),

          lotteryHash:
            winnerData.lotteryHash,

        });

      }

      if (refreshBlockchainData) {

        refreshBlockchainData();

      }

      await loadManagerData();

    } catch (error) {

      console.error(error);

      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      toast.error(

        error.reason ||

        error.shortMessage ||

        error.message ||

        "Failed to draw winner."

      );

    } finally {

      setLoading(false);

    }

  }

  /*Loading Screen*/

  if (pageLoading) {

    return (

      <div className="dashboard">

        <h1 className="dashboard-title">
          Manager Dashboard
        </h1>

        <div className="panel-card">

          <p>
            Loading manager data...
          </p>

        </div>

      </div>

    );

  }

    return (
    <div className="dashboard">

      {/* Header */}

      <div className="history-header">

        <h1 className="dashboard-title">
          Manager Dashboard
        </h1>

        <p className="history-subtitle">
          Manage and monitor the CipherDraw lottery.
        </p>

      </div>

      {/* Statistics */}

      <div className="history-stats">

        <div className="history-stat-card">

          <span className="history-stat-label">
            🎲 Current Round
          </span>

          <h2>{currentRound}</h2>

          <p>Active Lottery</p>

        </div>

        <div className="history-stat-card">

          <span className="history-stat-label">
            💰 Prize Pool
          </span>

          <h2>{prizePool} ETH</h2>

          <p>Current Pot</p>

        </div>

        <div className="history-stat-card">

          <span className="history-stat-label">
            👥 Players
          </span>

          <h2>{players}</h2>

          <p>Joined Players</p>

        </div>

        <div className="history-stat-card">

          <span className="history-stat-label">
            {loading ? "🟡" : players > 0 ? "🟢" : "⚪"} Lottery Status
          </span>

          <h2>
            {loading
              ? "DRAWING"
              : players > 0
              ? "OPEN"
              : "WAITING"}
          </h2>

          <p>
            {loading
              ? "Selecting Winner"
              : players > 0
              ? "Ready to Draw"
              : "Waiting for Players"}
          </p>

        </div>

      </div>

      {/* Access Control */}

      {!isManager ? (

        <div className="panel-card">

          <div className="panel-header">

            <div className="panel-icon">
              <Crown size={22} />
            </div>

            <div>

              <h3 className="panel-title">
                Access Denied
              </h3>

              <p className="panel-subtitle">
                Only the contract manager can access this page.
              </p>

            </div>

          </div>

        </div>

      ) : (

        <div className="panel-card">

          {/* Card Header */}

          <div className="panel-header">

            <div className="panel-icon">
              <Crown size={22} />
            </div>

            <div>

              <h3 className="panel-title">
                Manager Controls
              </h3>

              <p className="panel-subtitle">
                Authorized Lottery Administration
              </p>

            </div>

          </div>

          {/* Wallet */}

          <div className="panel-info">

            <div className="info-row">

              <span>Manager Wallet</span>

              <strong className="wallet-address">

                {managerAddress
                  ? `${managerAddress.substring(
                      0,
                      6
                    )}...${managerAddress.substring(
                      managerAddress.length - 4
                    )}`
                  : "-"}

              </strong>

            </div>

          </div>

          {/* Live Status */}

          <div className="manager-info-box">

            <h4>
              Live Admin Status
            </h4>

            <div className="manager-status-list">

              <div className="manager-status-row">

                <span>Wallet Connected</span>

                <strong
                  className={
                    walletConnected
                      ? "status-success"
                      : "status-error"
                  }
                >
                  {walletConnected
                    ? "Connected"
                    : "Not Connected"}
                </strong>

              </div>

              <div className="manager-status-row">

                <span>Administrator</span>

                <strong
                  className={
                    isManager
                      ? "status-success"
                      : "status-error"
                  }
                >
                  {isManager
                    ? "Verified"
                    : "Unauthorized"}
                </strong>

              </div>

              <div className="manager-status-row">

                <span>Lottery Status</span>

                <strong
                  className={
                    lotteryOpen
                      ? "status-success"
                      : "status-warning"
                  }
                >
                  {lotteryOpen
                    ? "Open"
                    : "Waiting"}
                </strong>

              </div>

              <div className="manager-status-row">

                <span>Players Joined</span>

                <strong>
                  {players}
                </strong>

              </div>

              <div className="manager-status-row">

                <span>Prize Pool</span>

                <strong
                  className={
                    hasPrizePool
                      ? "status-success"
                      : "status-warning"
                  }
                >
                  {prizePool} ETH
                </strong>

              </div>

            </div>

          </div>

          <hr className="manager-divider" />

          {/* Draw Button */}

          <button
            className="buy-button"
            onClick={handleDrawWinner}
            disabled={
              loading ||
              !canDrawWinner
            }
          >

            {loading
              ? "🎲 Drawing Winner..."
              : "🎲 Draw Lottery Winner"}

          </button>

        </div>

      )}

    </div>
  );
}

export default Manager;

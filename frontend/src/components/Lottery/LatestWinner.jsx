import "./latestWinner.css";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import {
  Trophy,
  Wallet,
  Coins,
  Target,
  CheckCircle,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWallet } from "../../context/WalletContext";

import {
  getLatestWinnerDetails,
} from "../../services/contract";

function LatestWinner({ refreshKey }) {

  const { signer } = useWallet();

  const [winner, setWinner] = useState("");
  const [prize, setPrize] = useState("0");
  const [round, setRound] = useState(0);

  const loadWinner = useCallback(async () => {

    if (!signer) return;

    try {

      const latestRound =
        await getLatestWinnerDetails(signer);

      if (!latestRound) {

        setWinner("");
        setPrize("0");
        setRound(0);

        return;
      }

      setWinner(latestRound.winner);

      setPrize(
        ethers.formatEther(
          latestRound.prizeAmount
        )
      );

      setRound(
        Number(latestRound.roundId)
      );

    } catch (error) {

      console.error(error);

      setWinner("");
      setPrize("0");
      setRound(0);

    }

  }, [signer]);

  useEffect(() => {

    loadWinner();

  }, [loadWinner, refreshKey]);
  useAutoRefresh(loadWinner, 10000);

  return (

    <div className="latest-winner-card">

      <div className="panel-header">

        <div className="panel-icon">
          <Trophy size={22}/>
        </div>

        <div>

          <h3 className="panel-title">
            Latest Winner
          </h3>

          <p className="panel-subtitle">
            Most recent completed lottery
          </p>

        </div>

      </div>

      <div className="panel-info">

        <div className="info-row">

          <span>
            <Wallet size={15}/>
            Winner Wallet
          </span>

          <strong className="wallet-address">

            {winner
              ? `${winner.substring(0,6)}...${winner.substring(
                  winner.length-4
                )}`
              : "No Winner"}

          </strong>

        </div>

        <div className="info-row">

          <span>
            <Coins size={15}/>
            Prize Won
          </span>

          <strong>

            {prize} ETH

          </strong>

        </div>

        <div className="info-row">

          <span>
            <Target size={15}/>
            Winning Round
          </span>

          <strong>

            #{round}

          </strong>

        </div>

      </div>

      <div className="winner-status">

        <div className="status-item">
          <CheckCircle size={16}/>
          Prize Distributed
        </div>

        <div className="status-item">
          <CheckCircle size={16}/>
          Stored On-Chain
        </div>

      </div>

    </div>

  );

}

export default LatestWinner;
import Swal from "sweetalert2";
import "./buyTicket.css";
import toast from "react-hot-toast";
import { useState } from "react";

import {
  Ticket,
  Trophy,
  Users,
  Coins,
  CheckCircle,
} from "lucide-react";

import { buyTicket } from "../../services/contract";
import { useWallet } from "../../context/WalletContext";
import { useRecentActivity } from "../../context/RecentActivityContext";

function BuyTicket({
  ticketPrice,
  currentRound,
  participants = 0,
  prizePool = "0",
  onTicketPurchased,
}) {

  const { signer } = useWallet();
  const { addRecentActivity } = useRecentActivity();

  const [loading, setLoading] = useState(false);

  async function handleBuyTicket() {

    if (!signer) {

      toast.error("Please connect your wallet first.");

      return;

    }

    if (loading) return;

    let loadingToast;

    try {

      setLoading(true);

      loadingToast = toast.loading(
        "Waiting for wallet confirmation..."
      );
      console.log("Signer:", signer);
      const receipt = await buyTicket(signer);

      toast.dismiss(loadingToast);

      Swal.fire({

        toast: true,

        position: "top",

        icon: "success",

        title: "🎫 Ticket Purchased Successfully!",

        text: `Round #${currentRound} • ${ticketPrice}`,

        showConfirmButton: false,

        timer: 3000,

        timerProgressBar: true,

        background: "#1F2947",

        color: "#ffffff",

        iconColor: "#22D3EE",

        customClass: {

          popup: "ticket-toast",

        },

      });

      console.log("Transaction:", receipt.hash);
      const buyerAddress = await signer.getAddress();

      addRecentActivity({
        type: "ticket",
        title: `${buyerAddress.slice(0, 6)}...${buyerAddress.slice(-4)}`,
        description: `Bought 1 Ticket • Round #${currentRound}`,
        timestamp: Date.now(),
      });

      if (onTicketPurchased) {
        await onTicketPurchased();
      }

    }
    catch (error) {

      if (loadingToast) {

        toast.dismiss(loadingToast);

      }

      console.error(error);

      toast.error(

        error.reason ||

        error.shortMessage ||

        "Transaction failed."

      );

    }

    finally {

      setLoading(false);

    }

  }

    return (

    <div className="buy-ticket-card">

      {/* Header */}

      <div className="panel-header">

        <div className="panel-icon">

          <Ticket size={22} />

        </div>

        <div>

          <h3 className="panel-title">

            Buy Lottery Ticket

          </h3>

          <p className="panel-subtitle">

            Participate in the active blockchain lottery

          </p>

        </div>

      </div>

      {/* Lottery Information */}

      <div className="panel-info">

        <div className="info-row">

          <span>

            <Ticket size={15} />

            Ticket Price

          </span>

          <strong>

            {ticketPrice}

          </strong>

        </div>

        <div className="info-row">

          <span>

            <Trophy size={15} />

            Current Round

          </span>

          <strong>

            #{currentRound}

          </strong>

        </div>

        <div className="info-row">

          <span>

            <Users size={15} />

            Participants

          </span>

          <strong>

            {participants}

          </strong>

        </div>

        <div className="info-row">

          <span>

            <Coins size={15} />

            Prize Pool

          </span>

          <strong>

            {prizePool} ETH

          </strong>

        </div>

      </div>

      {/* Status */}

      <div className="buy-status">

        <div className="status-item">

          <CheckCircle size={16} />

          Wallet Connected

        </div>

        <div className="status-item">

          <CheckCircle size={16} />

          Lottery Open

        </div>

        <div className="status-item">

          <CheckCircle size={16} />

          Eligible to Purchase

        </div>

      </div>

      {/* Buy Button */}

      <button

        className="buy-button"

        onClick={handleBuyTicket}

        disabled={loading}

      >

        {

          loading

            ? "Processing..."

            : "Buy Ticket"

        }

      </button>

    </div>

  );

}

export default BuyTicket;
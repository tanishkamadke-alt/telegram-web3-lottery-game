import { Ticket } from "lucide-react";

function BuyTicket({
  ticketPrice,
  currentRound,
}) {
  return (
    <div className="panel-card">

      <div className="panel-header">

        <div className="panel-icon">
          <Ticket size={22} />
        </div>

        <div>
          <h3 className="panel-title">
            Buy Lottery Ticket
          </h3>

          <p className="panel-subtitle">
            Join the current lottery
          </p>
        </div>

      </div>

      <div className="panel-info">

        <div className="info-row">
          <span>Ticket Price</span>
          <strong>{ticketPrice}</strong>
        </div>

        <div className="info-row">
          <span>Current Round</span>
          <strong>#{currentRound}</strong>
        </div>

      </div>

      <button className="buy-button">
        Buy Ticket
      </button>

    </div>
  );
}

export default BuyTicket;
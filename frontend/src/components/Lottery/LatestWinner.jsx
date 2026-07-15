import { Trophy } from "lucide-react";

function LatestWinner() {
  return (
    <div className="panel-card">

      <div className="panel-header">

        <div className="panel-icon">
          <Trophy size={22} />
        </div>

        <div>
          <h3 className="panel-title">
            Latest Winner
          </h3>

          <p className="panel-subtitle">
            Most recent winner
          </p>
        </div>

      </div>

      <div className="panel-info">

  <div className="winner-section">
    <span className="winner-label">Winner Wallet</span>

    <strong className="wallet-address">
      0x71...93Ac
    </strong>
  </div>

  <div className="winner-section">
    <span className="winner-label">Prize Won</span>

    <strong>
      0.02 ETH
    </strong>
  </div>

  <div className="winner-section">
    <span className="winner-label">Winning Round</span>

    <strong>
      #1
    </strong>
  </div>

        </div>
    </div>
  );
}

export default LatestWinner;
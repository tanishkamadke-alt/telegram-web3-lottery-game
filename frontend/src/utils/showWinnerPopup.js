import Swal from "sweetalert2";

export function showWinnerPopup(data) {

  const shortWinner =
    `${data.winner.substring(0, 8)}...${data.winner.substring(data.winner.length - 6)}`;

  const shortHash =
    `${data.lotteryHash.substring(0, 12)}...${data.lotteryHash.substring(data.lotteryHash.length - 8)}`;

  Swal.fire({

    width: 560,

    background: "#1f2947",

    color: "#ffffff",

    allowOutsideClick: false,

    confirmButtonColor: "#22D3EE",

    confirmButtonText: "Continue",

    showClass: {
      popup: "animate__animated animate__zoomIn"
    },

    hideClass: {
      popup: "animate__animated animate__zoomOut"
    },

    html: `

      <div style="padding:12px">

        <div
          style="
            font-size:78px;
            margin-bottom:10px;
            filter:drop-shadow(0 0 18px rgba(34,211,238,.35));
          "
        >
          🏆
        </div>

        <h2
          style="
            margin:0;
            color:#22D3EE;
            font-size:34px;
            font-weight:700;
          "
        >
          Winner Selected!
        </h2>

        <p
          style="
            color:#9CA3AF;
            margin-top:8px;
            margin-bottom:24px;
            font-size:15px;
          "
        >
          ✓ Successfully Recorded On Blockchain
        </p>

        <div
          style="
            background:#253454;
            border:1px solid #30456f;
            border-radius:18px;
            padding:22px;
          "
        >

          <div
            style="
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:18px;
              text-align:left;
            "
          >

            <div>
              <div style="color:#94A3B8;font-size:13px">
                🏅 Winner
              </div>

              <div style="font-weight:700;font-size:18px">
                ${shortWinner}
              </div>
            </div>

            <div>
              <div style="color:#94A3B8;font-size:13px">
                💰 Prize
              </div>

              <div
                style="
                  color:#22D3EE;
                  font-weight:700;
                  font-size:22px;
                "
              >
                ${data.prizeAmount} ETH
              </div>
            </div>

            <div>
              <div style="color:#94A3B8;font-size:13px">
                🎯 Round
              </div>

              <div style="font-weight:700">
                #${data.roundId}
              </div>
            </div>

            <div>
              <div style="color:#94A3B8;font-size:13px">
                👥 Players
              </div>

              <div style="font-weight:700">
                ${data.totalPlayers}
              </div>
            </div>

          </div>

          <div
            style="
              margin-top:20px;
              padding-top:18px;
              border-top:1px solid rgba(255,255,255,.08);
              text-align:left;
            "
          >

            <div
              style="
                color:#94A3B8;
                font-size:13px;
              "
            >
              🔐 Lottery Hash
            </div>

            <div
              style="
                margin-top:6px;
                font-size:15px;
                font-weight:600;
                word-break:break-all;
              "
            >
              ${shortHash}
            </div>

          </div>

        </div>

      </div>

    `

  });

}
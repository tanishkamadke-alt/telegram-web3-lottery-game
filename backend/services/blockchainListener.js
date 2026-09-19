import { ethers } from "ethers";
import fs from "fs";
import Activity from "../models/Activity.js";

const LotteryABI = JSON.parse(
  fs.readFileSync(
    new URL("../contracts/Lottery.json", import.meta.url),
    "utf8"
  )
);

const provider = new ethers.WebSocketProvider(process.env.SEPOLIA_WS_URL);

// Listen for WebSocket errors
provider.on("error", (err) => {
    console.error("❌ WebSocket Error:", err);
});

// Listen for WebSocket disconnect
provider.websocket.on("close", () => {
    console.log("🔴 WebSocket disconnected");
});

const contract = new ethers.Contract(
    "0xd93dbb2e66e720389e5a7838dC049e8a8E57517F",
    LotteryABI.abi,
    provider
);

export const startBlockchainListener = (io) => {

    console.log("📡 Listening to Lottery events...");

    // Ticket Purchased
    contract.on(
        "TicketPurchased",
        async (player, roundId, ticketPrice, timestamp, event) => {

            try {

                await Activity.create({

                    type: "ticket",

                    wallet: player,

                    roundId: Number(roundId),

                    ticketPrice: ethers.formatEther(ticketPrice),

                    transactionHash: event.log.transactionHash,

                    blockNumber: event.log.blockNumber,

                    timestamp: new Date(Number(timestamp) * 1000)

                });

                io.emit("activityUpdated"); //notify all connected clients
                console.log("🎟 TicketPurchased saved");

            } catch (err) {

                console.log(err.message);

            }

        }
    );

    // Winner Selected
    contract.on(
        "WinnerSelected",
        async (
            winner,
            roundId,
            prizeAmount,
            totalPlayers,
            timestamp,
            event
        ) => {

            try {

                await Activity.create({

                    type: "winner",

                    wallet: winner,

                    roundId: Number(roundId),

                    prizeAmount: ethers.formatEther(prizeAmount),

                    totalPlayers: Number(totalPlayers),

                    transactionHash: event.log.transactionHash,

                    blockNumber: event.log.blockNumber,

                    timestamp: new Date(Number(timestamp) * 1000)

                });
                
                io.emit("activityUpdated");
                console.log("🏆 WinnerSelected saved");

            } catch (err) {

                console.log(err.message);

            }

        }
    );

    // Lottery Started
    contract.on(
        "LotteryStarted",
        async (roundId, event) => {

            try {

                await Activity.create({

                    type: "start",

                    wallet: "SYSTEM",

                    roundId: Number(roundId),

                    transactionHash: event.log.transactionHash,

                    blockNumber: event.log.blockNumber,

                    timestamp: new Date()

                });
                
                io.emit("activityUpdated");

                console.log("🚀 LotteryStarted saved");

            } catch (err) {

                console.log(err.message);

            }

        }
    );

};
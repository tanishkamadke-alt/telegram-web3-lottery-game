import express from "express";
import http from "http";
import {Server} from "socket.io";

import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import "./bot.js";
import connectDB from "./config/database.js";
import { startBlockchainListener } from "./services/blockchainListener.js";
import telegramRoutes from "./routes/telegramRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://telegram-web3-lottery-game.vercel.app",
      "https://telegram-web3-lottery-game-hzk5wtxd-tanishka20.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});
app.set("io", io);

connectDB();  // Connect MongoDB
startBlockchainListener(io);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://telegram-web3-lottery-game.vercel.app",
        "https://telegram-web3-lottery-game-hzk5wtxd-tanishka20.vercel.app",
      ];

      if (
  !origin ||
  allowedOrigins.includes(origin) ||
  (origin.startsWith("https://telegram-web3-lottery-game") &&
    origin.endsWith(".vercel.app"))
) {
  callback(null, true);
} else {
  callback(new Error("Not allowed by CORS"));
}
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", telegramRoutes);
app.use("/api/activity", activityRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 CipherDraw Backend Running"
  });
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("🔴 Client disconnected:", socket.id);
    console.log("Reason:", reason);
  });

  socket.on("error", (err) => {
    console.error("Socket Error:", err);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${PORT}`);
});
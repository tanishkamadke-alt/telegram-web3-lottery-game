import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    wallet: {
      type: String,
      required: true,
    },

    roundId: {
      type: Number,
      required: true,
    },

    ticketPrice: Number,

    prizeAmount: Number,

    totalPlayers: Number,

    transactionHash: {
      type: String,
      unique: true,
    },

    blockNumber: Number,

    timestamp: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Activity", activitySchema);
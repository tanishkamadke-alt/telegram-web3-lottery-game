console.log("***** CONTRACT.JS LOADED *****");

import { ethers } from "ethers";
import { LOTTERY_ABI } from "../contracts/abi";
import { LOTTERY_CONTRACT_ADDRESS } from "../contracts/addresses";

export function getContract(signer) {
  if (!signer) {
    throw new Error("Wallet is not connected.");
  }

  console.log("Contract Address:", LOTTERY_CONTRACT_ADDRESS);
  console.log("ABI Length:", LOTTERY_ABI.length);

  return new ethers.Contract(
    LOTTERY_CONTRACT_ADDRESS,
    LOTTERY_ABI,
    signer
  );
}

// READ FUNCTIONS

export async function getCurrentRound(signer) {
  return await getContract(signer).currentRound();
}

export async function getTotalPlayers(signer) {
  return await getContract(signer).getTotalPlayers();
}

export async function getPrizePool(signer) {
  const balance = await getContract(signer).getContractBalance();
  return ethers.formatEther(balance);
}

export async function getLatestWinner(signer) {
  return await getContract(signer).getLatestWinner();
}

export async function getLotteryHistoryCount(signer) {
  return await getContract(signer).getLotteryHistoryCount();
}

export async function getLotteryRound(signer, index) {
  return await getContract(signer).getLotteryRound(index);
}

export async function getLatestWinnerDetails(signer) {
  const contract = getContract(signer);

  console.log("================================");
  console.log("LOADING RECENT ACTIVITY");
  console.log("================================");

  console.log("Contract:", contract.target);

  const count = Number(
    await contract.getLotteryHistoryCount()
  );

  if (count === 0) {
    return null;
  }

  return await contract.getLotteryRound(count - 1);
}

export async function getManager(signer) {
  return await getContract(signer).manager();
}

export async function buyTicket(signer) {

  console.log("=================================");
  console.log("BUY TICKET STARTED");
  console.log("=================================");

  const signerAddress = await signer.getAddress();

  console.log("Signer Address:", signerAddress);

  const contract = getContract(signer);

  console.log("Contract created.");

  console.log("About to send transaction...");

  const tx = await contract.buyTicket({
    value: ethers.parseEther("0.01"),
  });

  console.log("Transaction object returned.");
  console.log(tx);

  console.log("Hash:", tx.hash);

  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();

  console.log("Transaction mined.");

  console.log(receipt);

  return receipt;
}

export async function drawWinner(signer) {

  console.log("DRAW WINNER");

  const contract = getContract(signer);

  console.log("Lottery Status:", await contract.getLotteryStatus());
  console.log("Players:", Number(await contract.getTotalPlayers()));
  console.log("Balance:", (await contract.getContractBalance()).toString());

  try{
  const tx = await contract.drawWinner({
    gasLimit: 1000000n,
  });

  console.log("Draw Tx:", tx.hash);

  await tx.wait();

  return tx;
} catch (err) {
  console.error("DRAW ERROR:", err);
}
}

export async function getRecentActivity(signer) {
  console.log("ENTERED getRecentActivity");

  const contract = getContract(signer);

  try {

    const currentBlock = await signer.provider.getBlockNumber();

    console.log("Current Block:", currentBlock);

    const fromBlock = currentBlock - 20;

    console.log("Searching From:", fromBlock);
    console.log("Searching To:", currentBlock);
    console.log("Searching blocks:", fromBlock, "->", currentBlock);

    // ---------------- Ticket Events ----------------

    console.log("Loading TicketPurchased events...");

    const ticketEvents = await contract.queryFilter(
    contract.filters.TicketPurchased(),
    fromBlock,
    currentBlock
    );

    console.log("Ticket Events:", ticketEvents);
    console.log("Ticket Event Count:", ticketEvents.length);
    console.log("TicketPurchased loaded successfully.");
    console.log(ticketEvents);
    console.log("Count =", ticketEvents.length);

    // ---------------- Winner Events ----------------

    console.log("Loading WinnerSelected events...");

    const winnerEvents = await contract.queryFilter(
    contract.filters.WinnerSelected(),
    fromBlock,
    currentBlock
    );

    console.log("Winner Events:", winnerEvents);
    console.log("Winner Event Count:", winnerEvents.length);
    console.log("WinnerSelected loaded successfully.");
    console.log(winnerEvents);
    console.log("Count =", winnerEvents.length);

    // ---------------- Build Activity List ----------------

    const activities = [];

    for (const event of ticketEvents) {
      activities.push({
        type: "ticket",
        player: event.args.player,
        round: Number(event.args.roundId),
        timestamp: Number(event.args.timestamp),
      });
    }

    for (const event of winnerEvents) {
      activities.push({
        type: "winner",
        winner: event.args.winner,
        prize: Number(event.args.prizeAmount) / 1e18,
        round: Number(event.args.roundId),
        timestamp: Number(event.args.timestamp),
      });
    }

    activities.sort((a, b) => b.timestamp - a.timestamp);

    console.log("Activities:");
    console.table(activities);

    return activities;

  } catch (err) {

    console.error("Recent Activity Error:", err);

    return [];

  }

}

//Network Status
export async function getNetworkStatus(signer) {
  const provider = signer.provider;

  const start = performance.now();

  const [blockNumber, network] = await Promise.all([
    provider.getBlockNumber(),
    provider.getNetwork(),
]);

let gasPrice = "0";

try {
    const feeData = await provider.getFeeData();

    if (feeData.gasPrice) {
        gasPrice = Number(
            ethers.formatUnits(feeData.gasPrice, "gwei")
        ).toFixed(2);
    }
} catch  {
    console.warn("Gas price unavailable");
}

  const latency = Math.round(performance.now() - start);

  return {
    blockNumber,
    gasPrice,
    latency,
    connected: !!network,
};
}

export async function getLotteryStatus(signer) {

  const contract = getContract(signer);

  return await contract.getLotteryStatus();

}

export async function startLottery(signer) {

  const contract = getContract(signer);

  const tx = await contract.startLottery();

  await tx.wait();

  return tx;

}

// =====================================================
// Get ALL Blockchain Activities (No Backend)
// =====================================================

export async function getAllActivities(signer) {
  try {
    const contract = getContract(signer);

    const latestBlock =
      await signer.provider.getBlockNumber();

    console.log("Searching blockchain...");
    console.log("Latest Block:", latestBlock);

    // Search from genesis block
    const fromBlock = 0;

    // ---------------- Ticket Events ----------------

    const ticketEvents =
      await contract.queryFilter(
        contract.filters.TicketPurchased(),
        fromBlock,
        latestBlock
      );

    // ---------------- Winner Events ----------------

    const winnerEvents =
      await contract.queryFilter(
        contract.filters.WinnerSelected(),
        fromBlock,
        latestBlock
      );

    const activities = [];

    // Ticket events
    for (const event of ticketEvents) {
      activities.push({
        type: "ticket",
        wallet: event.args.player,
        roundId: Number(event.args.roundId),
        timestamp: Number(event.args.timestamp),
        prizeAmount: 0,
      });
    }

    // Winner events
    for (const event of winnerEvents) {
      activities.push({
        type: "winner",
        wallet: event.args.winner,
        roundId: Number(event.args.roundId),
        timestamp: Number(event.args.timestamp),
        prizeAmount:
          Number(event.args.prizeAmount) / 1e18,
      });
    }

    // Latest first
    activities.sort(
      (a, b) => b.timestamp - a.timestamp
    );

    console.log(
      "Blockchain Activities:",
      activities
    );

    return activities;

  } catch (err) {

    console.error(
      "Failed to load blockchain activities:",
      err
    );

    return [];
  }
}

export async function getActivityEvents(signer) {
  const contract = getContract(signer);

  // Get latest block
  const currentBlock = await signer.provider.getBlockNumber();

  // Search from deployment block (adjust later if needed)
  const fromBlock = 0;

  // Load all ticket purchases
  const ticketEvents = await contract.queryFilter(
    contract.filters.TicketPurchased(),
    fromBlock,
    currentBlock
  );

  // Load all winners
  const winnerEvents = await contract.queryFilter(
    contract.filters.WinnerSelected(),
    fromBlock,
    currentBlock
  );

  const activities = [];

  // Ticket events
  for (const event of ticketEvents) {
    activities.push({
      type: "ticket",
      wallet: event.args.player,
      round: Number(event.args.roundId),
      timestamp: Number(event.args.timestamp),
      prizeAmount: 0,
    });
  }

  // Winner events
  for (const event of winnerEvents) {
    activities.push({
      type: "winner",
      wallet: event.args.winner,
      round: Number(event.args.roundId),
      timestamp: Number(event.args.timestamp),
      prizeAmount:
        Number(event.args.prizeAmount) / 1e18,
    });
  }

  // newest first
  activities.sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return activities;
}




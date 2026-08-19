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

// ---------------------------
// READ FUNCTIONS
// ---------------------------

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

// ---------------------------
// WRITE FUNCTIONS
// ---------------------------

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

  const tx = await contract.drawWinner({
    gasLimit: 1000000n,
  });

  console.log("Draw Tx:", tx.hash);

  await tx.wait();

  return tx;
}

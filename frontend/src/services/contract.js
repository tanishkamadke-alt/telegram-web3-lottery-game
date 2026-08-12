console.log("***** CONTRACT.JS LOADED *****");

import { ethers } from "ethers";
import { LOTTERY_ABI } from "../contracts/abi";
import { LOTTERY_CONTRACT_ADDRESS } from "../contracts/addresses";

export function getContract(signer) {
  if (!signer) {
    throw new Error("Wallet is not connected.");
  }

  console.log("Address:", LOTTERY_CONTRACT_ADDRESS);
  console.log("ABI length:", LOTTERY_ABI.length);
  
  return new ethers.Contract(
    LOTTERY_CONTRACT_ADDRESS,
    LOTTERY_ABI,
    signer
  );
}

export async function getCurrentRound(signer) {
  return await getContract(signer).currentRound();
}

export async function buyTicket(signer) {
  console.log("STEP 1: buyTicket() called");

  const contract = getContract(signer);

  console.log("STEP 2: Contract created");

  console.log("STEP 3: Sending transaction...");

  const currentSigner = await signer.getAddress();

  console.log("BUY TICKET SIGNER:", currentSigner);

  console.log("CONNECTED UI ADDRESS:", signer.address);

  const tx = await contract.buyTicket({
    value: ethers.parseEther("0.01"),
  });

  console.log("STEP 4: Transaction sent");
  console.log(tx);

  const receipt = await tx.wait();

  console.log("STEP 5: Transaction mined");

  return receipt;
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

  export async function drawWinner(signer) {
    const tx = await getContract(signer).drawWinner({
    gasLimit: 1000000n,
  });

  await tx.wait();
  return tx;
  }

  export async function getLotteryHistoryCount(signer) {
    return await getContract(signer).getLotteryHistoryCount();
  }

  export async function getLotteryRound(signer, index) {
    return await getContract(signer).getLotteryRound(index);
  }

  export async function getLatestWinnerDetails(signer) {
    const contract = getContract(signer);

    const count = Number(await contract.getLotteryHistoryCount());

    if (count === 0) {
      return null;
    }

    return await contract.getLotteryRound(count - 1);
  }

  export async function getManager(signer) {
    return await getContract(signer).manager();
  }


const hre = require("hardhat");

async function main() {
  console.log("Deploying Lottery contract...");

  const Lottery = await hre.ethers.getContractFactory("Lottery");

  const lottery = await Lottery.deploy();

  await lottery.waitForDeployment();

  console.log(
    "Lottery deployed to:",
    await lottery.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
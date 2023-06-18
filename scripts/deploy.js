// import { ethers } from "hardhat";
const hre = require("hardhat")
require("dotenv").config({ path: ".env" });
const fs = require("fs") //file system

async function main() {

  const coinVest = await hre.ethers.deployContract("CoinVest");
  await coinVest.waitForDeployment();

  // save the contract address to a local file.
	fs.writeFileSync('./context/config.js', 
  `
  import CoinVest from "./CoinVest.json"

  export const contractAddress = "${coinVest.target}";
  export const coinVestABI = CoinVest.abi;
  `) 

  console.log("Open the ./context/config.js file to find the deployment details.");


// print the address of the deployed contract
console.log("Verify Contract Address:", coinVest.target);

// console.log("Sleeping.....");
// Wait for etherscan to notice that the contract has been deployed
// await sleep(40000);

  // Verify the contract after deploying
//   await hre.run("verify:verify", {
//     address: CoinVest.address,
//     constructorArguments: [],
//   });


}

// function sleep(ms) {
// return new Promise((resolve) => setTimeout(resolve, ms));
// }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

// export const ownerAddress = "${coinVest.signer.address}";

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
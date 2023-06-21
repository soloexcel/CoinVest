require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config({"path":".env"})
const NEXT_PUBLIC_RPC_PROVIDER = process.env.NEXT_PUBLIC_RPC_PROVIDER;
const NEXT_PUBLIC_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: NEXT_PUBLIC_RPC_PROVIDER,
      accounts: [NEXT_PUBLIC_PRIVATE_KEY],
    },
  }
};
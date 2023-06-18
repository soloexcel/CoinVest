require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config({"path":".env"})
const NEXT_PUBLIC_ALCHEMY_NODE_RPC = process.env.NEXT_PUBLIC_ALCHEMY_NODE;
const NEXT_PUBLIC_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: NEXT_PUBLIC_ALCHEMY_NODE_RPC,
      accounts: [NEXT_PUBLIC_PRIVATE_KEY],
    },
  }
};
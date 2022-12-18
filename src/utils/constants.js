import { constants } from "ethers";

// constants used throughout the app
export const mainnetContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_ETHEREUM
export const rafflesAddress = process.env.REACT_APP_CONTRACT_ADDRESS_RAFFLES
export const ticketsAddress = process.env.REACT_APP_CONTRACT_ADDRESS_TICKETS
export const monthlyErc721Address = process.env.REACT_APP_CONTRACT_MONTHLY_LOTTERY_ERC721
export const monthlyErc20Address = process.env.REACT_APP_CONTRACT_MONTHLY_LOTTERY_ERC20
export const weeklyAddress = process.env.REACT_APP_CONTRACT_WEEKLY_LOTTERY
export const emptyMerkleProof = [constants.HashZero]
export const emptyMerkleRoot = constants.HashZero
export const l2ChainName = String(process.env.REACT_APP_L2_CHAIN_NAME)
export const l2Chain = Number(process.env.REACT_APP_L2_CHAIN)
export const allowedChains = [1, 5, l2Chain] // chains which we can be connected on
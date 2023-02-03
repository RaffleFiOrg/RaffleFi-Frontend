import { ethers, BigNumber, utils } from 'ethers';
import MainnetABI from '../abi/MainnetEscrow.json';
import RafflesABI from '../abi/Raffles.json';
import TicketsABI from '../abi/RaffleTicketSystem.json';
import ERC721ABI from '../abi/ERC721.json';
import ERC20ABI from '../abi/ERC20.json';
import { toast } from 'react-toastify';
import { 
    allowedChains,
    l2Faucet,
    mainnetContractAddress, 
    mainnetFaucet, 
    nftFaucet, 
    rafflesAddress, 
    ticketsAddress 
} from './constants';

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();

const mainnetContract = new ethers.Contract(
    mainnetContractAddress,
    MainnetABI.abi,
    signer
)
const rafflesContract = new ethers.Contract(
    rafflesAddress,
    RafflesABI.abi,
    provider
)

const ticketsContract = new ethers.Contract(
    ticketsAddress,
    TicketsABI.abi,
    provider 
)

export const createRaffle = async (
    valueToSend, 
    assetAddress,
    assetIdOrAmount,
    currency,
    pricePerTicket,
    numberOfTickets,
    minimumTicketsSold,
    endtime,
    merkleRoot,
    mode, 
) => {    
    try {
        if (mode === 'ERC721') {
            const tx = await mainnetContract.connect(signer).createERC721Raffle(
                assetAddress,
                BigNumber.from(assetIdOrAmount),
                currency,
                BigNumber.from(pricePerTicket),
                BigNumber.from(numberOfTickets),
                BigNumber.from(minimumTicketsSold),
                BigNumber.from(endtime),
                merkleRoot,
                { value: valueToSend.toString() }
            );
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                toast.success("Successfully created a new raffle");
                return true 
            } else {
                toast.warn("Failed to create a new raffle");
                return false 
            }
        } else {
            const tx = await mainnetContract.connect(signer).createERC20Raffle(
                assetAddress,
                BigNumber.from(assetIdOrAmount),
                currency,
                BigNumber.from(pricePerTicket),
                BigNumber.from(numberOfTickets),
                BigNumber.from(minimumTicketsSold),
                BigNumber.from(endtime),
                merkleRoot,
                { value: valueToSend.toString() }
            )
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                toast.success("Successfully created a new raffle");
                return true 
            } else {
                toast.warn("Failed to create a new raffle");
                return false 
            }
        }
    } catch (e) { return false }
}

export const cancelRaffle = async (raffleId) => {
    try {
        const tx = await rafflesContract.connect(signer).cancelRaffle(BigNumber.from(raffleId));
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully cancelled raffle ${raffleId}`);
            return true 
        } else {
            toast.warn(`Failed to cancel raffle ${raffleId}`);
            return false 
        }
    } catch (e) { return false }
}

export const completeRaffle = async (raffleId) => {
    try {
        const tx = await rafflesContract.connect(signer).completeRaffle(BigNumber.from(raffleId));
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully completed raffle ${raffleId}`);
            return true 
        } else {
            toast.warn(`Failed to complete raffle ${raffleId}`,);
            return false 
        }
    } catch (e) { 
        console.log(e)
        return false }
}

export const claimRaffle = async (raffleId) => {
    try {
        const tx = await rafflesContract.connect(signer).claimRaffle(BigNumber.from(raffleId));
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully claimed raffle ${raffleId}`,);
            return true 
        } else {
            toast.warn(`Failed to claim raffle ${raffleId}`);
            return false 
        }
    } catch (e) { return false }
}

export const claimCancelledRaffle = async (raffleId) => {
    try {
        const tx = await rafflesContract.connect(signer).claimCancelledRaffle(BigNumber.from(raffleId));
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully claimed raffle ${raffleId}`);
            return true 
        } else {
            toast.warn(`Failed to claim raffle ${raffleId}`);
            return false 
        }
    } catch (e) { return false }
}

export const buyTickets = async (quantity, currency, pricePerTicket, raffleId, merkleProof) => {
    try {
        const valueToSend = currency === ethers.constants.AddressZero ?  
            BigNumber.from(pricePerTicket).mul(BigNumber.from(quantity)) 
            : BigNumber.from(0);
        const tx = await rafflesContract.connect(signer).buyRaffleTicket(
            BigNumber.from(raffleId),
            BigNumber.from(quantity),
            merkleProof,
            { value: valueToSend.toString() }
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully bought ${quantity} tickets`);
            return true 
        } else {
            toast.warn(`Failed to buy ${quantity} tickets`);
            return false 
        }
    } catch (e) { 
        console.log(e)
        return false
    }
}

export const postSellOrder = async (
    raffleId, ticketId, currency, salePrice) => {
    try {
        const tx = await ticketsContract.connect(signer).postSellOrder(
            BigNumber.from(raffleId),
            BigNumber.from(ticketId),
            currency,
            salePrice
        )
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully posted a sell order for raffle ${raffleId}`);
            return true
        } else {
            toast.warn(`Failed to post a sell order for raffle ${raffleId}`);
            return false 
        }
    } catch (e) { return false }
}

// Safety function 
export const getFreshOrderData = async (ticketId, raffleId) => {
    try {
        const response = await ticketsContract.ticketOrders(BigNumber.from(raffleId), BigNumber.from(ticketId));
        return response; 
    } catch (e) {
        return 
    }
}

export const postBuyOrder = async (raffleId, ticketId, ticketRecipient, currency, salePrice) => {
    const valueToSend = currency === ethers.constants.AddressZero ?
        utils.parseEther(salePrice): 0 

    try {
        const tx = await ticketsContract.connect(signer).postBuyOrder(
            BigNumber.from(raffleId),
            BigNumber.from(ticketId),
            ticketRecipient,
            currency,
            BigNumber.from(salePrice),
            { value: valueToSend.toString() }
        )
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully bought ticket ${ticketId}`);
            return true 
        } else {
            toast.warn(`Failed to buy ticket ${ticketId}`);
            return false 
        }
    } catch (e) { return false }
}

export const cancelSellOrder = async (raffleId, ticketId) => {
    try {
        const tx = await ticketsContract.connect(signer)
        .cancelSellOrder(BigNumber.from(raffleId), BigNumber.from(ticketId), {
            value: '0'
        });
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully cancelled the sell order`);
            return true 
        } else {
            toast.warn(`Failed to cancel the sell order`);
            return false 
        }
    } catch (e) { return false }
} 

export const buyTicketWithSignature = async (
    raffleId, ticketId, currency, price, buyer, _signature
    ) => {
    const valueToSend = currency === ethers.constants.AddressZero ?
        price : 0 

    const signature = _signature.substring(2)
    const r = '0x' + signature.substring(0, 64)
    const s = '0x' + signature.substring(64, 128)
    const v = parseInt(signature.substring(128, 130), 16)
    try {
        const tx = await ticketsContract.connect(signer).buyTicketWithSignature(
            BigNumber.from(raffleId),
            BigNumber.from(ticketId),
            currency, 
            price,
            buyer,
            r,
            s,
            v,
            { value: valueToSend }
        )
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            toast.success(`Successfully bought ticket ${ticketId}`);
            return true 
        } else {
            toast.warn(`Failed to buy ticket ${ticketId}`);
            return false 
        }
    } catch (e) { 
        console.log(e)
        return false 
    }
}

export const getDecimals = async (contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, ERC20ABI.abi, provider);
        const decimals = await contract.decimals();
        return decimals;
    } catch (e) {
        return 0
    }
}

export const getOpeningFee = async () => {
    try {
        const openingFee = await mainnetContract.OPENING_FEE();
        return openingFee;
    } catch (e) {
        return -1; 
    }
}

export const approveToken = async (contractAddress, amount, recipient) => {
    try {
        const contract = new ethers.Contract(contractAddress, ERC20ABI.abi, provider);
        const tx = await contract.connect(signer).approve(recipient, amount.toString());
        const receipt = await tx.wait();
        if (receipt.status !== 1) {
            toast.warn("Failed to approve");
            return -1;
        }
    } catch (e) { return -1 }
}

export const checkAllowance = async (contractAddress, to) => {
    try {
        const contract = new ethers.Contract(contractAddress, ERC20ABI.abi, provider);
        const address = await signer.getAddress()
        const allowance = await contract.allowance(address, to);
        return allowance;
    } catch (e) {
        return -1;
    }
}

export const checkApproved = async (contractAddress, tokenId) => {
    try {
        const contract = new ethers.Contract(contractAddress, ERC721ABI.abi, provider);
        const approved = contract.getApproved(tokenId);
        return approved;
    } catch (e) {
        return ethers.constants.AddressZero;
    }
}

export const increaseAllowance = async (contractAddress, to, amount) => {
    try {
        const contract = new ethers.Contract(contractAddress, ERC20ABI.abi, provider);
        const tx = await contract.connect(signer).increaseAllowance(
            to, amount
        );
        const receipt = await tx.wait();
        if (receipt.status !== 1) {
            toast.warn("Failed to increase allowance");
            return -1;
        }
    } catch (e) {
        return -1
    }
}

export const getFairRaffleFee = async (
    tokenAddress,
    amount, 
    currency,
    pricePerTicket,
    numberOfTickets,
    minimumTicketsSold
) => {
    try {
        const fee = await mainnetContract.fairRaffleFeeERC20(
            tokenAddress,
            BigNumber.from(amount),
            currency,
            BigNumber.from(pricePerTicket),
            BigNumber.from(numberOfTickets),
            BigNumber.from(minimumTicketsSold)
        ) 
        return fee;
    } catch (e) {
        return -1;
    }
}

export const getFairRaffleFeeERC721 = async (
    currency,
    pricePerTicket,
    minimumTicketsSold
) => {
    try {
        const fee = await mainnetContract.fairRaffleFeeERC721(
            currency,
            BigNumber.from(pricePerTicket),
            BigNumber.from(minimumTicketsSold)
        )
        return fee;
    } catch (e) {
        return -1;
    }
}

// Utils 
const typedData = {
    types: {
        Ballot: [
            { name: "buyer" , type: "address" },
            { name: "raffleId", type: "uint256" },
            { name: "ticketId", type: "uint256" },
            { name: "currency", type: "address" },
            { name: "price", type: "uint128" },
            { name: "nonce", type: "uint256" }
        ],
    },
    domain: {
        name: "RaffleTicketSystem",
        version: "1",
        chainId: 1,
        verifyingContract: ticketsAddress,
    },
    primaryType: "Ballot",
    message: {
        buyer: "",
        raffleId: 0,
        ticketId: 0,
        currency: "",
        price: 0,
        nonce: ""
    },
}

// Replace the signature data
function replaceData(
    chainId,
    buyer,
    raffleId,
    ticketId,
    currency,
    price,
    nonce
    ) {
    typedData.domain.chainId = chainId;
    typedData.message.buyer = buyer 
    typedData.message.raffleId = raffleId 
    typedData.message.ticketId = ticketId 
    typedData.message.currency = currency 
    typedData.message.price = price 
    typedData.message.nonce = nonce 
}

export const signTransaction = async (
    chainId,
    buyer, 
    raffleId,
    ticketId,
    currency,
    price,
) => {
    try {
        const nonce = await ticketsContract.nonce(await signer.getAddress())
        replaceData(chainId, buyer, raffleId, ticketId, currency, price, nonce.toString())
        const signedData = await signer._signTypedData(
            typedData.domain,
            typedData.types, 
            typedData.message
        )
        return signedData
    } catch (e) {
        console.log(e)
        toast.warning('Could not get your signature')
        return 
    }
}

export const getBalance = async (contractAddress) => {
    try {
        const contract = new ethers.Contract(
            contractAddress,
            ERC20ABI.abi,
            signer
        ); 
        return await contract.balanceOf(await signer.getAddress())
    } catch (e) {
        return -1
    }
}

/// Mint testnet tokens
export const tokenFaucet = async (chainId) => {
    if (!allowedChains.includes(chainId)) {
        toast.warning("You need to be connected to either Goerli or Arbitrum Goerli")
        return 
    }
    const faucetAddress = chainId === 5 ? mainnetFaucet : l2Faucet
    try {
        const faucetContract = new ethers.Contract(
            faucetAddress,
            ERC20ABI.abi,
            signer
        );
        const tx = await faucetContract.mint(await signer.getAddress(), ethers.utils.parseEther("100"));
        const receipt = await tx.wait();
        if (receipt.status !== 1) toast.warning("Could not mint tokens on this network")
        else toast.success("100 Test tokens minted")
    } catch (e) {
        console.log(e)
        toast.warning("Could not mint tokens on this network")
    }
}

/// Mint testnet NFT
export const NFTFaucet = async () => {
    try {
        const nftContract = new ethers.Contract(
            nftFaucet,
            ERC721ABI.abi,
            signer
        )
        const tx = await nftContract.safeMint(await signer.getAddress())
        const receipt = await tx.wait();
        if (receipt.status !== 1) toast.warning("Could not mint testnet NFT")
        else toast.success("Test NFT minted")
    } catch (e) {
        console.log(e)
        toast.warning("Could not mint testnet NFT")
    }
}
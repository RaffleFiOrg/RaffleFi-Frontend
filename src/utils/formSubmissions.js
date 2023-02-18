import { getRaffleDate } from "../utils/formatting";
import { toast } from "react-toastify";
import { approveToken, 
    buyTickets, 
    buyTicketWithSignature, 
    checkAllowance, 
    checkApproved, 
    createRaffle, 
    getBalance, 
    getDecimals, 
    getFairRaffleFee, 
    getFairRaffleFeeERC721, 
    getFreshOrderData, 
    getOpeningFee,
    increaseAllowance,
    postBuyOrder,
} from "./web3Functions";
import { BigNumber, constants, utils } from "ethers";
import { 
    emptyMerkleProof, 
    emptyMerkleRoot, 
    mainnetContractAddress,
    rafflesAddress, 
    ticketsAddress 
} from "./constants";

// The function called on the create new raffle form 
export const createRaffleForm = async (
    e,
    whitelistedCurrencies, 
    nftId=null, 
    assetAddress,
    assetType='ERC721',
    ) => {

    try {
        const id = e.nativeEvent.submitter.id;
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData.entries());
    
        const currencyObj = whitelistedCurrencies.find(item => item.name === formDataObject.currency)
        const currency = currencyObj.address 
        const currencyDecimals = currencyObj.decimals
        const merkleRoot = emptyMerkleRoot
    
        if (id === 'raffleButton') {
            // Here we need to differentiate between ERC20 and ERC721 :rip: 
            // We also need to make sure that all inputs are sent
            let endDate = formDataObject.enddate // month/day/year 
            let endTime = formDataObject.endtime // hour/minute 
            let minimumTicketsSold = formDataObject.minimumtickets; 
            let numberOfTickets = formDataObject.numberoftickets;            
            const endtime = getRaffleDate(endDate, endTime);
            if (endtime.success === false) {
                toast.warn("The end date must be at least 12 hours in the future");
                return
            }
            // change the price per ticket to use correct decimals 
            const pricePerTicket = utils.parseUnits(formDataObject.ticketprice, currencyDecimals)
           
            const openingFee = await getOpeningFee();
            if (openingFee === BigNumber.from(-1)) return;
    
            if (assetType === 'ERC721') {
                // no need to check ownership as this can only be reached via the sell page
                // which fetches the NFTs from alchemy
                const fairRaffleFee = await getFairRaffleFeeERC721(
                    currency,
                    pricePerTicket,
                    minimumTicketsSold,
                );
    
                if (fairRaffleFee === -1) return 
    
                const valueToSend = BigNumber.from(
                    openingFee
                    ).add(
                        BigNumber.from(fairRaffleFee)
                    );
    
                const isApproved = await checkApproved(
                    assetAddress,
                    nftId,
                );
    
                if (isApproved === mainnetContractAddress) {
                    const success = await createRaffle (
                        valueToSend,
                        assetAddress,
                        nftId,
                        currency,
                        pricePerTicket,
                        numberOfTickets,
                        minimumTicketsSold,
                        endtime.date,
                        merkleRoot,
                        assetType
                    )
                    return success
                } else {
                    // we need to approve 
                    const res = await approveToken(assetAddress, nftId, mainnetContractAddress);
                    if (res === -1) return 
                    const success = await createRaffle (
                        valueToSend,
                        assetAddress,
                        nftId,
                        currency,
                        pricePerTicket,
                        numberOfTickets,
                        minimumTicketsSold,
                        endtime.date,
                        merkleRoot,
                        assetType
                    );
                    return success
                }  
            } else {
                // ERC20 
                if (assetAddress === constants.AddressZero) {
                    const assetIdOrAmount = utils.parseEther(formDataObject.amount)
    
                    const openingFee = await getOpeningFee();
                    const valueToSend = BigNumber.from(
                        assetIdOrAmount).add(BigNumber.from(openingFee));
    
                    const success = await createRaffle(
                        valueToSend, assetAddress, assetIdOrAmount, currency, 
                        pricePerTicket, numberOfTickets, minimumTicketsSold, endtime.date,
                        merkleRoot, assetType
                    );
                    return success
                } else {
                    // we need to check allowance 
                    const allowance = await checkAllowance(
                        assetAddress, 
                        mainnetContractAddress
                    );
                    const decimals = await getDecimals(assetAddress);
                    
                    if (decimals === -1) {
                        toast.warn("Error")
                        return 
                    }
                    
                    const assetIdOrAmount = utils.parseUnits(formDataObject.amount, decimals)
                    const openingFee = await getOpeningFee();
    
                    // check if we have enough allowance
                    if (BigNumber.from(allowance).gte(assetIdOrAmount)) {
                        const success = await createRaffle(
                            openingFee,
                            assetAddress,
                            assetIdOrAmount,
                            currency,
                            pricePerTicket,
                            numberOfTickets,
                            minimumTicketsSold,
                            endtime.date,
                            merkleRoot,
                            assetType
                        );
                        return success
                    } else if (allowance.toString() === '0') {
                        const res = await approveToken(assetAddress, assetIdOrAmount, mainnetContractAddress);
                        if (res === -1) return 
                        const success = await createRaffle(
                            openingFee,
                            assetAddress,
                            assetIdOrAmount,
                            currency,
                            pricePerTicket,
                            numberOfTickets,
                            minimumTicketsSold,
                            endtime.date,
                            merkleRoot,
                            assetType
                        );
                        return success
                    } else {
                        // calculate how much we need to increase for the allowance
                        const amountToIncrease = BigNumber.from(assetIdOrAmount).sub(BigNumber.from(allowance));
                        const res = await increaseAllowance(assetAddress, mainnetContractAddress, amountToIncrease);
                        if (res === -1) {
                            return 
                        }
                        const success = await createRaffle(
                            openingFee,
                            assetAddress,
                            assetIdOrAmount,
                            currency,
                            pricePerTicket,
                            numberOfTickets,
                            minimumTicketsSold,
                            endtime.date,
                            merkleRoot,
                            assetType
                        );
                        return success                              
                    }
                }
            }
        } else {
            const ticketPrice = utils.parseUnits(formDataObject.ticketprice, currencyDecimals)
    
            if (assetType === 'ERC20') {
                const decimals = await getDecimals(assetAddress);
    
                if (decimals === -1) {
                    toast.warn("Error")
                    return 
                }
    
                const amount = utils.parseUnits(formDataObject.amount, decimals)
    
                const fairRaffleFee = await getFairRaffleFee(
                    assetAddress,
                    amount,
                    currency,
                    ticketPrice,
                    formDataObject.numberoftickets,
                    formDataObject.minimumtickets ? formDataObject.minimumtickets : 0
                );
                toast.success(`The fair raffle fee is ${fairRaffleFee}`);
            } else {
                const fairRaffleFee = await getFairRaffleFeeERC721(
                    currency,
                    ticketPrice,
                    formDataObject.minimumtickets
                );
                toast.success(`The fair raffle fee is ${fairRaffleFee}`);
            }
        }
    } catch (err) {
        toast.warning('There was an error')
        return false
    }
}

// Buy a ticket
export const buyATicketForm = async (
    quantity, 
    raffleId,
    pricePerTicket,
    currency,
) => {
    console.log(
        raffleId 
    )
    try {
        // check that we have enough balance
        const balance = await getBalance(currency)
        if (balance === -1) {
            toast.warn("Error");
            return false; 
        }

        const priceToPay = BigNumber.from(quantity).mul(BigNumber.from(pricePerTicket))

        if (BigNumber.from(balance).lt(priceToPay)) {
            toast.warn("You don't have the required amount of funds");
            return false; 
        }

        if (currency === constants.AddressZero) {
            return await buyTickets(quantity, currency, pricePerTicket, raffleId, emptyMerkleRoot);
        } else {
            // 1. get current allowance 
            const allowance = await checkAllowance(currency, rafflesAddress);
            if (allowance === -1) {
                toast.warn("Error");
                return; 
            }
            const amountToPay = BigNumber.from(quantity).mul(BigNumber.from(pricePerTicket));
            // 2. act based on the allowance 
            if (allowance.toString() === '0') {
                // approve all 
                const res = await approveToken(currency, amountToPay, rafflesAddress);
                if (res === -1) return 
                return await buyTickets(quantity, currency, pricePerTicket, raffleId, emptyMerkleProof);
            } else if (allowance.gte(amountToPay)) {
                return await buyTickets(quantity, currency, pricePerTicket, raffleId, emptyMerkleProof);
            } else {
                // increase allowance
                const amountToIncrease = amountToPay.sub(BigNumber.from(allowance));
                const res = await increaseAllowance(currency, rafflesAddress, amountToIncrease);
                if (res === -1) {
                    toast.warn("Error");
                    return;
                } 
                return await buyTickets(quantity, currency, pricePerTicket, raffleId, emptyMerkleProof);
            }
        }

    } catch (err) {
        toast.warning('There as an error')
    }
}

// Buy a resale ticket
export const buyATicketFromMarketplace = async (
    destination,
    saleData
) => {
    try {
        if (!utils.isAddress(destination)) {
            toast.warning('You need to provide a valid ETH address')
            return false
        }
        // check that we have enough balance
        const balance = await getBalance(saleData.currency)
        if (balance === -1) {
            toast.warn("Error")
            return false
        }

        if (BigNumber.from(balance).lt(BigNumber.from(saleData.price))) {
            toast.warn("You don't have the required amount of funds")
            return false
        }
   
        if (saleData.signature) {
            const buy = async () => {
                return await buyTicketWithSignature(saleData.raffleId, saleData.ticketId, 
                    saleData.currency, saleData.price, destination, saleData.signature
                )
            }
            if (saleData.currency === constants.AddressZero) {
                await buy()
            } else {
                const allowance = await checkAllowance(saleData.currency, ticketsAddress)
                if (allowance === -1) {
                    toast.warn("Error checking allowance")
                    return false
                }

                if (allowance.toString() === '0') {
                    const res = await approveToken(saleData.currency, saleData.price, ticketsAddress)
                    if (res === -1) {
                        toast.warn("Error approving")
                        return false 
                    } 
                    await buy()
                } else if (allowance.gte(BigNumber.from(saleData.price))) {
                    await buy()
                } else {
                    const amountToIncrease = BigNumber.from(saleData.price).sub(allowance)
                    const res = await increaseAllowance(saleData.currency, ticketsAddress,
                        amountToIncrease)
                    if (res === -1) {
                        toast.warn("Error approving")
                        return false
                    } 
                    await buy()
                }
            }
        } else {
            // Need to get fresh order data to prevent frontrunning
            const freshOrderData = await getFreshOrderData(saleData.ticketId, saleData.raffleId);
            if (
                !BigNumber.from(freshOrderData.price).eq(BigNumber.from(saleData.price)) || 
                freshOrderData.currency !== saleData.currency
                ) {
                toast.warning("They are trying to frontrun you, stopping here")
                return false
            }
            const buy = async () => {
                return await postBuyOrder(saleData.raffleId, saleData.ticketId, destination,
                    saleData.currency, saleData.price);
            }
            if (saleData.currency === constants.AddressZero) {
                await buy();
            } else {
                const allowance = await checkAllowance(saleData.currency, ticketsAddress)
                if (allowance === -1) {
                    toast.warn("Error checking allowance")
                    return false;
                }
                if (allowance.toString() === '0') {
                    const res = await approveToken(saleData.currency, saleData.price, ticketsAddress)
                    if (res === -1) {
                        toast.warn("Error approving")
                        return false
                    } 
                    await buy()
                } else if (allowance.gte(saleData.price)) {
                    await buy()
                } else {
                    const amountToIncrease = BigNumber.from(saleData.price).sub(allowance)
                    const res = await increaseAllowance(saleData.currency, ticketsAddress,
                        amountToIncrease)
                    if (res === -1) {
                        toast.warn("Error approving");
                        return false
                    } 
                    await buy()
                }
            }
        }
    } catch (e) {
        console.log(e)
        toast.warn("There was an error, try again")
        return false 
    }
}
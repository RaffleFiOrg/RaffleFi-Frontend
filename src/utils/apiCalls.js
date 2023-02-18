import axios from 'axios'

// internal api 
const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

// external api
const client2 = axios.create({
    baseURL: process.env.REACT_APP_API_2_URL
})

export const _getWhitelistedCurrencies = async () => {
    const response = await client.get("currencies")
    return response.data
}

export const _getActiveRafflesERC721 = async () => {
    const response = await client.get("raffles/erc721/active")
    return response.data
}

export const _getActiveRafflesERC20 = async () => {
    const response = await client.get("raffles/erc20/active")
    return response.data
}

export const _getUserTicketsERC20 = async (account) => {
    const response = await client.get(`tickets/raffles/erc20/user/${account}`)
    return response.data
}

export const _getUserTicketsERC721 = async (account) => {
    const response = await client.get(`tickets/raffles/erc721/user/${account}`)
    return response.data
}

export const _getUserTicketsERC20Unsorted = async (account) => {
    const response = await client.get(`tickets/raffles/erc20/user/${account}/unsorted`)
    return response.data
}

export const _getUserTicketsERC721Unsorted = async (account) => {
    const response = await client.get(`tickets/raffles/erc721/user/${account}/unsorted`)
    return response.data
}

export const _getTicketsOrdersERC20 = async () => {
    const response = await client.get('tickets/raffles/erc20/sale')
    return response.data
}

export const _getTicketsOrdersERC721 = async () => {
    const response = await client.get('tickets/raffles/erc721/sale')
    return response.data
}

export const _getSignaturesERC721 = async (account) => {
    const response = await client.get(`signature/erc721/${account}`)
    return response.data
}

export const _getSignaturesERC20 = async (account) => {
    const response = await client.get(`signature/erc20/${account}`)
    return response.data
}

export const _getFloorPrice = async (address, chainId) => {
    const response = await client2.get(`floor_price/${address}/${chainId}`)
    return response.data
}

export const _getImage = async (address, id, chainId) => {
    const response = await client2.get(`/image/${address}/${id}/${chainId}`)
    return response.data
}

export const _getRaffledata = async (raffleId) => {
    const response = await client.get(`raffle/${raffleId}`)
    return response.data
}

export const _getFinishedERC721Raffles = async () => {
    const response = await client.get("raffles/erc721/finished")
    return response.data
}

export const _getFinishedERC20Raffles = async () => {
    const response = await client.get("raffles/erc20/finished")
    return response.data
}

export const _getOrderData = async (raffleId, ticketId) => {
    const response = await client.get(`tickets/sale/${raffleId}/${ticketId}`)
    return response.data
}

export const _getSaleData = async (raffleId, account, ticketId) => {
    const response = await client.get(`tickets/${raffleId}/user/${account}/${ticketId}`)
    return response.data
}

export const _getBoughtRafflesERC721 = async (account) => {
    const response = await client.get(`tickets/raffles/erc721/user/${account}`)
    return response.data
}

export const _getBoughtRafflesERC20 = async (account) => {
    const response = await client.get(`tickets/raffles/erc20/user/${account}`)
    return response.data
}

export const _getUserCreatedRafflesERC721 = async (account) => {
    const response = await client.get(`raffles/erc721/created/${account}`)
    return response.data
}

export const _getUserCreatedRafflesERC20 = async (account) => {
    const response = await client.get(`raffles/erc20/created/${account}`)
    return response.data
}

export const _getWhitelistData = async (merkleRoot) => {
    const response = await client.get(`whitelist/${merkleRoot}`)
    return response.data
}

export const _checkWinner = async (raffleId) => {
    const response = await client.get(`raffles/winner/${raffleId}`)
    return response.data
}

export const _getWeeklyLottery = async () => {
    const response = await client.get(`weeklylottery`)
    return response.data 
}

export const _getWeeklyLotteryTokens = async () => {
    const response = await client.get(`weeklylottery/tokens/current`)
    return response.data 
}

export const _getWeeklyLotteryWhitelistedTokens = async () => {
    const response = await client.get(`weeklylottery/whitelistedtokens`)
    return response.data 
}

export const _getWeeklyLotteryUserTickets = async (address) => {
    const response = await client.get(`weeklylottery/tickets/${address}`)
    return response.data 
}

export const _getWeeklyLotteryUserTicketsCurrentWeek = async (address) => {
    const response = await client.get(`weeklylottery/tickets/${address}/current`)
    return response.data 
}

export const _getResaleTicketsSold = async (address) => {
    const response = await client.get(`tickets/resale/sold/${address}`)
    return response.data
}

export const _fetchNFTs = async (address, chainId) => {
    const response = await client2.get(`nfts/${address}/${chainId}`)
    return response.data 
}

export const _fetchSpecificTokenBalance = async (account, tokens, chainId) => {
    const response = await client2.post(`tokens/specific`, {
        account: account,
        tokens: tokens,
        chain: chainId
    })
    return response.data
}

export const _getTokenMetadata = async (address, chainId) => {
    const response = await client2.get(`tokens/metadata/${address}/${chainId}`)
    return response.data
}

export const _fetchTokenBalances = async (address, chainId) => {
    const response = await client2.get(`tokens/balances/${address}/${chainId}`)
    return response.data
}

export const _getNftMetadata = async (address, id, chainId) => {
    const response = await client2.get(`nfts/metadata/${address}/${id}/${chainId}`)
    return response.data
}

export const _signatureSale = async (data) => {
    const response = await client.post('signatures', data)
    return response.status
}

export const _getNumberOfRafflesCreated = async (account) => {
    const response = await client.get(`raffles/created/amount/${account}`)
    return response.data
}

export const _getNumberOfTicketsBought = async (account) => {
    const response = await client.get(`/tickets/bought/amount/${account}`)
    return response.data
}
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BigNumber, utils } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { unixToDate } from '../../utils/formatting'
import { toast } from 'react-toastify'
import { cancelSellOrder } from '../../utils/Web3Functions'
import { buyATicketFromMarketplace } from '../../utils/formSubmissions'
import { useNavigate } from 'react-router-dom'

import './ResaleTicketBox.css'
import { l2Chain, l2ChainName } from '../../utils/constants'

export default function ResaleTicketBox(props) {
    // if (Object.keys(props.raffleData).length === 0) return 

    const { account, chainId } = useWeb3React()
    const [ ticketDestination, setTicketDestination ] = useState(account)
    const navigate = useNavigate()

    const totalTickets = props.raffleData.numberOfTickets
    const ticketsSold = props.raffleData.ticketsSold
    const currencyName = props.raffleData.currencyName 
    
    let name 
    let idOrAmount
    let currentWorth
    let pricePerTicketNoDecimals
    let pricePerTicketResale
    let end 

    try {
        name = props.raffleData.assetContractName ? props.raffleData.assetContractName : getEllipsisTxt(props.raffleData.assetContract, 10);
        idOrAmount = props.raffleData.raffleType === 'ERC20' ? utils.formatUnits(props.raffleData.nftIdOrAmount, props.raffleData.decimals).toString() : props.raffleData.nftIdOrAmount;
        currentWorth = utils.formatUnits(BigNumber.from(props.raffleData.numberOfTickets).mul(BigNumber.from(props.raffleData.pricePerTicket)), props.raffleData.currencyDecimals).toString()
        pricePerTicketNoDecimals = utils.formatUnits(BigNumber.from(props.raffleData.pricePerTicket), props.raffleData.raffle_currency_decimals).toString()
        pricePerTicketResale = utils.formatUnits(props.raffleData.price, props.raffleData.decimals)
        end = unixToDate(props.raffleData.endTimestamp)
    } catch (err) { return }
  
    const buyTickets = async () => {
        if (chainId !== l2Chain) {
            toast.error(`You need to be connected to ${l2ChainName}`)
            return 
        }

        const toSend = ticketDestination === '' ? ticketDestination : account
        const success = await buyATicketFromMarketplace(toSend, props.raffleData)
        if (success) navigate('/ticket-marketplace')
    }

    const cancel = async () => {
        if (chainId !== l2Chain) {
            toast.error(`You need to be connected to ${l2ChainName}`)
            return 
        }
        const success = await cancelSellOrder(props.raffleData.raffleId, props.raffleData.ticketId)
        if (success) navigate('/ticket-marketplace')
    }

    return (
        <div className="detailsTicketBuyContainer resaleTicketBoxContainer">
            <div className="titleDetails">
                <span>
                    {`Ticket ID ${props.raffleData.ticketId} for ${name} `}
                    {props.raffleData.raffleType === 'ERC721' && '#'}
                    {idOrAmount}
                </span>
            </div>
            <div className="raffleDetailsBoxContainer">
                <div className="raffleDetailsBox">
                    <h6>
                        {'Current Worth'}
                    </h6>
                    <div>
                        <span>
                        {`${currentWorth} ${props.raffleData.raffle_currency_name}`}
                        </span>
                    </div>
                </div>
                <div className="raffleDetailsBox">
                    <h6>
                        {'Total Tickets'}
                    </h6>
                    <div>
                        <span>
                        {totalTickets}
                        </span>
                    </div>
                </div>
                <div className="raffleDetailsBox">
                    <h6>
                        Tickets Sold
                    </h6>
                    <div>
                        <span>
                        {ticketsSold}
                        </span>
                    </div>
                </div>
                <div className="raffleDetailsBox">
                    <h6>
                        Original Ticket Price
                    </h6>
                    <div>
                        <span>
                        {`${pricePerTicketNoDecimals.toString()} ${props.raffleData.raffle_currency_name}`}
                        </span>
                    </div>
                </div>  
                <div className="raffleDetailsBox">
                    <h6>
                        End Date
                    </h6>
                    <div>
                        <span>
                        {`${end.toDateString()}`}
                        </span>
                    </div>
                </div>     
                <div className="raffleDetailsBox">
                    <h6>
                        End Time
                    </h6>
                    <div>
                        <span>
                        {`${end.getHours()}:${end.getMinutes().toString().length === 1 ? `0${end.getMinutes()}` : `${end.getMinutes()}`}`}
                        </span>
                    </div>
                </div> 
            </div>
            <div className="buyTicketRow">
                <input 
                className="forminput ticketsNumberInput" 
                onChange={(e) => setTicketDestination(e.target.value)}
                placeholder={account} />
                <Button 
                onClick={buyTickets}
                variant="buttonOutline" 
                className="plusMinusButton">
                    {`${pricePerTicketResale.toString()} ${currencyName}`}
                </Button>
                {
                    (
                        props.raffleData.seller && account &&
                        props.raffleData.seller.toLowerCase() === account.toLowerCase() &&
                        props.raffleData.signature === ''
                    ) &&
                    <Button onClick={cancel} className="plusMinusButton" variant="connectOutline">
                        Cancel
                    </Button>
                }
            </div>
        </div>
    )
}
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import { getEllipsisTxt, unixToDate } from '../../utils/formatting'
import { buyATicketForm } from '../../utils/formSubmissions'
import { cancelRaffle, completeRaffle } from '../../utils/web3Functions'
import { useNavigate } from 'react-router-dom'
import { utils } from 'ethers'

import './TicketBuyBox.css'
import { l2Chain, l2ChainName } from '../../utils/constants'

export default function TicketBuyBox(props) {

    if (Object.keys(props.raffleData).length === 0) return 

    const { active, account, chainId } = useWeb3React()

    const navigate = useNavigate()

    const totalTickets = props.raffleData.numberOfTickets
    const ticketsSold = props.raffleData.ticketsSold
    const currencyName = props.raffleData.currencyName 

    let name 
    let idOrAmount
    let pricePerTicketNoDecimals
    let currentWorth
    let end 

    try {
        name = props.raffleData.assetContractName ? 
        props.raffleData.assetContractName : getEllipsisTxt(props.raffleData.assetContract, 10)
     
        idOrAmount = props.raffleData.raffleType === 'ERC20' ?  
        utils.formatUnits(props.raffleData.nftIdOrAmount, props.raffleData.decimals).toString() :
        props.raffleData.nftIdOrAmount 
       
        pricePerTicketNoDecimals = utils.formatEther(props.raffleData.pricePerTicket, props.raffleData.currencyDecimals).toString()
        currentWorth = pricePerTicketNoDecimals * props.raffleData.numberOfTickets
        end = unixToDate(props.raffleData.endTimestamp)
    } catch (err) { return }

    const [ amountToPay, setAmountToPay ] = useState(pricePerTicketNoDecimals)
   
    // Function to cancel a raffle
    const cancelARaffle = async () => {
        if (chainId !== l2Chain) {
            toast.error(`You need to be connected to ${l2ChainName}`)
            return 
        }
        await cancelRaffle(props.raffleData.raffleId)
    }

    const [ amountOfTicketsToBuy, setAmountOfTicketsToBuy ] = useState(1);

    const changeAmountOftickets = (value) => {
        setAmountOfTicketsToBuy(value)
        setAmountToPay(pricePerTicketNoDecimals * value)
    }

    const buyTickets = async () => {
        if (chainId !== l2Chain) {
            toast.error(`You need to be connected to ${l2ChainName}`)
            return 
        }

        const success = await buyATicketForm(amountOfTicketsToBuy, props.raffleData.raffleId,
            props.raffleData.pricePerTicket, props.raffleData.currency)
        if (success) navigate('/raffles')
    }

    const closeRaffle = async () => {
        if (chainId !== l2Chain) {
            toast.error(`You need to be connected to ${l2ChainName}`)
            return 
        }

        const res = await completeRaffle(props.raffleData.raffleId)
        if (res) navigate('/raffles')
    }

    return (
        <div className="detailsTicketBuyContainer">
            <div className="titleDetails">
                {
                    props.raffleData.raffleType === 'ERC721' ?
                    `${name} #${idOrAmount}` :
                    `${idOrAmount} ${name}`
                }
            </div>
            <div className="raffleDetailsBoxContainer">
                <div className="raffleDetailsBox">
                    <h6>
                        {'Current Worth'}
                    </h6>
                    <div>
                        <span>
                        {`${currentWorth} ${currencyName}`}
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
                        Ticket Price
                    </h6>
                    <div>
                        <span>
                        {`${pricePerTicketNoDecimals.toString()} ${currencyName}`}
                        </span>
                    </div>
                </div>
                {
                    props.raffleData.raffleType === 'ERC721' && props.floorPrice &&
                    <div className="raffleDetailsBox">
                    <h6>
                        Floor Price
                    </h6>
                    <div>
                        <span>
                        {`${props.floorPrice} ${props.floorPriceCurrency}`}
                        </span>
                    </div>
                    </div>
                }   
                {
                    props.raffleData.raffleState === 'IN_PROGRESS' &&
                    <>
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
                    </>  
                }         
            </div>
            <div className="buyTicketRow">
                {
                    // if we have sold all tickets or the end time is in the past
                    totalTickets === ticketsSold || end < new Date() ?
                    <Button 
                    onClick={closeRaffle}
                    variant="buttonOutline" 
                    className="plusMinusButton">
                        Complete Raffle
                    </Button> :
                    <>
                        <input 
                        className="forminput ticketsNumberInput" 
                        onChange={(e) => changeAmountOftickets(e.target.value)} 
                        placeholder='Tickets' 
                        type="number" 
                        min="1" />
                        <Button 
                        onClick={buyTickets}
                        variant="buttonOutline" 
                        className="plusMinusButton">
                            {`${amountToPay.toString()} ${currencyName}`}
                        </Button>
                    </>
                }
                
                {
                    props.raffleData.raffleState === 'IN_PROGRESS' &&
                    active && props.raffleData?.raffleOwner && props.raffleData?.raffleOwner.toLowerCase() === account.toLowerCase() &&
                    <Button className="plusMinusButton" variant="connectOutline" onClick={cancelARaffle}>
                        Cancel
                    </Button>
                }   
            </div>           
        </div>
    )
}
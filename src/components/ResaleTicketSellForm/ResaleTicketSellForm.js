import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { signTransaction, postSellOrder } from '../../utils/Web3Functions'
import { BigNumber, utils } from 'ethers'
import { getEllipsisTxt, unixToDate } from '../../utils/formatting'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'
import { _getWhitelistedCurrencies, _signatureSale } from '../../utils/apiCalls'
import { l2Chain, l2ChainName } from '../../utils/constants'

import './ResaleTicketSellForm.css'

/**
 * 
 * @param props The raffle data 
 * @returns 
 */
export default function ResaleTicketSellForm(props) {

    if (Object.keys(props.raffleData).length === 0) return 

    const navigate = useNavigate()
    const { account, chainId } = useWeb3React()
    const [ whitelistedCurrencies, setWhitelistedCurrencies ] = useState([]) 
    
    const raffleData = props.raffleData
    const assetType = raffleData.raffleType
    const totalTickets = raffleData.numberOfTickets
    const ticketsSold = raffleData.ticketsSold

    let name 
    let currentWorth
    let pricePerTicketNoDecimals
    let end 
    let idOrAmount

    useEffect(() => {
        const getWhitelistedCurrencies = async () => {
            const response = await _getWhitelistedCurrencies()
            if (response) setWhitelistedCurrencies(response)
        }
        getWhitelistedCurrencies().catch()
    })

    try {
        name = raffleData.assetContractName ? raffleData.assetContractName : getEllipsisTxt(raffleData.assetContract, 10);
        currentWorth = utils.formatUnits(BigNumber.from(raffleData.numberOfTickets).mul(BigNumber.from(raffleData.pricePerTicket)), raffleData.currencyDecimals).toString()
        pricePerTicketNoDecimals = utils.formatUnits(BigNumber.from(raffleData.pricePerTicket), raffleData.raffle_currency_decimals).toString()
        end = unixToDate(raffleData.endTimestamp)
        idOrAmount = assetType === 'ERC20' ?  utils.formatUnits(
            raffleData.nftIdOrAmount, raffleData.decimals
            ).toString() :
            raffleData.nftIdOrAmount 
    } catch (err) { 
        console.log(err)
        return
     }
    
    // Function to sell a ticket in the marketplace
    const sellTicketToMarketplace = async (e) => {
        e.preventDefault();

        try {
            if (chainId !== l2Chain) {
                toast.error(`You need to be connected to ${l2ChainName}`)
                return 
            }
            
            const id = e.nativeEvent.submitter.id;
    
            const formData = new FormData(e.target);
            const formDataObject = Object.fromEntries(formData.entries());
            const currency = whitelistedCurrencies.find(item => item.name === formDataObject.currency);
            const price = utils.parseUnits(formDataObject.ticketprice, currency.decimals).toString()
    
            if (id === 'sellToMarketplace') {
                const success = await postSellOrder(raffleData.raffleId, raffleData.ticketId, currency.address, price);
                if (success) navigate('/ticket-marketplace')
            } else {
                if (!utils.isAddress(formDataObject.buyer)) {
                    toast.warning('Not a valid EVM address')
                    return 
                } 
                // ask to sign a tx
                const signature = await signTransaction(
                    chainId, 
                    formDataObject.buyer, 
                    raffleData.raffleId, 
                    raffleData.ticketId, 
                    currency.address, 
                    price);
                if (signature) {
                    const response = await _signatureSale({
                        currency: currency.address,
                        price: price,
                        raffleId: raffleData.raffleId,
                        ticketId: raffleData.ticketId,
                        signature: signature,
                        boughtBy: formDataObject.buyer, 
                        seller: account, 
                        currencyName: formDataObject.currency,
                        currencyDecimals: currency.decimals
                    })
                    if (response === 200) {
                        toast.success("Successfully set an item for sale with a signature")
                        navigate('/ticket-marketplace')
                    } else {
                        toast.error("Failed to create a ticket sale with a signature")
                    }
                }
            }
        } catch (err) {
            toast.warning('There was an error')
        }
    }
    
    return (
        <div className="detailsTicketBuyContainer resaleTicketBoxContainer">
            <div className="titleDetails">
                <span>{`Ticket ID ${raffleData.ticketId} for ${name} `}{raffleData.raffleType === 'ERC721' && '#'}{idOrAmount}</span>
            </div>
            <div className="raffleDetailsBoxContainer">
                <div className="raffleDetailsBox">
                    <h6>
                        {'Current Worth'}
                    </h6>
                    <div>
                        <span>
                        {`${currentWorth} ${raffleData.raffle_currency_name}`}
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
                        {`${pricePerTicketNoDecimals.toString()} ${raffleData.raffle_currency_name}`}
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
            <form className="ticketResaleForm" onSubmit={sellTicketToMarketplace}>
                <div className="formInputRow formInputRowResaleTicketSellForm">
                    <select required className="forminput forminputResale" name="currency">
                        <option name="currency">Currency</option>
                        {
                            whitelistedCurrencies.length > 0 && whitelistedCurrencies.map((item, index) => {
                                return <option key={index} name="currencyname">{item.name}</option>
                            })
                        }    
                    </select>
                    <input className="forminput forminputResale" required min='0' name="ticketprice" type="number" placeholder="Price" /> 
                </div> 
                <div className="formInputRow formInputRowResaleTicketSellForm">
                    <input className="forminput forminputResale" name="buyer" type="text" placeholder='Buyer address - only for signature sale' />
                </div>
                <div className="resaleTicketSellFormButtonRow">
                    <Button
                    id='sellToMarketplace'
                    type='submit' variant="connectOutline" className="plusMinusButton">
                        Sell
                    </Button>
                    <Button
                    id='sellToMarketplaceWithSignature'
                    type='submit' variant="connectOutline" className="plusMinusButton">
                        Sell with Signature
                    </Button>
                </div>
            </form>   
        </div>
    )
}
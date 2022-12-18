import React from 'react'
import { Link } from 'react-router-dom';
import { utils } from 'ethers';

import Loading from '../../../assets/nft.png'

export default function BuyTicketCard(props) {
    let nftIdOrAmount 
    let ticketPrice 
    try {
        nftIdOrAmount = props.assetType === 'ERC20' ? 
        utils.formatUnits(props.data.nftIdOrAmount, props.data.decimals).toString() :
        props.data.nftIdOrAmount; 
        ticketPrice = utils.formatUnits(props.data.price, props.data.currencyDecimals).toString()
    } catch (err) { 
        console.log(err)
        return }
    
    return (
        <Link 
        className="cardLink"
        to={'/ticket/buy/' + props.data.raffleId + '/' + props.data.ticketId}
        state={{ saleData: props.data, currencies: props.whitelistedCurrencies }}>
            <div className="generalCard">
                {
                    props.data.tokenURI.endsWith('.mp4') ?
                    <video src={props.data.tokenURI} className="nftImg" /> :
                    <img src={props.data.tokenURI ? props.data.tokenURI : Loading} alt="nftImg" className="cardImg" />
                }
                <div className="cardAbout">
                    <div className="cardDetails">
                        <div className="about">
                            <span>{
                                props.data.assetContractName ? 
                                props.data.assetContractName :
                                props.data.symbol ?
                                props.data.symbol :
                                props.data.assetContract
                            }</span>
                            <span>
                                {props.assetType === 'ERC721' && '#'}
                                {nftIdOrAmount}</span>
                        </div>
                    </div>
                    <div className="cardPrice">
                        <span>{ticketPrice}</span>
                        <span>{props.data.currencyName}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
import React from 'react'
import { utils } from 'ethers';
import { Link } from 'react-router-dom';

import Loading from '../../../assets/nft.png'

export default function SellTicketCard(props) {
    let nftIdOrAmount
    let originalPrice
    try {
        nftIdOrAmount = 
        props.assetType === 'ERC20' ? 
        utils.formatUnits(props.data.nftIdOrAmount, props.data.decimals).toString() :
        props.data.nftIdOrAmount;
        originalPrice = utils.formatUnits(props.data.pricePerTicket, props.data.currencyDecimals).toString()
    } catch (e) { return }

    return (
        <Link 
        className="cardLink"
        to={'/ticket/sell/' + props.data.raffleId + '/' + props.data.ticketId}
        state={{ assetData: props.data, currencies: props.whitelistedCurrencies }}>
            <div className="generalCard">
                {
                    props.data.tokenURI.endsWith('.mp4') ?
                    <video src={props.data.tokenURI} className="nftImg" /> :
                    <img src={props.data.tokenURI ? props.data.tokenURI : Loading} alt="nftImg" className="cardImg" />
                }
                <div className="cardAbout">
                    <div className="cardDetails">
                        <div className="about">
                            <span>{props.data.assetContractName}</span>
                            <span>{props.assetType === 'ERC721' && '#'}{nftIdOrAmount}</span>
                        </div>
                    </div>
                    <div className="cardPrice">
                        <span>{originalPrice}</span>
                        <span>{props.data.currencyName}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
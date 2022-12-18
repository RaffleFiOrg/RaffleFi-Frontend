import React from 'react'
import { Link } from 'react-router-dom'

import './GeneralCard.css'

export default function GeneralCard(props) {

    return (
        <Link 
        className="cardLink"
        to={'/raffle/' + props.raffleData.raffleId}
        state={{ assetData: props.raffleData, currencies: props.whitelistedCurrencies }}>
            <div className="generalCard">
                {
                    props.tokenURI.endsWith('.mp4') ?
                    <video src={props.tokenURI} className="cardImg" /> :
                    <img src={props.tokenURI} alt="nftImg" className="cardImg" />
                }
                <div className="cardAbout">
                    <div className="cardDetails">
                        <div className="about">
                            <span>{
                                props.raffleData.assetContractName ? 
                                props.raffleData.assetContractName :
                                props.raffleData.symbol ? 
                                props.raffleData.symbol :
                                props.raffleData.assetContract
                            }</span>
                            <span>
                                {props.raffleData.raffleType === 'ERC721' && '#'}
                                {props.idOrAmount}
                            </span>
                        </div>
                    </div>
                    <div className="cardPrice">
                        <span>{Number(props.ticketPrice).toFixed(2)}</span>
                        <span>{props.raffleData.currencyName}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
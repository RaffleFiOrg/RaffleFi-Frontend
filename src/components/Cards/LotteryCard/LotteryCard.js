import React from 'react'
import { utils } from 'ethers'

import Logo from '../../../assets/footerLogo.png'

export default function LotteryCard(props) {

    // TODO get the image from s3
    let amount 
    try {
        amount = utils.formatUnits(props.amount, props.decimals)
    } catch (e) { return }

    return (
        <div className="generalCard">
            <img src={Logo} alt="nftImg" className="cardImg" />
            <div className="cardAbout">
                <div className="cardDetails">
                    <div className="about">
                        <span>{props.name}</span>
                    </div>
                </div>
                <div className="cardPrice">
                    <span>{amount}</span>
                    <span>{props.symbol}</span>
                </div>
            </div>
        </div>
    )
}
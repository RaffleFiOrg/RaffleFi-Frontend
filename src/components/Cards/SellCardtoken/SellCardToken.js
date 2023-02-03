import React from 'react'
import { Link } from 'react-router-dom';
import Loading from '../../../assets/nft.png'

import './SellCardToken.css'

/// This component is used to display the token cards in the sell page
export default function SellCardToken(props) {
    // if we don't have any data, don't render anything
    if (Object.keys(props.data).length === 0) return 

    let symbol = props.data.symbol
    if (symbol && symbol.length > 15) symbol = symbol.substring(0, 15)

    let balance = parseFloat(props.data.balance).toFixed(2).toString() 
    if (balance.length > 7) balance = `${balance.substring(0, 7)}..`

    return (
        <Link to={props.data.token_address} 
        className="cardLink"
        state={{ assetData: props.data, assetType: props.assetType, whitelistedCurrencies: props.whitelistedCurrencies }}>
             <div className="generalCard">
                <img 
                className="sellCardTokenImg"
                src={props.data.logo ? props.data.logo : Loading} 
                /> 
                <div className="cardAbout">
                    <div className="cardDetails">
                        <div className="about">
                            <span>{props.data.name ? props.data.name : props.data.token_address}</span>      
                        </div>
                    </div>
                    <div className="cardPrice cardPriceToken">
                        <span>{balance}</span>
                        <span>{symbol}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
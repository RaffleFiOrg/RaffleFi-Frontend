import React from 'react'
import { Link } from 'react-router-dom';
import Loading from '../../../assets/nft.png'

import './SellCardToken.css'

export default function SellCardToken(props) {

    if (Object.keys(props.data).length === 0) return 

    let symbol = props.data.symbol
    if (symbol && symbol.length > 15) {
        symbol = symbol.substring(0, 15)
    }

    return (
        <Link to={props.data.token_address} 
        className="cardLink"
        state={{ assetData: props.data, assetType: props.assetType, whitelistedCurrencies: props.whitelistedCurrencies }}>
             <div className="generalCard">
                {
                    props.data.type === 'img' ?
                    <img 
                    className="sellCardTokenImg"
                    src={props.data.logo ? props.data.logo : Loading} 
                    /> :
                    <img 
                    className="sellCardTokenImg"
                    src={`data:image/svg+xml;base64,${props.data.logo}`} 
                    />
                }
                  
                <div className="cardAbout">
                    <div className="cardDetails">
                        <div className="about">
                            <span>{props.data.name ? props.data.name : props.data.token_address}</span>      
                        </div>
                    </div>
                    <div className="cardPrice cardPriceToken">
                        <span>{parseFloat(props.data.balance).toFixed(2)}</span>
                        <span>{symbol}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
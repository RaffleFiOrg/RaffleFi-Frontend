import React from 'react'
import { Link } from 'react-router-dom'
import { getEllipsisTxt } from '../../../utils/formatting';
import Loading from '../../../assets/nft.png'

import './SellCard.css'

export default function SellCard(props) {

    let image = props.data.rawMetadata.image ? props.data.rawMetadata.image : props.data.rawMetadata.image_url
    let tokenId = props.data.tokenId
    let name = props.data.rawMetadata?.name ? props.data.rawMetadata.name : props.data.contract.name

    try {
        if (image) {
            if (image.includes('ipfs')) {
                image = image.replace('ipfs://', 'https://ipfs.io/ipfs/')
            }
        } else if (image === undefined) {
            image = Loading
        }
    
        if (String(tokenId).length > 6) {
            tokenId = String(tokenId).slice(0, 6)
        }

        if (name && String(name).split(' ')[String(name).split(' ').length-1].includes('#')) {
            const splitted = String(name).split(' ')
            name = splitted.splice(0, splitted.length-1).join(' ') 
        }
    } catch (e) { return }
   
    return (
        <Link 
        className="cardLink"
        to={props.data.contract.address} 
        state={{ assetData: props.data, assetType: props.assetType, whitelistedCurrencies: props.whitelistedCurrencies }} >
            <div className="generalCard">
                {
                    image.endsWith('.mp4') ?
                    <video 
                    className="sellCardImg"
                    src={image}>
                    </video> :
                    <img 
                    className="sellCardImg"
                        src={image} 
                    />
                }
                <div className="cardAbout">
                    <div className="cardDetails">
                        <div className="about">
                            <span>{name}</span>
                        </div>
                    </div>
                    <div className="cardPrice">
                        <span>#{tokenId}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
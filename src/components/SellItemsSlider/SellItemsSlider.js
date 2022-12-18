import React, { useState } from 'react';
import Slider from 'react-slick';
import { settings } from '../../utils/sliderSettings';
import { Row } from 'react-bootstrap';
import SellCard from '../Cards/SellCard/SellCard';
import SellCardToken from '../Cards/SellCardtoken/SellCardToken'

export default function SellItemSlider(props) {

    // If no data was passed, we don't render anything
    if (props.assetData.length === 0) return 

    const whitelistedCurrencies = props.whitelistedCurrencies;
    const assetType = props.assetType;
    const raffleData = props.assetData
  
    return (
        <div className="collection">
            <div className="collectionCarousel">
                <Row className="text-center">
                    <Slider {...settings}>
                    {raffleData.map((item, index) => {
                        return (
                            assetType === 'ERC721' ? 
                            <SellCard key={index} assetType={assetType} whitelistedCurrencies={whitelistedCurrencies} data={item} /> :
                            <SellCardToken key={index} assetType={assetType} whitelistedCurrencies={whitelistedCurrencies} data={item} />   
                        ) 
                    })}
                    </Slider>
                </Row>
            </div>
        </div>
    )
}

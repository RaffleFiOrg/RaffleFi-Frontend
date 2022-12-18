import React, { useState } from 'react';
import Slider from 'react-slick';
import Loading from '../../assets/nft.png'
import GeneralCard from '../Cards/GeneralCard/GeneralCard';
import { settings } from '../../utils/sliderSettings';
import { Button, Col, Row } from 'react-bootstrap';
import { getEllipsisTxt, unixToDate } from '../../utils/formatting';

import './CollectionSlider.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { utils } from 'ethers';

export default function CollectionSlider(props) {

    // If no data was passed, we don't render anything
    if (props.raffleData.length === 0) return 

    const whitelistedCurrencies = props.whitelistedCurrencies;
    const assetType = props.assetType;
    
    const [raffleData, setRaffleData] = useState(props.raffleData);

    const sortBy = (sortType) => {
        switch(sortType) {
            case "sortByEndDateDesc":
                setRaffleData((prevEntries) => [...prevEntries].sort((a, b) => parseFloat(b.endTimestamp) - parseFloat(a.endTimestamp)))
                break
            case "sortByEndDateAsc":
                setRaffleData((prevEntries) => [...prevEntries].sort((a, b) => parseFloat(a.endTimestamp) - parseFloat(b.endTimestamp)))
                break 
            default:
                break 
        }
    }
  
    return (
        <Row className="collection">
            <Col className="justify-content-lg-start">
                <div className='collectionSliderTitle'>
                    <p>{
                        props.raffleData[0].assetContractName ? 
                        props.raffleData[0].assetContractName :
                        props.raffleData[0].symbol ?
                        props.raffleData[0].symbol :
                        getEllipsisTxt(props.raffleData[0].assetContract)
                        }
                    </p> 
                </div>
            </Col>
            <Col className="justify-content-lg-end">
                <div className='collectionSliderButtons'>
                    <Button 
                    variant="connectOutline sortButton"
                    onClick={() => sortBy("sortByEndDateDesc")}
                    >
                        Date Desc  
                    </Button>
                    <Button 
                    variant="connectOutline sortButton"
                    onClick={() => sortBy("sortByEndDateAsc")}
                    >
                        Date Asc
                    </Button>
                </div>
            </Col>
            <div className="collectionCarousel">
                <Row className="text-center">
                    <Slider {...settings}>
                    {raffleData.map((item, index) => {
                        let date = unixToDate(item.endTimestamp);
                        let tokenURI = item.tokenURI ? item.tokenURI : Loading;
                        let idOrAmount;
                        if (assetType === "ERC721") {
                            idOrAmount = item.nftIdOrAmount;
                        } else {
                            // Calculate the amount based on the decimals so it looks pretty
                            idOrAmount = utils.formatUnits(item.nftIdOrAmount, item.decimals)
                        }
                        // Calculate ticket price nicely with decimals
                        const ticketPrice = utils.formatUnits(item.pricePerTicket, item.currencyDecimals)

                        return (    
                            <GeneralCard 
                                raffleData={item} 
                                idOrAmount={idOrAmount}
                                tokenURI={tokenURI} 
                                date={date}
                                key={index} 
                                ticketPrice={ticketPrice}
                                whitelistedCurrencies={whitelistedCurrencies}
                            /> 
                        )  
                    })}
                    </Slider>
                </Row>
            </div>
        </Row>
    )
}

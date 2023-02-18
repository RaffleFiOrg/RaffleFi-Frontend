import React, { useState } from 'react';
import Slider from 'react-slick';
import { settings } from '../../utils/sliderSettings';
import { Button, Col, Row } from 'react-bootstrap';
import BuyTicketCard from '../Cards/BuyTicketCard/BuyTicketCard';
import SellTicketCard from '../Cards/SellTicketCard/SellTicketCard';

import './TicketsSlider.css';
import { useWeb3React } from '@web3-react/core';

export default function TicketsSlider(props) {

    // If no data was passed, we don't render anything
    if (props.assetData.length === 0) return 

    const { account } = useWeb3React()

    const whitelistedCurrencies = props.whitelistedCurrencies;
    const assetType = props.assetType;
    const mode = props.mode;
    const [ raffleData, setRaffleData ] = useState(props.assetData);

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
            <Col className="d-flex justify-content-lg-start justify-content-center">
                <p>{props.collectionName ? props.collectionName : 'Unnamed collection'}</p> 
            </Col>
            <Col className="d-flex justify-content-lg-end justify-content-center">
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
            </Col>
            <div className="collectionCarousel">
                <Row className="text-center">
                    <Slider {...settings}>
                    {raffleData.map((item, index) => {
                        return (
                            mode === 'Sell' ? 
                            <SellTicketCard key={index} assetType={assetType} whitelistedCurrencies={whitelistedCurrencies} data={item}/> :
                            (item.boughtBy === account || item.boughtBy === '0') &&
                            <BuyTicketCard key={index} assetType={assetType} whitelistedCurrencies={whitelistedCurrencies} data={item}/>   
                        ) 
                    })}
                    </Slider>
                </Row>
            </div>
        </Row>  
    )
}

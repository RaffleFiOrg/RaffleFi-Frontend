import React, { useState} from 'react';
import { Col, Row, Button, Container } from 'react-bootstrap';
import CollectionSlider from '../components/CollectionSlider/CollectionSlider';
import { 
    _getWhitelistedCurrencies, 
    _getActiveRafflesERC721, 
    _getActiveRafflesERC20 
} from '../utils/apiCalls';
import { useQuery } from '@tanstack/react-query';

import './Home.css'

export default function Home() {

    const [assetType, setAssetType ] = useState("ERC721");

    const { data: erc721 } = useQuery({
        queryKey: ['erc721ActiveRaffles'],
        queryFn: _getActiveRafflesERC721
    })

    const { data: erc20 } = useQuery({
        queryKey: ['erc20ActiveRaffles'],
        queryFn: _getActiveRafflesERC20
    })
    
    const { data: whitelistedCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: _getWhitelistedCurrencies
    })

    const Display = () => {
        if (assetType === 'ERC721') {
            if (!erc721) return 
            return Object.entries(erc721).map(([key, value]) => {
                return (
                    <CollectionSlider 
                    raffleData={value} 
                    assetType={assetType}
                    whitelistedCurrencies={whitelistedCurrencies}
                    key={key}
                    />
                )
            }) 
        } else {
            if (!erc20.data) return 
            return Object.entries(erc20).map(([key, value]) => {
                return (
                    <CollectionSlider 
                    raffleData={value} 
                    assetType={assetType}
                    whitelistedCurrencies={whitelistedCurrencies}
                    key={key}
                    />
                )
            }) 
        }   
    }


    return (
        <Container>
            <Row className="homePageTitleAndButtonsRow">
                <Col className="d-flex justify-content-lg-start justify-content-center">
                    <p className="homeTitle">Active Raffles</p>
                </Col>
                <Col className="d-flex justify-content-lg-end justify-content-center">
                    <Button 
                    variant="connectOutline assetTypeButton"
                    onClick={() => setAssetType("ERC721")}
                    >
                        ERC721 
                    </Button>
                    <Button 
                    variant="connectOutline assetTypeButton"
                    onClick={() => setAssetType("ERC20")}
                    >
                        ERC20
                    </Button>
                </Col>
            </Row>
            <Display />
        </Container>
    )
}
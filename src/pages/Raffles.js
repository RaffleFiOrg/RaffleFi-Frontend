import React, { useState } from 'react'
import { _getActiveRafflesERC20, _getActiveRafflesERC721, _getFinishedERC20Raffles, _getFinishedERC721Raffles, _getWhitelistedCurrencies } from '../utils/apiCalls';
import CollectionSlider from '../components/CollectionSlider/CollectionSlider';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';

import './Raffles.css'

// Display all the raffles
export default function Raffles() {
    const [assetType, setAssetType] = useState("ERC721");
    const [activeOrFinished, setActiveOrFinished] = useState("Active");

    const { data: erc721 } = useQuery({
        queryKey: ['erc721ActiveRaffles'],
        queryFn: _getActiveRafflesERC721
    })

    const { data: erc721Finished } = useQuery({
        queryKey: ['erc721RafflesFinished'],
        queryFn: _getFinishedERC721Raffles
    })

    const { data: erc20 } = useQuery({
        queryKey: ['erc20ActiveRaffles'],
        queryFn: _getActiveRafflesERC20
    })

    const { data: erc20Finished } = useQuery({
        queryKey: ['erc20RafflesFinished'],
        queryFn: _getFinishedERC20Raffles
    })
    
    const { data: whitelistedCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: _getWhitelistedCurrencies
    })

    // Inner component to render all raffles collections
    const RenderAll = () => {
        let data;
        if (assetType === 'ERC721' && activeOrFinished === 'Active') {
            data = erc721
        } else if (assetType === 'ERC721' && activeOrFinished === 'Finished') {
            data = erc721Finished
        } else if (assetType === 'ERC20' && activeOrFinished === 'Active') {
            data = erc20
        } else {
            data = erc20Finished
        }

        if (data && Object.keys(data).length > 0) {
            return Object.entries(data).map(([key, value]) => {
                return (
                    <CollectionSlider 
                    raffleData={value} 
                    collectionName={key}
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
            <Row className="Banner">
                <Col
                className="justify-content-lg-start"
                >
                    <div className="activeOrFinishedRow">
                        <span 
                        className={activeOrFinished==='Active' ? 'active' : 'finished'}
                        onClick={() => setActiveOrFinished('Active')}>
                            Active Raffles 
                        </span>
                    </div>
                    <div className='activeOrFinishedRow'>
                        <span 
                        className={activeOrFinished==='Finished' ? 'active' : 'finished'}
                        onClick={() => setActiveOrFinished('Finished')}
                        >Finished Raffles</span>
                    </div>
                </Col>
                <Col className="justify-content-lg-end">
                    <div className='rafflesNavigationButtons'>
                        <Button variant="connectOutline" 
                        className="assetButton"
                        onClick={() => setAssetType("ERC721")}
                        >
                            ERC721
                        </Button>
                        <Button 
                        variant="connectOutline" 
                        className="assetButton"
                        onClick={() => setAssetType("ERC20")}
                        >
                            ERC20
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <RenderAll />
            </Row>
        </Container>        
    )
}
import React from 'react'
import {  Col, Row, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { _getFloorPrice, _getNftMetadata, _getRaffledata } from '../utils/apiCalls';
import MetadataCard from '../components/Cards/MetadataCard/MetadataCard';
import TicketBuyBox from '../components/TicketBuyBox/TicketBuyBox';
import FinishedRaffleDetails from '../components/FinishedRaffleDetails/FinishedRaffleDetails';
import { blockExplorers } from '../utils/allChains';
import { useQuery } from '@tanstack/react-query';

import Loading from '../assets/nft.png';
import ethIcon from '../assets/ethIcon.svg'
import hearthIcon from '../assets/hearthicon.svg'
import './Raffle.css'


// Page with only one raffle
export default function Raffle() {
    
    const { chainId } = useWeb3React();
    const locationData = useLocation();

    const { data: raffleData } = useQuery({
        queryKey: ['raffleData', locationData.pathname],
        queryFn: () => _getRaffledata(locationData.pathname.split('/')[2])
    })

    const { data: floorPrice } = useQuery({
        queryKey: ['floorPrice', raffleData, chainId],
        queryFn: () => _getFloorPrice(raffleData.assetContract, chainId),
        enabled: !!chainId && !!raffleData && raffleData.raffleType === 'ERC721'
    })

    const { data: metadata } = useQuery({
        queryKey: ['metadata', raffleData, chainId],
        queryFn: () => _getNftMetadata(raffleData.assetContract, raffleData.nftIdOrAmount, chainId),
        enabled: !!chainId && !!raffleData && raffleData.raffleType === 'ERC721'
    })

    const Display = () => {
        if (raffleData) {
            if (raffleData[0]?.raffleState === 'IN_PROGRESS') {
                return (
                    <TicketBuyBox 
                    floorPrice={floorPrice && floorPrice.floorPrice}
                    floorPriceCurrency={floorPrice && floorPrice.priceCurrency}
                    raffleData={raffleData[0]}
                    assetType={raffleData[0].raffleType}
                    />
                )
            } else {
                return <FinishedRaffleDetails raffleData={raffleData[0]} /> 
            }
        }
    }

    return (
        <Container>
            <Row className="text-center homeLotteryRow">
                <p className="homeTitle">{
                    raffleData && raffleData[0].raffleState === 'IN_PROGRESS' ?
                    'Participate in this Raffle' :
                    'Raffle has completed'
                }
                    
                </p>
                <p className="homeSubtitle">
                    {
                        raffleData && raffleData[0].raffleState === 'IN_PROGRESS' &&
                        'You can win this Raffle'
                    }   
                </p>
            </Row>
            <Row className="raffleRow">
                <Col
                xs={12}
                md={12}
                lg={4}
                >
                    <div className="singleImageCard">
                        <div className="iconsBox">
                            <Col className="d-flex justify-content-start">
                                <a href={`${blockExplorers[1]}/address/${raffleData && raffleData[0].assetContract}`} rel="noreferrer" target="_blank">
                                    <img className="ethIcon iconLeft" src={ethIcon} />
                                </a>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <a>
                                    <img className="ethIcon iconRight" src={hearthIcon} />
                                </a>
                            </Col>
                        </div>
                        <img className="raffleImg" src={raffleData && raffleData[0].tokenURI ? raffleData[0].tokenURI : Loading}/>
                    </div>
                </Col>
                <Col
                xs={12}
                md={12}
                lg={8}
                >
                    <Display />
                </Col>
                {
                    metadata &&
                    <div>
                        <MetadataCard 
                        metadata={metadata} 
                        />
                    </div>
                }
            </Row>
        </Container>
    )
}
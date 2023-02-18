import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { _getFloorPrice, _getSaleData, _getWhitelistedCurrencies } from '../utils/apiCalls';
import { useWeb3React } from '@web3-react/core'
import { Container, Row, Col } from 'react-bootstrap'
import ResaleTicketSellForm from '../components/ResaleTicketSellForm/ResaleTicketSellForm';
import { useQuery } from '@tanstack/react-query';

import Loading from '../assets/nft.png'
import './TicketSale.css'

/**
 * Page that allows to resell a ticket to the market 
 */
export default function TicketSale() {

    const { account, chainId } = useWeb3React();

    // location data is needed to get the URL 
    const locationData = useLocation();
 
    const { data: ticketData } = useQuery({
        queryKey: [
            'ticketData', 
            account, 
            locationData.pathname.split('/')[3],
            locationData.pathname.split('/')[4]
        ],
        queryFn: () => _getSaleData(
            locationData.pathname.split('/')[3], 
            account, 
            locationData.pathname.split('/')[4]
        ),
        enabled: !!account 
    })

    
    const { data: floorPrice } = useQuery({
        queryKey: ['floorPrice', ticketData, chainId],
        queryFn: () => _getFloorPrice(ticketData.assetContract, chainId),
        enabled: !!chainId && !!ticketData && ticketData.raffleType === 'ERC721'
    })

    return (
        <Container>
            <Row className='ticketBuyRow'>
                {
                    ticketData &&
                    <>
                    <Col
                    xs={12}
                    md={12}
                    lg={4}
                    >
                        <div>
                            <img className="raffleImg" 
                            src={(ticketData.tokenURI) ? 
                                ticketData.tokenURI : Loading}
                            />
                        </div>
                    </Col>
                    <Col
                    xs={12}
                    md={12}
                    lg={8}
                    >
                        <ResaleTicketSellForm
                        floorPrice={floorPrice && floorPrice.floorPrice}
                        floorPriceCurrency={floorPrice && floorPrice.priceCurrency}
                        raffleData={ticketData[0]}
                        />
                    </Col>
                    </>
                }
            </Row>
        </Container>
    )
}
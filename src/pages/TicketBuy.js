import React from 'react'
import { _getFloorPrice, _getOrderData } from '../utils/apiCalls';
import { useWeb3React } from '@web3-react/core'
import { Container, Row, Col } from 'react-bootstrap'
import ResaleTicketBox from '../components/ResaleTicketBox/ResaleTicketBox';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import Loading from '../assets/nft.png'
import './TicketBuy.css'

/**
 * Page that allows to buy a ticket from the marketplace
*/
export default function TicketBuy() {

    const { chainId } = useWeb3React()
    const locationData = useLocation()

    console.log(locationData.pathname.split('/')[3])
    // The data of a ticket on sale by another user
    const { data: saleData } = useQuery({
        queryKey: ['saleData'],
        queryFn: () => _getOrderData(
            locationData.pathname.split('/')[3], 
            locationData.pathname.split('/')[4]
        )
    })

    // floor price if ERC721 raffle
    const { data: floorPrice } = useQuery({
        queryKey: ['floorPrice', saleData, chainId],
        queryFn: () => _getFloorPrice(saleData.assetContract, chainId),
        enabled: !!chainId && !!saleData && saleData.raffleType === 'ERC721'
    })

    console.log('saledata', saleData)


    return (
        <Container>
            <Row className='ticketBuyRow'>
                {
                    saleData &&
                    <>
                    <Col
                    xs={12}
                    md={12}
                    lg={4}
                    >
                        <div>
                            <img className="raffleImg" src={saleData[0].tokenURI ? saleData[0].tokenURI : Loading}/>
                        </div>
                    </Col>
                    <Col
                    xs={12}
                    md={12}
                    lg={8}
                    >
                        <ResaleTicketBox 
                        floorPrice={floorPrice && floorPrice.floorPrice}
                        floorPriceCurrency={floorPrice && floorPrice.priceCurrency}
                        raffleData={saleData[0]}
                        />
                    </Col>
                    </>  
                }
            </Row>
        </Container>
    )
}
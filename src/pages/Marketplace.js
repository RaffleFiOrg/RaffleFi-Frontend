import React, { useState } from 'react'
import { 
    _getTicketsOrdersERC20, 
    _getTicketsOrdersERC721, 
    _getUserTicketsERC20, 
    _getUserTicketsERC721,
    _getWhitelistedCurrencies 
} from '../utils/apiCalls'
import { useWeb3React } from '@web3-react/core'
import { Button, Container, Col, Row } from 'react-bootstrap'
import TicketsSlider from '../components/TicketsSlider/TicketsSlider'
import { useQuery } from '@tanstack/react-query'

import './Marketplace.css'

export default function Marketplace() {

    const { account } = useWeb3React()

    const [ assetType, setAssetType ] = useState("ERC721")
    const [ mode, setMode ] = useState("Buy")

    const { data: erc20Tickets } = useQuery({
        queryKey: ['erc20TicketsBought', account],
        queryFn: () => _getUserTicketsERC20(account),
        enabled: !!account 
    })

    const { data: erc721Tickets } = useQuery({
        queryKey: ['erc721TicketsBought', account],
        queryFn: () => _getUserTicketsERC721(account),
        enabled: !!account 
    })

    const { data: ticketsOrdersERC20 } = useQuery({
        queryKey: ['erc20TicketsOrders'],
        queryFn: _getTicketsOrdersERC20
    })

    const { data: ticketsOrdersERC721 } = useQuery({
        queryKey: ['erc721TicketsOrders'],
        queryFn: _getTicketsOrdersERC721
    })

    const { data: whitelistedCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: _getWhitelistedCurrencies
    })


    const TicketsCarousel = () => {
        let showing = {};

        if (mode === "Buy" && assetType === 'ERC721') {
            showing = ticketsOrdersERC721
        } else if (mode === "Buy" && assetType === 'ERC20') {
            showing = ticketsOrdersERC20
        } else if (mode === 'Sell' && assetType === 'ERC721') {
            showing = erc721Tickets
        } else {
            showing = erc20Tickets
        }

        if (!showing) return 
        if (Object.keys(showing).length === 0) return 

        return (
            Object.entries(showing).map(([key, value]) =>  {
                console.log('I have data', showing)
                return (
                    <TicketsSlider 
                    whitelistedCurrencies={whitelistedCurrencies}
                    key={key} 
                    mode={mode} 
                    assetData={value} 
                    collectionName={key}
                    assetType={assetType} />
                )
            })
        )
    }

    return (
        <Container>
            <Row className="text-center homeLotteryRow">
                <p className="homeTitle">Tickets Resale</p>
                <p className="homeSubtitle">Buy and sell your tickets here</p>
            </Row>
            <Row>
                <Col className="d-flex justify-content-lg-start justify-content-center">
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
                <Col className="d-flex justify-content-lg-end justify-content-center">
                    <Button variant="connectOutline" 
                    className="assetButton marketplaceButtons"
                    onClick={() => setMode("Sell")}
                    >
                        Sell
                    </Button>
                    <Button 
                    variant="connectOutline" 
                    className="assetButton marketplaceButtons"
                    onClick={() => setMode("Buy")}
                    >
                        Buy
                    </Button>
                </Col>
                <TicketsCarousel />
            </Row>  
        </Container>
    )
}
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ProfileDescription from '../components/ProfileDescription/ProfileDescription'
import { useWeb3React } from '@web3-react/core'
import { 
    _getWhitelistedCurrencies,
    _getBoughtRafflesERC721, 
    _getBoughtRafflesERC20, 
    _getUserCreatedRafflesERC721,
    _getUserCreatedRafflesERC20,
    _getNumberOfRafflesCreated,
    _getUserTicketsERC721Unsorted,
    _getUserTicketsERC20Unsorted,
    _getNumberOfTicketsBought
 } from '../utils/apiCalls'
import { settings } from '../utils/sliderSettings'
import SellTicketCard from '../components/Cards/SellTicketCard/SellTicketCard'
import Slider from 'react-slick';
import GeneralCard from '../components/Cards/GeneralCard/GeneralCard'
import { unixToDate } from '../utils/formatting'
import Loading from '../assets/nft.png'
import { utils } from 'ethers'
import { SearchBar } from '../components/SearchBar/SearchBar'
import { useQuery } from '@tanstack/react-query'

import './Profile.css'

export default function Profile() {

    const { account } = useWeb3React();

    const [ assetType, setAssetType ] = useState("ERC721")
    const [ ticketsSearchTerm, setTicketsSearchTerm ] = useState("")
    const [ rafflesSearchTerm, setRafflesSearchTerm ] = useState("")

    const { data: erc721Created } = useQuery({
        queryKey: ['erc721RafflesCreated', account],
        queryFn: () => _getUserCreatedRafflesERC721(account),
        enabled: !!account 
    })

    const { data: erc721Tickets } = useQuery({
        queryKey: ['erc721TicketsBoughtUnsorted', account],
        queryFn: () => _getUserTicketsERC721Unsorted(account),
        enabled: !!account 
    })

    const { data: erc20Created } = useQuery({
        queryKey: ['erc20RafflesCreated', account],
        queryFn: () => _getUserCreatedRafflesERC20(account),
        enabled: !!account 
    })

    const { data: erc20Tickets } = useQuery({
        queryKey: ['erc20TicketsBoughtUnsorted', account],
        queryFn: () => _getUserTicketsERC20Unsorted(account),
        enabled: !!account 
    })

    const { data: rafflesCreated } = useQuery({
        queryKey: ['totalRafflesCreated', account],
        queryFn: () => _getNumberOfRafflesCreated(account),
        enabled: !!account 
    })

    const { data: ticketsBought } = useQuery({
        queryKey: ['totalTicketsBought', account],
        queryFn: () => _getNumberOfTicketsBought(account),
        enabled: !!account
    })

    const { data: whitelistedCurrencies } = useQuery({
        query: ['currencies'],
        queryFn: _getWhitelistedCurrencies
    })

    // Need to fetch without sorting first on API 
    const ConditionalRenderingTickets = () => {
        try {
            const data = assetType === 'ERC20' ? erc20Tickets : erc721Tickets
            if (data && data.length > 0) {
                return (
                    <div className="collectionCarousel">
                        <Row className="text-center">
                            <Slider {...settings}>
                            {data.map((item, index) => {
                                if (!item.assetContractName.includes(ticketsSearchTerm)) return 
                                return (
                                    <SellTicketCard 
                                    key={index} assetType={assetType} 
                                    whitelistedCurrencies={whitelistedCurrencies} 
                                    data={item} /> 
                                ) 
                            })}
                            </Slider>
                        </Row>
                    </div>
                )
            } 
        } catch (err) {}
    }

    const ConditionalRenderingRaffles = () => {       
        try {
            const data = assetType === 'ERC20' ? erc20Created : erc721Created
            if (data && data.length > 0) {
                return (
                    <div className="collectionCarousel">
                        <Row className="text-center">
                            <Slider {...settings}>
                            {data.map((item, index) => {
                                if (!item.assetContractName.includes(rafflesSearchTerm)) return 

                                const date = unixToDate(item.endTimestamp);
                                const tokenURI = item.tokenURI ? item.tokenURI : Loading;
                                const idOrAmount = assetType === "ERC721" ? item.nftIdOrAmount :
                                    utils.formatUnits(item.nftIdOrAmount, item.decimals).toString()
                                const ticketPrice = utils.formatUnits(item.pricePerTicket, item.currencyDecimals).toString()
    
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
                )
            }
        } catch (err) {}
    }

    return (
        <Container>
            <ProfileDescription 
            rafflesCreated={rafflesCreated ? rafflesCreated : 0} 
            ticketsBought={ticketsBought ? ticketsBought : 0}
            setAssetType={setAssetType} />
            <Row className="lotterySpanTitleRow">
                <Col
                className="d-flex justify-content-center justify-content-lg-start justify-content-sm-center">
                    <span className="lotterySpanTitle">Tickets Bought</span>
                </Col>
                <Col className="d-flex justify-content-lg-end justify-content-center">
                    <SearchBar setSearchTerm={setTicketsSearchTerm}/>
                </Col>
                <ConditionalRenderingTickets />
            </Row>
            <Row className="lotterySpanTitleRow">
                <Col
                className="d-flex justify-content-center justify-content-lg-start justify-content-sm-center">
                    <span className="lotterySpanTitle">Raffles Created</span>
                </Col>
                <Col className="d-flex justify-content-lg-end justify-content-center">
                    <SearchBar setSearchTerm={setRafflesSearchTerm} />
                </Col>
                <ConditionalRenderingRaffles />
            </Row>
        </Container>
    )
}
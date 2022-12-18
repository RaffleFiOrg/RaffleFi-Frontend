import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import LotteryDescription from "../components/LotteryDescription/LotteryDescription";
import WeeklyLotteryDescription from '../components/WeeklyLotteryDescription/WeeklyLotteryDescription';
import { SearchBar } from '../components/SearchBar/SearchBar'
import { useWeb3React } from '@web3-react/core'
import Slider from 'react-slick'
import { settings } from '../utils/sliderSettings'
import { 
    _getWeeklyLottery, 
    _getWeeklyLotteryTokens, 
    _getWeeklyLotteryUserTicketsCurrentWeek, 
    _getWeeklyLotteryWhitelistedTokens 
} from '../utils/apiCalls';
import { _fetchSpecificTokenBalance } from '../utils/apiCalls'
import LotteryCard from '../components/Cards/LotteryCard/LotteryCard';

import './MonthlyLottery.css'

export default function Lotteries() {

    const [ assetType, setAssetType ] = useState("ERC721")
    const [ weeklyLotteryAssets, setWeeklyLotteryAssets ] = useState([])
    const [ weeklyLotteryWhitelistedtokens, setWeeklyLotteryWhitelistedtokens ] = useState([])
    const [ weeklyLotteryBoughtTicketsUser, setWeeklyLotteryBoughtTicketsUser ] = useState([])
    const [ weeklyLotteryData, setWeeklyLotteryData ] = useState({})

    const { account, active, chainId } = useWeb3React()

    const search = () => {

    }

    useEffect(() => {
        const getWeeklyWhitelistedTokens = async () => {
            const response = await _getWeeklyLotteryWhitelistedTokens()
            if (response.length > 0) setWeeklyLotteryWhitelistedtokens(response)
            const tokens = await _fetchSpecificTokenBalance(account.toString(), response.map((item) => item.address), chainId)
        }

        const getWeeklyLotteryData = async () => {
            const response = await _getWeeklyLottery()
            if (response.length > 0) setWeeklyLotteryData(response[0])
        }

        const getWeeklyLotteryAssets = async () => {
            const response = await _getWeeklyLotteryTokens()
            if (response.length > 0) setWeeklyLotteryAssets(response)
        }

        const getUserTickets = async () => {
            const response = await _getWeeklyLotteryUserTicketsCurrentWeek(account)
            if (response.length > 0) setWeeklyLotteryBoughtTicketsUser(response)
        }

        // const getUserERC20s = async () => {
        //     const response = await _fetchSpecificTokenBalance()
        // }

        getWeeklyWhitelistedTokens().catch()
        getWeeklyLotteryData().catch()
        getWeeklyLotteryAssets().catch()
        if (account) getUserTickets().catch()
    }, [active, account])

    const DisplayAssetsWeekly = () => {

    }

    const DisplayVaultWeekly = () => {
        return (
            <div className="collectionCarousel">
            <Row className="text-center">
                <Slider {...settings}>
                    {weeklyLotteryAssets.map((item, index) => {   
                        return (
                            <LotteryCard 
                            key={index}
                            name={item.name}
                            symbol={item.symbol}
                            amount={item.amount}
                            decimals={item.decimals}
                            />
                        ) 
                    })}
                </Slider>
            </Row>
        </div>
        )
       
    }

    return (
        <Container>
            <Row className="text-center homeLotteryRow">
                <p className="homeTitle">Active Lotteries</p>
                <p className="homeSubtitle">Scroll down to play our lotteries</p>
            </Row>
            <WeeklyLotteryDescription 
            totalTicketsSold={
                weeklyLotteryData.total_tickets_sold ? 
                weeklyLotteryData.total_tickets_sold :
                0
            } />
            <Row className='lotterySpanTitleRow'>
                <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-center justify-content-lg-start justify-content-sm-center">
                    <span className="lotterySpanTitle">The Vault</span>
                </Col>
                <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-lg-end justify-content-center">
                    <SearchBar search={search} />
                </Col>
            </Row>
            <DisplayVaultWeekly />
            <Row className='lotterySpanTitleRow'>
                <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-center justify-content-lg-start justify-content-sm-center">
                    <span className="lotterySpanTitle">Your Assets</span>
                </Col>
                <Col 
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-lg-end justify-content-center">
                    <SearchBar search={search} />
                </Col>
            </Row>
            <DisplayAssetsWeekly />
            <LotteryDescription setAssetType={setAssetType} />
            <Row className="lotterySpanTitleRow">
                <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-center justify-content-lg-start justify-content-sm-center">
                    <span className="lotterySpanTitle">Your Elegible Assets</span>
                    {
                        assetType === 'ERC20' ? '' : ''
                    }
                </Col>
                <Col 
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-lg-end justify-content-center">
                    <SearchBar search={search} />
                </Col>
            </Row>
            <Row className='lotterySpanTitleRow'>
                <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-center justify-content-lg-start justify-content-sm-center">
                    <span className="lotterySpanTitle">The Vault</span>
                    {
                        assetType === 'ERC20' ? '' : ''
                    }
                </Col>
                <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="d-flex justify-content-lg-end justify-content-center">
                    <SearchBar search={search} />
                </Col>
            </Row>
        </Container>
    )
}
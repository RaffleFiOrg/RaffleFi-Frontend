import React, { useEffect, useState } from 'react'
import { Button, Container, ThemeProvider, Col, Row } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom';
import { _getFloorPrice, _getWhitelistedCurrencies } from '../utils/apiCalls';
import { useWeb3React } from '@web3-react/core';
import MetadataCard from '../components/Cards/MetadataCard/MetadataCard';
import { createRaffleForm } from '../utils/formSubmissions';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

import Loading from '../assets/nft.png'
import './SellItem.css'

export default function SellItem() {

    const locationData = useLocation();
    const navigate = useNavigate();

    // Get the data from the 
    const { account, chainId, active } = useWeb3React()
    const [ assetType, setAssetType ] = useState("ERC721")
    const [ raffleData, setRaffleData ] = useState({})
    const [ image, setImage ] = useState()
    const [ metadata, setMetadata ] = useState()
    const [ showName, setShowName ] = useState()    

    const { data: floorPrice } = useQuery({
        queryKey: ['floorPrice', raffleData, chainId],
        queryFn: () => _getFloorPrice(raffleData.assetContract, chainId),
        enabled: !!chainId && !!raffleData && raffleData.raffleType === 'ERC721'
    })

    const { data: whitelistedCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: _getWhitelistedCurrencies
    })

    // Get the floor price when the page loads only if NFT
    useEffect(()  => {        
        // This page can only be accessed if coming from the sell page 
        if (locationData.state === null) {
            navigate('/sell')
        } else {
            if (account) {
                setRaffleData(locationData.state.assetData);
                setAssetType(locationData.state.assetType);
                let name 
                if (locationData.state.assetType === 'ERC721') {
                    if (locationData.state.assetData.rawMetadata?.name) {
                        name = locationData.state.assetData.rawMetadata?.name
                    } else name = locationData.state.assetData.contract?.name
                    if (name && String(name).split(' ')[String(name).split(' ').length-1].includes('#')) {
                        const splitted = String(name).split(' ')
                        name = splitted.splice(0, splitted.length-1).join(' ') 
                    }
                } else name = locationData.state.assetData?.name 
                setShowName(name)
            }
        }
        if (locationData.state.assetType === 'ERC721') {
            setMetadata(locationData.state.assetData.rawMetadata)
            // get the metadata
            if (locationData.state.assetData.rawMetadata?.image) {
                if (String(locationData.state.assetData.rawMetadata.image).includes('ipfs')) {
                    setImage(String(locationData.state.assetData.rawMetadata.image).replace('ipfs://', 'https://ipfs.io/ipfs/'))
                } else {
                    setImage(locationData.state.assetData.rawMetadata.image)
                }
            } else if (locationData.state.assetData.rawMetadata?.image === undefined) {
                if (locationData.state.assetData.rawMetadata?.image_url) {
                    setImage(locationData.state.assetData.rawMetadata.image_url)
                } else {
                    setImage(Loading)
                }
            } else {
                setImage(Loading)
            }
        } else {
            setImage(locationData.state.assetData.logo ? locationData.state.assetData.logo : Loading)
        }
    }, [chainId, account]);


    const createNewRaffle = async (e) => {
        e.preventDefault();

        // check if we are connected
        if (!active) {
            toast.warn("You need to connect your wallet first")
            return 
        }

        if (chainId !== 5) {
            toast.error("You need to be connected to Ethereum")
            return 
        }

        const success = await createRaffleForm(
            e,
            whitelistedCurrencies,
            assetType === 'ERC721' && raffleData.tokenId,
            assetType === 'ERC721' ? raffleData.contract.address : raffleData.token_address,
            assetType
        );

        if (success) navigate('/sell')
    }

    const RenderForm = () => {
        return (
            <div className="formcontainer">
                <div className="titleDetailsSell">
                    <span>
                        {showName}{' '}{
                        assetType === 'ERC721' ? '#' + raffleData.tokenId :
                        raffleData.balance
                        }
                    </span>
                </div>
                <form onSubmit={createNewRaffle}>
                    {
                        assetType === "ERC20" && 
                        <div className="formInputRow">
                            <input className="forminput" required name="amount" type="text" placeholder="Amount" /> 
                        </div>
                    }
                    <div className="formInputRow">
                        <select required className="forminput" name="currency">
                            <option name="currency">Currency</option>
                            {
                                whitelistedCurrencies &&
                                whitelistedCurrencies.length > 0 && whitelistedCurrencies.map((item, index) => {
                                    return <option key={index} name="currencyname">{item.name}</option>
                                })
                            }    
                        </select>
                        <input className="forminput" required name="ticketprice" type="text" placeholder="Price" /> 
                    </div>
                    <div className="formInputRow">
                        <input className="forminput" type="number" required min='1' name="numberoftickets" placeholder="Number of tickets" /> 
                        <input className="forminput" type="number" min='0' required name="minimumtickets" placeholder="Minimum tickets" /> 
                    </div>
                    <div className="formInputRow">
                        <input className="forminput" required type="date" name="enddate" placeholder="End date" /> 
                        <input className="forminput" required type="time" name="endtime" placeholder="End time" />                       
                    </div>
                    <div className="buttonsRowSellItem">
                        <Button type='submit' variant="connectOutline" id="raffleButton" className="createRaffleButton">
                            Create Raffle
                        </Button>
                        <Button type='submit' variant="connectOutline" id="fairButton" className="createRaffleButton">
                            Calculate Fair Value
                        </Button>
                    </div>
                </form>
            </div>
        )  
    }

    return (
        <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minBreakpoint="xxs"
        >
            <Container>
                <Row className="text-center homeLotteryRow">
                    <p className="homeTitle">Create A New Raffle</p>
                </Row>
                <Row className="sellItemRow">
                    <Col
                    xs={12}
                    md={12}
                    lg={4}
                    >
                        <div>
                            <img className="raffleImg" src={image}/>
                        </div>
                    </Col>
                    <Col
                    xs={12}
                    md={12}
                    lg={8}
                    >
                       <RenderForm />
                    </Col>
                    {
                        assetType === 'ERC721'  &&
                        <div>
                            <MetadataCard 
                            metadata={metadata} 
                            floorPrice={floorPrice && floorPrice.floorPrice}
                            floorPriceCurrency={floorPrice && floorPrice.priceCurrency}
                            />
                        </div>
                    }
                </Row>
                </Container>
        </ThemeProvider>
    )
}
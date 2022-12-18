import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button, Container, Col, Row } from 'react-bootstrap';
import { _fetchTokenBalances, _fetchNFTs } from '../utils/apiCalls';
import { _getWhitelistedCurrencies } from '../utils/apiCalls';
import SellItemSlider from '../components/SellItemsSlider/SellItemsSlider';
import { useQuery } from '@tanstack/react-query';

import './Sell.css'

export default function Sell() {

    const { account, chainId } = useWeb3React();
    const [ assetType, setAssetType ] = useState("ERC721");

    const { data: nfts } = useQuery({
        queryKey: ['nfts', account, chainId],
        queryFn: () => _fetchNFTs(account, chainId),
        enabled: !!account 
    })
    
    const { data: erc20s } = useQuery({
        queryKey: ['erc20', account, chainId],
        queryFn: () => _fetchTokenBalances(account, chainId),
        enabled: !!account
    })

    const { data: whitelistedCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: _getWhitelistedCurrencies
    })
    
    const Display = () => {
        let data = new Array();
        if (assetType === "ERC721") {
            if (nfts && nfts.length > 0) {
                data = nfts;
            }
        } else {
            if (erc20s && erc20s.length > 0) {
                data = erc20s;
            } 
        }
        if (data.length === 0) return 

        return (
            <SellItemSlider 
            assetType={assetType} 
            assetData={data} 
            whitelistedCurrencies={whitelistedCurrencies} />
        )
    }

    return ( 
        <Container>
            <Row className="homePageTitleAndButtonsRow">
                <Col className="d-flex justify-content-lg-start justify-content-center">
                    <p className="homeTitle">Pick from your wallet</p>
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
            <div className="sellRow">
                <Display />
            </div>
        </Container>
    )
}
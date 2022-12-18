import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import './LotteryDescription.css'

export default function LotteryDescription(props) {

    const checkIfYouWon = () => {

    }
    
    return (
        <Row className="lotteryDescriptionRow">
            <Col className="justify-content-lg-start">
                <div className="spanDiv">
                    <span className="monthlyLotterySpan">
                        Monthly Lottery
                    </span>
                </div>
                <div className="remainingTimeLottery">
                    <Button disabled variant="buttonOutline"
                    className="timeButton"
                    >
                        0
                    </Button>
                    <Button 
                    disabled
                    className="timeButton"
                    variant="buttonOutline">
                        0
                    </Button>
                    <Button disabled className="colonButton" variant="buttonOutline">
                        :
                    </Button>
                    <Button disabled className="timeButton" variant="buttonOutline">
                        0
                    </Button>
                    <Button disabled className="timeButton" variant="buttonOutline">
                        0
                    </Button>
                    <Button disabled className="colonButton" variant="buttonOutline">
                        :
                    </Button>
                    <Button disabled className="timeButton" variant="buttonOutline">
                        0
                    </Button>
                    <Button disabled className="timeButton" variant="buttonOutline">
                        0
                    </Button>
                </div>
            </Col>
            <Col>
                <div className='lotterDescriptionRow'>
                    <span>
                        Contribute to the vault using one of the NFTs that you own. 
                        Only allowed NFTs will be displayed. 
                        Each NFT will be worth x amount of shares which are decided 
                        at the beginning of the month based on the floor price at that time.
                    </span>
                </div>
                <Row className='lotterDescriptionRow3'>
                    <Col className="d-flex justify-content-lg-start justify-content-center">
                        <Button 
                            variant="connectOutline checkIfYouWonButton"
                            onClick={checkIfYouWon}
                            >
                                Check if you won 
                        </Button>
                    </Col>
                    <Col className="d-flex justify-content-lg-start justify-content-center">
                        <Button 
                        variant="connectOutline assetTypeButton"
                        onClick={() => props.setAssetType("ERC721")}
                        >
                            ERC721 
                        </Button>
                        <Button 
                        variant="connectOutline assetTypeButton"
                        onClick={() => props.setAssetType("ERC20")}
                        >
                            ERC20
                        </Button>
                    </Col>
                </Row>   
            </Col>
        </Row>
    )
}
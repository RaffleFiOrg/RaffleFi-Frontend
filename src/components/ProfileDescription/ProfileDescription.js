import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { _getResaleTicketsSold } from '../../utils/apiCalls';

import './ProfileDescription.css'

export default function ProfileDescription(props) {

    const { account } = useWeb3React()
    const [ resaleTicketsSold, setResaleTicketsSold ] = useState(0)

    useEffect(() => {
        const getResaleTicketsSold = async () => {
            const response = await _getResaleTicketsSold(account)
            response && setResaleTicketsSold(response)
        }

        if (account) getResaleTicketsSold().catch()
    }, [ account ])

    return (
        <Row className="profileDescriptionRow">
            <Col className="justify-content-lg-start">
                <div className="spanDiv">
                    <span className="monthlyLotterySpan">
                        Profile
                    </span>
                </div>
                <div className="spanDiv">
                    <span className="accountAddressSpan">
                        {account}
                    </span>
                </div>
                <div className="buttonRowProfileDescription">
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
                </div>
            </Col>
            <Col className="justify-content-lg-end">
                <div className="lotterDescriptionRow profileDescriptionSpanRow">
                    <span className="lotteryDescriptionSpan1">
                        Statistics
                    </span>
                </div>
                <div className='lotterDescriptionRow'>
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="profileStatsSpan">
                            {`Created ${props.rafflesCreated} Raffles`}
                        </span>
                    </div>
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="profileStatsSpan">
                            {`Bought ${props.ticketsBought} Tickets`}
                        </span>
                    </div>
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="profileStatsSpan">
                            {`Sold ${resaleTicketsSold} Resale Tickets`}
                        </span>
                    </div>
                </div>
            </Col>
        </Row>
    )
}
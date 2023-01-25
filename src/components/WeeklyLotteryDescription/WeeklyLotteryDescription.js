import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { checkIfIWonWeekly } from '../../utils/web3Functions';

export default function WeeklyLotteryDescription(props) {

    const [ lotteryWeek, setLotteryWeek ] = useState(0)

    const checkIfYouWon = async () => {
        const res = await checkIfIWonWeekly(lotteryWeek)
        if (res) toast.success(`Wow, you won the lottery with index ${lotteryWeek.toString()}`)
        else toast.warn('Sorry, you did not win')
        // show how to claim 
    }

    return (
        <Row className="weeklyLotteryDescriptionRow">
            <Col className="justify-content-lg-start">
                <div className="spanDiv">
                    <span className="monthlyLotterySpan">
                        Weekly Lottery
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
                        Contribute to the vault using any tokens you want. The amount of tickets received will 
                        depend on the value of the deposited assets at the time of deposit.
                    </span>
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="profileStatsSpan">
                            {`Sold ${props.totalTicketsSold} Tickets`}
                        </span>
                    </div>
                </div>
                <div className='lotterDescriptionRow3'>
                    <input 
                    className="forminput formInputLotteryDescription"
                    type='number' required placeholder='Lottery index' 
                    onChange={(e) => setLotteryWeek(e.target.value)} />
                    <Button 
                        variant="connectOutline checkIfYouWonButton"
                        onClick={checkIfYouWon}
                        >
                            Check if you won 
                    </Button>
                </div>   
            </Col>
        </Row>
    )
}
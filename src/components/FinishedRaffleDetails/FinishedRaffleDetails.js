import React from 'react'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';

import './FinishedRaffleDetails.css'

/**
 * Show the details for a finished raffle
 * @param props <any> - data from the parent component
 * @returns <void>
 */
export default function FinishedRaffleDetails(props) {

    if (Object.keys(props.raffleData).length === 0) return 

    const raffleData = props.raffleData 
    const name = props.raffleData.assetContractName ? 
    props.raffleData.assetContractName : 
    props.raffleData.symbol ?
    props.raffleData.symbol :
    props.raffleData.assetContract;

    let idOrAmount
    let ticketPrice

    try {
        idOrAmount = props.raffleData.raffleType === 'ERC721' ? props.raffleData.nftIdOrAmount :
        utils.formatUnits(props.raffleData.nftIdOrAmount, props.raffleData.decimals)
        ticketPrice = utils.formatUnits(raffleData.pricePerTicket, raffleData.currencyDecimals)
    } catch (err) { return }

    return (
        <div className="finishedRaffleDetailsBox">
            <div className="finishedRaffleDetailsTitle">
                <span>{`${name} #${idOrAmount}`}</span>
            </div>
            <div className="statsRowFinished">
                <div className="finishedRaffleRow">
                    <span style={{'fontSize': '24px'}} className="finishedRaffleSpanTitle">
                        Raffle details
                    </span>
                </div>
                <div className='lotterDescriptionRow'>
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="finishedRaffleSpan">
                            {`Tickets sold: ${raffleData.ticketsSold} `}
                        </span>
                    </div>
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="finishedRaffleSpan">
                            {`Ticket price: ${ticketPrice} ${raffleData.currencyName} `}
                        </span>
                    </div>    
                    <div className="iconsDiv">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span className="finishedRaffleSpan">
                            {`Winner: `}
                            </span>
                        <span className="finishedRaffleSpanWinner">{raffleData.raffleWinner}</span>
                    </div>                     
                </div>
            </div>
        </div>
    )
}
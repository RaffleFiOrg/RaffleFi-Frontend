import React from 'react';
import { Link } from 'react-router-dom';
import DogePound from '../../assets/dogepound.png';
import EthereumLogoRight from '../../assets/ethbackgroundright.png';
import EthereumLogoLeft from '../../assets/ethbackgroundleft.png';

import './LotteryWidget.css';

export default function LotteryWidget(props) {

    const assetType = props.assetType;
    const imgSrc = props.lotteryType === 'Weekly Lottery' ? EthereumLogoLeft : assetType === 'erc20' ? EthereumLogoRight : DogePound;

    return (
        <div className="widgetCard">
            <Link className='playButton' to='lotteries'>
                <div className="lotteryImgContainer">
                    <img className="lotteryImage" src={imgSrc}></img>
                </div>
            </Link>
        </div>
    );
}
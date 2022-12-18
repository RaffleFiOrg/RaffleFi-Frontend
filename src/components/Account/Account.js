import React, { useEffect, useState } from "react"
import { connectors } from '../../utils/connectors'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from "@web3-react/core"
import { ethers } from 'ethers'
import { blockExplorers, menuItems } from "../../utils/allChains"
import { getEllipsisTxt } from "../../utils/formatting"
import Chains from "../Chains/Chains";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { allowedChains } from "../../utils/constants"

import '../NavBar/NavBar.css';
import './Account.css'

const Injected = new InjectedConnector({
    supportedChainIds: allowedChains
});

/**
 * Handle web3 account stuff 
 */
export default function Account() {

    const { active, activate, deactivate, chainId, account } = useWeb3React()
    const [ isModalVisible, setIsModalVisible ] = useState(false)
    const [ isAuthModalVisible, setIsAuthModalVisible ] = useState(false)
    const [ userNativeBalance, setUserNativeBalance ] = useState(null)
    const [ chainToken, setChainToken ] = useState('')

    useEffect(() => {
        const connectWalletOnPageLoad = async () => {
            if (localStorage.getItem('isAuthenticated') === 'true') {
                await activate(Injected)
            }
        }

        const getBalance = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
                const signer = provider.getSigner()
                const balance = await signer.getBalance()
                setUserNativeBalance(Number(ethers.utils.formatEther(balance.toString())).toFixed(2))
                const net = menuItems.find(item => item.key === chainId)
                if (net) {
                    setChainToken(net.value)
                }  
            } catch (e) {}
        }

        if (active) getBalance().catch()
        connectWalletOnPageLoad().catch()

    }, [chainId, account])

    // Helper functions
    // View on explorer 
    const ViewOnExplorer = (account) => {
        const url = blockExplorers[chainId] ? `${blockExplorers[chainId]}/address/${account.account}` : '#'
        return (
            <>
            <a style={{textDecoration: 'none'}} 
                href={url} 
                target="_blank">
                <svg style={{marginLeft: '10px'}} viewBox="64 64 896 896" 
                focusable="false" dataicon="select" 
                width="1em" height="1em" fill="currentColor" 
                aria-hidden="true">
                    <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h360c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H184V184h656v320c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V144c0-17.7-14.3-32-32-32zM653.3 599.4l52.2-52.2a8.01 8.01 0 00-4.7-13.6l-179.4-21c-5.1-.6-9.5 3.7-8.9 8.9l21 179.4c.8 6.6 8.9 9.4 13.6 4.7l52.4-52.4 256.2 256.2c3.1 3.1 8.2 3.1 11.3 0l42.4-42.4c3.1-3.1 3.1-8.2 0-11.3L653.3 599.4z">
                    </path>
                    <title>View on block explorer</title>
                </svg>
            </a>
            </>
        )
    }

    // The copy icon 
    const CopyIcon = () => {
        return (
            <>
            <svg onClick={()=> 
            navigator.clipboard.writeText(account)
            }     
            xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="#1780FF" 
            fill="none" strokeLinecap="round" strokeLinejoin="round" style={{cursor: "pointer"}}>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 3v4a1 1 0 0 0 1 1h4"></path>
                <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z"></path>
                <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"></path>
                <title id="copy-address">Copy Address</title>
            </svg>
            </>
        )
    }

    // If we are not connected to a wallet
    if (!active) {
        return (
            <>
            <Button 
            variant="connectOutline nav"
            onClick={() => setIsAuthModalVisible(true) }
            >
                Connect
            </Button>

            <Modal 
            show={isAuthModalVisible}
            onHide={() => setIsAuthModalVisible(false)}
            className="modalAccount"
            >
                <ModalHeader closeButton>
                    <h4 className="w-100 text-center">Authenticate</h4>
                </ModalHeader>
                <ModalBody>
                    <div className="text-center">
                        {
                            connectors.map(({title, icon, connectorId}, index) => {
                                return (
                                    <div key={index} onClick={async () => {
                                        try {
                                            activate(Injected)
                                            setIsAuthModalVisible(false)
                                            localStorage.setItem("isAuthenticated", true)
                                        } catch (e) {}
                                    }}>
                                        <ModalBody className="text-center">
                                            <img src={icon} alt={title} style={{width: '50px', height:'50px', borderWidth: '5px', borderColor:'black', 
                                            borderRadius:'10px', marginRight: '5px', marginBottom: '10px'}} /> <br />
                                            {title}
                                        </ModalBody>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ModalBody>
            </Modal>
            </>
        )
    } else {
        if (!allowedChains.includes(chainId)) {
            return (
                <Button
                variant="connectOutline"
                onClick={() => setIsModalVisible(true)}
                >
                    <span>Wrong Chain</span>
                </Button>
            )
        } else {
            return (
                <>
                <Button
                variant="connectOutline"
                onClick={() => setIsModalVisible(true)}
                >
                    <span>{getEllipsisTxt(account, 6)}</span>
                </Button>
                <Modal
                show={isModalVisible}
                onHide={() => setIsModalVisible(false)}
                className='modalAccount'
                >
                    <ModalHeader closeButton style={{justifyContent:'center'}}>
                    <h4 className="w-100 text-center">
                        Account 
                    </h4>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{display:'grid', gridTemplateColumns: '2fr 1fr'}}>
                            <ModalBody>
                                <div>
                                    <span>{getEllipsisTxt(account, 7)}</span>
                                    <CopyIcon />
                                </div>
                                <div className="modalAccountButtonsRow">
                                    <Button 
                                    variant="connectOutline" 
                                    onClick={async () => {
                                        deactivate();
                                        setIsModalVisible(false);
                                        localStorage.setItem("isAuthenticated", false);
                                    }}>
                                        Disconnect
                                    </Button> 
                                </div>
                            </ModalBody>
                            <ModalBody className="text-center">
                                <div>
                                    {userNativeBalance}{' '}{chainToken}
                                    <ViewOnExplorer account={account.toString()} />
                                </div>
                                <div className="modalAccountButtonsRow">
                                    <Chains />
                                </div>
                            </ModalBody>
                        </div>
                    </ModalBody>
                </Modal>  
                </> 
            )
        }
    }
}
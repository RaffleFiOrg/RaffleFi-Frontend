import React, { useEffect, useState } from 'react'
import { chainsData, menuItems } from '../../utils/allChains';
import { useWeb3React } from '@web3-react/core';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';

import './Chains.css'

export default function Chains() {
  const [selected, setSelected] = useState({});

  const { library, account, chainId } = useWeb3React();

  const switchNetwork = async (id) => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: id }],
      });
    } catch (switchError) {
      // 4902 error code indicates the chain is missing on the wallet
      if (switchError.code === 4902) {
        if (id === '0x66EED') {
          try {
            await library.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                chainsData.arbitrumTestnet
              ],
            });
          } catch (error) {
            console.error(error)
          }
        } else if (id === '0x13881') {
          try {
            await library.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                chainsData.maticMumbai
              ],
            });
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
  }

  useEffect(() => {
    if (!chainId) return;
    const newSelected = menuItems.find((item) => item.key === chainId);
    setSelected(newSelected);
  }, [chainId])

  if (!chainId || !account) return null;

  const renderChainsTooltip = props => (
    <Tooltip className="tooltipStyle" {...props}>Change chain</Tooltip>
  )

  return (
    <>
      <OverlayTrigger
        placement='top'
        overlay={renderChainsTooltip}
      >
        <Dropdown
          drop='down'
          className="dropDownChains">
          <Dropdown.Toggle className="dropDownToggleChains">
            <div className="pull-left">
              <img
                className="thumbnail-image"
                src={selected ? selected.icon : ""}
                alt="Icon"
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              menuItems.map((item, index) => {
                return (
                  <div key={index}>
                    <Dropdown.Item onClick={() => switchNetwork(`0x${item.key.toString(16)}`)}>
                      <img style={{ width: '30px', height: '30px' }} className="thumbnail-image" src={item.icon} />
                      <span style={{ color: 'black' }}>{item.name}</span>
                    </Dropdown.Item>
                    {
                      index !== menuItems.length - 1 &&
                      <Dropdown.Divider />
                    }
                  </div>
                )
              })
            }
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>
    </>
  )
}

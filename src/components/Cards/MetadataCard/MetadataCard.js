import React from 'react'

import './MetadataCard.css'

// Display an asset's metadata
export default function MetadataCard(props) {

    const metadata = props.metadata?.attributes ? props.metadata.attributes : [];
    if (metadata.length === 0) return
  
    return (
        <div className="metadataContainer">
            <div className="boxContainer">
                {
                    props.floorPrice && props.floorPriceCurrency &&
                    <div className="metadataBox">
                        <h6>
                            Floor Price
                        </h6>
                        <div>
                            <span>
                                {`${props.floorPrice} ${props.floorPriceCurrency}`}
                            </span>
                        </div>
                    </div>
                }
                {
                    metadata.map((item, index) => {
                        return (
                            <div key={index} className="metadataBox">
                                <h6>
                                    {item.trait_type}
                                </h6>
                                <div>
                                    <span>
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
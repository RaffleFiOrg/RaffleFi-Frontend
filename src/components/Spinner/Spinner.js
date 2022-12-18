import React from 'react'

export default function Spinner(props) {

    if (props.show) {
        return (
            <div className="loading-wheel">
                <div className="spinner"></div>
            </div>
        )
    }
}
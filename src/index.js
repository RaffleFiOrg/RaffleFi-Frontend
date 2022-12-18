import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'

import './index.css';
import 'url:./fonts/Montserrat-Black.ttf'

function getLibrary(provider) {
    return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <App />
    </Web3ReactProvider>
);


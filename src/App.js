import React from 'react';
import NavBar from './components/NavBar/NavBar';
import Foooter from './components/Footer/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Raffle from './pages/Raffle';
import Raffles from './pages/Raffles';
import Sell from './pages/Sell';
import SellItem from './pages/SellItem'
import TicketBuy from './pages/TicketBuy';
import TicketSale from './pages/TicketSale';
import { BrowserRouter as Router, Routes,  Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Configs for react-query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false, 
          cacheTime: 60 * 1000,
          staleTime: 30 * 1000
        }
    }
})

/**
 * Main Components container  
*/
export default function App() {
    return (
        <div className="App">
            <Router>
                <QueryClientProvider client={queryClient}>
                    <NavBar />
                    <Routes>
                        <Route path='/' element={<Home />}/>  
                        <Route path='/raffles' element={<Raffles />}/>
                        <Route path='/raffle/:raffleId' element={<Raffle />} />
                        <Route path='/sell' element={<Sell />}/>
                        <Route path='/sell/:address' element={<SellItem />}/>
                        <Route path='/ticket-marketplace' element={<Marketplace />}/>
                        <Route path='/profile' element={<Profile />}/>
                        <Route path='/ticket/buy/:raffleId/:ticketId' element={<TicketBuy />} />
                        <Route path='/ticket/sell/:raffleId/:ticketId' element={<TicketSale />} /> 
                      </Routes>
                </QueryClientProvider>
            </Router>
          <Foooter />
        </div>
    )
}
import React, { useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Logo from '../../assets/RaffleFi_center.png';
import Account from '../Account/Account';
import { ToastContainer } from 'react-toastify';
import './NavBar.css';

export default function NavBar() {

    // Notify that metamask is not installed and is required
    useEffect(() => {
        if (window.ethereum === null) toast.warn("You need to install metamask") 
    }, [window.ethereum])

    return (
        <Container>
            <div className="header">
                <Navbar 
                bg="transparent" 
                expand="lg" 
                className="navbar-dark">
                    <ToastContainer
                    position='top-right'
                    autoClose={2000}
                    />
                    <Navbar.Brand className="brandImg">
                        <img className="navBarRaffleFiLogo" src={Logo} alt="Logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-lg`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                            <img className='navBarRaffleFiLogSideMenu' src={Logo} alt="Logo" />
                        </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <Nav className="justify-content-center flex-grow-1">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/raffles">Raffles</Nav.Link>
                            <Nav.Link href="/sell">Sell</Nav.Link>
                            <Nav.Link href="/ticket-marketplace">Resale</Nav.Link>
                            <Nav.Link href="/profile">Profile</Nav.Link>
                            <Nav.Link href='/lotteries'>Lotteries</Nav.Link>
                        </Nav>
                        <Account />
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Navbar>
            </div>
        </Container>
    )
}
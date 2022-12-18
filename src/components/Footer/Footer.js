import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import Logo from '../../assets/footerLogo.png';
import { FaDiscord, FaTwitter } from "react-icons/fa";

import './Footer.css'

export default function Foooter() {
  return (
    <>
        <div className="SocialIcons">
            <Container fluid>
            <Row>
                <Col>
                <img src={Logo} alt="Footer Logo" />
                <div className="socialShare">
                    <a href="#"><FaDiscord /></a>
                    <a href="#"><FaTwitter /></a>
                </div>
                </Col>
            </Row>
            </Container>
            </div>
            <div className='Foooter'>
                <Container>
                <Row className='justify-content-between'>
                <Col className='copyrights'>
                    <p>RaffleFi© 2022</p>
                </Col>
                <Col className='support'>
                    <a href='/whitepaper' target="_blank">Whitepaper</a>
                </Col>
                </Row>
            </Container>
        </div>
    </>
  )
}

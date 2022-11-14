import React from 'react'
import {  Navbar, Container, Image, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../../logo.png';

const Banner = () => {



    return (
        <>
            <Navbar fixed="top" bg="white shadow-light" style={{ zIndex: 10 }} expand="lg">
                <Container>
                    <LinkContainer to='/' >
                        <Navbar.Brand>
                            <Image src={logo} alt='Logo' className='nav-logo' />{' '}
                            <span className='fw-bold'>Business Intelligence</span>
                            
                        </Navbar.Brand>
                    </LinkContainer>
                    <Nav>
                        <span className='fw-bold'>Team 19</span>
                    </Nav>             
                </Container>
            </Navbar>
        </>
    )
}

export default Banner

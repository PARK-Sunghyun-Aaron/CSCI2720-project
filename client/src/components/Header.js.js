import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Header = ({ username, isAdmin }) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Location Finder</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/favorites">Favorites</Nav.Link>
                    {isAdmin && <Nav.Link href="/admin">Admin</Nav.Link>}
                    {username && <Nav.Text className="ml-2">Welcome, {username}</Nav.Text>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
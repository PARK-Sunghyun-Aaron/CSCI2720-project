import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importing the logo

const Header = ({ userName, onLogout, isAdmin }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        onLogout();
        setDropdownOpen(false);
    };

    return (
        <nav className={`navbar navbar-expand-lg bg-dark fixed-top visible`}>
            <Link to="/" className="navbar-brand text-white">
                <img src={logo} alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
                Muse Locator
            </Link>
            <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
                style={{ color: 'white' }}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/">Events</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/locator">Locator</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/favorites">Favorites</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="#" onClick={toggleDropdown}>
                            <u>Hi, {userName}</u>
                        </Link>
                        <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                            {isAdmin && (
                                <li>
                                    <Link className="dropdown-item" to="/admin-dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
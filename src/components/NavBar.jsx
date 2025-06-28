// src/components/NavBar.jsx
import React, { useState } from 'react';
import '../App.css';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-brand">Pawsome NGO</a>
                <div className="menu-icon" onClick={toggleMenu}>
                    <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <a href="#home" className="nav-links" onClick={() => setIsOpen(false)}>
                            HOME
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#about" className="nav-links" onClick={() => setIsOpen(false)}>
                            ABOUT
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#resources" className="nav-links" onClick={() => setIsOpen(false)}>
                            RESOURCES
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#contact" className="nav-links" onClick={() => setIsOpen(false)}>
                            CONTACT
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#admin" className="nav-links" onClick={() => setIsOpen(false)}> {/* New Admin Link */}
                            ADMIN
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
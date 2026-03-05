import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Kungen from "../images/CDKungen.png";

function Header({ user }) {
    return (
        <header className="header">
            <div className="cdk">
                <img src={Kungen} className="cd-logo" alt="cdlogo"/>
                <h1>CDKUNGEN.SE</h1>
            </div>
            <nav className="navbar">
                <Link to="/">Home</Link>
                {user && <Link to="/user">My Orders</Link>}
            </nav>
        </header>
    );
}

export default Header;
import React from 'react';
import './Header.css';
import Kungen from "../images/CDKungen.png";

function Header() {
    return (
        <header className="header">
            <div className = "cdk">
                <img src={Kungen} className="cd-logo" alt="cdlogo"/>
                <h1>CDKUNGEN.SE</h1>
            </div>
        </header>
    );
}

export default Header;
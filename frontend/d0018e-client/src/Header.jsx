import React from "react";
import CartBox from "./CartBox";
import "./Header.css";
import Kungen from "../images/CDKungen.png";
import { Link } from "react-router-dom";

function Header({ toggleCart, cartCount, cartOpen, countCart, updateCart, syncCart, closeCart, user }) {
  return (
    <header className="header">
      <div className="header-inner">

        <div className="cdk">
          <Link to="/">
          <img src={Kungen} className="cd-logo" alt="cdlogo"/>
          </Link>
          <h1>CDKUNGEN.SE</h1>          

          <nav className="navbar">
              <Link to="/user" className="nav-button">Orderhistorik</Link>
          </nav>
        </div>


        <div className="login-container">
          <button className="login-button">
            <Link to="/login">Logga in</Link>
          </button>
        </div>

        <div className="cart-container">
          <button className="cart-button" onClick={toggleCart}>
            Kundvagn
            {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
          </button>

            {cartOpen && user && (<CartBox uid={user.UID} updateCart={updateCart} syncCart={syncCart} countCart={countCart} closeCart={closeCart}/>
            )}
        </div>

      </div>
    </header>
  );
}

export default Header;
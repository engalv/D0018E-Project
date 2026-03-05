import React from "react";
import CartBox from "./CartBox";
import "./Header.css";
import Kungen from "../images/CDKungen.png";

function Header({ toggleCart, cartCount, cartOpen, countCart, updateCart, syncCart, closeCart, user }) {
  return (
    <header className="header">
      <div className="header-inner">

        <div className="cdk">
          <img src={Kungen} className="cd-logo" alt="cdlogo"/>
          <h1>CDKUNGEN.SE</h1>
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
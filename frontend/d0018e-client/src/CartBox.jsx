import React from "react";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";
import "./CartBox.css";

function CartBox({ uid, updateCart, syncCart, closeCart, countCart }) {

const navigate = useNavigate();
const checkout = () => {
  if (closeCart) closeCart();
  navigate("/checkout");
};

  return (
    <div className="cart-box">
      <Cart uid={uid} updateCart={updateCart} syncCart={syncCart} countCart={countCart} />

      <button className="checkout-button" onClick={checkout}>
        Till kassan
      </button>
    </div>
  );
}

export default CartBox;
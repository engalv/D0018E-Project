import React, { useEffect, useState } from "react";
import api from "./api"; 
import "./Checkout.css";

function Checkout({ uid, syncCart }) {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [uid]);

  async function fetchCart() {
    try {
      const res = await api.get(`/cart/${uid}`);
      const data = res.data;
      setCartProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("/cart/uid error", err);
      setCartProducts([]);
    }
  }

  // --- Update quantity of a product in the cart ---
  async function updateQuantity(pid, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    setCartProducts(prev =>
      prev.map(p => (p.PID === pid ? { ...p, Quantity: newQuantity } : p))
    );

    try {
      await api.post("/cart/update", { uid, pid, quantity: newQuantity });
    } catch (err) {
      console.error("updateQuantity error:", err);
    }
  }

  // --- Checkout / place order ---
  async function handleOrder() {
    try {
      await api.post("/cart/checkout", { uid });
      setCartProducts([]);
      syncCart(prev => !prev);
    } catch (err) {
      console.error("/cart/checkout error:", err);
    }
  }

  return (
    <div className="checkout-container">
      <h1>Kassa</h1>

      {cartProducts.length === 0 ? (
        <p>Kundvagnen är tom.</p>
      ) : (
        <>
          {cartProducts.map(p => (
            <div key={p.PID} className="checkout-product">
              <div className="checkoutName">{p.Name}</div>
              <div className="checkoutQty">{p.Quantity} st</div>
              <div className="checkoutPrice">{Number(p.Price).toFixed(2)} kr</div>
            </div>
          ))}

          <div className="checkoutTotalPrice">
            {cartProducts.reduce((acc, p) => acc + p.Price * p.Quantity, 0).toFixed(2)} kr
          </div>

          <button onClick={handleOrder} className="checkout-button">
            Beställ
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
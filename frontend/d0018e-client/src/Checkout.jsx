import React, { useEffect, useState } from "react";
import "./Checkout.css"

function Checkout({ uid, syncCart }) {
  const [cartProducts, syncCartProducts] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [uid]);

  async function fetchCart() {
    try {
        const res = await fetch(`http://localhost:5000/cart/${uid}`);
        const data = await res.json();
        syncCartProducts(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("/cart/uid error", err);
        syncCartProducts([]);
        }
    }

    async function updateQuantity(pid, newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        syncCartProducts(prev =>
            prev.map(p => (p.PID === pid ? { ...p, Quantity: newQuantity } : p))
        );
        try {
            await fetch("http://localhost:5000/cart/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, pid, quantity: newQuantity }),
            });
        } catch (err) {
            console.error("updateQuantity error:", err);
        }
}

  async function handleOrder() {
    try {
        await fetch("http://localhost:5000/cart/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid }),
        });
        syncCartProducts([]);
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
                <div className="checkoutName">
                    {p.Name}
                </div>
                
                <div className="checkoutQty">
                    {p.Quantity} st
                </div>

                <div className="checkoutPrice">
                    {Number(p.Price).toFixed(2)} kr
                </div>
                
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
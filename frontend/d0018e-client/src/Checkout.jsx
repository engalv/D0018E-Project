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
                <b>{p.Name}</b> - {p.Quantity} × £{p.Price} = £
                {(p.Quantity * p.Price).toFixed(2)}
            </div>
            ))}

            Total: £{cartProducts.reduce((acc, p) => acc + p.Price * p.Quantity, 0).toFixed(2)}
            <button onClick={handleOrder} className="checkout-button">
                Beställ
            </button>
        </>
        )}
    </div>
    );
}

export default Checkout;
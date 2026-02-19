import { useEffect, useState } from "react";

function Cart({ uid, updateCart, syncCart }) {
    const [cartProducts, syncCartProducts] = useState([]);

    useEffect(() => {
        fetchCart();
    }, [uid, updateCart]);

    function fetchCart() {
        fetch(`http://localhost:5000/cart/${uid}`)
        .then(res => res.json())
        .then(data => syncCartProducts(data))
        .catch(err => console.error("fetchcart error:", err));
    }

    function updateQuantity(pid, newQuantity) {
        const product = cartProducts.find(p => p.PID === pid);
        if (newQuantity > product.Stock) newQuantity = product.Stock;

        syncCartProducts(prev => prev.map(p => (p.PID === pid ? { ...p, Quantity: newQuantity } : p)));

        fetch("http://localhost:5000/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid, quantity: newQuantity })
        })
        .then(() => fetchCart())
        .catch(err => console.error("updateQuantity error:", err));
    }

    function removeProduct(pid) {
        fetch("http://localhost:5000/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid })
        })
        .then(() => fetchCart())
        .catch(err => console.error("removeProduct error:", err));
    }

    // Checkout
    function checkout() {
        fetch("http://localhost:5000/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
        })
        .then(() => {
            syncCartProducts([]);
            syncCart(prev => !prev);
        })
        .catch(err => console.error("checkout error:", err));
    }

    return (
        <div style={{ border: "1px solid #aaa", padding: "10px", marginTop: "20px" }}>
        <h2>Kundvagn</h2>

        {cartProducts.length === 0 ? (
            <p>-</p>
        ) : (
            <>
            {cartProducts.map((product, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                <b>{product.Name}</b>
                <p>Pris: £{product.Price}</p>

                <input
                    type="number"
                    min={1}
                    value={product.Quantity}
                    onChange={e => {
                    let val = Number(e.target.value);
                    updateQuantity(product.PID, val);
                    }}
                />

                <p>Summa: £{(product.Price * product.Quantity)}</p>
                <button onClick={() => removeProduct(product.PID)}>-</button>
                <hr />
                </div>
            ))}

            <h3>Pris: £{cartProducts.reduce((acc, p) => acc + p.Price * p.Quantity, 0)}</h3>
            <button onClick={checkout}>Beställ</button>
            <button
                onClick={() => {
                fetch(`http://localhost:5000/cart/checkout/${uid}`, { method: "DELETE" })
                    .then(() => fetchCart())
                    .catch(err => console.error(err));
                }}
            >
                Rensa kundvagn
            </button>
            </>
        )}
        </div>
    );
}

export default Cart;

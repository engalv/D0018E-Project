import { useEffect, useState } from "react";

function Cart({ uid, updateCart, syncCart }) {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [uid, updateCart]);

  async function fetchCart() {
    try {
      const res = await fetch(`http://localhost:5000/cart/${uid}`);
      const data = await res.json();
      setCartProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchCart error:", err);
      setCartProducts([]);
    }
  }

  async function updateQuantity(pid, newQuantity) {
    const product = cartProducts.find(p => p.PID === pid);
    if (!product) return;
    if (newQuantity > product.Stock) newQuantity = product.Stock;
    if (newQuantity < 1) newQuantity = 1;

    setCartProducts(prev =>
      prev.map(p => (p.PID === pid ? { ...p, Quantity: newQuantity } : p))
    );

    try {
      await fetch("http://localhost:5000/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid, quantity: newQuantity }),
      });
      fetchCart();
    } catch (err) {
      console.error("updateQuantity error:", err);
    }
  }

  async function removeProduct(pid) {
    try {
      await fetch("http://localhost:5000/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid }),
      });
      fetchCart();
    } catch (err) {
      console.error("removeProduct error:", err);
    }
  }

  async function checkout() {
    try {
      await fetch("http://localhost:5000/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      setCartProducts([]);
      syncCart(prev => !prev);
    } catch (err) {
      console.error("checkout error:", err);
    }
  }

  async function clearCart() {
    try {
      await fetch(`http://localhost:5000/cart/clear/${uid}`, { method: "DELETE" });
      setCartProducts([]);
      syncCart(prev => !prev);
    } catch (err) {
      console.error("clearCart error:", err);
    }
  }

  return (
    <div style={{ border: "1px solid #aaa", padding: "10px", marginTop: "20px" }}>
      <h2>Kundvagn</h2>

      {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
        <>
          {cartProducts.map((product, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <b>{product.Name}</b>
              <p>Pris: £{product.Price}</p>
              <input
                type="number"
                min={1}
                value={product.Quantity}
                onChange={e => updateQuantity(product.PID, Number(e.target.value))}
              />
              <p>Summa: £{(product.Price * product.Quantity).toFixed(2)}</p>
              <button onClick={() => removeProduct(product.PID)}>-</button>
              <hr />
            </div>
          ))}

          <h3>
            Pris totalt: £
            {cartProducts.reduce((acc, p) => acc + p.Price * p.Quantity, 0).toFixed(2)}
          </h3>

          <button onClick={checkout}>Beställ</button>
          <button onClick={clearCart} style={{ marginLeft: "10px", backgroundColor: "#f88" }}>
            Rensa kundvagn
          </button>
        </>
      ) : (
        <p>-</p>
      )}
    </div>
  );
}

export default Cart;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./Cart.css";

function Cart({ uid, updateCart, syncCart, countCart }) {
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCart();
  }, [uid, updateCart]);

  const checkout = () => {
    navigate("/checkout");
  };

  async function fetchCart() {
    try {
      const res = await api.get(`/cart/${uid}`);
      const data = res.data;
      setCartProducts(Array.isArray(data) ? data : []);
      countCart && countCart(data.reduce((acc, p) => acc + p.Quantity, 0));
    } catch (err) {
      console.error("fetchCart error:", err);
      setCartProducts([]);
      countCart && countCart(0);
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
      await api.post("/cart/update", { uid, pid, quantity: newQuantity });
      fetchCart();
    } catch (err) {
      console.error("updateQuantity error:", err);
    }
  }

  async function removeProduct(pid) {
    setCartProducts(prev => prev.filter(p => p.PID !== pid));
    try {
      await api.post("/cart/remove", { uid, pid });
      syncCart(prev => !prev);
    } catch (err) {
      console.error("removeProduct error:", err);
    }
  }

  async function clearCart() {
    try {
      const res = await api.delete(`/cart/clear/${uid}`);
      const data = res.data;

      if (!res.status || res.status >= 400) {
        console.error("Failed to clear cart:", data.error);
        return;
      }

      console.log(data.message);
      setCartProducts([]);
      syncCart(prev => !prev);
    } catch (err) {
      console.error("clearCart error:", err);
    }
  }

  return (
    <div className="cart-box"> 
      <h2>Kundvagn</h2>
      {cartProducts.length > 0 ? (
        <>
          {cartProducts.map((product) => (
            <div className="cart-products" key={product.PID}>
              <button onClick={() => removeProduct(product.PID)}>x</button>
              <div className="cartName">{product.Name}</div>
              <div className="cartQty">
                <input
                  type="number"
                  className="cartQtyInput"
                  value={product.Quantity}
                  onChange={e => updateQuantity(product.PID, Number(e.target.value))}
                />
              </div>
              <div className="cartPrice">{Number(product.Price).toFixed(2)} kr</div>
            </div>
          ))}

          <div className="cart-total">
            {cartProducts.reduce((acc, p) => acc + p.Price * p.Quantity, 0).toFixed(2)} kr
          </div>

          <div className="cart-actions">
            <button className="clear-button" onClick={clearCart}>
              Rensa kundvagn
            </button>
            <button className="checkout-button" onClick={checkout}>
              Till kassan
            </button>
          </div>
        </>
      ) : <p>-</p>}
    </div>
  );
}

export default Cart;
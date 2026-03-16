import { useEffect, useState } from "react";
import api from "./api";

function Orders({ uid }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [uid]);

  async function fetchOrders() {
    try {
      const res = await api.get(`/orders/user/${uid}`);
      const data = res.data;

      if (!data || data.length === 0) {
        setOrders([]);
        setError("Du har inga beställningar.");
        return;
      }

      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
      setError("Server error, försök igen senare.");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {error && <p>{error}</p>}

      {orders.length > 0 && orders.map(order => (
        <div
          key={order.OID}
          style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
        >
          <b>Order #{order.OID} — {order.Status}</b><br />
          Datum: {new Date(order.Creation_Time).toLocaleDateString()}<br />
          Kostnad: {Number(order.Price || 0).toFixed(2)} kr

          {order.items && order.items.length > 0 && (
            <ul>
              {order.items.map((item, index) => (  
                <li key={`${order.OID}-${item.PID}-${index}`}>
                  {item.Amount} x {item.Product_Name} ({Number(item.Price).toFixed(2)} kr)
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {!error && orders.length === 0 && <p>Du har inga beställningar</p>}
    </div>
  );
}

export default Orders;
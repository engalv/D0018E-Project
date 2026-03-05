import { useEffect, useState } from "react";

function UserPage({ uid }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [uid]);

  async function fetchOrders() {
    try {
      const res = await fetch(`http://localhost:5000/orders/${uid}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
          >
            <b>Order #{order.id} — {order.status}</b><br/>
            Placed on: {new Date(order.created_at).toLocaleDateString()}<br/>
            Total: £{order.total_price.toFixed(2)}
            <ul>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.product_name} x {item.quantity} (£{item.price} each)
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default UserPage;
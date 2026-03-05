import { useEffect, useState } from "react";

function UserPage({ uid }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [uid]);

  async function fetchOrders() {
    try {
      const res = await fetch(`http://localhost:5000/orders/user/${uid}`);

      if (res.status === 404) {
        setOrders([]);
        setError("You have no orders.");
        return;
      }

      if (!res.ok) {
        console.error("Server error:", res.status);
        setOrders([]);
        setError("Server error. Please try again later.");
        return;
      }

      const data = await res.json();
      setOrders(data);
      setError(null);

    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    }

    console.log("This is the status", orders.Status)
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
          Placed on: {new Date(order.Creation_Time).toLocaleDateString()}<br />
          Total: £{Number(order.Price || 0).toFixed(2)}

          {order.items && order.items.length > 0 && (
            <ul>
              {order.items.map(item => (  
                <li key={item.id}>
                  {item.Product_Name} x {item.Amount} (£{item.Price} each)
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {!error && orders.length === 0 && <p>You have no orders.</p>}
    </div>
  );
}

export default UserPage;
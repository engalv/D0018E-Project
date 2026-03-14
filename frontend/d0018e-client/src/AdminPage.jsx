import React, { useEffect, useState } from "react";
import api from "./api";

function AdminPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user?.Is_Admin) return;

    api.get("/admin/orders").then(res => setOrders(res.data));
    api.get("/admin/products").then(res => setProducts(res.data));
  }, [user]);

  if (!user?.Is_Admin) return <p>Access denied</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Orders</h3>
      <ul>
        {orders.map(o => (
          <li key={o.OrderID}>Order #{o.OrderID} - User: {o.UserID}</li>
        ))}
      </ul>

      <h3>Products</h3>
      <ul>
        {products.map(p => (
          <li key={p.ProductID}>{p.Name} - ${p.Price}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
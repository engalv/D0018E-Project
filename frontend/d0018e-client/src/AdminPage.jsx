import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";


// This is the admin page, only admins can access 
function AdminPage({ user }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
  Name: "",
  Price: "",
  Stock: "",
  Description: "",
  Cover_Image: "",
  CID: ""
  });
  const orderStatuses = ["pending", "completed", "cancelled"];

  // Fetch products and users
  useEffect(() => {
    if (!user?.Is_Admin) return;

    api.get("/admin/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    api.get("/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, [user]);

  // Fetch orders for clicked on user
  const handleUserClick = async (uid) => {
    setSelectedUser(uid);
    setSelectedUserOrders([]); // reset while loading
    try {
      const res = await api.get(`/admin/user/${uid}/orders`);
      setSelectedUserOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setSelectedUserOrders([]);
    }
  };

  // Update order status
  const handleStatusChange = async (oid, newStatus) => {
    try {
      await api.put(`/admin/order/${oid}/status`, { status: newStatus });
      setSelectedUserOrders(prev =>
        prev.map(o => (o.OID === oid ? { ...o, Status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Failed to update order status");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.Name || !newProduct.Price || !newProduct.Cover_Image || !newProduct.Stock || !newProduct.Description || !newProduct.CID) return alert("");

    try {
      const res = await api.post("/admin/product", {
        Name: newProduct.Name,
        Price: parseFloat(newProduct.Price),
        Stock: parseInt(newProduct.Stock || "0", 10),
        Description: newProduct.Description || null,
        Cover_Image: newProduct.Cover_Image || null,
        CID: newProduct.CID || null
      });

      setProducts(prev => [...prev, res.data]);
      setNewProduct({ Name: "", Price: "", Stock: "", Description: "", Cover_Image: "", CID: "" });
    } catch (err) {
      console.error("Failed to add product", err);
      alert("Failed to add product");
    }
  };

  if (!user?.Is_Admin) return <p>Åtkomst nekad.</p>;

  return (
    <div className="admin-container">
      {/*Users */}
      <div className="user-column">
        <h3>Users</h3>
        <ul className="user-list">
          {users?.map(u => (
            <li
              key={u.UID}
              className={`user-item clickable ${selectedUser === u.UID ? "selected" : ""}`}
              onClick={() => handleUserClick(u.UID)}
            >
              {u.Name} ({u.Email})
            </li>
          ))}
        </ul>
      </div>

      {/*Orders*/}
      <div className="order-column">
        <h3>Beställningar</h3>
        {selectedUser ? (
          selectedUserOrders.length > 0 ? (
            <ul className="order-list">
              {selectedUserOrders.map(order => {
                const total = order.items.reduce((acc, p) => acc + p.Price * p.Amount, 0);
                return (
                  <li key={order.OID} className="order-item">
                    <div className="order-header">
                      <strong>Beställning #{order.OID}</strong> &nbsp;|&nbsp;
                      <span>Skapades: {order.Creation_Time ? new Date(order.Creation_Time).toLocaleString() : "Unknown"}</span> &nbsp;|&nbsp;
                      <span>Status: </span>
                      <select
                        value={order.Status}
                        onChange={(e) => handleStatusChange(order.OID, e.target.value)}
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <ul className="order-products">
                      {order.items.map(p => (
                        <li key={p.PID}>
                          {p.Product_Name} x{p.Amount} (${p.Price})
                        </li>
                      ))}
                    </ul>
                    <div className="order-total">
                      <strong>Total: ${total.toFixed(2)}</strong>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Inga beställningar hittade.</p>
          )
        ) : (
          <p>Välj en användare för att se deras beställningar</p>
        )}
      </div>

      {/* Products */}
      <div className="product-column">
        <h3>Add Product</h3>
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Name"
              value={newProduct.Name}
              onChange={e => setNewProduct({ ...newProduct, Name: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newProduct.Price}
              onChange={e => setNewProduct({ ...newProduct, Price: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.Stock}
              onChange={e => setNewProduct({ ...newProduct, Stock: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.Description || ""}
              onChange={e => setNewProduct({ ...newProduct, Description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={newProduct.Cover_Image || ""}
              onChange={e => setNewProduct({ ...newProduct, Cover_Image: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category ID"
              value={newProduct.CID || ""}
              onChange={e => setNewProduct({ ...newProduct, CID: e.target.value })}
            />
            <button type="submit">Add Product</button>
          </form>

        <h3>Products</h3>
        <ul className="product-list">
          {products?.map(p => (
            <li
              key={p.PID}
              className="product-item clickable"
              onClick={() => navigate(`/product/${p.PID}`)}
            >
              {p.Name} - ${p.Price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
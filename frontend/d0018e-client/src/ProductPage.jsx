import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProductPage({ uid, syncCart, user }) {
  const { pid } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [stock, setStock] = useState(0);
  const [editInfo, setEditInfo] = useState({ Name: "", Price: "", Description: "", CID: "" });

  const isAdmin = user?.Is_Admin;
  const token = localStorage.getItem("token"); // Grab JWT from localStorage

  // Fetch product info
  useEffect(() => {
    fetch(`http://localhost:5000/product/${pid}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setStock(data.Stock);
        setEditInfo({
          Name: data.Name,
          Price: data.Price,
          Description: data.Description,
          CID: data.CID
        });
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [pid]);

  // Fetch reviews
  useEffect(() => {
    fetch(`http://localhost:5000/product/${pid}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, [pid]);

  // Buy product
  const buyProduct = async () => {
    try {
      await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid: product.PID, quantity })
      });
      syncCart(prev => !prev);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // Submit review
  const submitReview = async () => {
    try {
      await fetch("http://localhost:5000/product/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid: product.PID, rating, comment })
      });
      const updatedReviews = await fetch(`http://localhost:5000/product/${pid}/reviews`).then(r => r.json());
      setReviews(updatedReviews);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  // Admin: update stock
  const handleStockUpdate = async () => {
    if (!token) return alert("Admin token missing. Please login again.");

    try {
      await fetch(`http://localhost:5000/product/admin/product/${product.PID}/stock`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ Stock: parseInt(stock, 10) })
      });
      alert("Stock updated!");
      setProduct(prev => ({ ...prev, Stock: parseInt(stock, 10) }));
    } catch (err) {
      console.error("Failed to update stock", err);
      alert("Failed to update stock");
    }
  };

  // Admin: update general product info
  const handleInfoUpdate = async () => {
    if (!token) return alert("Admin token missing. Please login again.");

    try {
      await fetch(`http://localhost:5000/product/admin/product/${product.PID}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editInfo)
      });
      alert("Product info updated!");
      setProduct(prev => ({ ...prev, ...editInfo }));
    } catch (err) {
      console.error("Failed to update product info", err);
      alert("Failed to update product info");
    }
  };

  // Admin: delete review
  const handleDeleteReview = async (rid) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    if (!token) return alert("Admin token missing. Please login again.");

    try {
      await fetch(`http://localhost:5000/product/admin/review/${rid}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setReviews(prev => prev.filter(r => r.RID !== rid));
    } catch (err) {
      console.error("Failed to delete review", err);
      alert("Failed to delete review");
    }
  };

  const averageRating = reviews.length > 0 ? 
    (reviews.reduce((sum, r) => sum + r.Rating, 0) / reviews.length).toFixed(2) : null;

  if (!product) return <p>Laddar in produkt...</p>;

  return (
    <div className="productspage" style={{ padding: "20px" }}>
      <h1>{product.Name}</h1>
      <img 
        src={`/images/${product.Cover_Image}`} 
        alt={product.Name} 
        style={{ width: "300px", height: "300px", objectFit: "cover" }} 
      />

      {isAdmin ? (
        <div style={{ marginBottom: "10px" }}>
          <label>
            Name: <input value={editInfo.Name} onChange={e => setEditInfo({...editInfo, Name: e.target.value})}/>
          </label>
          <label>
            Price: <input type="number" value={editInfo.Price} onChange={e => setEditInfo({...editInfo, Price: e.target.value})}/>
          </label>
          <label>
            Description: <textarea value={editInfo.Description} onChange={e => setEditInfo({...editInfo, Description: e.target.value})}/>
          </label>
          <label>
            Category ID: <input type="number" value={editInfo.CID} onChange={e => setEditInfo({...editInfo, CID: e.target.value})}/>
          </label>
          <button onClick={handleInfoUpdate}>Update Info</button>
        </div>
      ) : (
        <p>{product.Description}</p>
      )}

      <p>£{product.Price}</p>

      <p>
        I lager: {isAdmin ? (
          <>
            <input 
              type="number" 
              value={stock} 
              onChange={e => setStock(e.target.value)} 
              style={{ width: "60px", marginRight: "8px" }}
            />
            <button onClick={handleStockUpdate}>Update</button>
          </>
        ) : product.Stock}
      </p>

      <p>
        Genomsnittlig bedömning: {averageRating ? `${averageRating} / 5 (${reviews.length} reviews)` : "No ratings yet"}
      </p>

      <div>
        <label>
          Antal: 
          <input 
            type="number" 
            min="1" 
            max={product.Stock} 
            value={quantity} 
            onChange={e => setQuantity(Number(e.target.value))} 
          />
        </label>
        <button onClick={buyProduct} disabled={product.Stock <= 0}>
          {product.Stock > 0 ? "Lägg i kundvagn" : "Slut i lagret"}
        </button>
      </div>

      <hr />
      <h3>Lägg ett omdöme</h3>
      <label>
        Rating:
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <br />
      <label>
        Comment:
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
      </label>
      <br />
      <button onClick={submitReview}>Lägg ett omdöme</button>

      <h2>Omdömen</h2>
      {reviews.length ? reviews.map(r => (
        <div key={r.RID} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
          <b>{r.UserName}</b> gav betyget {r.Rating}/5
          <p>{r.Comment}</p>
          <small>{r.Creation_Time ? new Date(r.Creation_Time).toLocaleString() : "No date"}</small>
          {isAdmin && (
            <button onClick={() => handleDeleteReview(r.RID)} style={{ marginLeft: "10px" }}>
              Delete review
            </button>
          )}
        </div>
      )) : <p>Inga omdömen än.</p>}
    </div>
  );
}

export default ProductPage;
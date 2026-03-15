import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api";

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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/product/${pid}`);
        const data = res.data;
        setProduct(data);
        setStock(data.Stock);
        setEditInfo({
          Name: data.Name,
          Price: data.Price,
          Description: data.Description,
          CID: data.CID
        });
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
    fetchProduct();
  }, [pid]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await api.get(`/product/${pid}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    }
    fetchReviews();
  }, [pid]);

  const buyProduct = async () => {
    try {
      await api.post("/cart/add", { uid, pid: product.PID, quantity });
      syncCart(prev => !prev);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const submitReview = async () => {
    try {
      await api.post("/product/review", { uid, pid: product.PID, rating, comment });
      const res = await api.get(`/product/${pid}/reviews`);
      setReviews(res.data);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  const handleStockUpdate = async () => {
    try {
      await api.put(`/product/admin/product/${product.PID}/stock`, { Stock: parseInt(stock, 10) });
      alert("Stock updated!");
      setProduct(prev => ({ ...prev, Stock: parseInt(stock, 10) }));
    } catch (err) {
      console.error("Failed to update stock", err);
      alert("Failed to update stock");
    }
  };

  const handleInfoUpdate = async () => {
    try {
      await api.put(`/product/admin/product/${product.PID}`, editInfo);
      alert("Product info updated!");
      setProduct(prev => ({ ...prev, ...editInfo }));
    } catch (err) {
      console.error("Failed to update product info", err);
      alert("Failed to update product info");
    }
  };

  const handleDeleteReview = async (rid) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/product/admin/review/${rid}`);
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
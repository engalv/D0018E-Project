import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProductPage({ uid, syncCart }) {
  const { pid } = useParams(); 
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/product/${pid}`)
      .then(res => res.json())
      
      .then(data => {
        setProduct(data) 
        console.log("Fetched product:", data)
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [pid]);

  useEffect(() => {
    fetch(`http://localhost:5000/product/${pid}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data),)
      .catch(err => console.error("Error fetching reviews:", err));
  }, [pid]);

  const buyProduct = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          pid: product.PID,
          quantity
        })
      });
      const data = await res.json();
      console.log(data.message);
      syncCart(prev => !prev); 
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const submitReview = async () => {
    try {
      const res = await fetch("http://localhost:5000/product/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid: product.PID, rating, comment })
      });
      await res.json();

      const updatedReviews = await fetch(`http://localhost:5000/product/${pid}/reviews`).then(r => r.json());
      setReviews(updatedReviews);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.Rating, 0) / reviews.length).toFixed(2): null;

  if (!product) return <p>Laddar in produkt...</p>;

  return (
    <div className="productspage" style={{ padding: "20px" }}>
      <h1>{product.Name}</h1>
      <img 
        src={`/images/${product.Cover_Image}`} 
        alt={product.Name} 
        style={{ width: "300px", height: "300px", objectFit: "cover" }} 
      />
      <p>{product.Description}</p>
      <p>£{product.Price}</p>
      <p>I lager: {product.Stock}</p>
      <p>
        Genomsnittlig bedömning:{" "}
        {averageRating ? `${averageRating} / 5 (${reviews.length} reviews)` : "No ratings yet"}
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
      {reviews.length ? (
        reviews.map(r => (
          <div key={r.RID} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
            <b>{r.UserName}</b> gav betyget {r.Rating}/5
            <p>{r.Comment}</p>
            <small>
              {r.Creation_Time ? new Date(r.Creation_Time).toLocaleString() : "No date"}
            </small>
          </div>
        ))
      ) : (
        <p>Inga omdömen än.</p>
      )}

      <hr />
    </div>
  );
}

export default ProductPage;
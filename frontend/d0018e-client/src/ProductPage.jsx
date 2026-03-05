import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProductPage({ uid, syncCart }) {
  const { pid } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch product data
  useEffect(() => {
    fetch(`http://localhost:5000/product/${pid}`)
      .then(res => res.json())
      
      .then(data => {
        setProduct(data) // get the first element since your backend returns array
        console.log("Fetched product:", data)
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [pid]);

  // Fetch product reviews
  useEffect(() => {
    fetch(`http://localhost:5000/product/${pid}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data),)
      .catch(err => console.error("Error fetching reviews:", err));
  }, [pid]);

  // Add to cart
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
      syncCart(prev => !prev); // refresh cart
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // Submit review
  const submitReview = async () => {
    try {
      const res = await fetch("http://localhost:5000/product/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pid: product.PID, rating, comment })
      });
      await res.json();
      // Refresh reviews after submission
      const updatedReviews = await fetch(`http://localhost:5000/product/${pid}/reviews`).then(r => r.json());
      setReviews(updatedReviews);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.Name}</h1>
      <p>{product.Description}</p>
      <p>£{product.Price}</p>
      <p>I lager: {product.Stock}</p>

      <div>
        <label>
          Quantity: 
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

      <h2>Reviews</h2>
      {reviews.length ? (
        reviews.map(r => (
          <div key={r.RID} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
            <b>{r.UserName}</b> rated {r.Rating}/5
            <p>{r.Comment}</p>
            <small>
              {r.Creation_Time ? new Date(r.Creation_Time).toLocaleString() : "No date"}
            </small>
          </div>
        ))
      ) : (
        <p>Ingen recension än.</p>
      )}

      <hr />

      <h3>Leave a review</h3>
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
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
}

export default ProductPage;
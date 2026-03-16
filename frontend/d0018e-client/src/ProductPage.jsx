import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api";
import "./ProductPage.css";
import { Trash } from "lucide-react";

function ProductPage({ uid, syncCart, user }) {
  const { pid } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [stock, setStock] = useState(0);
  const [editInfo, setEditInfo] = useState({ Name: "", Price: "", Description: "", CID: "" });
  const [editing, setEditing] = useState(false);
  const [editInfoMessage, setEditInfoMessage] = useState("");
  const [stockMessage, setStockMessage] = useState("");

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
        console.error("Error fetching: (products)", err);
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
        console.error("Error fetching: (review):", err);
      }
    }
    fetchReviews();
  }, [pid]);

  const buyProduct = async () => {
    try {
      await api.post("/cart/add", { uid, pid: product.PID, quantity });
      syncCart(prev => !prev);
    } catch (err) {
      console.error("Error (cart):", err);
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
      console.error("Error (add review):", err);
    }
  };

  const handleStockUpdate = async () => {
    try {
      await api.put(`/product/admin/product/${product.PID}/stock`, { Stock: parseInt(stock, 10) });
      setProduct(prev => ({ ...prev, Stock: parseInt(stock, 10) }));
      setStockMessage("Lagersaldot uppdaterades")
    } catch (err) {
      console.error("Misslyckades att uppdatera lagersaldot", err);
      setStockMessage("Misslyckades att uppdatera lagersaldot")
    }
  };

  const handleInfoUpdate = async () => {
    try {
      await api.put(`/product/admin/product/${product.PID}`, editInfo);
      setProduct(prev => ({ ...prev, ...editInfo }));
      setEditing(false);
      setEditInfoMessage("Produkten uppdaterades")
    } catch (err) {
      console.error("Misslyckades att uppdatera produkten", err);
      setEditInfoMessage("Misslyckades att uppdatera produkten")
    }
  };

  const handleDeleteReview = async (rid) => {
    try {
      await api.delete(`/product/admin/review/${rid}`);
      setReviews(prev => prev.filter(r => r.RID !== rid));
    } catch (err) {
      console.error("Error (delete review)", err);
    }
  };

  const averageRating = reviews.length > 0 ? 
    (reviews.reduce((sum, r) => sum + r.Rating, 0) / reviews.length).toFixed(2) : null;

  if (!product) return <p>Laddar in produkten...</p>;

  return (
    <div className="productspage">
      <h1>{product.Name}</h1>

      <div className="productCard">
      <img 
        src={`/images/${product.Cover_Image}`} 
        alt={product.Name} 
        className="imgProduct"
      />

      <div className="qtyCart">
        <label>
          Antal: 
          <input type="number" min="1" max={product.Stock} value={quantity} onChange={e => setQuantity(Number(e.target.value))}/>
        </label>
        <button className="cartBtn" onClick={buyProduct} disabled={product.Stock <= 0}>
          {product.Stock > 0 ? "Lägg i kundvagn" : "Slut i lagret"}
        </button>
      </div>

      <div className="productInfo">
        <p>{product.Description}</p>
        <p>{product.Price} kr</p>
        <p>Lager: {product.Stock} st</p>
      </div>
      <p>
        Genomsnittlig bedömning: {averageRating ? `${averageRating} / 5 (${reviews.length} recensioner)` : "Finns ännu ingen recension om produkten"}
      </p>
      </div>

            {isAdmin && !editing && (
        <button onClick={() => setEditing(true)}>Ändra produktinformation</button>
      )}

      {editInfoMessage && (  <p className="editProfileMessage">{editInfoMessage}</p>)}
      {stockMessage && (  <p className="editStockMessage">{stockMessage}</p>)}
      {editing && isAdmin && (
        <>
        <div className="editProduct">
          <label>
            <div className="editProductInfo">Namn: </div>
            <input value={editInfo.Name} className="nameBtn" onChange={e => setEditInfo({...editInfo, Name: e.target.value})}/>
          </label>
          <label>
             <div className="editProductInfo">Lager: </div>
            <input type="number" className="stockBtn" value={stock} onChange={e => setStock(e.target.value)}/>
            <button onClick={handleStockUpdate}>✓</button>
          </label>
          <label>
            <div className="editProductInfo">Pris: </div>
            <input type="number" className="priceBtn" value={(editInfo.Price)} onChange={e => setEditInfo({...editInfo, Price: e.target.value})}/>
          </label>
          <label>
            <div className="editProductInfo">Beskrivning: </div>
            <textarea value={editInfo.Description} onChange={e => setEditInfo({...editInfo, Description: e.target.value})}/>
          </label>
          <label>
            <div className="editProductInfo">Kategori-ID: </div>
            <input type="number" className="categoryBtn" value={editInfo.CID} onChange={e => setEditInfo({...editInfo, CID: e.target.value})}/>
          </label>
          <div className="infoBtn">
          <button onClick={handleInfoUpdate}>✓</button>
          <button onClick={() => setEditing(false)}>x</button>
          </div>
        </div>
      </>
    )}

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
        Recension:
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
            <button className="trashBtn" onClick={() => handleDeleteReview(r.RID)}>
              <Trash size={16}/>
            </button>
          )}
        </div>
      )) : <p>Inga omdömen än.</p>}
    </div>
  );
}

export default ProductPage;
import React, { useState, useEffect } from "react";
import "./Products.css";

function Products({ uid, syncCart, updateCart, countCart }) {
  const [products, syncProducts] = useState([]);
  const [qty, syncQty] = useState({});
  
  useEffect(() => {
    fetch("http://localhost:5000/product")
      .then(res => res.json())
      .then(data => {
        syncProducts(data);
        syncQty(data.reduce((acc, p) => ({ ...acc, [p.PID]: 1 }), {}));
      })
      .catch(err => console.error("fetch error:", err));
  }, [updateCart]);

const buyProduct = (product) => {
  const quantity = qty[product.PID] || 1;

  fetch("http://localhost:5000/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: uid,
      pid: product.PID,
      quantity: quantity
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data.message);
      syncCart(prev => !prev);
      countCart(prev => prev + quantity);
    });
};

  
return (
  <div className="products-container">
    <div className="textfont">
        Produkter
    </div>

    <div className="products-list">
      {products.map(p => (
        <div key={p.PID} className="product-row">

          <img src={p.Cover_Image} alt={p.Name}
            className="product-image"
          />

          <div className="product-name">
            {p.Name}
          </div>

          <div className="product-stock">
            {p.Stock > 0 ? `${p.Stock}` : "Slut i lager"}
          </div>

          <div className="product-price">
            £{p.Price}
          </div>

          <button
            className="buy-btn"
            onClick={() => buyProduct(p)}
            disabled={p.Stock <= 0}
          >
            {p.Stock > 0 ? "Lägg i kundvagn" : "Slut i lagret"}
          </button>
        </div>
      ))}
    </div>
  </div>
);
}
export default Products;

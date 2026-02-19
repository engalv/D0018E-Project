import React, { useState, useEffect } from "react";

function Products({ uid, syncCart, updateCart }) {
  const [products, syncProducts] = useState([]);
  const [qty, syncQty] = useState({});
  
  useEffect(() => {
    fetch("http://localhost:5000/products")
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
      });
  };

  return (
    <div>
      <h1>Produkter</h1>
      {products.map(p => (
        <div key={p.PID}>
          <b>{p.Name}</b>
          <p>{p.Description}</p>
          <p>£{p.Price}</p>
          <p>I lager: {p.Stock}</p>

          <button
            onClick={() => buyProduct(p)}
            disabled={p.Stock <= 0}
          >
            {p.Stock > 0 ? "Lägg i kundvagn" : "Slut i lagret"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Products;

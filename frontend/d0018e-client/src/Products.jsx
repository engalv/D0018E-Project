import React, { useState, useEffect } from "react";
import "./Products.css";
import { useParams, Link } from "react-router-dom";
import api from "./api";
import Banner from "./Banner";
import { ShoppingCart, X } from "lucide-react";


function Products({ uid, syncCart, updateCart, countCart }) {
  const [products, syncProducts] = useState([]);
  const [qty, syncQty] = useState({});
  const { cid } = useParams();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = cid ? `/product/category/${cid}` : "/product";
        const res = await api.get(url);
        const data = res.data;
        syncProducts(data);
        syncQty(data.reduce((acc, p) => ({ ...acc, [p.PID]: 1 }), {}));
      } catch (err) {
        console.error("fetch error:", err);
      }
    }

    fetchProducts();
  }, [updateCart, cid]);

  const buyProduct = async (product) => {
    const quantity = qty[product.PID] || 1;

    try {
      const res = await api.post("/cart/add", {
        uid: uid,
        pid: product.PID,
        quantity: quantity
      });
      console.log(res.data.message);
      syncCart(prev => !prev);
      countCart && countCart(prev => prev + quantity);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  return (
    <div className="products-container">
      <Banner imageUrl="/images/reklam.gif" productId={4} />
      <div className="textfont"> Produkter </div>

      <div className="products-list">
        {products.map(p => (
          <div key={p.PID} className="product-row">
            <img src={`/images/${p.Cover_Image}`} alt={p.Name} className="product-image" />
            <Link to={`/product/${p.PID}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="product-name">{p.Name}</div>
            </Link>

            <div className="product-stock">
              {p.Stock > 0 ? `${p.Stock}` : "Slut i lager"} st
            </div>

            <div className="product-price">{Number(p.Price).toFixed(2)} kr</div>

            <button
              className={`buy-btn ${p.Stock > 0 ? "inStock" : "outStock"}`}
              onClick={() => buyProduct(p)}
              disabled={p.Stock <= 0}
            >
              {p.Stock > 0 ? <ShoppingCart size={24} /> : <X size={24} />}
            </button>
          </div>
        ))}
         <Banner imageUrl="/images/reklam2.png" productId={2} />
      </div>
    </div>
  );
  
}

export default Products;
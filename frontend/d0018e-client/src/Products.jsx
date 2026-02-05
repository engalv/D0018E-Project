import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p.P_ID}>
          <p>{p.Name}</p>
          <p>{p.Description}</p>
          <b>£{p.Price}</b>
        </div>
      ))}
    </div>
  );
}

export default Products;
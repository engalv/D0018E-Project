import React from "react";
import "./CategoryBox.css"
import { Link } from "react-router-dom";

function CategoryBox() {
  return (
    <nav className="category-box">
      <ul>
        <li><Link to="/">Produkter</Link></li>
        <li><Link to="/category/1">Film</Link></li>
        <li><Link to="/category/2">Musik</Link></li>
        <li><Link to="/category/3">Spel</Link></li>
      </ul>
    </nav>
  );
}

export default CategoryBox;
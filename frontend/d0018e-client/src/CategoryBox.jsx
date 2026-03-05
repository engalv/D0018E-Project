import React from "react";
import "./CategoryBox.css";

function CategoryBox() {
  return (
    <nav className="category-box">
      <ul>
        <li>Produkter</li>
        <li>Musik</li>
        <li>Spel</li>
        <li>Filmer</li>
      </ul>
    </nav>
  );
}

export default CategoryBox;
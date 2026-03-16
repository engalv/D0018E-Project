import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

function Banner({ imageUrl, productId }) {
    return (
        <div className="banner">
            <Link to={`/product/${productId}`}>
                <img src={imageUrl} alt="Reklam" />
            </Link>
        </div>
    );
}
export default Banner;
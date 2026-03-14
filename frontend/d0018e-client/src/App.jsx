import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./Header";
import Products from "./Products.jsx";
import ProductPage from "./ProductPage.jsx";
import CartBox from "./CartBox.jsx";
import Checkout from "./Checkout.jsx";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import UserPage from "./UserPage.jsx";
import CategoryBox from "./CategoryBox.jsx";
import AdminPage from "./AdminPage.jsx"

import "./App.css";

// decodeJWT did not want to work as an import for some reason
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    console.log("Decoded JWT:", decoded);
    return decoded;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [updateCart, syncCart] = useState(false);
  const [cartOpen, openCart] = useState(false);
  const [cartCount, countCart] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token on load:", token);

    if (!token) {
      console.log("No token found");
      setAuthChecked(true);
      return;
    }

    const decoded = decodeJwt(token);
    if (decoded && decoded.UID) {
      console.log("Setting user from token:", decoded);
      setUser(decoded);
    } else {
      console.log("Invalid token, removing...");
      localStorage.removeItem("token");
    }
    setAuthChecked(true);
  }, []);

  // --- Fetch cart when user or updateCart changes ---
  useEffect(() => {
    if (!user) return;

    console.log("Fetching cart for user:", user.UID);
    fetch(`http://localhost:5000/cart/${user.UID}`)
      .then((res) => res.json())
      .then((data) => {
        const totalQty = data.reduce((acc, p) => acc + p.Quantity, 0);
        console.log("Cart total quantity:", totalQty);
        countCart(totalQty);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, [user, updateCart]);

  // --- Product view component ---
  const ProductView = () => {
    if (!authChecked) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    return (
      <div className="duct">
        <Products
          uid={user.UID}
          updateCart={updateCart}
          syncCart={syncCart}
          countCart={cartCount}
        />
        {cartOpen && (
          <CartBox
            uid={user.UID}
            updateCart={updateCart}
            syncCart={syncCart}
            closeCart={() => openCart(false)}
            countCart={cartCount}
          />
        )}
      </div>
    );
  };

  // --- Wait for auth check before rendering ---
  if (!authChecked) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <Header
        toggleCart={() => openCart((prev) => !prev)}
        cartCount={cartCount}
        cartOpen={cartOpen}
        user={user}
        setUser={setUser}
        countCart={countCart}
        updateCart={updateCart}
        syncCart={syncCart}
        closeCart={() => openCart(false)}
      />

      <CategoryBox />

      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!user ? <LoginForm setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <RegistrationForm /> : <Navigate to="/" />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={user ? <ProductView /> : <Navigate to="/login" />}
          />
          <Route
            path="/category/:cid"
            element={user ? <ProductView /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={user ? <Checkout uid={user.UID} syncCart={syncCart} /> : <Navigate to="/login" />}
          />
          <Route
            path="/product/:pid"
            element={user ? <ProductPage uid={user.UID} syncCart={syncCart} user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/user"
            element={user ? <UserPage uid={user.UID} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user?.Is_Admin ? <AdminPage user={user} /> : <Navigate to="/" />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={user ? <Navigate to="/" /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
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

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [updateCart, syncCart] = useState(false);
  const [cartOpen, openCart] = useState(false);
  const [cartCount, countCart] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/cart/${user.UID}`)
      .then(res => res.json())
      .then(data => {
        const totalQty = data.reduce((acc, p) => acc + p.Quantity, 0);
        countCart(totalQty);
      });
  }, [user, updateCart]);

  return (
    <div className="app-container">
      <Header
        toggleCart={() => openCart(prev => !prev)}
        cartCount={cartCount}
        cartOpen={cartOpen}
        user={user}
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
          {user && (
            <>
              <Route
                path="/"
                element={
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
                }
              />
              <Route
                path="/checkout"
                element={<Checkout uid={user.UID} syncCart={syncCart} />}
              />
              <Route
                path="/product/:pid"
                element={<ProductPage uid={user.UID} syncCart={syncCart} />}
              />
              <Route
                path="/user"
                element={<UserPage uid={user.UID} />}
              />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./Header";
import Products from "./Products.jsx";
import ProductPage from "./ProductPage.jsx";
import Cart from "./Cart.jsx";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import UserPage from "./UserPage.jsx"
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [updateCart, syncCart] = useState(false);

  return (
    <Router>
      <Header user={user}/>

      <Routes>
        <Route
          path="/login"
          element={
            !user ? <LoginForm setUser={setUser} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/register"
          element={
            !user ? <RegistrationForm /> : <Navigate to="/" />
          }
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
                  />
                  <Cart
                    uid={user.UID}
                    updateCart={updateCart}
                    syncCart={syncCart}
                  />
                </div>
              }
            />
            <Route
              path="/product/:pid"
              element={<ProductPage uid={user.UID} syncCart={syncCart} />}
            />

            <Route
              path="/user"
              element={<UserPage uid={user.UID}/>}
            />

          </>
        )}

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
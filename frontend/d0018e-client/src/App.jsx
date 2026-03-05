import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./Products.jsx";
import Checkout from "./Checkout.jsx";
import Header from "./Header.jsx";
import CartBox from "./CartBox.jsx";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
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
    <div className="container"> {}
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

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <div className="auth-forms">
                <RegistrationForm />
                <hr/>
                <LoginForm setUser={setUser} />
              </div>
            ) : (
              <>
                <Products uid={user.UID} updateCart={updateCart} syncCart={syncCart} countCart={countCart}/>
                {cartOpen && (
                    <CartBox uid={user.UID} updateCart={updateCart} syncCart={syncCart} closeCart={() => openCart(false)} countCart={countCart}/>
                )}
              </>
            )
          }
        />
        <Route
          path="/checkout"
          element={<Checkout uid={user?.UID} syncCart={syncCart} />}
        />
      </Routes>
    </div>
  );
}

export default App;
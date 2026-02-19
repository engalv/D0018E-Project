import React, { useState } from "react";
import cdKungen from "../images/CDKungen.png";
import Products from "./Products.jsx";
import Cart from "./Cart.jsx";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [updateCart, syncCart] = useState(false);

  return (
    <>
      <div>
        <a href="swag.com" target="_blank">
          <img src={cdKungen} className="logo" alt="CDKungen logo" />
        </a>
      </div>

      <h1>CDKUNGEN.se</h1>

      {!user ? (
        <div className="auth-forms">
          <RegistrationForm />
          <hr />
          <LoginForm setUser={setUser} />
        </div>
      ) : (
        <div className="duct">
          {/* Pass syncCart to Products as well */}
          <Products uid={user.UID} updateCart={updateCart} syncCart={syncCart} />
          <Cart uid={user.UID} updateCart={updateCart} syncCart={syncCart} />
        </div>
      )}

      <p className="read-the-docs">CDKUNGEN.se</p>
    </>
  );
}

export default App;
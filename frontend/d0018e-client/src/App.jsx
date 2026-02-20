import React, { useState } from "react";
import cdKungen from "../images/CDKungen.png";
import Products from "./Products.jsx";
import Cart from "./Cart.jsx";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import Header from './Header';
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [updateCart, syncCart] = useState(false);

  return (
    <>    

      <Header/>{}

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
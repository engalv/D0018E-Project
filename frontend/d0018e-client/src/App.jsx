import { useState } from "react";
import cdKungen from "../images/CDKungen.png";
import Products from "./Products.jsx";
import Cart from "./Cart.jsx";
import "./App.css";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [updateCart, syncCart] = useState(false);

  return (
    <>
      <div>
        <a href="https://swag.com" target="_blank" rel="noopener noreferrer">
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
          <Products
            uid={user.UID}
            syncCart={syncCart}
            updateCart={updateCart}
          />

          <Cart
            uid={user.UID} 
            updateCart={updateCart}
            syncCart={syncCart}
             />

          <button id="orderbutton">Order</button>
        </div>
      )}

      <p className="read-the-docs">CDKUNGEN.se</p>
    </>
  );
}

export default App;

import { useState } from "react";
import cdKungen from "../images/CDKungen.png";
import Products from "./Products.jsx";
import Cart from "./Cart.jsx";
import "./App.css";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import Header from './Header';

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

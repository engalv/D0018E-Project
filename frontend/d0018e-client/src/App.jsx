import { useState } from 'react';
import cdKungen from '../images/CDKungen.png';
import Products from './Products.jsx';
import Cart from './Cart.jsx';
import './App.css';
import RegistrationForm from './RegistrationForm.jsx'

function App() {
  const [uid] = useState(1);
  const [updateCart, syncCart] = useState(false);
  const [user, setUser] = useState(null) 

  return (
    <>
      <div>
        <a href="swag.com" target="_blank">
          <img src={cdKungen} className="logo" alt="CDKungen logo" />
        </a>
      </div>

      <h1>CDKUNGEN.se</h1>

      <div className="duct">
        <Products 
          uid={uid} 
          syncCart={syncCart}
          updateCart={updateCart}
        />

        <Cart 
          uid={uid} 
          updateCart={updateCart} 
          syncCart={syncCart}
        />
      </div>

      {!user ? (
        <div className="auth-forms">
          <RegistrationForm />
          <hr />
          <LoginForm setUser={setUser} />
        </div>
      ) : (
        <div className="duct">
          <Products />
          <button id="orderbutton">Order</button>
        </div>
      )}

      <p className="read-the-docs">CDKUNGEN.se</p>
    </>
  );
}

export default App;

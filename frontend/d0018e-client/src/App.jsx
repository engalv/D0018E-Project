import { useState } from 'react';
import cdKungen from '../images/CDKungen.png';
import Products from './Products.jsx';
import Cart from './Cart.jsx';
import './App.css';

function App() {
  const [uid] = useState(1);
  const [updateCart, syncCart] = useState(false);
  
  return (
    <>
      <div>
        <a href="https://chatgpt.com" target="_blank">
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
      

      <p className="read-the-docs">
        CDKUNGEN.se
      </p>
    </>
  );
}

export default App;

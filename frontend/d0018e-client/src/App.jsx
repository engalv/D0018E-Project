import { useState } from 'react'
import cdKungen from '../images/CDKungen.png'
import Products from './Products.jsx'
import LoginForm from './LoginForm.jsx'
import RegistrationForm from './RegistrationForm.jsx'
import './App.css'

function App() {

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
          <Products />
          <button id="orderbutton">Order</button>
        </div>
      )}

      <p className="read-the-docs">CDKUNGEN.se</p>
    </>
  )
}

export default App

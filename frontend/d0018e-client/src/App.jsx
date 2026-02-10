import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cdKungen from '../images/CDKungen.png'
import Products from './Products.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="" target="_blank">
          <img src={cdKungen} className="logo" alt="CDKungen logo" />
        </a>
      </div>
      <h1>CDKUNGEN.se</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
        </button>
        <p>
          {/* edit <code>src/App.jsx</code> and save to test HMR    */}
        </p>
      </div>
          <div class="duct">
            <Products />
            <button id="orderbutton">Order</button>
        </div>
      <p className="read-the-docs">
        CDKUNGEN.se
      </p>
    </>
  )
}

export default App

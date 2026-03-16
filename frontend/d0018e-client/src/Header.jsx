import React from "react";
import Cart from "./Cart";
import "./Header.css";
import Kungen from "../images/CDKungen.png";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, LogIn } from "lucide-react";

function Header({ toggleCart, cartCount, cartOpen, countCart, updateCart, syncCart, closeCart, user, setUser, showCartButton }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);                    
    navigate("/login");               
    window.location.reload(); 
  };

  return (
    <header className="header">
      <div className="header-inner">

        <div className="cdk">
          <Link to="/">
            <img src={Kungen} className="cd-logo" alt="cdlogo"/>
          </Link>
          <h1>CDKUNGEN.SE</h1>          

          <nav className="navbar">

            {/* Admin button */}
            {user?.Is_Admin === 1 && (
              <button
                className="nav-button admin-button"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            )}
          </nav>
        </div>

      <div className="header-right">
        <div className="login-container">
          {!user ? (
            <button className="login-button">
              <Link to="/login"><LogIn size={24}/></Link>
            </button>
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={24}/>
            </button>
          )}
        </div>

          <div className="profileButton"><Link to="/profile" className="nav-button"> <User size={28} /> </Link></div>
          {showCartButton && (
            <div className="cart-container">
              <button className="cart-button" onClick={toggleCart}>
                Kundvagn
                {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
              </button>

              {cartOpen && user && (
                <Cart
                  uid={user.UID}
                  updateCart={updateCart}
                  syncCart={syncCart}
                  countCart={countCart}
                  closeCart={closeCart}
                />
              )}
            </div>
          )}
      </div>
      </div>
    </header>
  );
}

export default Header;
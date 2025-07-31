import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { useCart } from "./state/CartContext";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const { cartCount } = useCart(); // Use cartCount, always live
  const location = useLocation();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Persistent top navigation scaffold
  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <nav className="navbar">
          <Link to="/" className="nav-logo">
            PlayPals
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/cart">
                Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        <main style={{ width: "100%", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </header>
    </div>
  );
}

export default App;

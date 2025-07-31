import React, { createContext, useContext, useReducer, useEffect } from "react";

// Key used in localStorage for the cart state
const STORAGE_KEY = "pp_cart_v1";

// Helper: loads cart from localStorage if available
function loadCartFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Helper: saves cart to localStorage
function saveCartToStorage(cart) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

// Reducer handles cart item state and actions
// PUBLIC_INTERFACE
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find((c) => c.product.id === action.product.id);
      if (exists) {
        // Increase quantity if already in cart
        const updated = state.cart.map((c) =>
          c.product.id === action.product.id
            ? { ...c, quantity: c.quantity + (action.quantity || 1) }
            : c
        );
        saveCartToStorage(updated);
        return { ...state, cart: updated };
      } else {
        const next = [
          ...state.cart,
          { product: action.product, quantity: action.quantity || 1 },
        ];
        saveCartToStorage(next);
        return { ...state, cart: next };
      }
    }
    case "REMOVE_FROM_CART": {
      const filtered = state.cart.filter((c) => c.product.id !== action.productId);
      saveCartToStorage(filtered);
      return { ...state, cart: filtered };
    }
    case "UPDATE_QUANTITY": {
      const updated = state.cart.map((c) =>
        c.product.id === action.productId
          ? { ...c, quantity: Math.max(1, action.quantity) }
          : c
      );
      saveCartToStorage(updated);
      return { ...state, cart: updated };
    }
    case "CLEAR_CART": {
      saveCartToStorage([]);
      return { ...state, cart: [] };
    }
    case "HYDRATE_FROM_STORAGE": {
      return { ...state, cart: loadCartFromStorage() };
    }
    default:
      return state;
  }
}

const defaultState = { cart: [] };

// React Context
const CartContext = createContext();

/**
 * CartProvider supplies cart state and dispatcher to the app.
 * Handles cart persistence via localStorage.
 */
// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, defaultState);

  // On mount, hydrate state from localStorage
  useEffect(() => {
    dispatch({ type: "HYDRATE_FROM_STORAGE" });
    // Listen for changes in localStorage from other tabs & sync
    function syncAcrossTabs(e) {
      if (e.key === STORAGE_KEY) dispatch({ type: "HYDRATE_FROM_STORAGE" });
    }
    window.addEventListener("storage", syncAcrossTabs);
    return () => window.removeEventListener("storage", syncAcrossTabs);
  }, []);

  // For robust persistence: save cart on every change
  useEffect(() => {
    saveCartToStorage(state.cart);
  }, [state.cart]);

  // PUBLIC_INTERFACE: Expose helpers for live order summary, update, remove, etc.
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart
    .reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        cartCount,
        cartTotal,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useCart() {
  /**
   * useCart returns global cart context.
   */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

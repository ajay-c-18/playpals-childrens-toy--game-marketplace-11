import React, { createContext, useContext, useReducer } from "react";

// Reducer handles cart and optionally filters (expand as needed)
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find((c) => c.product.id === action.product.id);
      if (exists) {
        // Increase quantity if already in cart
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.product.id === action.product.id
              ? { ...c, quantity: c.quantity + action.quantity }
              : c
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { product: action.product, quantity: action.quantity }],
        };
      }
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((c) => c.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((c) =>
          c.product.id === action.productId
            ? { ...c, quantity: action.quantity }
            : c
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "SET_FILTERS":
      return { ...state, filters: action.filters };
    default:
      return state;
  }
}

const defaultState = { cart: [], filters: {} };
// React Context
const CartContext = createContext();

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /**
   * CartProvider supplies cart/filters state and dispatcher to the app.
   */
  const [state, dispatch] = useReducer(cartReducer, defaultState);
  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        filters: state.filters,
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
   * useCart returns global cart/filters context.
   */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

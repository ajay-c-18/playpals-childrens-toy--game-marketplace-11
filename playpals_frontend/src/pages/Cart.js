import React from "react";
import { useCart } from "../state/CartContext";

/**
 * Shopping cart page — summary and update controls (placeholder)
 */
// PUBLIC_INTERFACE
function Cart() {
  const { cart } = useCart();
  return (
    <section>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.product.id}>
              {item.product.name} &times; {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Cart;

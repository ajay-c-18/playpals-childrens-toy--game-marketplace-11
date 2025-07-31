import React from "react";
import { useCart } from "../state/CartContext";

/**
 * Shopping cart page — summary, quantity updates, remove, and live order totals.
 */
// PUBLIC_INTERFACE
function Cart() {
  const { cart, cartCount, cartTotal, dispatch } = useCart();

  const handleQuantityChange = (productId, newQty) => {
    // Only positive integers allowed
    if (+newQty > 0) {
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity: Number(newQty) });
    }
  };

  const handleRemove = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
  };

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <section style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item) => (
              <li
                key={item.product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  borderBottom: "1px solid #ececec",
                  padding: "10px 0",
                }}
              >
                <img
                  src={item.product.images?.[0] || "https://cdn.pixabay.com/photo/2013/07/13/12/10/toy-146162_1280.png"}
                  alt={item.product.name}
                  style={{
                    width: 60,
                    height: 52,
                    borderRadius: 9,
                    objectFit: "cover",
                    border: "1.2px solid #f8e0dd",
                    background: "#faf8f3",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", color: "#ff6f61" }}>
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: 14, color: "#888" }}>
                    Brand: {item.product.brand} | <span>Ages {item.product.age}+</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#43b5a0" }}>
                    ${item.product.price.toFixed(2)} ×{" "}
                    <input
                      type="number"
                      min="1"
                      style={{
                        width: 38,
                        borderRadius: 7,
                        border: "1px solid #ddd",
                        padding: "2px 6px",
                        marginLeft: 2,
                        marginRight: 3,
                      }}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product.id,
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      aria-label={`Quantity of ${item.product.name}`}
                    />{" "}
                    ={" "}
                    <span style={{ fontWeight: 600 }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  className="clear-btn"
                  style={{
                    background: "#ffdbe2",
                    color: "#cc2231",
                    border: "none",
                    borderRadius: 11,
                    padding: "7px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemove(item.product.id)}
                  aria-label={`Remove ${item.product.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", marginTop: 22 }}>
            <div style={{ fontWeight: 600, fontSize: 17 }}>
              Total ({cartCount} item{cartCount === 1 ? "" : "s"}):{" "}
              <span style={{ color: "#43b5a0" }}>${cartTotal}</span>
            </div>
            <button
              className="clear-btn"
              style={{
                background: "#eee",
                color: "#906a3b",
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
                padding: "7px 16px",
                marginRight: 5,
              }}
              onClick={handleClearAll}
              aria-label="Clear all items from cart"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;

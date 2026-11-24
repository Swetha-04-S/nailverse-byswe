
import { Link } from "react-router-dom";

import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Trash2
} from "lucide-react";

import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart
  } = useCart();

  return (
    <div className="cart-page">

      <header className="cart-header">
        <Link to="/" className="cart-logo">
          Nailverse
          <small>BY SWE</small>
        </Link>

        <Link to="/#shop" className="cart-continue">
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>
      </header>

      <main className="cart-container">

        <div className="cart-title">
          <p>YOUR NAILVERSE COLLECTION</p>
          <h1>Shopping Cart</h1>
          <span>{cartCount} item(s) in your cart</span>
        </div>

        {cartItems.length === 0 ? (

          <div className="empty-cart">
            <ShoppingBag size={48} />

            <h2>Your cart is waiting for some love!</h2>

            <p>
              Discover beautiful designs and find your favourites.
            </p>

            <Link to="/#shop" className="cart-shop-button">
              Explore Collection
            </Link>
          </div>

        ) : (

          <div className="cart-layout">

            <section className="cart-items">

              {cartItems.map((item) => (

                <div className="cart-item" key={item._id}>

                  <Link to={`/product/${item._id}`}>
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500"
                      }
                      alt={item.name}
                    />
                  </Link>

                  <div className="cart-item-info">

                    <p>{item.category}</p>

                    <h3>{item.name}</h3>

                    <strong>
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </strong>

                    <div className="cart-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                  </div>

                  <div className="cart-item-actions">

                    <strong>
                      ₹{(
                        Number(item.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </section>

            <aside className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Items ({cartCount})</span>

                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <strong>Calculated at checkout</strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Subtotal</span>

                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout
              </Link>

              <p>Made with love, designed for you. 💗</p>

            </aside>

          </div>

        )}

      </main>
    </div>
  );
}

export default Cart;

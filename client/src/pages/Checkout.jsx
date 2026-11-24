
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, CheckCircle } from "lucide-react";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("customerToken")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (cartItems.length === 0 && !placedOrder) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, placedOrder, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity
        })),

        shippingAddress: formData,

        paymentMethod: "COD"
      };

      const response = await createOrder(orderData);

      if (response.success) {
        // Clear cart only after successful order creation
        clearCart();

        setPlacedOrder(response.order);
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to place your order. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // Order success screen
  if (placedOrder) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <CheckCircle size={65} />

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for shopping with Nailverse By Swe.
          </p>

          <div className="success-order-details">
            <span>Order Number</span>
            <strong>{placedOrder.orderNumber}</strong>

            <span>Total Amount</span>
            <strong>₹{placedOrder.totalAmount}</strong>

            <span>Payment Method</span>
            <strong>Cash on Delivery</strong>

            <span>Order Status</span>
            <strong>{placedOrder.orderStatus}</strong>
          </div>

          <button
            onClick={() => navigate("/")}
            className="success-home-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <header className="checkout-header">
        <Link to="/cart">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <h1>NAILVERSE BY SWE</h1>

        <ShoppingBag size={22} />
      </header>

      <div className="checkout-container">

        <div className="checkout-form-section">

          <h2>Checkout</h2>

          <p className="checkout-subtitle">
            Complete your details to place your order.
          </p>

          <form onSubmit={handleSubmit}>

            <h3>Delivery Information</h3>

            <div className="checkout-fields">

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit phone number"
                maxLength={10}
                required
              />

              <textarea
                name="addressLine"
                placeholder="House No., Street, Area"
                value={formData.addressLine}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                title="Enter a valid 6-digit postal code"
                maxLength={6}
                required
              />

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />

            </div>

            <h3>Payment Method</h3>

            <div className="payment-option">
              <input
                type="radio"
                checked
                readOnly
              />

              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay when your order arrives.</p>
              </div>
            </div>

            {error && (
              <p className="checkout-error">{error}</p>
            )}

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

          </form>
        </div>

        <aside className="checkout-summary">

          <h3>Your Order</h3>

          {cartItems.map((item) => (
            <div
              className="checkout-product"
              key={item._id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <strong>{item.name}</strong>
                <p>Quantity: {item.quantity}</p>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            </div>
          ))}

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <div className="checkout-total-row">
            <span>Shipping</span>
            <strong>FREE</strong>
          </div>

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default Checkout;

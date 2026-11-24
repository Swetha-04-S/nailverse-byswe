
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  RefreshCw
} from "lucide-react";

import { getMyOrders } from "../services/api";
import "./MyOrders.css";

const statusSteps = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED"
];

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getStatusIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="my-orders-page">

      <header className="my-orders-header">
        <Link to="/" className="orders-logo">
          Nailverse
          <small>BY SWE</small>
        </Link>

        <Link to="/" className="orders-back-link">
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>
      </header>

      <main className="my-orders-container">

        <div className="my-orders-heading">
          <div>
            <p>YOUR NAILVERSE COLLECTION</p>
            <h1>My Orders</h1>
            <span>
              Track and manage your purchases.
            </span>
          </div>

          <button
            className="orders-refresh"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (

          <div className="orders-message">
            <Package size={35} />
            <p>Loading your orders...</p>
          </div>

        ) : error ? (

          <div className="orders-message orders-error">
            <p>{error}</p>
            <button onClick={fetchOrders}>
              Try Again
            </button>
          </div>

        ) : orders.length === 0 ? (

          <div className="orders-empty">
            <ShoppingBag size={55} />
            <h2>No orders yet!</h2>
            <p>
              Your beautiful Nailverse collection is waiting.
            </p>

            <Link to="/" className="orders-shop-btn">
              Explore Collection
            </Link>
          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => {

              const currentIndex = getStatusIndex(
                order.orderStatus
              );

              const isCancelled =
                order.orderStatus === "CANCELLED";

              return (
                <article
                  className="order-card"
                  key={order._id}
                >

                  <div className="order-card-header">

                    <div>
                      <span className="order-label">
                        ORDER NUMBER
                      </span>

                      <h3>{order.orderNumber}</h3>

                      <p>
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`order-status ${
                        isCancelled ? "cancelled" : ""
                      }`}
                    >
                      {formatStatus(order.orderStatus)}
                    </span>

                  </div>

                  <div className="order-products">

                    {order.items.map((item, index) => (

                      <div
                        className="order-product"
                        key={`${item.product}-${index}`}
                      >

                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300"
                          }
                          alt={item.name}
                        />

                        <div className="order-product-info">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <strong>
                            ₹{Number(item.price).toLocaleString("en-IN")}
                          </strong>
                        </div>

                      </div>

                    ))}

                  </div>

                  {!isCancelled && (
                    <div className="order-tracking">

                      <h4>Order Progress</h4>

                      <div className="tracking-steps">

                        {statusSteps.map((step, index) => (

                          <div
                            className={`tracking-step ${
                              index <= currentIndex ? "completed" : ""
                            }`}
                            key={step}
                          >
                            <div className="tracking-dot"></div>

                            <span>
                              {formatStatus(step)}
                            </span>
                          </div>

                        ))}

                      </div>

                    </div>
                  )}

                  {isCancelled && (
                    <p className="cancelled-message">
                      This order has been cancelled.
                    </p>
                  )}

                  <details className="order-details">

                    <summary>
                      View Order Details
                    </summary>

                    <div className="order-address">
                      <h4>Delivery Address</h4>

                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.addressLine}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>

                    <div className="order-payment">
                      <p>
                        Payment Method: <strong>{order.paymentMethod}</strong>
                      </p>

                      <p>
                        Payment Status: <strong>{order.paymentStatus}</strong>
                      </p>

                      <p>
                        Shipping: <strong>
                          ₹{order.shippingFee}
                        </strong>
                      </p>

                      <p>
                        Total Amount: <strong>
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </strong>
                      </p>
                    </div>

                  </details>

                  <div className="order-card-footer">
                    <span>Total Amount</span>

                    <strong>
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </article>
              );
            })}

          </div>

        )}

      </main>
    </div>
  );
}

export default MyOrders;


import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Heart,
  Sparkles
} from "lucide-react";

import { getProductById } from "../services/api";
import "./ProductDetails.css";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const handleAddToCart = () => {
  const added = addToCart(product, quantity);

  if (added) {
    alert(`${product.name} added to your cart! 💗`);
  } else {
    alert("Unable to add this quantity. Please check available stock.");
  }
};
  

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setQuantity(1);

        const data = await getProductById(id);

        if (isMounted) {
          setProduct(data.product);
        }

      } catch (err) {
        console.error("Product details error:", err);

        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "Sorry, this product could not be found."
              : "Unable to load product details. Please try again."
          );
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((previous) => previous + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previous) => previous - 1);
    }
  };

  const isAvailable =
    product?.isAvailable && product?.stock > 0;



  if (loading) {
    return (
      <div className="product-state">
        <Sparkles size={28} />
        <h2>Finding your perfect nail moment...</h2>
        <p>Loading product details.</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-state">
        <h2>Oops! Something went wrong.</h2>
        <p>{error || "Product not found."}</p>

        <Link to="/#shop" className="details-back-button">
          <ArrowLeft size={17} />
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      {/* HEADER */}

      <header className="details-header">

        <Link to="/" className="details-logo">
          <span>Nailverse</span>
          <small>BY SWE</small>
        </Link>

        <Link to="/#shop" className="details-shop-link">
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>

      </header>

      {/* BREADCRUMB */}

      <div className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/#shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* PRODUCT CONTENT */}

      <main className="product-details-container">

        {/* PRODUCT IMAGE */}

        <div className="details-image-container">

          <img
            src={
              product.image ||
              "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1000"
            }
            alt={product.name}
            className="details-product-image"
          />

          <div className="details-image-label">
            <Sparkles size={15} />
            NAILVERSE COLLECTION
          </div>

        </div>

        {/* PRODUCT INFORMATION */}

        <div className="details-product-info">

          <p className="details-eyebrow">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <div className="details-divider"></div>

          <h3>Product Description</h3>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-stock">

            <span
              className={
                isAvailable
                  ? "stock-indicator available"
                  : "stock-indicator unavailable"
              }
            />

            <span>
              {isAvailable
                ? `${product.stock} items available`
                : "Currently unavailable"}
            </span>

          </div>

          {isAvailable && (

            <div className="quantity-section">

              <label>Quantity</label>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>

          )}

          <div className="details-total">

            <span>Subtotal</span>

            <strong>
              ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
            </strong>

          </div>
          <button 
          type="button"
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!isAvailable}><ShoppingBag size={18} />Add to Cart
          </button>

          <button
            type="button"
            className="details-enquire-button"
            onClick={() => {
              const message = encodeURIComponent(
                `Hi! I'm interested in ${product.name}. Quantity: ${quantity}. Price: ₹${product.price * quantity}.`
              );

              window.open(
                `https://www.instagram.com/nailverse_by_swe/`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            disabled={!isAvailable}
          >
            <Heart size={18} />
            {isAvailable ? "Enquire About This Product" : "Currently Unavailable"}
          </button>

          <p className="details-note">
            Made with love, designed for you. 💗
          </p>

        </div>

      </main>

      {/* BACK TO SHOP */}

      <div className="details-bottom">
        <Link to="/#shop">
          <ArrowLeft size={17} />
          Back to all products
        </Link>
      </div>

    </div>
  );
}

export default ProductDetails;

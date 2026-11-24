
import { useEffect, useState } from "react";

import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Mail,
  UserRound,
  ChevronDown,
  LogOut
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getProducts,
  getCustomerProfile
} from "./services/api";

import "./App.css";
import { useCart } from "./context/CartContext";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { cartCount } = useCart();

  // Get cached customer information
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("customerUser")) || null;
    } catch {
      return null;
    }
  });

  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(data.products || []);

    } catch (err) {
      console.error("Product fetching error:", err);

      setError(
        "Unable to load products. Please check your backend connection."
      );

    } finally {
      setLoading(false);
    }
  };

  // Fetch authenticated customer profile from MongoDB
  useEffect(() => {
    let isMounted = true;

    const fetchCustomerProfile = async () => {
      const token = localStorage.getItem("customerToken");

      if (!token) {
        localStorage.removeItem("customerUser");

        if (isMounted) {
          setCustomer(null);
        }

        return;
      }

      try {
        const data = await getCustomerProfile();

        if (!isMounted) return;

        if (data.success && data.user) {
          setCustomer(data.user);

          localStorage.setItem(
            "customerUser",
            JSON.stringify(data.user)
          );
        }

      } catch (err) {
        console.error("Customer profile fetching error:", err);

        const status = err.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("customerToken");
          localStorage.removeItem("customerUser");

          if (isMounted) {
            setCustomer(null);
            setProfileOpen(false);
          }
        }
      }
    };

    fetchCustomerProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products when homepage loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Close mobile navigation
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Customer logout
  const handleCustomerLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");

    setCustomer(null);
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <div className="website">

      {/* NAVIGATION */}
      <nav className="navbar">

        <Link to="/" className="logo" onClick={closeMenu}>
          <span>Nailverse</span>
          <small>BY SWE</small>
        </Link>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#shop" onClick={closeMenu}>Shop</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>

        <div className="nav-actions">

          <Link to="/cart" className="cart-icon" aria-label="Shopping cart">
            <ShoppingBag size={19} />

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          <a href="#shop" className="nav-button">
            Shop Now
          </a>

          {/* CUSTOMER PROFILE OR LOGIN BUTTON */}

          {customer ? (

            <div className="account-menu">

              <button
                type="button"
                className="account-button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
              >
                <UserRound size={17} />

                <span>
                  {customer.name?.split(" ")[0] || "My Account"}
                </span>

                <ChevronDown size={15} />
              </button>

              {profileOpen && (

                <div className="profile-dropdown">

                  <div className="profile-info">

                    <div className="profile-avatar">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <strong>{customer.name}</strong>
                      <span>{customer.email}</span>
                    </div>

                  </div>

                  <div className="profile-divider"></div>

                  <div className="profile-welcome">
                    Welcome to Nailverse! 💗
                  </div>

                  {/* MY ORDERS LINK */}

                  <Link
                    to="/my-orders"
                    className="logout-button"
                    onClick={() => {
                      setProfileOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <ShoppingBag size={16} />
                    My Orders
                  </Link>

                  {/* LOGOUT BUTTON */}

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleCustomerLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>

              )}

            </div>

          ) : (

            <Link
              to="/login"
              className="nav-button account-button"
              onClick={closeMenu}
            >
              <UserRound size={16} />
              Sign Up / Login
            </Link>

          )}

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          className="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </nav>

      {/* HERO SECTION */}

      <section className="hero" id="home">

        <div className="hero-content">

          <p className="eyebrow">
            <Sparkles size={15} />
            YOUR NAILS, YOUR UNIVERSE
          </p>

          <h1>
            Beauty is in
            <br />
            every <span>detail.</span>
          </h1>

          <p className="hero-description">
            Discover your perfect nail aesthetic with
            handcrafted press-on nails and beautiful
            nail art made just for you.
          </p>

          <div className="hero-buttons">

            <a href="#shop" className="primary-button">
              Explore Collection <ArrowRight size={17} />
            </a>

            <a href="#services" className="secondary-button">
              Our Services
            </a>

          </div>

          <div className="hero-note">
            <Heart size={16} />
            Made with love, designed for you.
          </div>

        </div>

        <div className="hero-image">

          <img
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1000"
            alt="Beautiful nail art"
          />

          <div className="image-label">
            <span>THE ART OF NAILS</span>
            <strong>Express yourself.</strong>
          </div>

        </div>

      </section>

      {/* HIGHLIGHTS */}

      <section className="highlights">

        <div>
          <Sparkles />
          <span>Handcrafted Designs</span>
        </div>

        <div>
          <Heart />
          <span>Made With Love</span>
        </div>

        <div>
          <Star />
          <span>Unique Nail Art</span>
        </div>

      </section>

      {/* SHOP */}

      <section className="shop-section" id="shop">

        <div className="section-heading">

          <p className="eyebrow">OUR COLLECTION</p>

          <h2>
            Find your <span>nail moment.</span>
          </h2>

          <p>
            Little details. Beautiful transformations.
          </p>

        </div>

        {loading && (
          <div className="product-message">
            <p>Loading our beautiful nail collection...</p>
          </div>
        )}

        {error && (
          <div className="product-message">
            <p>{error}</p>

            <button
              className="primary-button"
              onClick={fetchProducts}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="product-message">
            <p>
              No products available right now. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (

          <div className="product-grid">

            {products.map((product) => (

              <div className="product-card" key={product._id}>

                <div className="product-image">

                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700"
                    }
                    alt={product.name}
                  />

                  <span className="product-tag">
                    Nailverse Pick
                  </span>

                </div>

                <div className="product-info">

                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                  </div>

                  <strong>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>

                </div>

                <p className="product-description">
                  {product.description}
                </p>

                <Link
                  to={`/product/${product._id}`}
                  className="product-link"
                >
                  View Details <ArrowRight size={15} />
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* SERVICES */}

      <section className="services-section" id="services">

        <div className="section-heading">
          <p className="eyebrow">WHAT WE OFFER</p>

          <h2>
            A little love for your <span>nails.</span>
          </h2>
        </div>

        <div className="service-grid">

          <div className="service-card">
            <span>01</span>
            <h3>Gel Polish</h3>
            <p>Beautiful shades and a polished finish.</p>
            <strong>Starting at ₹199</strong>
          </div>

          <div className="service-card">
            <span>02</span>
            <h3>Nail Art</h3>
            <p>Creative designs that express your style.</p>
            <strong>Starting at ₹299</strong>
          </div>

          <div className="service-card">
            <span>03</span>
            <h3>Gel Extensions</h3>
            <p>Elegant extensions for your dream nails.</p>
            <strong>Starting at ₹599</strong>
          </div>

        </div>

      </section>

      {/* ABOUT */}

      <section className="about-section" id="about">

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=900"
            alt="Nail art collection"
          />
        </div>

        <div className="about-content">

          <p className="eyebrow">A LITTLE ABOUT US</p>

          <h2>
            More than nails.
            <br />
            <span>It's self-expression.</span>
          </h2>

          <p>
            Welcome to NailverseBySwe, a space created
            for people who love expressing themselves
            through beautiful nail art.
          </p>

          <p>
            From elegant everyday looks to creative
            statement designs, every set is made with
            attention to detail and love.
          </p>

          <a href="#contact" className="primary-button">
            Connect With Us <ArrowRight size={17} />
          </a>

        </div>

      </section>

      {/* CONTACT */}

      <section className="contact-section" id="contact">

        <p className="eyebrow">LET'S CONNECT</p>

        <h2>
          Your next nail obsession
          <span> starts here.</span>
        </h2>

        <p>
          Have a design in mind? We'd love to hear from you.
        </p>

        <a
          href="https://www.instagram.com/nailverse_by_swe/"
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          <span>IG</span>
          Follow on Instagram
        </a>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-logo">
          <strong>NailverseBySwe</strong>
          <p>Your nails. Your style. Your universe.</p>
        </div>

        <div className="footer-social">

          <a
            href="https://www.instagram.com/nailverse_by_swe/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            IG
          </a>

          <a href="#contact" aria-label="Contact">
            <Mail />
          </a>

        </div>

        <p className="copyright">
          © 2026 NailverseBySwe. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;

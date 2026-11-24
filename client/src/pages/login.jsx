
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Lock
} from "lucide-react";

import {
  loginCustomer,
  registerCustomer
} from "../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (mode === "register" && form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (mode === "register") {
        response = await registerCustomer({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        });
      } else {
        response = await loginCustomer({
          email: form.email.trim(),
          password: form.password
        });
      }

      // Save customer authentication details
      localStorage.setItem("customerToken", response.token);
      localStorage.setItem(
        "customerUser",
        JSON.stringify(response.user)
      );

      setMessage(response.message);

      // Redirect to homepage after successful authentication
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <Sparkles size={25} />
          <span>Nailverse<span className="logo-accent">BySwe</span></span>
        </Link>

        <div className="auth-content">
          <p className="auth-eyebrow">
            YOUR BEAUTY, YOUR STYLE
          </p>

          <h1>
            Every detail
            <br />
            tells your <span>story.</span>
          </h1>

          <p className="auth-description">
            Discover your perfect nail style, explore beautiful
            collections and make every moment a little more special.
          </p>

          <div className="auth-decoration">
            <span>Elegance</span>
            <span>•</span>
            <span>Creativity</span>
            <span>•</span>
            <span>You</span>
          </div>
        </div>

        <p className="auth-left-footer">
          © 2026 NailverseBySwe
        </p>
      </div>

      <div className="auth-right">

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

        <div className="auth-card">

          <div className="auth-heading">
            <span className="auth-small-label">
              WELCOME TO NAILVERSE
            </span>

            <h2>
              {mode === "login"
                ? "Welcome back!"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to continue your beauty journey."
                : "Join Nailverse and discover your style."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {mode === "register" && (
              <div className="auth-field">
                <label>Full Name</label>

                <div className="auth-input-wrap">
                  <User size={18} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>

              <div className="auth-input-wrap">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>

              <div className="auth-input-wrap">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-success" role="status">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login to Your Account"
                  : "Create Account"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                switchMode(
                  mode === "login" ? "register" : "login"
                )
              }
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>

        </div>

        <p className="auth-bottom-note">
          Made with love for your little moments of beauty.
        </p>

      </div>
    </div>
  );
}

export default Login;

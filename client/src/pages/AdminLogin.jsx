
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        username,
        password
      });

      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="admin-login-brand">NAILVERSE BY SWE</p>

        <h1>Welcome Back</h1>

        <p className="admin-login-subtitle">
          Sign in to manage your nail collection.
        </p>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter admin username"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>

        <a href="/" className="admin-login-back">
          Back to Nailverse website
        </a>
      </section>
    </main>
  );
}

export default AdminLogin;

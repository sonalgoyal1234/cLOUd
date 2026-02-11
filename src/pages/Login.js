import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";

export default function Login({ onSuccess, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  /* ---------- LOGIN API ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !pass.trim()) {
      setError("Please enter email & password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: email,
          password: pass,
        }
      );

      // Save user locally
      localStorage.setItem("lg_user", JSON.stringify(res.data.user));
      localStorage.setItem("lg_auth", "true");

      setError("");

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>
        <p className="sub">Login to continue</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button className="btn-primary" type="submit">
            Login
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account?
          <span onClick={switchToSignup}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}
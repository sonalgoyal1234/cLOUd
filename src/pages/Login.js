import React, { useState } from "react";
import "./Auth.css";

export default function Login({ onSuccess, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !pass.trim()) {
      setError("Please enter email & password");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("lg_user"));

    if (!storedUser) {
      setError("No account found. Please sign up first.");
      return;
    }

    if (
      storedUser.email === email &&
      storedUser.password === pass
    ) {
      localStorage.setItem("lg_auth", "true");
      setError("");
      onSuccess(); // ✅ ONLY HERE
    } else {
      setError("❌ Invalid email or password");
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

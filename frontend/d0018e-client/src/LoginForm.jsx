import React, { useState } from "react";
import api from "./api";

function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await api.post("/login", { email, password });

      setMessage("Login successful!");
      setIsError(false);

      console.log("Logged in user:", res.data.user);
      setUser(res.data.user);

    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Login failed";

      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && (
        <p style={{ color: isError ? "red" : "green" }}>
          {message}
        </p>
      )}

      <p>
        Har du inget konto? <a href="/register">Registrera dig här</a>
    </p>
    </div>
  );
}

export default LoginForm;
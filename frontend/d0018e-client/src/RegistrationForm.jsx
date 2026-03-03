import { useState } from "react";
import api from "./api";

function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await api.post("/register", { name, email, password });

      // ✅ Extract message string
      setMessage(res.data.message || "Registration successful");
      setIsError(false);

      // Optional: clear form after success
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      // ✅ Extract error string safely
      const errorMessage =
        err.response?.data?.error || "Registration failed";

      setMessage(errorMessage);
      setIsError(true);

      console.error("Registration error:", err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Register</button>

      {message && (
        <p style={{ color: isError ? "red" : "green" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default RegistrationForm;
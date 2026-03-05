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

      setMessage(res.data.message || "Registration successful");
      setIsError(false);

      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed";

      setMessage(errorMessage);
      setIsError(true);

      console.error("Registration error:", err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2 className="loginregistration">Register</h2>

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
      <p>
          Tillbaka till logga in? <a href="/login">Logga in</a>
      </p>
    </form>


    
  );
}

export default RegistrationForm;
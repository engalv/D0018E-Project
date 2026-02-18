import { useState } from "react";
import api from "./api";

function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", { name, email, password });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default RegistrationForm;

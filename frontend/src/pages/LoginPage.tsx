// src/components/LoginForm.tsx
import { useState, FormEvent } from "react";
import { loginRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginForm.css";

export const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const { token, role } = await loginRequest({ email, password });
      login({ email, role }, token);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Ingreso UCENIN</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>

        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

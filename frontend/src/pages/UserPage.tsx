import { useAuth } from "../context/AuthContext";

export const UserPage = () => {
  const { usuario, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido Socio</h1>
      <p>Correo: {usuario?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

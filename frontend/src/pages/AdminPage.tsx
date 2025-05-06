import { useAuth } from "../context/AuthContext";

export const AdminPage = () => {
  const { usuario, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {usuario?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

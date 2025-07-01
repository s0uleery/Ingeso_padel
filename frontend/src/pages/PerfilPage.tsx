// src/pages/PerfilPage.tsx
// src/pages/PerfilPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/PerfilPage.css";
import { updateBalance } from "../services/userService"; // asegúrate que esté correctamente importado

const PerfilPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleAgregarSaldo = async () => {
    const valorStr = prompt("Ingrese el monto a agregar:");
    if (!valorStr) return;

    const valor = parseFloat(valorStr);
    if (isNaN(valor)) {
      alert("El monto ingresado no es válido");
      return;
    }

    try {
      const result = await updateBalance(userInfo.rut, valor);

      if (result.balance !== undefined) {
        const actualizado = { ...userInfo, balance: result.balance };
        setUserInfo(actualizado);
        localStorage.setItem("userInfo", JSON.stringify(actualizado));
      }

      setMensaje(result.message);
    } catch (error) {
      console.error(error);
      setMensaje("Error al agregar saldo.");
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-info">
        <p><strong>Nombre:</strong> {userInfo.name}</p>
        <p><strong>Rol:</strong> {userInfo.role}</p>
        <p><strong>Correo:</strong> {userInfo.email}</p>
        {userInfo.role === "user" && (
          <p>
            <strong>Saldo:</strong> ${userInfo.balance?.toLocaleString("es-CL") || 0}{" "}
            <button onClick={handleAgregarSaldo}>Añadir saldo</button>
          </p>
        )}
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>

      <BottomNav />
    </div>
  );
};

export default PerfilPage;
import "../styles/ReservasPage.css";
import BottomNav from "../components/BottomNav";
import ReservaModal from "../components/ReservaModal";
import { useState, useEffect } from "react";
//import { fetchReservasByUser, createReserva, deleteReserva, confirmarReserva, Reserva } from "../services/bookingService";

const ReservasPage = () => {
  const [modo, setModo] = useState<"reservas" | "modificar">("reservas");
  const [tabReservas, setTabReservas] = useState<"activas" | "porPagar" | "porConfirmar">("activas");
  const [tabModificar, setTabModificar] = useState<"activas" | "canceladas">("activas");
  const [showModal, setShowModal] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [userInfo, setUserInfo] = useState<{ rut?: string; role?: string }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (userData && userData.rut) {
      setUserInfo(userData);

      const obtenerReservas = async () => {
        try {
          const data = await fetchReservasByUser(userData.rut);
          setReservas(data);
        } catch (error) {
          console.error("Error al obtener reservas", error);
        }
      };

      obtenerReservas();
    }
  }, []);

  const isAdmin = userInfo?.role === "admin";

  const handleDeleteReserva = async (numero: number) => {
    try {
      await deleteReserva(numero);
      setReservas(reservas.filter(reserva => reserva.numero !== numero));
    } catch (error) {
      console.error("Error al eliminar reserva", error);
    }
  };

  const handleConfirmReserva = async (numero: number) => {
    try {
      await confirmarReserva(numero);
      setReservas(prevReservas =>
        prevReservas.map(reserva =>
          reserva.numero === numero ? { ...reserva, estado: "confirmada" } : reserva
        )
      );
    } catch (error) {
      console.error("Error al confirmar reserva", error);
    }
  };

  const handleCrearReserva = async (nuevaReserva: Omit<Reserva, "rut">) => {
    try {
      if (!userInfo.rut) {
        console.error("Error: No se encontró el usuario en la sesión");
        return;
      }

      const reservaConUsuario = { ...nuevaReserva, rut: userInfo.rut };
      await createReserva(reservaConUsuario);
      setReservas([...reservas, reservaConUsuario]);
    } catch (error) {
      console.error("Error al crear la reserva", error);
    }
  };

  return (
    <>
      <div className="reservas-container">
        <div className="reservas-header">
          <h3>Mis Reservas</h3>
          <div className="reservas-switch">
            <button className={modo === "reservas" ? "active" : ""} onClick={() => setModo("reservas")}>
              Reservas
            </button>
            <button className={modo === "modificar" ? "active" : ""} onClick={() => setModo("modificar")}>
              Modificar
            </button>
          </div>
          <div className="reservas-tabs">
            {modo === "reservas" ? (
              <>
                <button className={tabReservas === "activas" ? "active" : ""} onClick={() => setTabReservas("activas")}>
                  Activas
                </button>
                <button className={tabReservas === "porPagar" ? "active" : ""} onClick={() => setTabReservas("porPagar")}>
                  Por pagar
                </button>
                <button className={tabReservas === "porConfirmar" ? "active" : ""} onClick={() => setTabReservas("porConfirmar")}>
                  Por confirmar
                </button>
              </>
            ) : (
              <>
                <button className={tabModificar === "activas" ? "active" : ""} onClick={() => setTabModificar("activas")}>
                  Activas
                </button>
                <button className={tabModificar === "canceladas" ? "active" : ""} onClick={() => setTabModificar("canceladas")}>
                  Canceladas
                </button>
              </>
            )}
          </div>
        </div>

        <div className="reservas-content">
          {reservas.length > 0 ? (
            reservas.map((reserva) => (
              <div key={reserva.numero} className="reserva-card">
                <p>Cancha {reserva.cancha} - {reserva.fecha} ({reserva.horaInicio} - {reserva.horaFin})</p>
                <button onClick={() => handleConfirmReserva(reserva.numero)}>Confirmar</button>
                <button onClick={() => handleDeleteReserva(reserva.numero)}>Eliminar</button>
              </div>
            ))
          ) : (
            <p className="no-reservas">No tienes reservas activas en este momento.</p>
          )}
        </div>

        <button className="nueva-reserva-btn" onClick={() => setShowModal(true)}>
          Nueva reserva
        </button>
      </div>

      {showModal && <ReservaModal onClose={() => setShowModal(false)} onCreateReserva={handleCrearReserva} />}
      <BottomNav isAdmin={isAdmin} />
    </>
  );
};

export default ReservasPage;
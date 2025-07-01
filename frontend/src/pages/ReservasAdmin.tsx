// src/pages/ReservasAdmin.tsx
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { Booking, getAllBookings, deleteBooking } from "../services/bookingService";
import "../styles/ReservasAdmin.css";

export const ReservasAdmin = () => {
  const [reservas, setReservas] = useState<Booking[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const rut = userInfo?.rut || "";

  const cargarReservas = async () => {
    try {
      const respuesta = await getAllBookings(rut);
      if (respuesta.history) {
        setReservas(respuesta.history);
      } else {
        setError(respuesta.message || "No se pudo cargar el historial");
      }
    } catch (e) {
      console.error(e);
      setError("Error al cargar reservas");
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleEliminar = async (id: number) => {
    try {
      const respuesta = await deleteBooking(id, rut);
      setMensaje(respuesta.message);
      cargarReservas();
    } catch (e) {
      console.error(e);
      setError("Error al eliminar reserva");
    }
  };

  return (
    <>
      <div className="admin-reservas-container">
        <h2>Historial de Reservas</h2>

        {mensaje && <p className="mensaje">{mensaje}</p>}
        {error && <p className="error">{error}</p>}

        <ul className="reserva-lista">
          {reservas.length === 0 ? (
            <p>No hay reservas registradas.</p>
          ) : (
            reservas.map((reserva) => (
              <li key={reserva.id} className="reserva-item">
                <p>
                  <strong>Usuario:</strong> {reserva.usuario} ({reserva.rut})<br />
                  <strong>Cancha:</strong> {reserva.court_number}<br />
                  <strong>Fecha:</strong> {reserva.date}<br />
                  <strong>Horario:</strong> {reserva.start_time} - {reserva.finish_time}<br />
                  <strong>Costo:</strong> ${reserva.total_cost}
                </p>
                <button className="btn-eliminar" onClick={() => handleEliminar(reserva.id)}>
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <BottomNav/>
    </>
  );
};

export default ReservasAdmin;

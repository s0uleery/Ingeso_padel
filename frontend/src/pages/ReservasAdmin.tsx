// src/pages/ReservasAdmin.tsx
import "../styles/ReservasAdmin.css";
import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
//import { fetchReservas, Reserva } from "../services/bookingService";

export const ReservasAdmin = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const data = await fetchReservas();
        setReservas(data);
      } catch (e) {
        setError("No se pudieron cargar las reservas");
      }
    };

    cargarReservas();
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="welcome">Historial Reservas</h2>

        {error && <p className="error">{error}</p>}

        <ul className="lista-reservas">
          {reservas.map((r) => (
            <li key={r.numero}>
              <strong>Reserva #{r.numero}</strong><br />
              Cancha: {r.cancha} | Fecha: {r.fecha}<br />
              Horario: {r.horaInicio} - {r.horaFin}<br />
              Equipamiento: {r.usaEquipamiento === "si" ? "Sí" : "No"}<br />
              Detalle Equipamiento: {r.detalleEquipamiento}<br />
              Boleta: {r.boleta}<br />
              RUT Reserva: {r.rut}
            </li>
          ))}
        </ul>
      </div>
      <BottomNav isAdmin={true} />
    </>
  );
};

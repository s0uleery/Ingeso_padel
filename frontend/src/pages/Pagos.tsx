// src/pages/Pagos.tsx
import { useState } from "react";
import { buscarReservasPorPagar } from "../services/pagoService";
import BottomNav from "../components/BottomNav";
import "../styles/Pagos.css";

export const Pagos = () => {
  const [rut, setRut] = useState("");
  const [reservas, setReservas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleBuscar = async () => {
    setMensaje("");
    setError("");
    try {
      const data = await buscarReservasPorPagar(rut);
      setReservas(data);
      if (data.length === 0) {
        setMensaje("No hay reservas por pagar para este RUT.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePagar = (reservaId: number) => {
    alert(`Procesando pago para la reserva ${reservaId}`);
  };

  return (
    <>
      <div className="container">
        <h2 className="welcome">Pagos</h2>

        <div className="busqueda-rut">
          <input
            type="text"
            placeholder="Ingrese RUT del cliente"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <button onClick={handleBuscar}>Buscar</button>
        </div>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="mensaje">{mensaje}</p>}

        <ul className="lista-pagos">
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              <strong>Cancha:</strong> {reserva.cancha_id} | <strong>Fecha:</strong> {reserva.fecha} | <strong>Hora:</strong> {reserva.hora_inicio} | <strong>Monto:</strong> ${reserva.monto}
              <button onClick={() => handlePagar(reserva.id)}>Pagar</button>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav/>
    </>
  );
};
// src/components/ReservaModal.tsx
import { useState } from "react";
import "../styles/ReservaModal.css";
//import { Reserva } from "../services/bookingService";

interface Jugador {
  nombre: string;
  apellido: string;
  rut: string;
  edad: number;
}

interface ReservaModalProps {
  onClose: () => void;
  onCreateReserva?: (nuevaReserva: Omit<Reserva, "rut">) => Promise<void>; // Nueva prop
}

const maxJugadoresPorCancha: Record<string, number> = {
  "1": 4,
  "2": 4,
  "3": 4,
  "4": 2,
  "5": 2,
  "6": 4,
};

const ReservaModal = ({ onClose, onCreateReserva }: ReservaModalProps) => {
  const [paso, setPaso] = useState(1);
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [duracion, setDuracion] = useState(90);
  const [cancha, setCancha] = useState("");
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [error, setError] = useState("");

  const siguientePaso = () => {
    if (!fecha || !horaInicio || !cancha || duracion < 90 || duracion > 180) {
      setError("Debes completar todos los campos correctamente.");
      return;
    }

    const cantidadMax = maxJugadoresPorCancha[cancha];
    if (!cantidadMax) {
      setError("Cancha no válida.");
      return;
    }

    setJugadores(Array.from({ length: cantidadMax }, () => ({
      nombre: "",
      apellido: "",
      rut: "",
      edad: 0,
    })));

    setError("");
    setPaso(2);
  };

  const confirmarReserva = async () => {
    if (onCreateReserva) {
      const nuevaReserva = {
        numero: Date.now(),
        cancha: Number(cancha),
        fecha,
        horaInicio,
        horaFin: new Date(new Date(fecha + " " + horaInicio).getTime() + duracion * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        usaEquipamiento: "no" as "si" | "no",
        boleta: "",
        detalleEquipamiento: "",
      };

      await onCreateReserva(nuevaReserva);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Nueva Reserva</h2>
        {paso === 1 && (
          <form className="reserva-form">
            <div>
              <label>Fecha:</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>

            <div>
              <label>Hora de inicio:</label>
              <select value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required>
                {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
                  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
                  "18:00", "18:30", "19:00", "19:30"].map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Duración (min):</label>
              <input type="number" value={duracion} onChange={(e) => setDuracion(Number(e.target.value))} min={90} max={180} step={30} required />
            </div>

            <div>
              <label>Cancha:</label>
              <select value={cancha} onChange={(e) => setCancha(e.target.value)} required>
                <option value="">Seleccionar cancha</option>
                {Object.entries(maxJugadoresPorCancha).map(([id, cantidad]) => (
                  <option key={id} value={id}>
                    Cancha {id} (máx. {cantidad} jugadores)
                  </option>
                ))}
              </select>
            </div>

            <div className="botones-container">
              <button type="button" onClick={siguientePaso}>Siguiente</button>
              <button type="button" onClick={onClose} className="modal-close-btn">Cerrar</button>
            </div>

            {error && <p className="reserva-error">{error}</p>}
          </form>
        )}

        {paso === 2 && (
          <form className="reserva-form">
            <h3>Confirmar Reserva</h3>
            <p>Fecha: {fecha}</p>
            <p>Hora de inicio: {horaInicio}</p>
            <p>Hora de fin: {new Date(new Date(fecha + " " + horaInicio).getTime() + duracion * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            <p>Cancha: {cancha}</p>

            {error && <p className="reserva-error">{error}</p>}

            <div className="botones-container">
              <button type="button" onClick={confirmarReserva}>Confirmar Reserva</button>
              <button type="button" onClick={() => setPaso(1)}>Volver</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReservaModal;
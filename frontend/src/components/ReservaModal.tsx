// src/pages/ReservaModal.tsx

import { useState } from "react";
import "../styles/ReservaModal.css";
import { Booking, getMyBookings } from "../services/bookingService";

interface Jugador {
  nombre: string;
  apellido: string;
  rut: string;
  edad: number;
}

interface ReservaModalProps {
  onClose: () => void;
  onCreateReserva?: (nuevaReserva: Omit<Booking, "id" | "total_cost" | "finish_time">) => Promise<void>;
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

  const siguientePaso = async () => {
    setError("");

    if (!fecha || !horaInicio || !cancha || duracion < 90 || duracion > 180) {
      setError("Debes completar todos los campos correctamente.");
      return;
    }

    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diferenciaDias = (fechaSeleccionada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);

    if (diferenciaDias < 7) {
      setError("La reserva debe realizarse con al menos 7 días de anticipación.");
      return;
    }

    const cantidadMax = maxJugadoresPorCancha[cancha];
    if (!cantidadMax) {
      setError("Cancha no válida.");
      return;
    }

    // Validación de solapamiento con reservas actuales del usuario
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const rut = userInfo.rut;

    if (!rut) {
      setError("No se encontró información del usuario.");
      return;
    }

    try {
      const { bookings } = await getMyBookings(rut);
      const inicioReserva = new Date(`${fecha}T${horaInicio}`);
      const finReserva = new Date(inicioReserva.getTime() + duracion * 60000);

      const conflictiva = bookings?.some((reserva) => {
        if (reserva.date !== fecha) return false;
        const ini = new Date(`${reserva.date}T${reserva.start_time}`);
        const fin = reserva.finish_time ? new Date(`${reserva.date}T${reserva.finish_time}`) : new Date(ini.getTime() + 90 * 60000);
        return (inicioReserva < fin && finReserva > ini);
      });

      if (conflictiva) {
        setError("Ya tienes una reserva que se solapa en ese horario.");
        return;
      }

      setPaso(2);
    } catch (e) {
      setError("Error al validar disponibilidad.");
      console.error(e);
    }
  };

  const handleJugadorChange = (
    index: number,
    field: keyof Jugador,
    value: string
  ) => {
    const nuevos = [...jugadores];

    const actualizado: Jugador = {
      ...nuevos[index],
      [field]: field === "edad" ? Number(value) : value,
    };

    nuevos[index] = actualizado;
    setJugadores(nuevos);
  };


  const agregarJugador = () => {
    const cantidadMax = maxJugadoresPorCancha[cancha];
    if (jugadores.length >= cantidadMax) {
      setError("No puedes agregar más jugadores que el máximo permitido.");
      return;
    }
    setJugadores([...jugadores, { nombre: "", apellido: "", rut: "", edad: 0 }]);
    setError("");
  };

  const confirmarReserva = async () => {
    if (jugadores.length === 0) {
      setError("Debes agregar al menos un jugador.");
      return;
    }

    if (onCreateReserva) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const rut = userInfo.rut;

      const nuevaReserva: Omit<Booking, "id" | "total_cost" | "finish_time"> = {
        rut,
        date: fecha,
        start_time: horaInicio,
        court_number: Number(cancha),
      };

      try {
        await onCreateReserva(nuevaReserva);
        onClose();
      } catch (err) {
        setError("Error al crear la reserva.");
        console.error(err);
      }
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
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Hora de inicio:</label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              >
                {[...Array(24)].flatMap((_, i) => {
                  const h = 8 + Math.floor(i / 2);
                  const m = i % 2 === 0 ? "00" : "30";
                  const hora = `${h.toString().padStart(2, "0")}:${m}`;
                  return h >= 8 && h < 20 ? <option key={hora} value={hora}>{hora}</option> : [];
                })}
              </select>
            </div>

            <div>
              <label>Duración (min):</label>
              <input
                type="number"
                value={duracion}
                onChange={(e) => setDuracion(Number(e.target.value))}
                min={90}
                max={180}
                step={30}
                required
              />
            </div>

            <div>
              <label>Cancha:</label>
              <select
                value={cancha}
                onChange={(e) => setCancha(e.target.value)}
                required
              >
                <option value="">Seleccionar cancha</option>
                {Object.entries(maxJugadoresPorCancha).map(([id, cantidad]) => (
                  <option key={id} value={id}>
                    Cancha {id} (máx. {cantidad} jugadores)
                  </option>
                ))}
              </select>
            </div>

            <div className="botones-container">
              <button type="button" onClick={siguientePaso}>
                Siguiente
              </button>
              <button type="button" onClick={onClose} className="modal-close-btn">
                Cerrar
              </button>
            </div>

            {error && <p className="reserva-error">{error}</p>}
          </form>
        )}

        {paso === 2 && (
          <form className="reserva-form">
            <h3>Jugadores</h3>

            {jugadores.map((jugador, idx) => (
              <div key={idx} className="jugador-inputs">
                <input placeholder="Nombre" value={jugador.nombre} onChange={(e) => handleJugadorChange(idx, "nombre", e.target.value)} required />
                <input placeholder="Apellido" value={jugador.apellido} onChange={(e) => handleJugadorChange(idx, "apellido", e.target.value)} required />
                <input placeholder="RUT" value={jugador.rut} onChange={(e) => handleJugadorChange(idx, "rut", e.target.value)} required />
                <input type="number" placeholder="Edad" value={jugador.edad}
                  onChange={(e) => handleJugadorChange(idx, "edad", e.target.value)}required/>
              </div>
            ))}

            <button type="button" onClick={agregarJugador}>Agregar Jugador</button>

            <div className="botones-container">
              <button type="button" onClick={confirmarReserva}>
                Confirmar Reserva
              </button>
              <button type="button" onClick={() => setPaso(1)}>
                Volver
              </button>
            </div>

            {error && <p className="reserva-error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ReservaModal;
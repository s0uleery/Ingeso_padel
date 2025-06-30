// src/pages/Canchas.tsx
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/Canchas.css";
import {
  createCourt,
  deleteCourt,
  fetchCourtsByAdmin,
} from "../services/userService";

interface Court {
  id?: number;
  numero: number;
  costo: number;
  maxJugadores: number;
}

export const Canchas = () => {
  const [canchas, setCanchas] = useState<Court[]>([]);
  const [nueva, setNueva] = useState<Court>({ numero: 0, costo: 0, maxJugadores: 2 });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const rut = JSON.parse(localStorage.getItem("userInfo") || "{}").rut;

  const cargarCanchas = async () => {
    try {
      const result = await fetchCourtsByAdmin(rut);
      if (result.message) {
        setError(result.message);
      } else if (result.courts) {
        setCanchas(result.courts);
      }
    } catch (e) {
      setError("No se pudo cargar la lista de canchas");
    }
  };

  useEffect(() => {
    cargarCanchas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNueva({
      ...nueva,
      [name]: name === "numero" || name === "costo" || name === "maxJugadores" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nueva.numero || nueva.costo < 0 || ![2, 4].includes(nueva.maxJugadores)) {
      setError("Todos los campos son obligatorios y deben ser válidos");
      return;
    }

    try {
      const result = await createCourt(rut, nueva.numero, nueva.costo);
      setMensaje(result.message);
      setNueva({ numero: 0, costo: 0, maxJugadores: 2 });
      cargarCanchas();
    } catch (e) {
      setError("Error al crear la cancha");
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    setMensaje("");
    try {
      const result = await deleteCourt(rut, id);
      setMensaje(result.message);
      cargarCanchas();
    } catch (e) {
      setError("Error al eliminar la cancha");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">Canchas</h2>

        <form onSubmit={handleSubmit} className="form-canchas">
          <div className="fila-formulario">
            <label>N° de Cancha:</label>
            <input
              name="numero"
              type="number"
              min="1"
              value={nueva.numero || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fila-formulario">
            <label>Costo:</label>
            <input
              name="costo"
              type="number"
              min="0"
              value={nueva.costo || ""}
              onChange={handleChange}
              required
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="fila-formulario">
            <label>Máx. Jugadores:</label>
            <select
              name="maxJugadores"
              value={nueva.maxJugadores}
              onChange={handleChange}
              required
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <button type="submit">Añadir</button>
        </form>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="mensaje">{mensaje}</p>}

        <h3>Lista de Canchas</h3>
        <ul className="lista-canchas">
          {canchas.map((c) => (
            <li key={c.id}>
              <strong>Cancha #{c.numero}</strong> - Costo: ${c.costo} | Máx Jugadores: {c.maxJugadores}
              {" "}
              {c.id && (
                <button className="btn-eliminar" onClick={() => handleDelete(c.id!)}>
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <BottomNav isAdmin={true} />
    </>
  );
};

export default Canchas;


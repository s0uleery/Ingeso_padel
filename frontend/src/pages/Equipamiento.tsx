import { useEffect, useState } from "react";
import { addOrUpdateEquipment, Equipment, fetchEquipment } from "../services/equipmentService";
import BottomNav from "../components/BottomNav";
import "../styles/Equipamiento.css";

export const Equipamiento = () => {
  const [equipos, setEquipos] = useState<Equipment[]>([]);
  const [nuevo, setNuevo] = useState<Equipment>({ name: "", stock: 0, type: "", cost: 0 });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarEquipamiento = async () => {
    try {
      const data = await fetchEquipment();
      setEquipos(data);
    } catch (e) {
      setError("No se pudo cargar el equipamiento");
    }
  };

  useEffect(() => {
    cargarEquipamiento();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevo({ ...nuevo, [name]: name === "stock" || name === "cost" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nuevo.name || !nuevo.type || nuevo.stock <= 0 || nuevo.cost < 0) {
      setError("Todos los campos son obligatorios y deben ser válidos");
      return;
    }

    try {
      const result = await addOrUpdateEquipment(nuevo);
      setMensaje(result.message);
      setNuevo({ name: "", stock: 0, type: "", cost: 0});
      cargarEquipamiento();
    } catch (e) {
      setError("Error al guardar equipamiento");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">Equipamiento</h2>

        <form onSubmit={handleSubmit} className="form-equipamiento">
          <div className="fila-formulario">
            <label>Nombre:</label>
            <input name="name" placeholder="Nombre" value={nuevo.name} onChange={handleChange} required />
          </div>

          <div className="fila-formulario">
            <label>Stock:</label>
            <input name="stock" type="number" min="0" value={nuevo.stock} onChange={handleChange} required />
          </div>

          <div className="fila-formulario">
            <label>Tipo:</label>
            <input name="type" placeholder="Tipo" value={nuevo.type} onChange={handleChange} required />
          </div>

          <div className="fila-formulario">
            <label>Costo:</label>
            <input  name="cost" type="number" inputMode="numeric"
              value={nuevo.cost} onChange={handleChange}
              onWheel={(e) => e.currentTarget.blur()} // desactiva scroll
              required />
          </div>

          <button type="submit">Añadir / Actualizar</button>
        </form>



        {error && <p className="error">{error}</p>}
        {mensaje && <p className="mensaje">{mensaje}</p>}

        <h3>Lista de Equipamiento</h3>
        <ul className="lista-equipamiento">
          {equipos.map((e, index) => (
            <li key={index}>
              <strong>{e.name}</strong> - {e.type} | Stock: {e.stock} | Costo: ${e.cost}
            </li>
          ))}
        </ul>
      </div>

      <BottomNav isAdmin={true} />
    </>
  );
};

export default Equipamiento;
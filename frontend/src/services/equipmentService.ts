// src/services/equipmentService.ts
const API_BASE_URL = "http://localhost:3000"; // Asegúrate que coincide con tu app.use()

export interface Equipment {
  id?: number;
  name: string;
  stock: number;
  type: string;
  cost: number;
}


export const fetchEquipment = async (): Promise<Equipment[]> => {
  const response = await fetch(`${API_BASE_URL}/all`);
  if (!response.ok) {
    throw new Error("Error al obtener el equipamiento");
  }
  const result = await response.json();
  return result.data;
};

export const addOrUpdateEquipment = async (equipment: Equipment): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  });

  if (!response.ok) {
    throw new Error("Error al guardar equipamiento");
  }

  return await response.json();
};

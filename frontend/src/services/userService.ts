const API_BASE_URL = "http://localhost:3000"; // Asegúrate de que coincida con tu configuración del backend

export interface User {
  rut: string;
  password: string;
  email: string;
  name: string;
}

// Registro de nuevo usuario
export const registerUser = async (user: User): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return await response.json();
};

// Actualización de saldo
export const updateBalance = async (rut: string, balance: number): Promise<{ message: string; balance?: number }> => {
  const response = await fetch(`${API_BASE_URL}/updateBalance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, balance }),
  });

  return await response.json();
};

// Crear cancha (solo admin)
export const createCourt = async (rut: string, number: number, cost: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/createCourt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, number, cost }),
  });

  return await response.json();
};

// Obtener lista de canchas (solo admin)
export const fetchCourtsByAdmin = async (rut: string): Promise<{ message?: string; courts?: any[] }> => {
  const response = await fetch(`${API_BASE_URL}/courts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut }),
  });

  return await response.json();
};

// Eliminar cancha (solo admin)
export const deleteCourt = async (rut: string, id: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/deleteCourt`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, id }),
  });

  return await response.json();
};

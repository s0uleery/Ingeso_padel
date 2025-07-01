const API_URL = "http://localhost:3000";

type LoginResponse = {
  id: string;
  role: "admin" | "user";
  email: string;
  name: string;
};

type RoleResponse = {
  role: "admin" | "user";
};

type IsAdminResponse = {
  isAdmin: boolean;
};

const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(data.message);
};

const getUserRoleByRut = async (rut: string): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/role/${rut}`, {
    credentials: 'include'
  });

  const data: RoleResponse = await response.json();

  if (response.ok) {
    return data.role;
  }

  throw new Error(data.role);
};

const isAdmin = async (rut: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/auth/isAdmin/${rut}`, {
    credentials: 'include'
  });

  const data: IsAdminResponse = await response.json();

  if (response.ok) {
    return data.isAdmin;
  }

  throw new Error(`Error al verificar si es admin: ${data.isAdmin}`);
};

export const authService = {
  login,
  getUserRoleByRut,
  isAdmin
};

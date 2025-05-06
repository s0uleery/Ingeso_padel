// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:3000"; // Cambia esto si tu backend está en otra URL

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  role: "admin" | "socio";
  email: string;
};

export const loginRequest = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  return response.data;
};

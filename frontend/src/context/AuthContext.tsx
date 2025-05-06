// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Usuario = {
  email: string;
  role: "admin" | "socio";
};

type AuthContextType = {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    return token && role && email ? { role: role as Usuario["role"], email } : null;
  });

  const login = (usuario: Usuario, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", usuario.role);
    localStorage.setItem("email", usuario.email);
    setUsuario(usuario);
    navigate(usuario.role === "admin" ? "/admin" : "/socio");
  };

  const logout = () => {
    localStorage.clear();
    setUsuario(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: !!usuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
};

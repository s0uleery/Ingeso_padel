// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="button-container">
        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
        <button onClick={() => navigate('/register')}>Registrarse</button>
      </div>
      <div className="title-box">Padel Ucenin</div>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { Link } from 'react-router-dom';
import spiny404Image from '../assets/img/spiny404.png'; // Ajusta esta ruta según la ubicación real de tu imagen

export default function NotFound() {
  return (
    <main>
      <div className="not-found-container">
        {/* Columna de texto */}
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">¡Vaya! Página no encontrada</h2>
          <p className="not-found-text">
            Parece que Spiny y tú se han desviado del camino. La ruta que buscas no existe o fue movida en SpineAlign.
          </p>
          <Link to="/" className="not-found-btn">
            Volver al inicio
          </Link>
        </div>

        {/* Columna de la imagen de Spiny */}
        <div className="not-found-image-container">
          <img
            src={spiny404Image}
            alt="Spiny confundido buscando la página"
            className="not-found-img"
          />
        </div>
      </div>
    </main>
  );
}
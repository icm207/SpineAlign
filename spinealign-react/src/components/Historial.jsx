// src/components/Historial.jsx
import React, { useEffect, useState } from 'react';
import '../assets/css/styleevaluar.css';
import '../assets/css/historial.css';

export default function Historial() {
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const sesionActiva = localStorage.getItem('token');
    const navLoginBtn = document.getElementById('nav-login-btn');
    if (sesionActiva && navLoginBtn) {
      navLoginBtn.textContent = "Mi Cuenta";
      navLoginBtn.href = "#";
    }
  }, []);

  const verDetalle = (idPaciente) => {
    alert(`Abriendo el expediente y reporte clínico guardado para el paciente: ${idPaciente}`);
  };

  const filas = [
    { id: 'PX-2026-01', nombre: 'Carlos Mendoza', fecha: '12/03/2026', angulo: '1.4°', asi: '1.2%', estado: 'Normal / Fisiológica', badge: 'badge-normal' },
    { id: 'PX-2026-02', nombre: 'María Fernanda Gómez', fecha: '14/03/2026', angulo: '3.8°', asi: '4.5%', estado: 'Leve / Monitoreo', badge: 'badge-moderado' },
    { id: 'PX-2026-03', nombre: 'Andrés R. Torres', fecha: '18/03/2026', angulo: '7.5°', asi: '8.9%', estado: 'Severa / Prioritaria', badge: 'badge-alerta' }
  ];

  const filasFiltradas = filas.filter(f => 
    f.id.toLowerCase().includes(filtro.toLowerCase()) || 
    f.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="spine-historial-container">
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/">Inicio</a>
          <a href="/evaluar">Nueva Evaluación</a>
          <a href="/login" className="boton-login" id="nav-login-btn">Iniciar sesión</a>
        </nav>
      </header>

      <main className="historial-container">
        <div className="historial-header">
          <h2>Historial de Evaluaciones Clínicas</h2>
          <input 
            type="text" 
            id="buscador" 
            className="buscador-historial" 
            placeholder="Buscar por paciente o ID..." 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="tabla-tarjeta">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>ID / H. Clínica</th>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Ángulo Bi-Acromial</th>
                <th>Índice ASI</th>
                <th>Estado Clínico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tabla-cuerpo">
              {filasFiltradas.map((fila, index) => (
                <tr key={index}>
                  <td>{fila.id}</td>
                  <td><strong>{fila.nombre}</strong></td>
                  <td>{fila.fecha}</td>
                  <td>{fila.angulo}</td>
                  <td>{fila.asi}</td>
                  <td><span className={`badge-estado ${fila.badge}`}>{fila.estado}</span></td>
                  <td>
                    <button className="btn-accion-tabla" onClick={() => verDetalle(fila.id)}>
                      <i className="fa-solid fa-eye"></i> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer>
        <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
        <p className="copyright">© 2026 SpineAlign - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
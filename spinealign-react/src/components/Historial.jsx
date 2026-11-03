import React, { useEffect, useState } from 'react';
import '../assets/css/styleevaluar.css';
import '../assets/css/historial.css';

export default function Historial() {
  const [filtro, setFiltro] = useState('');
  const [filas, setFilas] = useState([]);

  useEffect(() => {
    const sesionActiva = localStorage.getItem('token');
    const correoUsuario = localStorage.getItem('correo'); // El correo guardado al iniciar sesión
    const navLoginBtn = document.getElementById('nav-login-btn');
    
    if (sesionActiva && navLoginBtn) {
      navLoginBtn.textContent = "Mi Cuenta";
      navLoginBtn.href = "#";
    }

    // Consultar el historial real desde el backend
    if (correoUsuario) {
      fetch(`http://localhost:3000/api/historial/${correoUsuario}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Mapear los datos de MongoDB al formato que usa tu tabla
            const datosFormateados = data.map((item, index) => {
              const anguloVal = item.anguloBiacromial || 0;
              // Lógica de ejemplo para clasificar el estado clínico según el ángulo
              let estado = 'Normal / Fisiológica';
              let badge = 'badge-normal';
              if (anguloVal > 3 && anguloVal <= 6) {
                estado = 'Leve / Monitoreo';
                badge = 'badge-moderado';
              } else if (anguloVal > 6) {
                estado = 'Severa / Prioritaria';
                badge = 'badge-alerta';
              }

              return {
                id: `PX-2026-0${index + 1}`,
                nombre: 'Paciente Registrado', // O el nombre del usuario logueado
                fecha: new Date(item.fecha).toLocaleDateString(),
                angulo: `${anguloVal}°`,
                asi: `${item.indiceAsimetria || 0}%`,
                estado: estado,
                badge: badge
              };
            });
            setFilas(datosFormateados);
          }
        })
        .catch(err => console.error('Error al cargar el historial:', err));
    }
  }, []);

  const verDetalle = (idPaciente) => {
    alert(`Abriendo el expediente y reporte clínico guardado para el paciente: ${idPaciente}`);
  };

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
              {filasFiltradas.length > 0 ? (
                filasFiltradas.map((fila, index) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No hay evaluaciones registradas en el historial todavía.
                  </td>
                </tr>
              )}
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
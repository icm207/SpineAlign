// src/components/Historial.jsx
import React, { useEffect, useState } from 'react';
import '../assets/css/styleevaluar.css';
import '../assets/css/historial.css';

export default function Historial() {
  const [filtro, setFiltro] = useState('');
  const [filas, setFilas] = useState([]);

  useEffect(() => {
    const sesionActiva = localStorage.getItem('token');
    let correoUsuario = localStorage.getItem('correo') || 
                          localStorage.getItem('email') || 
                          localStorage.getItem('usuarioCorreo') ||
                          localStorage.getItem('userEmail');

    const navLoginBtn = document.getElementById('nav-login-btn');
    
    if (sesionActiva && navLoginBtn) {
      navLoginBtn.textContent = "Mi Cuenta";
      navLoginBtn.href = "#";
    }

    if (correoUsuario) {
      fetch(`http://localhost:3000/api/historial/${correoUsuario.trim()}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const datosFormateados = data.map((item, index) => {
              const anguloVal = item.anguloBiacromial || 0;
              let estado = 'Normal / Fisiológica';
              let badge = 'badge-normal';
              if (anguloVal >= 7.0) {
                estado = 'Severa / Atención Prioritaria';
                badge = 'badge-alerta';
              } else if (anguloVal >= 4.5) {
                estado = 'Moderada / Tratamiento Recomendado';
                badge = 'badge-alerta';
              } else if (anguloVal >= 2.0) {
                estado = 'Leve / Monitoreo';
                badge = 'badge-moderado';
              }

              return {
                id: `PX-2026-0${index + 1}`,
                nombre: item.nombre || 'Paciente General',
                edad: item.edad || '--',
                sexo: item.sexo || '--',
                estatura: item.estatura || '--',
                peso: item.peso || '--',
                fecha: new Date(item.fecha).toLocaleDateString(),
                angulo: `${anguloVal}°`,
                asi: `${item.indiceAsimetria || 0}%`,
                estado: estado,
                badge: badge,
                imagenUrl: item.imagenUrl || ''
              };
            });
            setFilas(datosFormateados);
          }
        })
        .catch(err => console.error('Error al cargar el historial:', err));
    }
  }, []);

  const verDetalle = (fila) => {
    const ventanaReporte = window.open('', '_blank', 'width=850,height=800');
    ventanaReporte.document.write(`
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Reporte Clínico Postural - ${fila.id} | SpineAlign</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 15px; margin-bottom: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 13px; }
            .metricas { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .caja { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; background: #fff; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
            .badge-normal { background: #dcfce7; color: #166534; }
            .badge-moderado { background: #fef9c3; color: #854d0e; }
            .badge-alerta { background: #fee2e2; color: #991b1b; }
            .seccion-foto { text-align: center; margin-bottom: 20px; }
            .foto-contenedor { width: 100%; max-width: 400px; margin: 10px auto; border: 2px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #000; }
            .foto-contenedor img { width: 100%; height: auto; display: block; object-fit: contain; }
            .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              .no-print { display: none; }
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <header class="header">
            <h1 style="margin: 0 0 5px 0; font-size: 22px;">SpineAlign - Expediente Clínico Postural</h1>
            <p style="margin: 0; color: #64748b; font-size: 13px;">Sistema de Análisis Biomecánico Computarizado</p>
          </header>
          <main>
            <section class="info-grid">
              <div><strong>Paciente:</strong> ${fila.nombre}</div>
              <div><strong>ID Historia:</strong> ${fila.id}</div>
              <div><strong>Edad:</strong> ${fila.edad} años</div>
              <div><strong>Sexo:</strong> ${fila.sexo}</div>
              <div><strong>Estatura:</strong> ${fila.estatura}</div>
              <div><strong>Peso:</strong> ${fila.peso}</div>
              <div style="grid-column: span 2;"><strong>Fecha de Evaluación:</strong> ${fila.fecha}</div>
            </section>

            <section class="metricas">
              <div class="caja">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">Ángulo Bi-Acromial</h3>
                <p style="font-size: 20px; font-weight: bold; color: #0284c7; margin: 0;">${fila.angulo}</p>
              </div>
              <div class="caja">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">Índice ASI</h3>
                <p style="font-size: 20px; font-weight: bold; color: #0284c7; margin: 0;">${fila.asi}</p>
              </div>
            </section>

            <section style="text-align: center; margin-bottom: 20px;">
              <span class="badge ${fila.badge}">${fila.estado}</span>
            </section>

            ${fila.imagenUrl ? `
              <section class="seccion-foto">
                <h3 style="font-size: 14px; margin-bottom: 5px; color: #475569;">Análisis Postural con Puntos de Referencia</h3>
                <div class="foto-contenedor">
                  <img src="${fila.imagenUrl}" alt="Análisis postural con puntos" />
                </div>
              </section>
            ` : `
              <p style="text-align: center; color: #94a3b8; font-size: 13px;">No hay fotografía adjunta en este registro.</p>
            `}

            <div style="text-align: center;" class="no-print">
              <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 15px; cursor: pointer; font-weight: bold;">Imprimir / Guardar como PDF</button>
            </div>
          </main>
          <footer class="footer">
            <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
            <p>© 2026 SpineAlign - Todos los derechos reservados</p>
          </footer>
        </body>
      </html>
    `);
    ventanaReporte.document.close();
  };

  const filasFiltradas = filas.filter(f => 
    f.id.toLowerCase().includes(filtro.toLowerCase()) || 
    f.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="spine-historial-container">
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Logotipo oficial de SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Menú principal de navegación">
          <a href="/">Inicio</a>
          <a href="/evaluar">Nueva Evaluación</a>
          <a href="/login" className="boton-login" id="nav-login-btn">Iniciar sesión</a>
        </nav>
      </header>

      <main className="historial-container">
        <section className="historial-header">
          <h1>Historial de Evaluaciones Clínicas Posturales</h1>
          <label htmlFor="buscador-historial" className="sr-only">Buscar por paciente o ID</label>
          <input 
            type="text" 
            id="buscador-historial" 
            className="buscador-historial" 
            placeholder="Buscar por paciente o ID..." 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Campo de búsqueda de evaluaciones clínicas"
          />
        </section>

        <section className="tabla-tarjeta" aria-label="Tabla de resultados de evaluaciones">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th scope="col">ID / H. Clínica</th>
                <th scope="col">Paciente</th>
                <th scope="col">Fecha</th>
                <th scope="col">Ángulo Bi-Acromial</th>
                <th scope="col">Índice ASI</th>
                <th scope="col">Estado Clínico</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody id="tabla-cuerpo">
              {filasFiltradas.length > 0 ? (
                filasFiltradas.map((fila, index) => (
                  <tr key={index}>
                    <td>{fila.id}</td>
                    <td><strong>{fila.nombre}</strong></td>
                    <td><time dateTime={fila.fecha}>{fila.fecha}</time></td>
                    <td>{fila.angulo}</td>
                    <td>{fila.asi}</td>
                    <td><span className={`badge-estado ${fila.badge}`}>{fila.estado}</span></td>
                    <td>
                      <button 
                        className="btn-accion-tabla" 
                        onClick={() => verDetalle(fila)}
                        aria-label={`Ver detalles y reporte PDF del paciente ${fila.id}`}
                      >
                        <i className="fa-solid fa-eye" aria-hidden="true"></i> Ver
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
        </section>
      </main>

      <footer role="contentinfo">
        <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
        <p className="copyright">© 2026 SpineAlign - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
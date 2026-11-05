// src/components/MiCuenta.jsx
import React, { useEffect, useState } from 'react';
import '../assets/css/styleevaluar.css';

export default function MiCuenta() {
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    edad: '',
    correo: '',
    sexo: '',
    altura: '',
    peso: '',
    idPaciente: ''
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let correoUsuario = localStorage.getItem('correo') || 
                          localStorage.getItem('email') || 
                          localStorage.getItem('usuarioCorreo') ||
                          localStorage.getItem('userEmail');

    if (!correoUsuario) {
      alert("No hay sesión activa. Por favor, inicia sesión.");
      window.location.href = '/login';
      return;
    }

    // Cargar datos actuales del usuario desde el backend
    fetch(`http://localhost:3000/api/usuario/${correoUsuario.trim()}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setDatosUsuario({
            nombre: data.nombre || '',
            edad: data.edad || '',
            correo: data.correo || '',
            sexo: data.sexo || '',
            altura: data.altura || '',
            peso: data.peso || '',
            idPaciente: data.idPaciente || 'PX-2026-01'
          });
        }
      })
      .catch(err => console.error("Error al cargar perfil:", err));
  }, []);

  const handleChange = (e) => {
    setDatosUsuario({
      ...datosUsuario,
      [e.target.name]: e.target.value
    });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/usuario/${datosUsuario.correo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario)
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje("¡Información actualizada con éxito!");
        setEditando(false);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        alert(data.error || "Error al actualizar");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="spine-evaluar-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/">Inicio</a>
          <a href="/evaluar">Nueva Evaluación</a>
          <a href="/historial">Historial</a>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div className="tarjeta-modulo" style={{ width: '100%', maxWidth: '600px', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: 'var(--medical-900)' }}>Mi Cuenta / Perfil Clínico</h2>
            <button 
              onClick={() => setEditando(!editando)}
              style={{ background: editando ? '#64748b' : 'var(--medical-600)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {editando ? 'Cancelar' : 'Editar Datos'}
            </button>
          </div>

          {mensaje && <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>{mensaje}</div>}

          <form onSubmit={guardarCambios} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="campo-datos" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>Nombre Completo</label>
              <input 
                type="text" 
                name="nombre" 
                value={datosUsuario.nombre} 
                onChange={handleChange} 
                disabled={!editando} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: editando ? '#fff' : '#f8fafc' }} 
              />
            </div>

            <div className="campo-datos">
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>Correo Electrónico (No editable)</label>
              <input 
                type="email" 
                value={datosUsuario.correo} 
                disabled 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: '#f8fafc', color: '#94a3b8' }} 
              />
            </div>

            <div className="campo-datos">
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>ID / Historia Clínica</label>
              <input 
                type="text" 
                name="idPaciente" 
                value={datosUsuario.idPaciente} 
                onChange={handleChange} 
                disabled={!editando} 
                placeholder="Ej. PX-2026-01" 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: editando ? '#fff' : '#f8fafc' }} 
              />
            </div>

            <div className="campo-datos">
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>Edad (años)</label>
              <input 
                type="number" 
                name="edad" 
                value={datosUsuario.edad} 
                onChange={handleChange} 
                disabled={!editando} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: editando ? '#fff' : '#f8fafc' }} 
              />
            </div>

            <div className="campo-datos">
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>Sexo</label>
              <select 
                name="sexo" 
                value={datosUsuario.sexo} 
                onChange={handleChange} 
                disabled={!editando} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: editando ? '#fff' : '#f8fafc' }}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="campo-datos">
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>Estatura (cm)</label>
              <input 
                type="number" 
                name="altura" 
                value={datosUsuario.altura} 
                onChange={handleChange} 
                disabled={!editando} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: editando ? '#fff' : '#f8fafc' }} 
              />
            </div>

            <div className="campo-datos">
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>Peso (kg)</label>
              <input 
                type="number" 
                name="peso" 
                value={datosUsuario.peso} 
                onChange={handleChange} 
                disabled={!editando} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', background: editando ? '#fff' : '#f8fafc' }} 
              />
            </div>

            {editando && (
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" style={{ width: '100%', background: '#059669', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Guardar Cambios
                </button>
              </div>
            )}
          </form>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', textAlign: 'center' }}>
            <button onClick={cerrarSesion} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>© 2026 SpineAlign - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
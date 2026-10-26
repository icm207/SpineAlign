// src/components/Registro.jsx
import React, { useState } from 'react';
import '../assets/css/login.css';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre && email && edad && sexo && password) {
      alert("¡Cuenta creada exitosamente para " + nombre + "! Ahora puedes iniciar sesión.");
      window.location.href = '/login';
    } else {
      alert("Por favor, completa todos los campos del formulario.");
    }
  };

  return (
    <div className="spine-registro-page">
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/">Inicio</a>
          <a href="/login" className="boton-login" style={{backgroundColor: '#fff', color: 'rgb(67, 67, 176)', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontWeight: 700}}>Iniciar sesión</a>
        </nav>
      </header>

      <main className="auth-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div className="contenedor-login" style={{ width: '100%', maxWidth: '440px' }}>
          <h2>Crear Cuenta</h2>
          <p>Regístrate para gestionar evaluaciones y reportes clínicos</p>
          
          <form className="formulario-login" onSubmit={handleSubmit}>
            <div className="campo-formulario">
              <input type="text" placeholder="Dr. Juan Pérez" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>

            <div className="campo-formulario">
              <input type="email" placeholder="medico@spinealign.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="campo-formulario" style={{ flex: 1 }}>
                <input type="number" placeholder="Edad (30)" min="18" max="100" value={edad} onChange={e => setEdad(e.target.value)} required />
              </div>

              <div className="campo-formulario" style={{ flex: 1 }}>
                <select className="select-personalizado" value={sexo} onChange={e => setSexo(e.target.value)} required>
                  <option value="" disabled>Selecciona sexo</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="campo-formulario">
              <input type="password" placeholder="Contraseña (••••••••)" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="boton-principal">Registrarse</button>
          </form>

          <div className="texto-secundario">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </div>
      </main>

      <footer>
        <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
        <p className="copyright">© 2026 SpineAlign - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
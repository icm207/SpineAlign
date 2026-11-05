// src/components/Login.jsx
import React, { useState } from 'react';
import '../assets/css/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Petición real a tu server.js en el puerto 3000
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token y el correo reales devueltos por MongoDB
        localStorage.setItem('token', data.token);
        localStorage.setItem('correo', data.correo);
        
        alert(`¡Bienvenido de nuevo, ${data.nombre}!`);
        window.location.href = '/evaluar';
      } else {
        // Muestra el error exacto que bota el servidor (ej: contraseña incorrecta)
        alert(`Error al iniciar sesión: ${data.error || 'Credenciales inválidas'}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor backend. Asegúrate de que node server.js esté corriendo.");
    }
  };

  return (
    <div className="spine-login-page">
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/">Inicio</a>
          <a href="/evaluar">Evaluación</a>
        </nav>
      </header>

      <main className="auth-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div className="contenedor-login" style={{ width: '100%', maxWidth: '420px' }}>
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta profesional de SpineAlign</p>
          
          <form className="formulario-login" onSubmit={handleSubmit}>
            <div className="campo-formulario">
              <input 
                type="email" 
                placeholder="medico@spinealign.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="campo-formulario">
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="boton-principal">Ingresar al Sistema</button>
          </form>

          <div className="texto-secundario">
            ¿No tienes una cuenta? <a href="/registro">Regístrate aquí</a>
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
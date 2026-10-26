// src/components/Home.jsx
import React, { useEffect } from 'react';
import '../assets/css/style.css';

export default function Home() {
  useEffect(() => {
    const sesionActiva = localStorage.getItem('token');
    const navLoginBtn = document.getElementById('nav-login-btn');
    if (sesionActiva && navLoginBtn) {
      navLoginBtn.textContent = "Mi Cuenta";
      navLoginBtn.href = "#";
    }
  }, []);

  const handleContactoSubmit = (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-contacto').value;
    alert(`¡Gracias por contactarnos, ${nombre}! Tu mensaje ha sido enviado correctamente.`);
    e.target.reset();
  };

  return (
    <div className="spine-home-container">
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/" className="mensaje-bienvenida">Bienvenido a SpineAlign</a>
          <a href="/evaluar">Nueva evaluación</a>
          <a href="/historial">Historial</a>
          <a href="/login" className="boton-login" id="nav-login-btn">Iniciar sesión</a>
        </nav>
      </header>

      <main>
        <section id="bienvenida" className="contenedor">
          <h2>¿Quiénes somos?</h2>
          <p>
            Bienvenido a SpineAlign. SpineAlign es un sitio web interactivo e iniciativa biomédica enfocada en la salud y la prevención postural de manera accesible e intuitiva. Mediante la integración de la cámara del dispositivo, la plataforma aplica un método de evaluación postural basado en fotogrametría computarizada, analizando puntos anatómicos clave en tiempo real.
          </p>
          <p> 
            A través del cálculo de métricas objetivas como el Ángulo Bi-Acromial y el Índice de Asimetría Postural (ASI), SpineAlign permite a las personas identificar de forma oportuna si presentan desniveles o malos hábitos posturales.
          </p>
          <figure>
            <img src="/src/assets/img/postura.png" alt="Persona posando de espaldas" className="centrada" />
          </figure>
        </section>

        <section id="como-funciona" className="spine-funcionamiento">
          <header className="spine-funcionamiento-header">
            <h2>¿Cómo funciona SpineAlign?</h2>
            <p>Tres pasos sencillos para conocer tu postura con precisión clínica</p>
          </header>
          <ol className="spine-steps-grid">
            <li className="spine-step-card">
              <span className="numero-paso">Paso 1</span>
              <h3>Activación de Cámara</h3>
              <p>Activa la cámara de tu dispositivo o carga una fotografía de espalda para iniciar el análisis visual.</p>
            </li>
            <li className="spine-step-card">
              <span className="numero-paso">Paso 2</span>
              <h3>Posicionamiento Anatómico</h3>
              <p>Ubícate de espaldas y ajusta de forma interactiva los marcadores en C7, Manubrium y ambos acromios.</p>
            </li>
            <li className="spine-step-card">
              <span className="numero-paso">Paso 3</span>
              <h3>Diagnóstico y Reporte</h3>
              <p>Revisa en tiempo real tu Ángulo Bi-Acromial, el índice ASI y genera tu reporte clínico formal en PDF.</p>
            </li>
          </ol>
        </section>

        <section id="contacto" className="contenedor" style={{ textAlign: 'center' }}>
          <h2>Contacto</h2>
          <p>¿Tienes dudas o deseas colaborar con nosotros? Escríbenos tu nombre, correo y mensaje para más información acerca de nuestros módulos de fotogrametría.</p>
          <form id="form-contacto" className="form-contacto-box" onSubmit={handleContactoSubmit}>
            <div className="grupo-form-contacto">
              <label htmlFor="nombre-contacto">Nombre</label>
              <input type="text" id="nombre-contacto" placeholder="Tu nombre completo" required />
            </div>
            <div className="grupo-form-contacto">
              <label htmlFor="email-contacto">Correo Electrónico</label>
              <input type="email" id="email-contacto" placeholder="tucorreo@ejemplo.com" required />
            </div>
            <div className="grupo-form-contacto">
              <label htmlFor="mensaje-contacto">Duda o Petición</label>
              <textarea id="mensaje-contacto" placeholder="Escribe aquí tu mensaje o solicitud..." required></textarea>
            </div>
            <button type="submit" className="btn-enviar-form">Enviar Mensaje</button>
          </form>
        </section>
      </main>

      <footer>
        <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
        <p className="copyright">Copyright © 2026 SpineAlign - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
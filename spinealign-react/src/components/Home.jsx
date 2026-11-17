// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';

export default function Home() {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [indiceActual, setIndiceActual] = useState(0);

  // Lista con las 4 imágenes para el carrusel
  const imagenesCarrusel = [
    { src: "/postura.png", alt: "Evaluación postural de espalda" },
    { src: "/postura2.png", alt: "Análisis de puntos anatómicos" },
    { src: "/postura3.png", alt: "Reporte clínico y métricas ASI" },
    { src: "/postura4.png", alt: "Visualización de resultados en plataforma" }
  ];

  useEffect(() => {
    const sesionActiva = localStorage.getItem('token');
    if (sesionActiva) {
      setEstaLogueado(true);
    }

    // Rotación automática cada 4 segundos
    const intervalo = setInterval(() => {
      setIndiceActual((prevIndex) => (prevIndex + 1) % imagenesCarrusel.length);
    }, 4000);

    return () => clearInterval(intervalo);
  }, [imagenesCarrusel.length]);

  const irALterior = () => {
    setIndiceActual((prevIndex) => (prevIndex === 0 ? imagenesCarrusel.length - 1 : prevIndex - 1));
  };

  const irASiguiente = () => {
    setIndiceActual((prevIndex) => (prevIndex + 1) % imagenesCarrusel.length);
  };

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
          <img src="/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/" className="mensaje-bienvenida">Bienvenido a SpineAlign</a>
          <a href="/evaluar">Nueva evaluación</a>
          <a href="/historial">Historial</a>
          {estaLogueado ? (
            <a href="/mi-cuenta" className="boton-login">Mi Cuenta</a>
          ) : (
            <a href="/login" className="boton-login">Iniciar sesión</a>
          )}
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
          </p>img
          
          {/* Carrusel de 4 Imágenes Rotativo */}
          <div className="carrusel-container">
            <button className="carrusel-btn carrusel-btn-prev" onClick={irALterior}>❮</button>
            
            <div 
              className="carrusel-track" 
              style={{ transform: `translateX(-${indiceActual * 100}%)` }}
            >
              {imagenesCarrusel.map((img, index) => (
                <div className="carrusel-slide" key={index}>
                  <img src={img.src} alt={img.alt} className="carrusel-img" />
                </div>
              ))}
            </div>

            <button className="carrusel-btn carrusel-btn-next" onClick={irASiguiente}>❯</button>

            {/* Puntos indicadores */}
            <div className="carrusel-dots">
              {imagenesCarrusel.map((_, index) => (
                <button 
                  key={index} 
                  className={`carrusel-dot ${indiceActual === index ? 'active' : ''}`}
                  onClick={() => setIndiceActual(index)}
                />
              ))}
            </div>
          </div>
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

      {/* Footer Formal y Contundente */}
      <footer className="footer-spine">
        <div className="footer-container">
          
          {/* Columna 1: Información del Proyecto */}
          <div className="footer-col">
            <h3>SpineAlign</h3>
            <p>
              Plataforma web avanzada para la evaluación postural y el análisis biomecánico. Desarrollado con rigor académico por estudiantes de <strong>Ingeniería Biomédica</strong>.
            </p>
          </div>

          {/* Columna 2: Creadores y Contacto */}
          <div className="footer-col">
            <h4>Equipo de Desarrollo</h4>
            <ul className="footer-creators-list">
              <li>
                <strong>Hostin Muñoz</strong>
                <a href="mailto:hostinm@uninorte.edu.co">hostinm@uninorte.edu.co</a>
              </li>
              <li>
                <strong>Isabella Calderón</strong>
                <a href="mailto:calderonisabella@uninorte.edu.co">calderonisabella@uninorte.edu.co</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Marco Legal & Aviso Médico */}
          <div className="footer-col">
            <h4>Marco Legal</h4>
            <ul className="footer-links">
             <li><a href="/marco-legal">Términos y Condiciones de Uso</a></li>
              <li><a href="/marco-legal">Política de Privacidad y Datos</a></li>
              <li><a href="/marco-legal">Aviso de Descargo Médico</a></li>
            </ul>
          </div>

        </div>

        {/* Barra inferior de Copyright */}
        <div className="footer-bottom">
          <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
          <p>© 2026 <strong>SpineAlign</strong>. Todos los derechos reservados.</p>
          <p className="copyright">Innovación en Ingeniería Biomédica y Salud Postural.</p>
        </div>
      </footer>
    </div>
  );
}
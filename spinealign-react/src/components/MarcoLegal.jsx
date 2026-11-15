import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css';

export default function MarcoLegal() {
  return (
    <div className="spine-home-container">
      {/* Barra de navegación */}
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/" className="mensaje-bienvenida">Bienvenido a SpineAlign</a>
          <a href="/evaluar">Nueva evaluación</a>
          <a href="/historial">Historial</a>
          <a href="/login" className="boton-login">Iniciar sesión</a>
        </nav>
      </header>

      {/* Contenido principal del Marco Legal y Tratamiento de Datos */}
      <main>
        <section className="contenedor legal-container">
          <h2>Marco Legal, Términos y Tratamiento de Datos</h2>
          <p className="legal-subtitle">
            Información transparente sobre la gestión, privacidad y seguridad de la información en SpineAlign.
          </p>

          <div className="legal-content-block">
            <h3>1. Política de Privacidad y Tratamiento de Datos de Pacientes / Usuarios</h3>
            <p>
              En <strong>SpineAlign</strong> nos tomamos muy en serio la privacidad de la información. Los datos personales recolectados al registrarse (como nombre y correo electrónico) son almacenados de forma cifrada en bases de datos seguras y son utilizados exclusivamente para la gestión de su cuenta y el historial de evaluaciones posturales. Bajo ninguna circunstancia comercializamos o cedemos datos personales a terceros.
            </p>
          </div>

          <div className="legal-content-block">
            <h3>2. Tratamiento de Imágenes y Datos Biométricos</h3>
            <p>
              Las fotografías y fotogramas procesados por la cámara o cargados por el usuario para el análisis del Ángulo Bi-Acromial y el Índice de Asimetría Postural (ASI):
            </p>
            <p style={{ marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--medical-600)' }}>
              • Se utilizan exclusivamente para el cálculo biomecánico en tiempo real.<br />
              • No son utilizados para entrenar modelos de inteligencia artificial públicos ni se almacenan de forma expuesta.<br />
              • El usuario conserva el derecho absoluto sobre sus registros visuales, pudiendo solicitar la eliminación de su historial y datos asociados en cualquier momento desde la plataforma.
            </p>
          </div>

          <div className="legal-content-block">
            <h3>3. Términos y Condiciones de Uso</h3>
            <p>
              El acceso y uso de SpineAlign implica la aceptación de estos términos. La plataforma está diseñada para proporcionar evaluaciones posturales orientadas a la prevención y la ergonomía personal. Quedará prohibido el uso indebido del sistema, intentos de vulneración de seguridad o la suplantación de identidad mediante cuentas no autorizadas.
            </p>
          </div>

          <div className="legal-content-block">
            <h3>4. Aviso de Descargo Médico (Disclaimer)</h3>
            <p>
              SpineAlign es una herramienta tecnológica de apoyo preventivo y académico desarrollada por estudiantes de Ingeniería Biomédica. <strong>Este software no emite diagnósticos médicos oficiales</strong> ni sustituye el criterio, valoración o consulta presencial con un profesional de la salud certificado (médico fisiatra, ortopedista o fisioterapeuta). Ante cualquier molestia o condición clínica, acuda siempre a un especialista.
            </p>
          </div>

          <div className="legal-actions">
            <Link to="/" className="not-found-btn">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>

      {/* Footer unificado */}
      <footer className="footer-spine">
        <div className="footer-container">
          <div className="footer-col">
            <h3>SpineAlign</h3>
            <p>
              Plataforma web avanzada para la evaluación postural y el análisis biomecánico. Desarrollado con rigor académico por estudiantes de <strong>Ingeniería Biomédica</strong> de la Universidad del Norte.
            </p>
          </div>
          <div className="footer-col">
            <h4>Equipo de Desarrollo</h4>
            <ul className="footer-creators-list">
              <li>
                <strong>Hostin Muñoz</strong>
                <a href="mailto:hymunoz@uninorte.edu.co">hymunoz@uninorte.edu.co</a>
              </li>
              <li>
                <strong>Isabella Calderón</strong>
                <a href="mailto:icalderon@uninorte.edu.co">icalderon@uninorte.edu.co</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Marco Legal</h4>
            <ul className="footer-links">
              <li><a href="/marco-legal">Términos, Privacidad y Datos</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
          <p>© 2026 <strong>SpineAlign</strong>. Todos los derechos reservados.</p>
          <p className="copyright">Innovación en Ingeniería Biomédica y Salud Postural.</p>
        </div>
      </footer>
    </div>
  );
}
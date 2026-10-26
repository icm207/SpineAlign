import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

/* ==========================================
   1. COMPONENTE: PÁGINA DE INICIO (index.html)
   ========================================== */
function Home() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleContacto = (e) => {
    e.preventDefault();
    alert(`¡Gracias por contactarnos, ${nombre}! Tu mensaje ha sido enviado correctamente.`);
    setNombre('');
    setEmail('');
    setMensaje('');
  };

  return (
    <main>
      {/* Sección Quiénes Somos */}
      <section id="bienvenida" className="contenedor" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2>¿Quiénes somos?</h2>
        <p style={{ color: '#475569', lineHeight: '1.6' }}>
          Bienvenido a SpineAlign. SpineAlign es un sitio web interactivo e iniciativa biomédica enfocada en la salud y la prevención postural de manera accesible e intuitiva. Mediante la integración de la cámara del dispositivo, la plataforma aplica un método de evaluación postural basado en fotogrametría computarizada, analizando puntos anatómicos clave en tiempo real.
        </p>
        <p style={{ color: '#475569', lineHeight: '1.6' }}> 
          A través del cálculo de métricas objetivas como el Ángulo Bi-Acromial y el Índice de Asimetría Postural (ASI), SpineAlign permite a las personas identificar de forma oportuna si presentan desniveles o malos hábitos posturales. Su propósito no es reemplazar el diagnóstico médico profesional, sino servir como un punto de orientación preventiva para que los usuarios reconozcan su estado postural y, de ser necesario, acudan a una consulta con un especialista de la salud.
        </p>
        <figure style={{ margin: '2rem 0' }}>
          <img src="/assets/img/postura.png" alt="Persona posando de espaldas" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
        </figure>
      </section>

      {/* Sección ¿Cómo funciona? */}
      <section id="como-funciona" className="spine-funcionamiento" style={{ padding: '4rem 2rem', backgroundColor: '#f1f5f9', textAlign: 'center' }}>
        <div className="spine-funcionamiento-header">
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>¿Cómo funciona SpineAlign?</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2.5rem' }}>Tres pasos sencillos para conocer tu postura con precisión clínica</p>
        </div>
      
        <ol className="spine-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto', listStyle: 'none', padding: 0 }}>
          <li className="spine-step-card" style={{ background: '#ffffff', padding: '2rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            <span className="numero-paso" style={{ display: 'inline-block', backgroundColor: 'rgba(67, 67, 176, 0.1)', color: 'rgb(67, 67, 176)', fontWeight: 700, fontSize: '0.9rem', padding: '0.3rem 0.8rem', borderRadius: '20px', marginBottom: '1rem' }}>Paso 1</span>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.75rem' }}>Activación de Cámara</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Activa la cámara de tu dispositivo o carga una fotografía de espalda para iniciar el análisis visual.</p>
          </li>
          <li className="spine-step-card" style={{ background: '#ffffff', padding: '2rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            <span className="numero-paso" style={{ display: 'inline-block', backgroundColor: 'rgba(67, 67, 176, 0.1)', color: 'rgb(67, 67, 176)', fontWeight: 700, fontSize: '0.9rem', padding: '0.3rem 0.8rem', borderRadius: '20px', marginBottom: '1rem' }}>Paso 2</span>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.75rem' }}>Posicionamiento Anatómico</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Ubícate de espaldas y ajusta de forma interactiva los marcadores en C7, Manubrium y ambos acromios.</p>
          </li>
          <li className="spine-step-card" style={{ background: '#ffffff', padding: '2rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            <span className="numero-paso" style={{ display: 'inline-block', backgroundColor: 'rgba(67, 67, 176, 0.1)', color: 'rgb(67, 67, 176)', fontWeight: 700, fontSize: '0.9rem', padding: '0.3rem 0.8rem', borderRadius: '20px', marginBottom: '1rem' }}>Paso 3</span>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.75rem' }}>Diagnóstico y Reporte</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Revisa en tiempo real tu Ángulo Bi-Acromial, el índice ASI y genera tu reporte clínico formal en PDF.</p>
          </li>
        </ol>
      </section>

      {/* Sección Contacto */}
      <section id="contacto" className="contenedor" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h2>Contacto</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>¿Tienes dudas o deseas colaborar con nosotros? Escríbenos tu nombre, correo y mensaje para más información acerca de nuestros módulos de fotogrametría.</p>
        
        <form onSubmit={handleContacto} className="form-contacto-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
          <div className="grupo-form-contacto">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div className="grupo-form-contacto">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div className="grupo-form-contacto">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Duda o Petición</label>
            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe aquí tu mensaje o solicitud..." required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px' }}></textarea>
          </div>

          <button type="submit" style={{ backgroundColor: 'rgb(67, 67, 176)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Enviar Mensaje</button>
        </form>
      </section>
    </main>
  );
}

/* ==========================================
   2. COMPONENTE: EVALUACIÓN INTERACTIVA (evaluar.html)
   ========================================== */
function Evaluar() {
  const navigate = useNavigate();
  const [nombrePaciente, setNombrePaciente] = useState('Paciente General');
  const [idPaciente, setIdPaciente] = useState('PX-2026-01');
  const [imagenSrc, setImagenSrc] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isEvaluacionLista, setIsEvaluacionLista] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const contenedorVisorRef = useRef(null);

  // Estados de métricas
  const [angulo, setAngulo] = useState('0.0°');
  const [desnivel, setDesnivel] = useState('0.0 mm');
  const [asi, setAsi] = useState('0.0%');
  const [estadoClinico, setEstadoClinico] = useState('Esperando imagen');
  const [estadoClase, setEstadoClase] = useState('badge-normal');

  // Puntos interactivos (coordenadas relativas en píxeles)
  const [puntos, setPuntos] = useState({
    c7: { x: 300, y: 150 },
    manubrio: { x: 300, y: 250 },
    la: { x: 200, y: 180 },
    ra: { x: 400, y: 180 }
  });

  const [arrastrando, setArrastrando] = useState(null);

  // Activar Cámara
  const activarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsWebcamActive(true);
      setImagenSrc(null);
      setIsEvaluacionLista(false);
    } catch (err) {
      alert("No se pudo acceder a la cámara.");
    }
  };

  // Capturar Foto de Cámara
  const capturarFoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsWebcamActive(false);
    setImagenSrc(canvas.toDataURL('image/png'));
    setIsEvaluacionLista(true);
  };

  // Cargar Archivo Local
  const handleArchivoSubido = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      setIsWebcamActive(false);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagenSrc(event.target.result);
      setIsEvaluacionLista(true);
    };
    reader.readAsDataURL(file);
  };

  // Reiniciar
  const resetGeneral = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsWebcamActive(false);
    setImagenSrc(null);
    setIsEvaluacionLista(false);
    setAngulo('0.0°');
    setDesnivel('0.0 mm');
    setAsi('0.0%');
    setEstadoClinico('Esperando imagen');
  };

  // Calcular métricas al mover puntos
  useEffect(() => {
    if (!isEvaluacionLista) return;

    const dx = puntos.ra.x - puntos.la.x;
    const dy = puntos.ra.y - puntos.la.y;
    const rad = Math.atan2(dy, dx);
    const gradosVal = Math.abs(rad * (180 / Math.PI));
    const desnivelVal = Math.abs(dy) * 0.85;
    const distanciaTotal = Math.sqrt(dx * dx + dy * dy);
    const asiVal = distanciaTotal > 0 ? (Math.abs(dy) / distanciaTotal) * 100 : 0;

    setAngulo(`${gradosVal.toFixed(1)}°`);
    setDesnivel(`${desnivelVal.toFixed(1)} mm`);
    setAsi(`${asiVal.toFixed(1)}%`);

    if (gradosVal >= 7.0) {
      setEstadoClinico("Severa / Atención Prioritaria");
      setEstadoClase("badge-alerta");
    } else if (gradosVal >= 4.5) {
      setEstadoClinico("Moderada / Tratamiento Recomendado");
      setEstadoClase("badge-alerta");
    } else if (gradosVal >= 2.0) {
      setEstadoClinico("Leve / Monitoreo");
      setEstadoClase("badge-moderado");
    } else {
      setEstadoClinico("Normal / Fisiológica");
      setEstadoClase("badge-normal");
    }
  }, [puntos, isEvaluacionLista]);

  // Manejo de arrastre de puntos
  const iniciarArrastre = (puntoKey) => (e) => {
    setArrastrando(puntoKey);
    e.preventDefault();
  };

  const manejarMovimiento = (e) => {
    if (!arrastrando || !contenedorVisorRef.current) return;
    const rect = contenedorVisorRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(15, Math.min(rect.width - 15, x));
    y = Math.max(15, Math.min(rect.height - 15, y));

    setPuntos(prev => ({
      ...prev,
      [arrastrando]: { x, y }
    }));
  };

  const detenerArrastre = () => {
    setArrastrando(null);
  };

  const handlePdfClick = () => {
    const sesionActiva = localStorage.getItem('token');
    if (!sesionActiva) {
      alert("Debe iniciar sesión para generar y descargar el reporte clínico en PDF.");
      navigate('/login');
    } else {
      window.print();
    }
  };

  return (
    <main className="evaluacion-layout" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Panel Izquierdo */}
      <section className="panel-izquierdo" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="tarjeta-modulo" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2>Nueva Evaluación</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 1.25rem 0' }}>Usa la cámara o sube una foto, luego arrastra libremente C7, el Manubrium y los hombros.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!isWebcamActive && !isEvaluacionLista && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={activarCamara} style={{ flex: 1, padding: '0.75rem', background: 'rgb(67, 67, 176)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}><i className="fa-solid fa-camera"></i> Activar Cámara</button>
                <label style={{ flex: 1, backgroundColor: '#ffffff', color: 'rgb(67, 67, 176)', border: '1px solid rgb(67, 67, 176)', textAlign: 'center', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-cloud-arrow-up"></i> Subir Archivo
                  <input type="file" accept="image/*" onChange={handleArchivoSubido} style={{ display: 'none' }} />
                </label>
              </div>
            )}

            {isWebcamActive && (
              <button type="button" onClick={capturarFoto} style={{ width: '100%', padding: '0.75rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}><i className="fa-solid fa-circle-dot"></i> Capturar Foto</button>
            )}

            {isEvaluacionLista && (
              <button type="button" onClick={resetGeneral} style={{ width: '100%', padding: '0.75rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}><i className="fa-solid fa-rotate-right"></i> Cambiar / Repetir Foto</button>
            )}
          </div>
        </div>

        {/* Datos Fisiológicos */}
        <div className="tarjeta-modulo" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>Datos Fisiológicos</h3>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Nombre</label>
            <input type="text" value={nombrePaciente} onChange={(e) => setNombrePaciente(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>ID / H. Clínica</label>
            <input type="text" value={idPaciente} onChange={(e) => setIdPaciente(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Métricas */}
        <div className="tarjeta-modulo" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Métricas</h3>
            <span className={estadoClase} style={{ padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{estadoClinico}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Ángulo Bi-Acromial</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{angulo}</span>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Desnivel Vertical</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{desnivel}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span>Índice de Asimetría (ASI)</span>
              <span style={{ fontWeight: 700 }}>{asi}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: asi, height: '100%', background: 'rgb(67, 67, 176)', transition: 'width 0.2s' }}></div>
            </div>
          </div>

          <button onClick={handlePdfClick} disabled={!isEvaluacionLista} style={{ width: '100%', padding: '0.75rem', background: isEvaluacionLista ? 'rgb(67, 67, 176)' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isEvaluacionLista ? 'pointer' : 'not-allowed' }}>
            <i className="fa-solid fa-file-pdf"></i> Generar Reporte PDF
          </button>
        </div>
      </section>

      {/* Panel Derecho: Visor */}
      <section className="panel-derecho">
        <div 
          ref={contenedorVisorRef}
          onMouseMove={manejarMovimiento}
          onMouseUp={detenerArrastre}
          style={{ position: 'relative', width: '100%', height: '600px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #cbd5e1' }}
        >
          {!isWebcamActive && !imagenSrc && (
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <i className="fa-solid fa-camera-retro" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <p>Activa la cámara o sube una fotografía para iniciar el análisis</p>
            </div>
          )}

          <video ref={videoRef} autoPlay playsinline style={{ display: isWebcamActive ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'cover' }}></video>
          {imagenSrc && <img src={imagenSrc} alt="Analisis" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />}

          {/* SVG para líneas */}
          {isEvaluacionLista && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <line x1={puntos.la.x} y1={puntos.la.y} x2={puntos.ra.x} y2={puntos.ra.y} stroke="#ef4444" strokeWidth="2" strokeDasharray="6,6" />
              <line x1={puntos.c7.x} y1={puntos.c7.y} x2={puntos.manubrio.x} y2={puntos.manubrio.y} stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,6" />
            </svg>
          )}

          {/* Puntos de control interactivos */}
          {isEvaluacionLista && (
            <>
              <div onMouseDown={iniciarArrastre('c7')} style={{ position: 'absolute', left: `${puntos.c7.x}px`, top: `${puntos.c7.y}px`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: 'rgb(67, 67, 176)', border: '2px solid #fff', borderRadius: '50%', cursor: 'grab' }} title="C7">
                <span style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '1px 6px', fontSize: '10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>C7 Vértebra</span>
              </div>
              <div onMouseDown={iniciarArrastre('manubrio')} style={{ position: 'absolute', left: `${puntos.manubrio.x}px`, top: `${puntos.manubrio.y}px`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#a855f7', border: '2px solid #fff', borderRadius: '50%', cursor: 'grab' }} title="Manubrium">
                <span style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '1px 6px', fontSize: '10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>Manubrium</span>
              </div>
              <div onMouseDown={iniciarArrastre('la')} style={{ position: 'absolute', left: `${puntos.la.x}px`, top: `${puntos.la.y}px`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#ef4444', border: '2px solid #fff', borderRadius: '50%', cursor: 'grab' }} title="L-Acromion">
                <span style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '1px 6px', fontSize: '10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>L-Acromion</span>
              </div>
              <div onMouseDown={iniciarArrastre('ra')} style={{ position: 'absolute', left: `${puntos.ra.x}px`, top: `${puntos.ra.y}px`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#ef4444', border: '2px solid #fff', borderRadius: '50%', cursor: 'grab' }} title="R-Acromion">
                <span style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '1px 6px', fontSize: '10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>R-Acromion</span>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

/* ==========================================
   3. COMPONENTE: HISTORIAL CLÍNICO (historial.html)
   ========================================== */
function Historial() {
  const [busqueda, setBusqueda] = useState('');
  
  const pacientes = [
    { id: 'PX-2026-01', nombre: 'Carlos Mendoza', fecha: '12/03/2026', angulo: '1.4°', asi: '1.2%', estado: 'Normal / Fisiológica', claseBadge: 'badge-normal' },
    { id: 'PX-2026-02', nombre: 'María Fernanda Gómez', fecha: '14/03/2026', angulo: '3.8°', asi: '4.5%', estado: 'Leve / Monitoreo', claseBadge: 'badge-moderado' },
    { id: 'PX-2026-03', nombre: 'Andrés R. Torres', fecha: '18/03/2026', angulo: '7.5°', asi: '8.9%', estado: 'Severa / Prioritaria', claseBadge: 'badge-alerta' },
  ];

  const pacientesFiltrados = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1.5rem', width: '100%', boxSizing: 'border-box', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Historial de Evaluaciones Clínicas</h2>
        <input 
          type="text" 
          placeholder="Buscar por paciente o ID..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
          style={{ padding: '0.65rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', width: '280px', outline: 'none' }}
        />
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', color: '#334155' }}>
              <th style={{ padding: '1rem 1.25rem' }}>ID / H. Clínica</th>
              <th style={{ padding: '1rem 1.25rem' }}>Paciente</th>
              <th style={{ padding: '1rem 1.25rem' }}>Fecha</th>
              <th style={{ padding: '1rem 1.25rem' }}>Ángulo Bi-Acromial</th>
              <th style={{ padding: '1rem 1.25rem' }}>Índice ASI</th>
              <th style={{ padding: '1rem 1.25rem' }}>Estado Clínico</th>
              <th style={{ padding: '1rem 1.25rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.25rem' }}>{p.id}</td>
                <td style={{ padding: '1rem 1.25rem' }}><strong>{p.nombre}</strong></td>
                <td style={{ padding: '1rem 1.25rem' }}>{p.fecha}</td>
                <td style={{ padding: '1rem 1.25rem' }}>{p.angulo}</td>
                <td style={{ padding: '1rem 1.25rem' }}>{p.asi}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: p.claseBadge === 'badge-normal' ? '#dcfce7' : p.claseBadge === 'badge-moderado' ? '#fef9c3' : '#fee2e2', color: p.claseBadge === 'badge-normal' ? '#166534' : p.claseBadge === 'badge-moderado' ? '#854d0e' : '#991b1b' }}>
                    {p.estado}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <button onClick={() => alert(`Abriendo expediente para ${p.id}`)} style={{ background: 'none', border: 'none', color: 'rgb(67, 67, 176)', cursor: 'pointer', fontWeight: 600 }}>
                    <i className="fa-solid fa-eye"></i> Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ==========================================
   4. COMPONENTE: LOGIN (login.html)
   ========================================== */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('token', 'fake-jwt-token-valido-2026');
      alert("¡Inicio de sesión exitoso! Bienvenido, " + email);
      navigate('/evaluar');
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Iniciar Sesión</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Accede a tu cuenta profesional de SpineAlign</p>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="medico@spinealign.com" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: 'rgb(67, 67, 176)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Ingresar al Sistema</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          ¿No tienes una cuenta? <Link to="/registro" style={{ color: 'rgb(67, 67, 176)', fontWeight: 600, textDecoration: 'none' }}>Regístrate aquí</Link>
        </div>
      </div>
    </main>
  );
}

/* ==========================================
   5. COMPONENTE: REGISTRO (registro.html)
   ========================================== */
function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistro = (e) => {
    e.preventDefault();
    if (nombre && email && edad && sexo && password) {
      alert("¡Cuenta creada exitosamente para " + nombre + "! Ahora puedes iniciar sesión.");
      navigate('/login');
    } else {
      alert("Por favor, completa todos los campos del formulario.");
    }
  };

  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '440px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Crear Cuenta</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Regístrate para gestionar evaluaciones y reportes clínicos</p>
        
        <form onSubmit={handleRegistro}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Nombre Completo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Dr. Juan Pérez" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="medico@spinealign.com" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Edad</label>
              <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="30" min="18" max="100" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Sexo</label>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#fff' }}>
                <option value="" disabled>Selecciona</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: 'rgb(67, 67, 176)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Registrarse</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'rgb(67, 67, 176)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión aquí</Link>
        </div>
      </div>
    </main>
  );
}

/* ==========================================
   6. CONTENEDOR PRINCIPAL Y ENRUTADOR (App)
   ========================================== */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Barra de Navegación Global */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <Link to="/">
            <img src="/assets/img/iotipo-.png" alt="Isotipo SpineAlign" style={{ height: '40px' }} />
          </Link>
          
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Inicio</Link>
            <Link to="/evaluar" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Nueva Evaluación</Link>
            <Link to="/historial" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Historial</Link>
            <Link to="/login" style={{ textDecoration: 'none', color: '#fff', background: 'rgb(67, 67, 176)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>
              {isLoggedIn ? 'Mi Cuenta' : 'Iniciar sesión'}
            </Link>
          </nav>
        </header>

        {/* Rutas de la Aplicación */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evaluar" element={<Evaluar />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>

        {/* Footer Global */}
        <footer style={{ textAlign: 'center', padding: '1.5rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
          <p style={{ margin: '0 0 0.25rem 0' }}>
            <strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.
          </p>
          <p style={{ margin: 0 }}>© 2026 SpineAlign - Todos los derechos reservados</p>
        </footer>

      </div>
    </Router>
  );
}

export default App;
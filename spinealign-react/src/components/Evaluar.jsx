// src/components/Evaluar.jsx
import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/styleevaluar.css';

export default function Evaluar() {
  const [streamCamara, setStreamCamara] = useState(null);
  const [imagenCargada, setImagenCargada] = useState(false);
  
  const videoWebcamRef = useRef(null);
  const imagenAnalisisRef = useRef(null);
  const placeholderVisorRef = useRef(null);
  const contenedorVisorRef = useRef(null);
  
  const puntoC7Ref = useRef(null);
  const puntoManubrioRef = useRef(null);
  const puntoLARef = useRef(null);
  const puntoRARef = useRef(null);
  const svgConexionRef = useRef(null);
  
  const lineaHombrosRef = useRef(null);
  const lineaEjeVerticalRef = useRef(null);
  const refVerticalIdealRef = useRef(null);
  const refHorizontalIdealRef = useRef(null);
  
  const btnPdfRef = useRef(null);
  const navLoginBtnRef = useRef(null);

  const [grupoInicialDisplay, setGrupoInicialDisplay] = useState('flex');
  const [grupoCamaraDisplay, setGrupoCamaraDisplay] = useState('none');
  const [grupoRevisionDisplay, setGrupoRevisionDisplay] = useState('none');
  const [grupoResetDisplay, setGrupoResetDisplay] = useState('none');

  const [angVal, setAngVal] = useState("0.0°");
  const [desnivelVal, setDesnivelVal] = useState("0.0 mm");
  const [asiVal, setAsiVal] = useState("0.0%");
  const [asiFill, setAsiFill] = useState("0%");
  const [badgeText, setBadgeText] = useState("Esperando imagen");
  const [badgeClass, setBadgeClass] = useState("badge-normal");
  const [pdfDisabled, setPdfDisabled] = useState(true);

  useEffect(() => {
    const sesionActiva = localStorage.getItem('token');
    if (sesionActiva && navLoginBtnRef.current) {
      navLoginBtnRef.current.textContent = "Mi Cuenta";
      navLoginBtnRef.current.href = "#";
    }
  }, []);

  const handlePdfClick = () => {
    const sesionActiva = localStorage.getItem('token');
    if (!sesionActiva) {
      alert("Debe iniciar sesión para generar y descargar el reporte clínico en PDF.");
      window.location.href = '/login';
    } else {
      window.print();
    }
  };

  const activarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStreamCamara(stream);
      if (videoWebcamRef.current) {
        videoWebcamRef.current.srcObject = stream;
        videoWebcamRef.current.style.display = 'block';
      }
      if (imagenAnalisisRef.current) imagenAnalisisRef.current.style.display = 'none';
      if (placeholderVisorRef.current) placeholderVisorRef.current.style.display = 'none';

      setGrupoInicialDisplay('none');
      setGrupoCamaraDisplay('block');
      setGrupoRevisionDisplay('none');
      setGrupoResetDisplay('none');
      ocultarPuntosInteractivos();
    } catch (err) {
      alert("No se pudo acceder a la cámara.");
    }
  };

  const capturarFoto = () => {
    if (!streamCamara || !videoWebcamRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoWebcamRef.current.videoWidth || 640;
    canvas.height = videoWebcamRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoWebcamRef.current, 0, 0, canvas.width, canvas.height);

    streamCamara.getTracks().forEach(track => track.stop());
    setStreamCamara(null);

    if (imagenAnalisisRef.current) {
      imagenAnalisisRef.current.src = canvas.toDataURL('image/png');
      imagenAnalisisRef.current.style.display = 'block';
    }
    if (videoWebcamRef.current) videoWebcamRef.current.style.display = 'none';

    setGrupoCamaraDisplay('none');
    setGrupoRevisionDisplay('flex');
  };

  const usarFoto = () => {
    setGrupoRevisionDisplay('none');
    setGrupoResetDisplay('block');
    setImagenCargada(true);
    inicializarPosicionesPuntos();
  };

  const repetirCamara = async () => {
    await activarCamara();
    setGrupoRevisionDisplay('none');
    setGrupoCamaraDisplay('block');
  };

  const subirArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (streamCamara) {
      streamCamara.getTracks().forEach(track => track.stop());
      setStreamCamara(null);
    }

    const lector = new FileReader();
    lector.onload = function(event) {
      if (imagenAnalisisRef.current) {
        imagenAnalisisRef.current.src = event.target.result;
        imagenAnalisisRef.current.style.display = 'block';
      }
      if (videoWebcamRef.current) videoWebcamRef.current.style.display = 'none';
      if (placeholderVisorRef.current) placeholderVisorRef.current.style.display = 'none';

      setGrupoInicialDisplay('none');
      setGrupoCamaraDisplay('none');
      setGrupoRevisionDisplay('none');
      setGrupoResetDisplay('block');

      setImagenCargada(true);
      inicializarPosicionesPuntos();
    };
    lector.readAsDataURL(archivo);
  };

  const resetGeneral = () => {
    if (streamCamara) {
      streamCamara.getTracks().forEach(track => track.stop());
      setStreamCamara(null);
    }
    if (imagenAnalisisRef.current) imagenAnalisisRef.current.style.display = 'none';
    if (videoWebcamRef.current) videoWebcamRef.current.style.display = 'none';
    if (placeholderVisorRef.current) placeholderVisorRef.current.style.display = 'block';

    setGrupoResetDisplay('none');
    setGrupoInicialDisplay('flex');
    ocultarPuntosInteractivos();
    reiniciarMetricas();
  };

  const ocultarPuntosInteractivos = () => {
    setImagenCargada(false);
    if (puntoC7Ref.current) puntoC7Ref.current.style.display = 'none';
    if (puntoManubrioRef.current) puntoManubrioRef.current.style.display = 'none';
    if (puntoLARef.current) puntoLARef.current.style.display = 'none';
    if (puntoRARef.current) puntoRARef.current.style.display = 'none';
    if (svgConexionRef.current) svgConexionRef.current.style.display = 'none';
  };

  const reiniciarMetricas = () => {
    setAngVal("0.0°");
    setDesnivelVal("0.0 mm");
    setAsiVal("0.0%");
    setAsiFill("0%");
    setBadgeText("Esperando imagen");
    setBadgeClass("badge-normal");
    setPdfDisabled(true);
  };

  const inicializarPosicionesPuntos = () => {
    if (!contenedorVisorRef.current) return;
    const rect = contenedorVisorRef.current.getBoundingClientRect();
    const w = rect.width > 0 ? rect.width : 600;
    const h = rect.height > 0 ? rect.height : 600;
    const cx = w / 2;
    const cy = h / 2;

    posicionarElemento(puntoC7Ref.current, cx, cy - 60);
    posicionarElemento(puntoManubrioRef.current, cx, cy + 60);
    posicionarElemento(puntoLARef.current, cx - 100, cy + 10);
    posicionarElemento(puntoRARef.current, cx + 100, cy + 10);

    if (puntoC7Ref.current) puntoC7Ref.current.style.display = 'flex';
    if (puntoManubrioRef.current) puntoManubrioRef.current.style.display = 'flex';
    if (puntoLARef.current) puntoLARef.current.style.display = 'flex';
    if (puntoRARef.current) puntoRARef.current.style.display = 'flex';
    if (svgConexionRef.current) svgConexionRef.current.style.display = 'block';

    setPdfDisabled(false);
    actualizarCalculosBiomecanicos();
  };

  const posicionarElemento = (el, x, y) => {
    if (el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  };

  const obtenerCentro = (el) => {
    if (!contenedorVisorRef.current || !el) return { x: 0, y: 0 };
    const parentRect = contenedorVisorRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top + rect.height / 2
    };
  };

  const actualizarCalculosBiomecanicos = () => {
    if (!puntoLARef.current || !puntoRARef.current || !puntoC7Ref.current || !puntoManubrioRef.current || !contenedorVisorRef.current) return;

    const posLA = obtenerCentro(puntoLARef.current);
    const posRA = obtenerCentro(puntoRARef.current);
    const posC7 = obtenerCentro(puntoC7Ref.current);
    const posManubrio = obtenerCentro(puntoManubrioRef.current);

    if (lineaHombrosRef.current) {
      lineaHombrosRef.current.setAttribute('x1', posLA.x);
      lineaHombrosRef.current.setAttribute('y1', posLA.y);
      lineaHombrosRef.current.setAttribute('x2', posRA.x);
      lineaHombrosRef.current.setAttribute('y2', posRA.y);
    }

    if (lineaEjeVerticalRef.current) {
      lineaEjeVerticalRef.current.setAttribute('x1', posC7.x);
      lineaEjeVerticalRef.current.setAttribute('y1', posC7.y);
      lineaEjeVerticalRef.current.setAttribute('x2', posManubrio.x);
      lineaEjeVerticalRef.current.setAttribute('y2', posManubrio.y);
    }

    const rectVisor = contenedorVisorRef.current.getBoundingClientRect();
    const anchoV = rectVisor.width > 0 ? rectVisor.width : 600;
    const altoV = rectVisor.height > 0 ? rectVisor.height : 600;

    if (refVerticalIdealRef.current) {
      refVerticalIdealRef.current.setAttribute('x1', posC7.x);
      refVerticalIdealRef.current.setAttribute('y1', 0);
      refVerticalIdealRef.current.setAttribute('x2', posC7.x);
      refVerticalIdealRef.current.setAttribute('y2', altoV);
    }

    const centerY = (posLA.y + posRA.y) / 2;
    if (refHorizontalIdealRef.current) {
      refHorizontalIdealRef.current.setAttribute('x1', 0);
      refHorizontalIdealRef.current.setAttribute('y1', centerY);
      refHorizontalIdealRef.current.setAttribute('x2', anchoV);
      refHorizontalIdealRef.current.setAttribute('y2', centerY);
    }

    const dx = posRA.x - posLA.x;
    const dy = posRA.y - posLA.y;
    const rad = Math.atan2(dy, dx);
    const grados = Math.abs(rad * (180 / Math.PI));
    const desnivelMm = Math.abs(dy) * 0.85;
    const distanciaTotalPx = Math.sqrt(dx * dx + dy * dy);
    const asiPorcentaje = distanciaTotalPx > 0 ? (Math.abs(dy) / distanciaTotalPx) * 100 : 0;

    setAngVal(`${grados.toFixed(1)}°`);
    setDesnivelVal(`${desnivelMm.toFixed(1)} mm`);
    setAsiVal(`${asiPorcentaje.toFixed(1)}%`);
    setAsiFill(`${Math.min(100, asiPorcentaje)}%`);

    if (grados >= 7.0) {
      setBadgeText("Severa / Atención Prioritaria");
      setBadgeClass("badge-alerta");
    } else if (grados >= 4.5) {
      setBadgeText("Moderada / Tratamiento Recomendado");
      setBadgeClass("badge-alerta");
    } else if (grados >= 2.0) {
      setBadgeText("Leve / Monitoreo");
      setBadgeClass("badge-moderado");
    } else {
      setBadgeText("Normal / Fisiológica");
      setBadgeClass("badge-normal");
    }
  };

  // Configurar eventos de arrastre para los puntos
  useEffect(() => {
    let elementoArrastrando = null;

    const onMouseDown = (el) => (e) => {
      elementoArrastrando = el;
      e.preventDefault();
    };

    const c7El = puntoC7Ref.current;
    const manEl = puntoManubrioRef.current;
    const laEl = puntoLARef.current;
    const raEl = puntoRARef.current;

    const handleMouseDownC7 = onMouseDown(c7El);
    const handleMouseDownMan = onMouseDown(manEl);
    const handleMouseDownLA = onMouseDown(laEl);
    const handleMouseDownRA = onMouseDown(raEl);

    if (c7El) c7El.addEventListener('mousedown', handleMouseDownC7);
    if (manEl) manEl.addEventListener('mousedown', handleMouseDownMan);
    if (laEl) laEl.addEventListener('mousedown', handleMouseDownLA);
    if (raEl) raEl.addEventListener('mousedown', handleMouseDownRA);

    const onMouseMove = (e) => {
      if (!elementoArrastrando || !contenedorVisorRef.current) return;
      const rect = contenedorVisorRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.max(10, Math.min(rect.width - 10, x));
      y = Math.max(10, Math.min(rect.height - 10, y));

      posicionarElemento(elementoArrastrando, x, y);
      actualizarCalculosBiomecanicos();
    };

    const onMouseUp = () => {
      elementoArrastrando = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="spine-evaluar-container">
      <header className="barra-navegacion">
        <a href="/">
          <img src="/src/assets/img/iotipo-.png" alt="Isotipo SpineAlign" className="logo" />
        </a>
        <nav className="menu-derecha" aria-label="Principal">
          <a href="/">Inicio</a>
          <a href="/historial">Historial</a>
          <a href="/login" className="boton-login" ref={navLoginBtnRef} id="nav-login-btn">Iniciar sesión</a>
        </nav>
      </header>

      <main className="evaluacion-layout">
        <section className="panel-izquierdo">
          <div className="reporte-header-pdf" style={{ display: 'none' }}>
            <h1>SpineAlign - Reporte Clínico Postural</h1>
            <p>Sistema de Análisis Biomecánico Computarizado</p>
          </div>

          <div className="tarjeta-modulo">
            <h2>Nueva Evaluación</h2>
            <p className="subtitulo-seccion">Usa la cámara o sube una foto, luego arrastra libremente C7, el Manubrium y los hombros.</p>
            
            <div className="controles-fuente" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div id="grupo-botones-inicial" style={{ display: grupoInicialDisplay, gap: '0.5rem' }}>
                <button type="button" onClick={activarCamara} className="btn-cargar-foto" style={{ flex: 1 }}>
                  <i className="fa-solid fa-camera"></i> Activar Cámara
                </button>
                <label htmlFor="archivo" className="btn-cargar-foto" style={{ flex: 1, backgroundColor: '#ffffff', color: 'var(--medical-600)', border: '1px solid var(--medical-600)', textAlign: 'center', lineHeight: '2.4rem', cursor: 'pointer' }}>
                  <i className="fa-solid fa-cloud-arrow-up"></i> Subir Archivo
                </label>
                <input type="file" id="archivo" accept="image/*" style={{ display: 'none' }} onChange={subirArchivo} />
              </div>

              <div id="grupo-botones-camara" style={{ display: grupoCamaraDisplay }}>
                <button type="button" onClick={capturarFoto} className="btn-cargar-foto" style={{ width: '100%', backgroundColor: '#059669' }}>
                  <i className="fa-solid fa-circle-dot"></i> Capturar Foto
                </button>
              </div>

              <div id="grupo-botones-revision" style={{ display: grupoRevisionDisplay, gap: '0.5rem' }}>
                <button type="button" onClick={usarFoto} className="btn-cargar-foto" style={{ flex: 1, backgroundColor: '#059669' }}>
                  <i className="fa-solid fa-check"></i> Usar Foto
                </button>
                <button type="button" onClick={repetirCamara} className="btn-cargar-foto" style={{ flex: 1, backgroundColor: '#dc2626' }}>
                  <i className="fa-solid fa-rotate-right"></i> Repetir Foto
                </button>
              </div>

              <div id="grupo-botones-reset" style={{ display: grupoResetDisplay }}>
                <button type="button" onClick={resetGeneral} className="btn-cargar-foto" style={{ width: '100%', backgroundColor: '#dc2626' }}>
                  <i className="fa-solid fa-rotate-right"></i> Cambiar / Repetir Foto
                </button>
              </div>
            </div>
          </div>

          <div className="tarjeta-modulo">
            <h3>Datos Fisiológicos del Paciente</h3>
            <div className="campo-datos">
              <label>Nombre</label>
              <input type="text" id="input-nombre" defaultValue="Paciente General" />
            </div>
            <div className="campo-datos" style={{ marginTop: '0.75rem' }}>
              <label>ID / H. Clínica</label>
              <input type="text" id="input-id" defaultValue="PX-2026-01" />
            </div>
          </div>

          <div className="tarjeta-modulo">
            <div className="metricas-header">
              <h3>Métricas Biomecánicas</h3>
              <span id="badge-estado" className={badgeClass}>{badgeText}</span>
            </div>

            <div className="metricas-grid">
              <div className="caja-metrica">
                <span className="metrica-titulo">Inclinación Bi-Acromial</span>
                <span id="val-angulo" className="metrica-valor">{angVal}</span>
                <span className="metrica-desc">Margen fisiológico &lt; 2.0°</span>
              </div>
              <div className="caja-metrica">
                <span className="metrica-titulo">Desnivel Vertical</span>
                <span id="val-desnivel" className="metrica-valor">{desnivelVal}</span>
                <span className="metrica-desc">Calibración: 1px = 0.85mm</span>
              </div>
            </div>

            <div className="asi-container" style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--slate-600)', fontWeight: 500 }}>Índice de Asimetría Postural (ASI)</span>
                <span id="val-asi" style={{ fontWeight: 700, color: 'var(--medical-900)' }}>{asiVal}</span>
              </div>
              <div className="barra-asi-fondo">
                <div id="barra-asi-progreso" className="barra-asi-fill" style={{ width: asiFill }}></div>
              </div>
            </div>

            <button 
              id="btn-descargar-pdf" 
              ref={btnPdfRef} 
              className="btn-pdf" 
              disabled={pdfDisabled} 
              style={{ backgroundColor: pdfDisabled ? 'var(--slate-200)' : 'var(--medical-600)', cursor: pdfDisabled ? 'not-allowed' : 'pointer', color: pdfDisabled ? 'var(--slate-400)' : '#fff' }}
              onClick={handlePdfClick}
            >
              <i className="fa-solid fa-file-pdf"></i> Generar Reporte PDF
            </button>
          </div>
        </section>

        <section className="panel-derecho">
          <div id="contenedor-visor" ref={contenedorVisorRef} className="visor-interactivo">
            <div id="placeholder-visor" ref={placeholderVisorRef} className="placeholder-visor">
              <i className="fa-solid fa-camera-retro"></i>
              <p>Activa la cámara o sube una fotografía para iniciar el análisis interactivo</p>
            </div>

            <video id="webcam-video" ref={videoWebcamRef} autoPlay playsInline style={{ display: 'none', maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}></video>
            <img id="imagen-analisis" ref={imagenAnalisisRef} alt="Evaluación Postural" style={{ display: 'none' }} />

            <svg id="svg-conexion" ref={svgConexionRef} className="svg-linea" style={{ display: 'none' }}>
              <line id="ref-vertical-ideal" ref={refVerticalIdealRef} x1="0" y1="0" x2="0" y2="0" className="linea-referencia-ideal" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
              <line id="ref-horizontal-ideal" ref={refHorizontalIdealRef} x1="0" y1="0" x2="0" y2="0" className="linea-referencia-ideal" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
              <line id="linea-hombros" ref={lineaHombrosRef} x1="0" y1="0" x2="0" y2="0" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,6" />
              <line id="linea-eje-vertical" ref={lineaEjeVerticalRef} x1="0" y1="0" x2="0" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,6" />
            </svg>

            <div id="punto-c7" ref={puntoC7Ref} className="punto-control" style={{ display: 'none' }} title="Arrastra C7 Vértebra">
              <span className="etiqueta-punto">C7 Vértebra</span>
            </div>
            <div id="punto-manubrio" ref={puntoManubrioRef} className="punto-control" style={{ display: 'none', backgroundColor: '#a855f7' }} title="Arrastra Manubrium">
              <span className="etiqueta-punto">Manubrium</span>
            </div>
            <div id="punto-lacromion" ref={puntoLARef} className="punto-control" style={{ display: 'none' }} title="Arrastra L-Acromion">
              <span className="etiqueta-punto">L-Acromion</span>
            </div>
            <div id="punto-racromion" ref={puntoRARef} className="punto-control" style={{ display: 'none' }} title="Arrastra R-Acromion">
              <span className="etiqueta-punto">R-Acromion</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p><strong>SpineAlign es una herramienta de apoyo.</strong> No sustituye el diagnóstico ni la valoración de un profesional de la salud.</p>
        <p className="copyright">© 2026 SpineAlign - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
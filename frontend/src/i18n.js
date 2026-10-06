import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const es = {
  translation: {
    appName: 'SpineAlign',
    tagline: 'Análisis de simetría postural de hombros',
    nav: { home: 'Inicio', new: 'Nueva evaluación', patients: 'Pacientes', login: 'Entrar', logout: 'Salir' },
    home: { title: 'Concientización postural', desc: 'Sube una fotografía, detecta los hombros y obtén una medición orientativa de la inclinación.', start: 'Nueva evaluación', privacy: 'Tus imágenes se procesan de forma local en el navegador cuando es posible y nunca se registran en logs.' },
    login: { email: 'Correo', password: 'Contraseña', submit: 'Entrar', error: 'No se pudo iniciar sesión' },
    patients: { title: 'Historial de pacientes', create: 'Crear paciente', code: 'Código', name: 'Nombre (opcional)', created: 'Creado' },
    new: { title: 'Nueva evaluación', patient: 'Paciente', consent: 'Doy mi consentimiento explícito para el tratamiento de esta imagen con fines de análisis postural.', choose: 'Elegir fotografía', detect: 'Detectar hombros', adjust: 'Ajusta los puntos arrastrándolos si hace falta.', save: 'Guardar evaluación', saved: 'Evaluación guardada', angle: 'Ángulo', diffPx: 'Diferencia (px)', diffPct: 'Diferencia (% ancho)', class: 'Clasificación', download: 'Descargar PDF', preview: 'Resultado' },
    classes: { symmetric: 'Simétrico', mild: 'Leve', moderate: 'Moderado', marked: 'Marcado' },
    detail: { evolution: 'Evolución en el tiempo', assessments: 'Evaluaciones', date: 'Fecha', classification: 'Clasificación' },
    footer: 'Herramienta de apoyo; no sustituye un diagnóstico médico.',
  },
};

const en = {
  translation: {
    appName: 'SpineAlign',
    tagline: 'Shoulder posture symmetry analysis',
    nav: { home: 'Home', new: 'New assessment', patients: 'Patients', login: 'Sign in', logout: 'Sign out' },
    home: { title: 'Posture awareness', desc: 'Upload a photo, detect the shoulders and get an indicative tilt measurement.', start: 'New assessment', privacy: 'Your images are processed locally in the browser when possible and never written to logs.' },
    login: { email: 'Email', password: 'Password', submit: 'Sign in', error: 'Sign in failed' },
    patients: { title: 'Patient history', create: 'Create patient', code: 'Code', name: 'Name (optional)', created: 'Created' },
    new: { title: 'New assessment', patient: 'Patient', consent: 'I explicitly consent to the processing of this image for posture analysis.', choose: 'Choose photo', detect: 'Detect shoulders', adjust: 'Drag the points to adjust if needed.', save: 'Save assessment', saved: 'Assessment saved', angle: 'Angle', diffPx: 'Difference (px)', diffPct: 'Difference (% width)', class: 'Classification', download: 'Download PDF', preview: 'Result' },
    classes: { symmetric: 'Symmetric', mild: 'Mild', moderate: 'Moderate', marked: 'Marked' },
    detail: { evolution: 'Evolution over time', assessments: 'Assessments', date: 'Date', classification: 'Classification' },
    footer: 'Support tool; does not replace a medical diagnosis.',
  },
};

i18n.use(initReactI18next).init({
  resources: { es, en },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export default i18n;

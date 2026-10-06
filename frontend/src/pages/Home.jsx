import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const features = [
    { icon: '📸', bg: '#efedff', title: '1. Sube una foto', text: 'JPG, PNG o WebP, máximo 5 MB. Necesitas tu consentimiento antes de subirla.' },
    { icon: '🤖', bg: '#e8f0fe', title: '2. Detecta los hombros', text: 'MediaPipe Pose los localiza automáticamente y puedes ajustar los puntos arrastrándolos.' },
    { icon: '📊', bg: '#e6f4ec', title: '3. Obtén el resultado', text: 'Ángulo, diferencia de altura y clasificación. Guarda y descarga el PDF.' },
  ];
  return (
    <main>
      <motion.section className="hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>✦ Orientador</span>
        <h1>{t('home.title')}</h1>
        <p>{t('home.desc')}</p>
        <Link className="btn" to="/evaluacion">{t('home.start')} →</Link>
      </motion.section>

      <h2 style={{ marginTop: '2rem' }}>¿Cómo funciona?</h2>
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {features.map((f, i) => (
          <motion.div className="card" key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
            <span style={iconStyle(f.bg)}>{f.icon}</span>
            <h3>{f.title}</h3>
            <p className="muted">{f.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <p>🔒 {t('home.privacy')}</p>
        <p className="muted">{t('footer')}</p>
      </div>
    </main>
  );
}

function iconStyle(bg) {
  return {
    display: 'inline-flex', width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, background: bg, fontSize: 22,
  };
}

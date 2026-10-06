import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Login from './pages/Login';
import NewAssessment from './pages/NewAssessment';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import AssessmentDetail from './pages/AssessmentDetail';

function RequireAuth({ children }) {
  return localStorage.getItem('spinealign_token') ? children : <Navigate to="/login" />;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const loggedIn = Boolean(localStorage.getItem('spinealign_token'));

  return (
    <BrowserRouter>
      <header className="site">
        <span className="brand">🦴 {t('appName')}</span>
        <nav>
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/evaluacion">{t('nav.new')}</Link>
          <Link to="/pacientes">{t('nav.patients')}</Link>
        </nav>
        <select aria-label="Idioma" style={{ width: 'auto' }} value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
        {loggedIn ? (
          <button onClick={() => { localStorage.removeItem('spinealign_token'); location.href = '/login'; }}>{t('nav.logout')}</button>
        ) : (
          <Link to="/login">{t('nav.login')}</Link>
        )}
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/evaluacion" element={<RequireAuth><NewAssessment /></RequireAuth>} />
        <Route path="/pacientes" element={<RequireAuth><Patients /></RequireAuth>} />
        <Route path="/pacientes/:id" element={<RequireAuth><PatientDetail /></RequireAuth>} />
        <Route path="/evaluaciones/:id" element={<RequireAuth><AssessmentDetail /></RequireAuth>} />
      </Routes>
      <footer className="site">{t('footer')}</footer>
    </BrowserRouter>
  );
}

import React from 'react';
import './assets/css/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Evaluar from './components/Evaluar';
import Historial from './components/Historial';
import Login from './components/Login';
import Registro from './components/Registro';
import MiCuenta from './components/MiCuenta';
import SpinyChat from './components/SpinyChat';
import NotFound from './components/NotFound'; // 1. Importa tu componente NotFound (ajusta la ruta si está en otra carpeta)

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Tus rutas existentes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evaluar" element={<Evaluar />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          
          {/* 2. Ruta comodín al FINAL de todas para atrapar errores 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Spiny flotará en todas las páginas de la app */}
        <SpinyChat />
      </div>
    </Router>
  );
}
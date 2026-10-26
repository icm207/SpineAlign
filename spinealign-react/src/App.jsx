import React from 'react';
import './assets/css/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Evaluar from './components/Evaluar';
import Historial from './components/Historial';
import Login from './components/Login';
import Registro from './components/Registro';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluar" element={<Evaluar />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}
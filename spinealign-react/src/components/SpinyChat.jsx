import React, { useState, useEffect } from 'react';
import '../assets/css/SpinyChat.css';
import spinyImg from '/spiny.png';

export default function SpinyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setMessages([
      { sender: 'spiny', text: '¡Hola! Bienvenido a SpineAlign. ¿En qué te puedo ayudar hoy con tu evaluación postural o conceptos anatómicos?' }
    ]);
    setHistory([]);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat-spiny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: userMessage,
          historial: history
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Error en el servidor de SpineAlign');
      }

      const botReply = data.respuesta;

      setMessages(prev => [...prev, { sender: 'spiny', text: botReply }]);
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userMessage }] },
        { role: 'model', parts: [{ text: botReply }] }
      ]);

    } catch (err) {
      console.error('Error al conectar con Spiny:', err);
      setMessages(prev => [
        ...prev,
        { sender: 'spiny', text: 'Ups, tuve un problema de conexión con el servidor. Verifica que el backend esté encendido.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spiny-container">
      {isOpen && (
        <div className="spiny-window">
          <div className="spiny-header">
            <div className="spiny-header-info">
              <img src={spinyImg} alt="Spiny" className="spiny-avatar" />
              <div className="spiny-title">
                <h3>Asistente Spiny</h3>
                <p>C7 · Acromion · Manubrio · Guía web</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="spiny-close-btn" title="Cerrar">
              ✕
            </button>
          </div>

          <div className="spiny-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`spiny-msg ${m.sender}`}>
                <p>{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="spiny-msg spiny loading">
                <p>Spiny está pensando...</p>
              </div>
            )}
          </div>

          <div className="spiny-footer-note">
            Pregúntame sobre biomecánica, postura o el funcionamiento de SpineAlign.
          </div>

          <form onSubmit={sendMessage} className="spiny-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué te gustaría saber?"
              className="spiny-input"
              disabled={loading}
            />
            <button type="submit" className="spiny-send-btn" title="Enviar mensaje" disabled={loading}>
              ↑
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="spiny-toggle-btn">
        <img src={spinyImg} alt="Spiny" className="spiny-toggle-img" />
        <span className="spiny-status-dot-container">
          <span className="spiny-status-ping"></span>
          <span className="spiny-status-core"></span>
        </span>
        <span className="spiny-toggle-text">
          {isOpen ? 'Cerrar el chat' : 'Pregúntale a Spiny'}
        </span>
        <span className="spiny-toggle-icon">
          {isOpen ? '✕' : '✦'}
        </span>
      </button>
    </div>
  );
}
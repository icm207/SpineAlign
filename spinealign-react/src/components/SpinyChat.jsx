import React, { useState, useEffect } from 'react';
import '../assets/css/SpinyChat.css';
import spinyImg from '../assets/img/spiny.png';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
    setHistory([
      {
        role: "user",
        parts: [{ text: "Eres Spiny, el asistente virtual de SpineAlign, una plataforma interactiva de evaluación postural (mide el ángulo biacromial y el índice de asimetría postural). Explica conceptos anatómicos clave (C7, acromion, manubrio) y guía al usuario de forma clara, amigable y concisa." }]
      },
      {
        role: "model",
        parts: [{ text: "¡Entendido! Soy Spiny, listo para ayudar con la postura y la anatomía en SpineAlign." }]
      }
    ]);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    const newHistory = [...history, { role: "user", parts: [{ text: userMessage }] }];

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: newHistory })
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Error en la API de Gemini");
      }

      const botReply = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { sender: 'spiny', text: botReply }]);
      setHistory([...newHistory, { role: "model", parts: [{ text: botReply }] }]);

    } catch (err) {
      console.error("Error al conectar con Gemini:", err);
      setMessages(prev => [...prev, { sender: 'spiny', text: 'Ups, tuve un problema de conexión con la IA. Revisa tu API Key en el archivo .env.' }]);
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
            />
            <button type="submit" className="spiny-send-btn" title="Enviar mensaje">
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
import { useAuth } from "../context/authContext.jsx";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import './chat.css';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Inicia sesión para usar el chat de recomendaciones.</p>
      </div>
    );
  }

  const enviarMensaje = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    const perfil = {
      edad: user.age,
      peso: user.weight,
      altura: user.height,
      genero: user.gender,
      nivel_actividad: user.activity_level,
    };

    setMessages((msgs) => [...msgs, { sender: "usuario", text: input }]);
    try {
      const res = await fetch("/back/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje_usuario: input,
          perfil_usuario: perfil,
        }),
      });
      const data = await res.json();

      setMessages((msgs) => [
        ...msgs,
        { sender: "ia", text: data.recomendacion_ia || "Sin respuesta de IA." },
        data.alimentos_recomendados
          ? { sender: "ia", text: `Alimentos recomendados: ${data.alimentos_recomendados.map(a => a.food_name).join(", ")}` }
          : null,
      ].filter(Boolean));
    } catch (err) {
      setError("Error al conectar con la IA o Nutritionix.");
    }
    setInput("");
    setLoading(false);
  };

  return (

    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <p style={{ color: "#888" }}>
            Sugerencia: ¡Indica cuál es tu objetivo! ¿Perder peso, ganar músculo, mejorar tu selección de alimentos...?
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-row ${msg.sender === "usuario" ? "right" : "left"}`}
          >
            <div className={`chat-message ${msg.sender}`}>
              <b>{msg.sender === "usuario" ? "Tú" : "NyDIA"}:</b>
              <div>
                {msg.sender === "ia"
                  ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                  : msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="chat-error">{error}</div>}
      {loading && (
        <div className="chat-spinner-container">
          <span className="spinner-circle" />
          <span>Procesando respuesta...</span>
        </div>
      )}
      <div className="chat-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !loading) {
              enviarMensaje();
            }
          }}
          placeholder="Escribe tu pregunta..."
          className="chat-input"
          disabled={loading}
        />
        <button
          onClick={enviarMensaje}
          className="chat-button"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
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
  const [firstPrompt, setFirstPrompt] = useState(true);

  if (!user) {
    return (
      <div className="chat-container">
        Inicia sesión para usar el chat de recomendaciones.
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
    setMessages((msgs) => [
      ...msgs,
      { sender: "usuario", text: input }
    ]);
    try {
      const res = await fetch("/back/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje_usuario: input,
          perfil_usuario: perfil,
          first_Prompt: firstPrompt,
          historial: messages.map(m => ({role: m.sender === "usuario" ? "user" : "assistant", content: m.text})),
        }),
      });
      const data = await res.json();
      setMessages((msgs) =>
        [
          ...msgs,
          { sender: "ia", text: data.recomendacion_ia || "Sin respuesta de IA." },
          data.alimentos_recomendados
            ? { sender: "ia", text: `Alimentos recomendados: ${data.alimentos_recomendados.map(a => a.food_name).join(", ")}` }
            : null,
        ].filter(Boolean)
      );
    } catch (err) {
      setError("Error al conectar con la IA o Nutritionix.");
    }
    setInput("");
    setLoading(false);
    setFirstPrompt(false);
  };

  return (
    <>
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="chat-suggestion">
            Sugerencia: ¡Indica cuál es tu objetivo! ¿Perder peso, ganar músculo, mejorar tu selección de alimentos...?
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-row ${msg.sender === "usuario" ? "right" : "left"}`}
          >
            <div className={`chat-message ${msg.sender}`}>
              <strong>{msg.sender === "usuario" ? "Tú" : "NyDIA"}</strong>{" "}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {error && <div className="chat-error">{error}</div>}
        {loading && (
          <div className="chat-spinner-container">
            <span className="spinner-circle" /> Procesando respuesta...
          </div>
        )}
        <div style={{ height: "7rem" }} />
      </div>
      <div className="chat-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !loading) enviarMensaje();
          }}
          placeholder="Escribe tu pregunta..."
          className="chat-input"
          disabled={loading}
        />
        <button className="chat-button" onClick={enviarMensaje} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </>
  );
}
import { useAuth } from "../context/authContext.jsx";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Evita renderizar si no hay usuario autenticado
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
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}>
      <div style={{ minHeight: "150px", marginBottom: "1rem" }}>
        {messages.length === 0 && <p style={{ color: "#888" }}>Sugerencia: ¡Indica cuál es tu objetivo! ¿Perder peso, ganar músculo, mejorar tu selección de alimentos...?</p>}
        
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <b>{msg.sender === "usuario" ? "Tú" : "IA"}:</b>
            <div style={{ whiteSpace: "pre-wrap" }}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

      </div>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if(e.key === "Enter" && !loading){
              enviarMensaje();
            }
          }}
          placeholder="Escribe tu pregunta..."
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
          disabled={loading}
        />

          
        {loading && (
          <div style={{ margin: "1rem", textAlign: "center" }}>
            <span className="spinner"
              style={{
                display: "inline-block",
                animation: "spin 1s linear infinite",
                fontSize: "2rem"
              }}
              role="img"
              aria-label="Cargando"
            >⏳</span>
            <span style={{ marginLeft: "0.5rem" }}>Procesando respuesta...</span>
          </div>
        )}

        <button
          onClick={enviarMensaje}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
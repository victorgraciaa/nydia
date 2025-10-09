import { useState, useEffect } from "react"
import './App.css'

function App() {
  const [message, setMessage] = useState("Cargando...");

  
  useEffect(() => {
    fetch("/api/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error("❌ Error al hacer fetch:", err);
        setMessage("Error de conexión con el backend");
      });
  }, []);
  

  return (
    <div>
      <h1>Frontend conectado</h1>
      <p>{message}</p>
    </div>
  );
}

export default App

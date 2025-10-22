import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";


export default function LoginForm() {

  const { login, token } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    console.log("Login recibido");

    e.preventDefault();

    if (!form.username || !form.password) {
      setMessage("❌ Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("/back/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setSuccess(true);      
      setMessage("✅ Inicio de sesión exitoso");
      
      sessionStorage.setItem("token", data.token);
      login(data.token, data.user);
      
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {success ? (
          <>
            <p style={styles.successMessage}>{message}</p>
            <button onClick={() => {
              navigate("/");
              window.location.reload();
            }} style={styles.button}>
              Ir a la página principal
            </button>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Iniciar sesión</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                style={styles.input}
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" style={styles.button}>Entrar</button>
              <button type="button" onClick={() => navigate("/")} style={styles.link}>
                Volver
              </button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  link: {
    marginTop: "0.75rem",
    backgroundColor: "transparent",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.9rem",
  },
  message: {
    marginTop: "1rem",
    color: "#333",
  },
  successMessage: {
    fontSize: "1.2rem",
    color: "#16a34a",
    marginBottom: "1rem",
  },
};
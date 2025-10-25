import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import './forms.css';

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
    <div className="form-page">
      <div className="form-card">
        {success ? (
          <>
            <div className="form-successMessage">{message}</div>
            <button className="form-button" onClick={() => { navigate("/"); window.location.reload(); }}>
              Ir a la página principal
            </button>
          </>
        ) : (
          <>
            <div className="form-title">Iniciar sesión</div>
            <form className="form-form" onSubmit={handleSubmit}>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button className="form-button" type="submit">
                Entrar
              </button>
            </form>
            <button className="form-link" onClick={() => navigate("/")}>
              Volver
            </button>
            {message && <div className="form-message">{message}</div>}
          </>
        )}
      </div>
    </div>
  );
}
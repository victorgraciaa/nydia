import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './forms.css';

export default function RegisterForm({ onBack }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    activity_level: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(form.password)) {
      errors.push("La contraseña debe tener al menos una mayúscula, un número y mínimo 6 caracteres");
    }
    const height = Number(form.height);
    const weight = Number(form.weight);
    const age = Number(form.age);
    if (isNaN(age) || age <= 0) {
      errors.push("La edad debe ser un número positivo");
    }
    if (isNaN(height) || height <= 0) {
      errors.push("La altura debe ser un número positivo");
    }
    if (isNaN(weight) || weight <= 0) {
      errors.push("El peso debe ser un número positivo");
    }
    if (errors.length > 0) {
      setMessage("❌\n" + errors.join("\n"));
      return;
    }
    try {
      const res = await fetch("/back/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age, height, weight }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setSuccess(true);
      setMessage("✅ Registro exitoso");
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
            <button className="form-button" onClick={() => navigate("/")}>
              Ir a la página principal
            </button>
          </>
        ) : (
          <>
            <div className="form-title">Crear cuenta</div>
            <form className="form-form" onSubmit={handleSubmit}>
              <input
                className="form-input-select"
                maxLength={20}
                type="text"
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                className="form-input-select"
                maxLength={20}
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                className="form-input-select"
                type="number"
                name="age"
                placeholder="Edad"
                value={form.age}
                onChange={handleChange}
                required
              />
              <input
                className="form-input-select"
                type="number"
                name="height"
                placeholder="Altura (cm)"
                value={form.height}
                onChange={handleChange}
                required
              />
              <input
                className="form-input-select"
                type="number"
                name="weight"
                placeholder="Peso (kg)"
                value={form.weight}
                onChange={handleChange}
                required
              />
              <select
                className="form-input-select"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>Sexo</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
              <select
                className="form-input-select"
                name="activity_level"
                value={form.activity_level}
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>Nivel de actividad</option>
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="activo">Activo</option>
                <option value="muy activo">Muy activo</option>
              </select>
              <button className="form-button" type="submit">
                Registrarse
              </button>
            </form>
            <button className="form-backButton" onClick={() => (onBack ? onBack() : navigate("/"))}>
              ⬅ Volver
            </button>
            {message && <div className="form-message">{message}</div>}
          </>
        )}
      </div>
    </div>
  );
}
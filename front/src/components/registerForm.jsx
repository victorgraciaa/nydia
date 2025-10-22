import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function RegisterForm({ onBack }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "hombre",
    activity_level: "sedentario",
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
        body: JSON.stringify({
          ...form,
          age,
          height,
          weight,
        }),
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
    <div style={styles.page}>
      <div style={styles.card}>
        {success ? (
          <>
            <p style={styles.successMessage}>{message}</p>
            <button onClick={() => navigate("/")} style={styles.button}>
              Ir a la página principal
            </button>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Crear cuenta</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} required style={styles.input} />
              <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required style={styles.input} />
              <input name="age" type="number" placeholder="Edad" value={form.age} onChange={handleChange} required style={styles.input} />
              <input name="height" type="number" placeholder="Altura (cm)" value={form.height} onChange={handleChange} required style={styles.input} />
              <input name="weight" type="number" placeholder="Peso (kg)" value={form.weight} onChange={handleChange} required style={styles.input} />
              <select name="gender" value={form.gender} onChange={handleChange} style={styles.select}>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
              <select name="activity_level" value={form.activity_level} onChange={handleChange} style={styles.select}>
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="activo">Activo</option>
                <option value="muy_activo">Muy activo</option>
              </select>
              <button type="submit" style={styles.button}>Registrarse</button>
              
            <button type="button" onClick={() => navigate("/")} style={styles.backButton}>
              ⬅ Volver
            </button>

            </form>
            {message && <p style={styles.message}>{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};

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
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  select: {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  buttonHover: {
    backgroundColor: "#2563eb",
  },
  backButton: {
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
  }
};

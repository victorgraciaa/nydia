export default function LoginForm({ onBack }) {
  return (
    <div style={styles.container}>
      <h2>Iniciar sesión</h2>
      <input style={styles.input} type="email" placeholder="Email" />
      <input style={styles.input} type="password" placeholder="Contraseña" />
      <button style={styles.button}>Entrar</button>
      <button style={styles.link} onClick={onBack}>Volver</button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem" },
  input: { padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", width: "250px" },
  button: { backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer" },
  link: { background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline" },
};

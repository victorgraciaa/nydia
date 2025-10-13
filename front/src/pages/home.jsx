export default function Home({ onSelect }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenido a <span style={styles.brand}>NyDIA</span></h1>
      <p style={styles.subtitle}>Tu asistente inteligente de nutrición y deporte 💪</p>

      <div style={styles.buttons}>
        <button style={styles.button} onClick={() => onSelect("login")}>Iniciar sesión</button>
        <button style={styles.buttonOutline} onClick={() => onSelect("register")}>Registrarse</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#f6f9fc" },
  title: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  brand: { color: "#3b82f6" },
  subtitle: { marginBottom: "2rem", color: "#555" },
  buttons: { display: "flex", gap: "1rem" },
  button: { backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer" },
  buttonOutline: { backgroundColor: "white", color: "#3b82f6", border: "2px solid #3b82f6", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer" },
};

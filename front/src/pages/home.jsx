import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function Home() {
  
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if(!token){
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Bienvenido a <span style={styles.brand}>NyDIA</span>
        </h1>
        <p style={styles.subtitle}>Tu asistente inteligente de nutrición y deporte 💪</p>

        <div style={styles.buttons}>
          <Link to="/login" style={styles.button}>Iniciar sesión</Link>
          <Link to="/register" style={styles.buttonOutline}>Registrarse</Link>
        </div>
      </div>
    );
  }


  return (
  <div style={loggedInStyles.sessionPage}>
    <div style={loggedInStyles.sessionTopBar}>
      <span>👤 {user?.username}</span>
      <span> Edad: {user?.age}</span>
      <span> Altura: {user?.height}</span>
      <span> Peso: {user?.weight}</span>
      <span> Género: {user?.gender}</span>
      <span> Nivel de actividad: {user?.activity_level}</span>
      <button onClick={handleLogout} style={loggedInStyles.sessionLogoutButton}>Cerrar sesión</button>
    </div>

    <div style={loggedInStyles.sessionCard}>
      <h2 style={loggedInStyles.sessionTitle}>Recomendaciones personalizadas</h2>
      <p style={loggedInStyles.sessionSubtitle}>Tu asistente inteligente está listo para ayudarte 🧠</p>
      <div style={loggedInStyles.sessionChatBox}>
        {/* Aquí irá el componente del chat */}
        <p>Chat de recomendaciones aquí...</p>
      </div>
    </div>
  </div>
);

  


}

const styles = {
  container: { 
    display: "flex", flexDirection: "column", alignItems: "center", 
    justifyContent: "center", height: "100vh", fontFamily: "sans-serif", 
    backgroundColor: "#f6f9fc" 
  },
  title: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  brand: { color: "#3b82f6" },
  subtitle: { marginBottom: "2rem", color: "#555" },
  buttons: { display: "flex", gap: "1rem" },
  button: { backgroundColor: "#3b82f6", color: "white", textDecoration: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer" },
  buttonOutline: { backgroundColor: "white", color: "#3b82f6", border: "2px solid #3b82f6", textDecoration: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer" },
};

const loggedInStyles = {
  sessionPage: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f6f9fc",
    fontFamily: "sans-serif",
  },
  sessionTopBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  sessionLogoutButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  sessionCard: {
    margin: "2rem auto",
    padding: "2rem",
    maxWidth: "600px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  sessionTitle: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
    color: "#333",
  },
  sessionSubtitle: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1.5rem",
  },
  sessionChatBox: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
    minHeight: "200px",
    textAlign: "left",
    fontSize: "0.95rem",
    color: "#333",
  }
};


import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import Chat from "../components/chat.jsx"
import './home.css';


export default function Home() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!token) {
    return (
      <div className="home-container">
        <div className="home-title">
          Bienvenido a <span className="home-brand">NyDIA</span>
        </div>
        <div className="home-subtitle">
          Tu asistente inteligente de nutrición y deporte 💪
        </div>
        <div className="home-buttons">
          <Link to="/login" className="home-button">Iniciar sesión</Link>
          <Link to="/register" className="home-buttonOutline">Registrarse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sessionPage">
      <div className="sessionTopBar">
        <div>
          👤 {user?.username} &nbsp;
          Edad: {user?.age} &nbsp;
          Altura: {user?.height} &nbsp;
          Peso: {user?.weight} &nbsp;
          Género: {user?.gender} &nbsp;
          Nivel de actividad: {user?.activity_level}
        </div>
        <button className="sessionLogoutButton" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      <div className="sessionCard">
        <div className="sessionTitle">Recomendaciones personalizadas</div>
        <div className="sessionSubtitle">
          NyDIA está listo para ayudarte 🤖
        </div>
        <div className="sessionChatBox">
          <Chat />
        </div>
      </div>
    </div>
  );
}
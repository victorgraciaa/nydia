import { useState } from "react";
import Home from "./pages/Home.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";

export default function App() {
  const [view, setView] = useState("home");

  return (
    <>
      {view === "home" && <Home onSelect={setView} />}
      {view === "login" && <LoginForm onBack={() => setView("home")} />}
      {view === "register" && <RegisterForm onBack={() => setView("home")} />}
    </>
  );
}

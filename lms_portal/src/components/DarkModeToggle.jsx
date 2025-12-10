import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import "../styles/toggle.css";

function DarkModeToggle() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <button className="toggle-btn" onClick={() => setDark(!dark)}>
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default DarkModeToggle;

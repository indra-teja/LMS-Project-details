import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "../../styles/toggle.css";

function DarkModeToggle() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <div
      className={`theme-toggle ${dark ? "dark" : ""}`}
      onClick={() => setDark(!dark)}
    >
      <div className="toggle-knob">
        <span className="toggle-icon">
          {dark ? "🌙" : "☀️"}
        </span>
      </div>
    </div>
  );
}

export default DarkModeToggle;

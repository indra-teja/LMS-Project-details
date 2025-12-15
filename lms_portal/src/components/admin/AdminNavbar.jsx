import { useContext } from "react";
import "../../styles/admin/admin-navbar.css";
import { ThemeContext } from "../../context/ThemeContext";

function AdminNavbar() {
  const { dark, setDark } = useContext(ThemeContext);

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <header className="admin-navbar">
      <h3>Admin Panel</h3>

      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}

export default AdminNavbar;

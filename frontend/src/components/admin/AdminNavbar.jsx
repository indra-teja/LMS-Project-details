import { useContext } from "react";
import "../../styles/admin/admin-navbar.css";
import { ThemeContext } from "../../context/ThemeContext";
import DarkModeToggle from "../student/DarkModeToggle";

function AdminNavbar() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <header className="admin-navbar">
      <h3>Admin Panel</h3>

      {/* Animated toggle */}
      <DarkModeToggle />
    </header>
  );
}

export default AdminNavbar;

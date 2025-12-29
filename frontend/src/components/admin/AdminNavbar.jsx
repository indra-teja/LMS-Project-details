import { useContext } from "react";
import "../../styles/admin/admin-navbar.css";
import { ThemeContext } from "../../context/ThemeContext";
import DarkModeToggle from "../student/DarkModeToggle";

function AdminNavbar() {
  const { dark, setDark } = useContext(ThemeContext);
  const adminName = localStorage.getItem("user_name");

  return (
    <header className="admin-navbar">
      <h3>Welcome, {adminName || "Admin"}</h3>
      <DarkModeToggle />
    </header>
  );
}

export default AdminNavbar;

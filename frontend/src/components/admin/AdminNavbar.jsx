import { useContext } from "react";
import "../../styles/admin/admin-navbar.css";
import { ThemeContext } from "../../context/ThemeContext";
import DarkModeToggle from "../student/DarkModeToggle";

function AdminNavbar() {
  const { dark } = useContext(ThemeContext);

  const adminName = localStorage.getItem("user_name");
  const adminId = localStorage.getItem("user_id");

  return (
    <header className="admin-navbar">
      <h3>
        Welcome, {adminName || "Admin"}
        <span style={{ fontSize: "13px", color: "#888", marginLeft: "8px" }}>
          (ID: {adminId})
        </span>
      </h3>

      <DarkModeToggle />
    </header>
  );
}

export default AdminNavbar;

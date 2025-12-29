import DarkModeToggle from "./DarkModeToggle.jsx";
import "../../styles/navbar.css";

function Navbar() {
  const studentName = localStorage.getItem("user_name");

  return (
    <div className="navbar">
      <h3>Welcome, {studentName || "Student"}</h3>
      <DarkModeToggle />
    </div>
  );
}

export default Navbar;

import DarkModeToggle from "./DarkModeToggle.jsx";
import "../../styles/navbar.css";

function Navbar() {
  const studentName = localStorage.getItem("user_name");
  const studentId = localStorage.getItem("user_id");

  return (
    <div className="navbar">
      <h3>
        Welcome, {studentName || "Student"}
        <span style={{ fontSize: "13px", color: "#888", marginLeft: "8px" }}>
          (ID: {studentId})
        </span>
      </h3>

      <DarkModeToggle />
    </div>
  );
}

export default Navbar;

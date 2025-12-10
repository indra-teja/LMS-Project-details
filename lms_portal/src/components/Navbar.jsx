import DarkModeToggle from "./DarkModeToggle.jsx";
import "../styles/navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <h3>Student Portal</h3> {/* Here we are getiing the student name */}
      <DarkModeToggle />
    </div>
  );
}

export default Navbar;

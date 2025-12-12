import DarkModeToggle from "../student/DarkModeToggle.jsx";

// Correct CSS import
import "../../styles/instructor/instructor-navbar.css";

export default function InstructorNavbar() {
  return (
    <header className="i-navbar">
      <h2>Instructor Panel</h2>
      <DarkModeToggle />
    </header>
  );
}

import DarkModeToggle from "../student/DarkModeToggle.jsx";
import "../../styles/instructor/instructor-navbar.css";

export default function InstructorNavbar() {
  const instructorName = localStorage.getItem("user_name");

  return (
    <header className="i-navbar">
      <h2>Welcome, {instructorName || "Instructor"}</h2>
      <DarkModeToggle />
    </header>
  );
}

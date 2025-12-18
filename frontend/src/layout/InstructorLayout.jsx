// src/layout/InstructorLayout.jsx
import { Outlet } from "react-router-dom";
import InstructorSidebar from "../components/instructor/InstructorSidebar.jsx";
import InstructorNavbar from "../components/instructor/InstructorNavbar.jsx";

// Correct CSS import
import "../styles/instructor/instructor-layout.css";

export default function InstructorLayout() {
  return (
    <div className="instructor-layout">
      <InstructorSidebar />

      <div className="instructor-main">
        <InstructorNavbar />
        <div className="instructor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

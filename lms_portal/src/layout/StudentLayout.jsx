import { Outlet } from "react-router-dom";
import Sidebar from "../components/student/Sidebar.jsx";
import Navbar from "../components/student/Navbar.jsx";

import "../styles/student/layout.css";

export default function StudentLayout() {
  return (
    <div className="student-layout">
      <Sidebar />

      <div className="student-main">
        <Navbar />

        <div className="student-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import "../../styles/admin/admin-layout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminNavbar />
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>

  );
}

export default AdminLayout;

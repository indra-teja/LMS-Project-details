import "../../styles/admin/admin-settings.css";
import '../../styles/admin/admin-common.css'


function AdminSettings() {
  return (
    <div className="a-box">
      <h2>Admin Settings</h2>

      <div className="admin-actions">
        <button className="admin-btn">Save Changes</button>
        <button className="admin-btn secondary">Reset</button>
      </div>

      <p>Theme, system preferences and configurations.</p>
    </div>
  );
}

export default AdminSettings;
